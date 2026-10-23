"""Screenshot the built page at phone size with Playwright (software WebGL).

Usage: python3 tools/shot.py [mode:view[:yaw] ...]
  mode: idle | walk | cast | fly     view: face | full | game     yaw: camera angle in radians
Images go to .cache/shots/. Frame rate here is software rendering, not a phone.
"""
import asyncio, os, sys
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, '.cache', 'shots')
shots = sys.argv[1:] or ['idle:face:0', 'idle:full', 'walk:full', 'cast:full', 'fly:full', 'idle:game']


async def main():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
                                          '--ignore-gpu-blocklist', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=1.5)
        errs = []
        pg.on('console', lambda m: errs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
        await pg.goto('file://' + os.path.join(ROOT, '.cache', 'hero.test.html'))
        await pg.wait_for_timeout(2500)
        for s in shots:
            parts = s.split(':')
            mode, view = parts[0], parts[1]
            js = f"window.__hero.setMode('{mode}');window.__hero.setView('{view}')"
            if len(parts) > 2:
                js += f";window.__hero.setYaw({parts[2]})"
            await pg.evaluate(js)
            await pg.wait_for_timeout(4000)
            name = f"{mode}_{view}" + (f"_{parts[2]}" if len(parts) > 2 else '') + '.png'
            await pg.screenshot(path=os.path.join(OUT, name))
            print('shot', name)
        print('\n'.join(errs[:20]) or 'no console errors')
        await b.close()

asyncio.run(main())
