"""Set the 捏臉 defaults and centre every slider on them.

Usage: python3 tools/set_face.py '午夜來斬妖・捏臉設定 {...}'   (or no argument: just re-centre)
The pasted text carries "who": 0 = 女主角 (defaults live in FACE_SPEC), 1 = 男主角 (defaults live in MALE).
Each slider keeps its full width (`span`, recorded on the first run); the window is moved so that `def` sits in the middle,
except where that would cross a floor in HARD (sizes, strengths): then the window is narrowed so def stays centred
(only for this round; span itself never changes), or starts at the floor if def is right on it.
Edits src/hero.src.html in place; then run tools/build.py.
"""
import json, math, os, re, sys

SRC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'hero.src.html')
HARD = {'noseTipP': 0, 'blush': 0, 'contour': 0, 'shadow': 0, 'flat': 0, 'lash': .5, 'shoulderDrop': 0, 'browDark': .1,
        'browBone': 0, 'browArch': 0, 'headS': .5, 'faceW': .3, 'headH': .5, 'eyeSize': .5, 'eyeOpen': .5, 'irisS': .5,
        'browLen': .3, 'browThick': .3, 'noseH': 0, 'noseW': .3, 'lipW': .3, 'lipThick': .3, 'height': .5, 'legLen': .4,
        'torsoLen': .3, 'shoulderW': .4, 'bodyW': .4, 'armLen': .5, 'neckLen': .05, 'lashes': 0, 'handS': .5, 'cheekHollow': 0, 'lowerLen': -.3}


def num(v):
    v = round(v, 4)
    return '0' if v == 0 else f'{v:g}'


def window(item, d):
    """min/max for default d: keep the slider's full width (span), centred on d unless a floor in HARD is in the way."""
    k, st, span = item['k'], item['step'], item['span']
    h = math.floor(round(span / 2 / st, 6)) * st
    if k in HARD and d - h < HARD[k]:
        room = math.floor(round((d - HARD[k]) / st, 6)) * st
        if room >= span / 8:  # narrow the window so the default stays in the middle (span is kept, so this never accumulates)
            h = room
        else:  # default sits (almost) on the floor: start at the floor instead
            return HARD[k], HARD[k] + 2 * h
    return d - h, d + h


def main():
    vals = {}
    if len(sys.argv) > 1:
        t = sys.argv[1]
        vals = json.loads(t[t.index('{'):t.rindex('}') + 1])
    who = int(vals.pop('who', 0))
    s = open(SRC, encoding='utf-8').read()
    a0, a1 = s.index('const FACE_SPEC=['), s.index('const FACE_DEF=') if 'const FACE_DEF=' in s else s.index('// 角色:')
    items = {}

    def fix(m):
        t = m.group(0)
        k = re.search(r"k:'(\w+)'", t).group(1)
        if who == 0 and k in vals:
            t = re.sub(r'def:[^,}]+', f'def:{num(vals[k])}', t)
        mm = re.search(r'min:([-\d.]+),max:([-\d.]+),step:([\d.]+),(?:span:([\d.]+),)?def:([-\d.]+)', t)
        if not mm:
            items[k] = None
            return t
        mn, mx, st, sp, d = mm.groups()
        mn, mx, st, d = float(mn), float(mx), float(st), float(d)
        span = float(sp) if sp else mx - mn
        if not sp:
            t = t.replace(',def:', f',span:{num(span)},def:', 1)
        items[k] = {'k': k, 'step': st, 'span': span}
        lo, hi = window(items[k], d)
        return re.sub(r'min:[-\d.]+,max:[-\d.]+', f'min:{num(lo)},max:{num(hi)}', t)

    spec = re.sub(r"\{k:'\w+'[^}]*\}", fix, s[a0:a1])
    s = s[:a0] + spec + s[a1:]
    # 男主角: MALE = {k: [min, max, def]}
    m = re.search(r'const MALE=(\{.*?\});', s)
    if m:
        male = json.loads(m.group(1))
        for k, item in items.items():
            d = vals[k] if who == 1 and k in vals else (male[k][2] if k in male else None)
            if d is None:
                continue
            lo, hi = window(item, d) if item else (0, 0)
            male[k] = [round(lo, 4) + 0.0, round(hi, 4) + 0.0, d]
        s = s[:m.start(1)] + json.dumps(male, separators=(',', ':'), ensure_ascii=False) + s[m.end(1):]
    open(SRC, 'w', encoding='utf-8').write(s)
    unknown = [k for k in vals if k not in items]
    print('角色:', '男主角' if who == 1 else '女主角')
    if who == 1 and m:
        for k, v in male.items():
            print(f'{k:12} {v[0]:>7} … {v[2]:>6} … {v[1]}')
    else:
        for mm in re.finditer(r"k:'(\w+)',n:'([^']+)',min:([-\d.]+),max:([-\d.]+),step:[\d.]+,(?:span:[\d.]+,)?def:([-\d.]+)", spec):
            print(f'{mm.group(2):10} {mm.group(3):>7} … {mm.group(5):>6} … {mm.group(4)}')
    if unknown:
        print('ignored (not in FACE_SPEC):', ', '.join(unknown))


main()
