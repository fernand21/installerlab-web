import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.116.0";

const allowedOrigins = new Set([
  "https://installerlab.website",
  "https://www.installerlab.website",
  "https://fernand21.github.io",
]);

const encoder = new TextEncoder();

function cors(req: Request): HeadersInit {
  const origin = req.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin)
      ? origin
      : "https://installerlab.website",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors(req),
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function base64UrlToBytes(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/")
      + "=".repeat((4 - (value.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function parseToken(token: string): { payloadSegment: string; signature: Uint8Array; payload: Record<string, unknown> } | null {
  const parts = token.split(".");
  if (parts.length !== 2 || parts[0].length < 2 || parts[0].length > 12000) return null;
  const payloadBytes = base64UrlToBytes(parts[0]);
  const signature = base64UrlToBytes(parts[1]);
  if (!payloadBytes || !signature || signature.length !== 64) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return { payloadSegment: parts[0], signature, payload: parsed as Record<string, unknown> };
  } catch {
    return null;
  }
}

function asInteger(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) return null;
  return value;
}

function hex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string): Promise<string> {
  return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}

async function verifyEd25519(payloadSegment: string, signature: Uint8Array): Promise<boolean> {
  const configured = (Deno.env.get("INSTALLERLAB_CLAIM_PUBLIC_KEY") || "").trim();
  const publicKey = base64UrlToBytes(configured);
  if (!publicKey || publicKey.length !== 32) return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      publicKey,
      { name: "Ed25519" },
      false,
      ["verify"],
    );
    return await crypto.subtle.verify(
      { name: "Ed25519" },
      key,
      signature,
      encoder.encode(payloadSegment),
    );
  } catch {
    return false;
  }
}

function failure(req: Request, reason: string): Response {
  if (reason === "redeemed") {
    return json(req, { success: false, message: "This benefit has already been redeemed." }, 409);
  }
  if (reason === "revoked") {
    return json(req, { success: false, message: "This benefit is no longer valid." }, 410);
  }
  if (reason === "expired") {
    return json(req, { success: false, message: "This benefit has expired." }, 410);
  }
  return json(req, { success: false, message: "Invalid InstallerLab benefit code." }, 400);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return json(req, { success: false, message: "Method not allowed" }, 405);

  const authorization = req.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    return json(req, { success: false, message: "Sign in to link this benefit to your account." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY")
    || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    || Deno.env.get("SUPABASE_SECRET_KEY") || "";
  if (!supabaseUrl || !publishableKey || !serviceKey) {
    return json(req, { success: false, message: "The benefit service is temporarily unavailable." }, 503);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  const user = userData?.user;
  if (userError || !user) {
    return json(req, { success: false, message: "Sign in to link this benefit to your account." }, 401);
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    body = parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    body = {};
  }

  const token = typeof body.claim === "string" ? body.claim.trim() : "";
  const parsed = parseToken(token);
  if (!parsed) return failure(req, "invalid");

  const payload = parsed.payload;
  const version = asInteger(payload.v);
  const issuedAt = asInteger(payload.issued_at);
  const expiresAt = payload.expires_at === null || payload.expires_at === undefined
    ? null
    : asInteger(payload.expires_at);
  const claimId = typeof payload.claim_id === "string" ? payload.claim_id.trim() : "";
  const tier = payload.tier === "supporter" || payload.tier === "pro" ? payload.tier : "";
  const maxApps = asInteger(payload.max_apps);
  const now = Math.floor(Date.now() / 1000);
  if (
    version !== 1 ||
    !issuedAt ||
    issuedAt > now + 300 ||
    (expiresAt !== null && (!expiresAt || expiresAt <= issuedAt || expiresAt <= now)) ||
    !/^[A-Za-z0-9._:-]{8,120}$/.test(claimId) ||
    !tier ||
    (tier === "supporter" && maxApps !== 5) ||
    (tier === "pro" && maxApps !== 10)
  ) {
    return failure(req, "invalid");
  }

  if (!await verifyEd25519(parsed.payloadSegment, parsed.signature)) {
    return failure(req, "invalid");
  }

  const tokenHash = await sha256(token);
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await admin.rpc("redeem_entitlement_claim", {
    p_user_id: user.id,
    p_claim_id: claimId,
    p_token_hash: tokenHash,
    p_tier: tier,
    p_max_apps: maxApps,
    p_issued_at: issuedAt,
    p_expires_at: expiresAt,
  });
  if (error || !data || typeof data !== "object") {
    return failure(req, "invalid");
  }
  const result = data as Record<string, unknown>;
  if (result.success !== true) return failure(req, String(result.reason || "invalid"));
  return json(req, {
    success: true,
    tier: result.tier === "pro" ? "pro" : "supporter",
    max_apps: result.max_apps === 10 ? 10 : 5,
  });
});
