#!/usr/bin/env python3
"""Generate brand-matched OG images (1200x630) for yuliusbox.com with PIL.

Design: zinc-950 dark background (#09090b), white bold title, zinc-400
subtitle, subtle accent bar, yuliusbox.com watermark. Matches site theme.
"""
import os
import re
import subprocess
import textwrap
from html import unescape

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (9, 9, 11)          # zinc-950
TITLE_C = (255, 255, 255)
SUB_C = (161, 161, 170)  # zinc-400
WATER_C = (82, 82, 91)   # zinc-600
ACCENT = (59, 130, 246)  # blue-500, subtle brand accent

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

OUTDIR = "/home/hatch/workspace/yuliusbox/public/og"


def fetch_meta(url):
    p = subprocess.run(
        ["curl", "-s", "--max-time", "25", "-A", "Mozilla/5.0", url],
        capture_output=True, timeout=40)
    html = p.stdout.decode("utf-8", "ignore")
    def tag(pat):
        m = re.search(pat, html, re.I | re.S)
        return unescape(m.group(1)).strip() if m else ""
    title = tag(r"<title>(.*?)</title>").split("|")[0].strip()
    desc = tag(r'<meta[^>]+name="description"[^>]+content="([^"]*)"')
    if not desc:
        desc = tag(r'<meta[^>]+property="og:description"[^>]+content="([^"]*)"')
    return title, desc


def slug_for(url):
    path = url.split("yuliusbox.com", 1)[1].split("?")[0].strip("/")
    return path.replace("/", "-") if path else "home"


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if draw.textlength(t, font=font) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w_
    if cur:
        lines.append(cur)
    return lines


def make_image(title, subtitle, out_path):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # subtle accent bar at top
    d.rectangle([0, 0, W, 6], fill=ACCENT)

    # subtle top glow: soft radial feel via layered horizontal bands
    for i in range(120):
        alpha = int(14 * (1 - i / 120))
        d.line([(0, 6 + i), (W, 6 + i)], fill=(9 + alpha, 9 + alpha, 11 + alpha))

    f_title = ImageFont.truetype(FONT_BOLD, 72)
    f_sub = ImageFont.truetype(FONT_REG, 34)
    f_water = ImageFont.truetype(FONT_REG, 28)

    max_w = W - 160
    lines = wrap(d, title, f_title, max_w)[:3]
    # shrink if still too tall
    while len(lines) > 2 and f_title.size > 48:
        f_title = ImageFont.truetype(FONT_BOLD, f_title.size - 6)
        lines = wrap(d, title, f_title, max_w)[:3]

    line_h = int(f_title.size * 1.25)
    total_h = len(lines) * line_h
    # reserve room for subtitle
    sub_lines = wrap(d, subtitle, f_sub, max_w)[:2] if subtitle else []
    sub_h = len(sub_lines) * 48 + (30 if sub_lines else 0)

    y = (H - total_h - sub_h) // 2
    for ln in lines:
        tw = d.textlength(ln, font=f_title)
        d.text(((W - tw) / 2, y), ln, font=f_title, fill=TITLE_C)
        y += line_h

    if sub_lines:
        y += 24
        for ln in sub_lines:
            tw = d.textlength(ln, font=f_sub)
            d.text(((W - tw) / 2, y), ln, font=f_sub, fill=SUB_C)
            y += 48

    wm = "yuliusbox.com"
    tw = d.textlength(wm, font=f_water)
    d.text((W - tw - 48, H - 58), wm, font=f_water, fill=WATER_C)

    img.save(out_path, "PNG", optimize=True)


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    with open("/tmp/og_urls.txt") as f:
        urls = [u.strip() for u in f if u.strip()]
    print(f"{len(urls)} URLs", flush=True)
    manifest = {}
    for i, url in enumerate(urls, 1):
        slug = slug_for(url)
        out = f"{OUTDIR}/{slug}.png"
        try:
            title, desc = fetch_meta(url)
            if not title:
                title = slug.replace("-", " ").title()
            make_image(title, desc, out)
            manifest[url] = {"slug": slug, "title": title, "file": f"/og/{slug}.png"}
            print(f"[{i}/{len(urls)}] {slug}.png <- {title[:50]}", flush=True)
        except Exception as e:
            print(f"[{i}/{len(urls)}] FAILED {url}: {e}", flush=True)
    import json
    with open("/tmp/og_manifest.json", "w") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print(f"done, {len(manifest)} images", flush=True)


if __name__ == "__main__":
    main()
