#!/usr/bin/env python3
import glob
import hashlib
import html as html_lib
import json
import mimetypes
import os
import re
import shutil
import subprocess
import urllib.request
from datetime import datetime, timezone
from urllib.parse import urlparse
from xml.sax.saxutils import escape

BASE = 'https://installerlab.website/'
MEDIA_BASE = BASE + 'community/media/'
PRIVATE_IMAGE_RE = re.compile(r'https://private-user-images\.githubusercontent\.com/[^\"\'<>\s]+')


def markdown_plain(md):
    s = str(md or '')
    s = re.sub(r'```[^\n]*\n([\s\S]*?)```', r'\1', s)
    s = re.sub(r'!\[([^\]]*)\]\([^)]+\)', r'\1', s)
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    s = re.sub(r'<[^>]+>', ' ', s)
    s = re.sub(r'^[#>*+\-]+\s*', '', s, flags=re.M)
    s = re.sub(r'\*\*|__|~~|`', '', s)
    return re.sub(r'\s+', ' ', s).strip()


def _image_extension(url, content_type):
    ctype = (content_type or '').split(';', 1)[0].strip().lower()
    by_type = {
        'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp',
        'image/gif': '.gif', 'image/svg+xml': '.svg'
    }
    if ctype in by_type:
        return by_type[ctype]
    ext = os.path.splitext(urlparse(url).path)[1].lower()
    if ext in {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'}:
        return '.jpg' if ext == '.jpeg' else ext
    guessed = mimetypes.guess_extension(ctype) if ctype else None
    return guessed or '.img'


def localize_images(fragment, discussion_number):
    if not fragment or 'private-user-images.githubusercontent.com' not in fragment:
        return fragment or ''

    out = fragment
    cache = {}
    media_dir = os.path.join('community', 'media', str(discussion_number))
    os.makedirs(media_dir, exist_ok=True)

    for raw_url in dict.fromkeys(PRIVATE_IMAGE_RE.findall(fragment)):
        request_url = html_lib.unescape(raw_url)
        if request_url in cache:
            public_url = cache[request_url]
        else:
            try:
                req = urllib.request.Request(
                    request_url,
                    headers={
                        'User-Agent': 'InstallerLab-Community-Mirror/1.0',
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                    },
                )
                with urllib.request.urlopen(req, timeout=30) as response:
                    payload = response.read()
                    content_type = response.headers.get('Content-Type', '')
                if not payload:
                    raise RuntimeError('empty image response')
                digest = hashlib.sha256(payload).hexdigest()[:24]
                ext = _image_extension(request_url, content_type)
                filename = digest + ext
                local_path = os.path.join(media_dir, filename)
                if not os.path.exists(local_path):
                    with open(local_path, 'wb') as f:
                        f.write(payload)
                public_url = f'{MEDIA_BASE}{discussion_number}/{filename}'
                cache[request_url] = public_url
                print(f'Localized discussion image: #{discussion_number} -> {filename}')
            except Exception as exc:
                print(f'WARNING: could not localize image for discussion #{discussion_number}: {exc}')
                continue

        out = out.replace(raw_url, public_url)
        out = out.replace(raw_url.replace('&', '&amp;'), public_url)

    return out


def git_lastmod(path):
    try:
        return subprocess.check_output(
            ['git', 'log', '-1', '--format=%cs', '--', path], text=True
        ).strip() or datetime.now(timezone.utc).date().isoformat()
    except Exception:
        return datetime.now(timezone.utc).date().isoformat()


def main():
    os.makedirs('community/data', exist_ok=True)
    os.makedirs('community/media', exist_ok=True)

    with open('/tmp/discussions-graphql.json', 'r', encoding='utf-8') as f:
        raw = json.load(f)

    guide_by_title = {}
    if os.path.exists('/tmp/guide-meta.json'):
        for guide in json.load(open('/tmp/guide-meta.json', 'r', encoding='utf-8')):
            stem = guide['stem']
            md_path = f'/tmp/guide-rendered/{stem}.md'
            html_path = f'/tmp/guide-rendered/{stem}.html'
            md = open(md_path, 'r', encoding='utf-8').read() if os.path.exists(md_path) else ''
            rendered = open(html_path, 'r', encoding='utf-8').read() if os.path.exists(html_path) else ''
            guide_by_title[guide['title']] = {
                'bodyText': markdown_plain(md),
                'bodyHTML': rendered,
                'lastmod': guide.get('lastmod') or '',
                'categorySlug': guide.get('categorySlug') or 'general',
            }

    repo = raw.get('data', {}).get('repository') or {}
    categories = []
    for item in (repo.get('discussionCategories') or {}).get('nodes') or []:
        if item:
            categories.append({
                'name': item.get('name') or 'General',
                'slug': item.get('slug') or 'general',
                'description': item.get('description') or '',
                'isAnswerable': bool(item.get('isAnswerable')),
            })

    discussions = []
    current_numbers = set()

    for item in (repo.get('discussions') or {}).get('nodes') or []:
        if not item or item.get('number') is None:
            continue

        number = item['number']
        number_text = str(number)
        current_numbers.add(number_text)
        category = item.get('category') or {}
        author = item.get('author') or {}
        comments_block = item.get('comments') or {}
        official = guide_by_title.get(item.get('title') or '')

        comments = []
        for comment in comments_block.get('nodes') or []:
            if not comment:
                continue
            cauthor = comment.get('author') or {}
            replies_block = comment.get('replies') or {}
            replies = []
            for reply in replies_block.get('nodes') or []:
                if not reply:
                    continue
                rauthor = reply.get('author') or {}
                replies.append({
                    'id': reply.get('id'),
                    'url': reply.get('url') or '',
                    'bodyText': reply.get('bodyText') or '',
                    'bodyHTML': localize_images(reply.get('bodyHTML') or '', number),
                    'createdAt': reply.get('createdAt'),
                    'updatedAt': reply.get('updatedAt'),
                    'user': rauthor.get('login') or 'developer',
                    'avatar': rauthor.get('avatarUrl') or '',
                })
            comments.append({
                'id': comment.get('id'),
                'url': comment.get('url') or '',
                'bodyText': comment.get('bodyText') or '',
                'bodyHTML': localize_images(comment.get('bodyHTML') or '', number),
                'createdAt': comment.get('createdAt'),
                'updatedAt': comment.get('updatedAt'),
                'user': cauthor.get('login') or 'developer',
                'avatar': cauthor.get('avatarUrl') or '',
                'isAnswer': bool(comment.get('isAnswer')),
                'replyCount': int(replies_block.get('totalCount') or 0),
                'replies': replies,
            })

        body_text = (official or {}).get('bodyText') or item.get('bodyText') or ''
        body_html = (official or {}).get('bodyHTML') or item.get('bodyHTML') or ''
        body_html = localize_images(body_html, number)
        updated_at = item.get('updatedAt')
        if official and official.get('lastmod'):
            local_stamp = official['lastmod'] + 'T00:00:00Z'
            if not updated_at or local_stamp > updated_at:
                updated_at = local_stamp

        detail = {
            'number': number,
            'title': item.get('title') or '',
            'url': item.get('url') or '',
            'bodyText': body_text,
            'bodyHTML': body_html,
            'createdAt': item.get('createdAt'),
            'updatedAt': updated_at,
            'user': author.get('login') or 'developer',
            'avatar': author.get('avatarUrl') or '',
            'category': category.get('name') or 'General',
            'categorySlug': category.get('slug') or 'general',
            'isAnswerable': bool(category.get('isAnswerable')),
            'commentCount': int(comments_block.get('totalCount') or 0),
            'answered': bool(item.get('answerChosenAt')),
            'officialGuide': bool(official),
            'comments': comments,
        }

        with open(f'community/data/{number}.json', 'w', encoding='utf-8') as f:
            json.dump(detail, f, ensure_ascii=False, indent=2)
            f.write('\n')

        discussions.append({
            'number': number,
            'title': detail['title'],
            'url': detail['url'],
            'bodyText': detail['bodyText'],
            'createdAt': detail['createdAt'],
            'updatedAt': detail['updatedAt'],
            'user': detail['user'],
            'avatar': detail['avatar'],
            'category': detail['category'],
            'categorySlug': detail['categorySlug'],
            'isAnswerable': detail['isAnswerable'],
            'comments': detail['commentCount'],
            'answered': detail['answered'],
            'officialGuide': detail['officialGuide'],
        })

    for path in glob.glob('community/data/*.json'):
        stem = os.path.splitext(os.path.basename(path))[0]
        if stem not in current_numbers:
            os.remove(path)

    for path in glob.glob('community/media/*'):
        if os.path.isdir(path) and os.path.basename(path) not in current_numbers:
            shutil.rmtree(path)

    latest_update = max((d.get('updatedAt') or '' for d in discussions), default='')
    generated_at = latest_update or '1970-01-01T00:00:00Z'
    with open('community/discussions.json', 'w', encoding='utf-8') as f:
        json.dump({
            'generatedAt': generated_at,
            'source': 'GitHub Discussions',
            'repository': 'fernand21/installerlab-web',
            'categories': categories,
            'discussions': discussions,
        }, f, ensure_ascii=False, indent=2)
        f.write('\n')

    special = {
        '': ('weekly', '1.0'), 'windows-installer-builder': ('weekly', '1.0'),
        'inno-setup-alternative': ('monthly', '0.9'), 'msi-builder': ('monthly', '0.9'),
        'portable-app-builder': ('monthly', '0.9'), 'b4j-installer': ('monthly', '0.9'),
        'download': ('daily', '0.9'), 'docs': ('weekly', '0.9'),
        'community': ('daily', '0.8'), 'features': ('monthly', '0.8'),
        'b4j': ('monthly', '0.8'), 'changelog': ('weekly', '0.7'),
        'faq': ('monthly', '0.6'), 'support': ('monthly', '0.6'),
        'about': ('monthly', '0.5'), 'donate': ('monthly', '0.5'),
    }

    urls = []
    for path in sorted(glob.glob('**/index.html', recursive=True)):
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            page_html = f.read(12000)
        if 'noindex' in page_html.split('</head>', 1)[0].lower():
            continue
        folder = os.path.dirname(path).replace('\\', '/').strip('/')
        loc = BASE if not folder else BASE + folder + '/'
        freq, priority = special.get(folder, ('monthly', '0.5'))
        urls.append({'loc': loc, 'lastmod': git_lastmod(path), 'changefreq': freq, 'priority': priority})

    for discussion in discussions:
        number = discussion.get('number')
        if number is None:
            continue
        updated = (discussion.get('updatedAt') or discussion.get('createdAt') or '')[:10] or datetime.now(timezone.utc).date().isoformat()
        urls.append({
            'loc': f'{BASE}community/topic/?id={number}',
            'lastmod': updated,
            'changefreq': 'daily',
            'priority': '0.6',
        })

    seen = set()
    unique = []
    for item in urls:
        if item['loc'] not in seen:
            seen.add(item['loc'])
            unique.append(item)

    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for item in unique:
        lines.extend([
            '  <url>', f"    <loc>{escape(item['loc'])}</loc>",
            f"    <lastmod>{item['lastmod']}</lastmod>",
            f"    <changefreq>{item['changefreq']}</changefreq>",
            f"    <priority>{item['priority']}</priority>", '  </url>'
        ])
    lines.append('</urlset>')
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')


if __name__ == '__main__':
    main()
