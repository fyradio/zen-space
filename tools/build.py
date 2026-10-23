"""Build the pages: src/hero.src.html -> hero.html (主角試做), src/game.src.html -> game.html (關卡，給 Artifact) + index.html (同一個遊戲包成完整網頁，給 GitHub Pages).

- `/*@include name.js*/` in a page is replaced by src/name.js (the shared hero lives in src/hero_core.js).

- Subsets the title and UI fonts (OFL, from google/fonts) and embeds them as data URIs,
  so the page works offline and needs no Google Fonts.
- Writes .cache/<page>.test.html (Three.js loaded from the local copy) for screenshot tests.
- Syntax-checks the inline script with node.

Run tools/fetch_deps.sh once first.
"""
import base64, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, '.cache')
GF = os.path.join(CACHE, 'gfonts', 'ofl')
THREE_LOCAL = os.path.join(CACHE, 'three-r128', 'build', 'three.min.js')
THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'

try:
    import brotli  # noqa: F401
    FLAVOR, MIME, FMT = 'woff2', 'font/woff2', 'woff2'
except ImportError:
    FLAVOR, MIME, FMT = None, 'font/ttf', 'truetype'


def subset(path, text):
    with tempfile.TemporaryDirectory() as d:
        tf = os.path.join(d, 't.txt')
        open(tf, 'w', encoding='utf8').write(text)
        out = os.path.join(d, 'o')
        cmd = ['pyftsubset', path, f'--text-file={tf}', f'--output-file={out}',
               '--layout-features=*', '--no-hinting']
        if FLAVOR:
            cmd.append(f'--flavor={FLAVOR}')
        subprocess.run(cmd, check=True, stderr=subprocess.DEVNULL)
        return base64.b64encode(open(out, 'rb').read()).decode()


PAGES = [('hero.src.html', 'hero.html', 'hero.test.html', None), ('game.src.html', 'game.html', 'game.test.html', 'index.html')]


def include(text):
    return re.sub(r'/\*@include ([\w./]+)\*/', lambda m: open(os.path.join(ROOT, 'src', m.group(1)), encoding='utf8').read(), text)


def build(src_name, out_name, test_name, page_name=None):
    path = os.path.join(ROOT, 'src', src_name)
    if not os.path.exists(path):
        return
    src = include(open(path, encoding='utf8').read())
    print('--', out_name)
    title = '午夜來斬妖'
    # glyphs only for text that can be shown: JS/CSS/HTML comments are dropped first (keeps the embedded font small)
    shown = re.sub(r'/\*[\s\S]*?\*/', '', src)
    shown = re.sub(r'(?<![:\'"\w\\])//[^\n]*', '', shown)
    shown = re.sub(r'<!--[\s\S]*?-->', '', shown)
    ui_chars = ''.join(sorted(set(c for c in shown if ord(c) > 127))) + ''.join(chr(i) for i in range(32, 127))
    faces = [
        ('TPotta', 'pottaone/PottaOne-Regular.ttf', title),
        ('TReggae', 'reggaeone/ReggaeOne-Regular.ttf', title),
        ('TRampart', 'rampartone/RampartOne-Regular.ttf', title),
        ('TBoku', 'yujiboku/YujiBoku-Regular.ttf', title),
        ('WenKai', 'lxgwwenkaitc/LXGWWenKaiTC-Regular.ttf', ui_chars),
    ]
    css = []
    for name, f, text in faces:
        p = os.path.join(GF, f)
        if not os.path.exists(p):
            sys.exit(f'missing font {p} - run tools/fetch_deps.sh first')
        b = subset(p, text)
        css.append(f"@font-face{{font-family:'{name}';src:url(data:{MIME};base64,{b}) format('{FMT}');font-display:block}}")
        print(f'{name:9s} {len(b) // 1024:4d} KB')

    out = src.replace('/*FONTS*/', '\n'.join(css))

    # syntax check of the inline script before writing anything
    js = re.findall(r'<script>(.*?)</script>', out, re.S)
    check = os.path.join(CACHE, 'check.js')
    os.makedirs(CACHE, exist_ok=True)
    open(check, 'w', encoding='utf8').write('\n'.join(js))
    r = subprocess.run(['node', '--check', check], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f'syntax error, {out_name} NOT written:\n' + r.stderr)
    print('syntax   OK')

    open(os.path.join(ROOT, out_name), 'w', encoding='utf8').write(out)
    if page_name:  # GitHub Pages needs a real document (charset + viewport); the Artifact wraps the fragment itself
        open(os.path.join(ROOT, page_name), 'w', encoding='utf8').write(
            '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" '
            'content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no"></head><body>' + out + '</body></html>')
        print(page_name, 'written')
    test = out.replace(f'<script src="{THREE_CDN}"></script>', f'<script src="file://{THREE_LOCAL}"></script>')
    test = ('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
            'content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + test + '</body></html>')
    open(os.path.join(CACHE, test_name), 'w', encoding='utf8').write(test)
    print(out_name, len(out) // 1024, 'KB')


for pg in PAGES:
    build(*pg)
