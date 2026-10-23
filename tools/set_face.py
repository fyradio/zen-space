"""Set the 捏臉 defaults and centre every slider on them.

Usage: python3 tools/set_face.py '午夜來斬妖・捏臉設定 {...}'   (or no argument: just re-centre)
Each slider keeps its full width (`span`, recorded on the first run); the window is moved so that `def` sits in the middle,
except where that would cross a floor in HARD (sizes, strengths): then the window starts at the floor.
Edits src/hero.src.html in place; then run tools/build.py.
"""
import json, math, os, re, sys

SRC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'hero.src.html')
HARD = {'noseTipP': 0, 'blush': 0, 'contour': 0, 'shadow': 0, 'flat': 0, 'lash': .5, 'shoulderDrop': 0, 'browDark': .1,
        'browBone': 0, 'browArch': 0, 'headS': .5, 'faceW': .5, 'headH': .5, 'eyeSize': .5, 'eyeOpen': .5, 'irisS': .5,
        'browLen': .3, 'browThick': .3, 'noseH': 0, 'noseW': .3, 'lipW': .3, 'lipThick': .3, 'height': .5, 'legLen': .4,
        'torsoLen': .4, 'shoulderW': .4, 'bodyW': .4, 'armLen': .5, 'neckLen': .2, 'lowerLen': -.1}


def num(v):
    v = round(v, 4)
    return '0' if v == 0 else f'{v:g}'


def main():
    vals = {}
    if len(sys.argv) > 1:
        t = sys.argv[1]
        vals = json.loads(t[t.index('{'):t.rindex('}') + 1])
    s = open(SRC, encoding='utf-8').read()
    a0, a1 = s.index('const FACE_SPEC=['), s.index('const FACE_DEF=')

    def fix(m):
        t = m.group(0)
        k = re.search(r"k:'(\w+)'", t).group(1)
        if k in vals:
            t = re.sub(r'def:[^,}]+', f'def:{num(vals[k])}', t)
        mm = re.search(r'min:([-\d.]+),max:([-\d.]+),step:([\d.]+),(?:span:[\d.]+,)?def:([-\d.]+)', t)
        if not mm:
            return t
        mn, mx, st, d = map(float, mm.groups())
        sp = re.search(r'span:([\d.]+)', t)
        span = float(sp.group(1)) if sp else mx - mn  # span: the slider's full width, kept across rounds
        if not sp:
            t = t.replace(',def:', f',span:{num(span)},def:', 1)
        h = math.floor(round(span / 2 / st, 6)) * st
        lo = d - h
        if k in HARD and lo < HARD[k]:  # can't centre without crossing the floor: sit on the floor, keep the width
            lo = HARD[k]
        return re.sub(r'min:[-\d.]+,max:[-\d.]+', f'min:{num(lo)},max:{num(lo + 2 * h)}', t)

    spec = re.sub(r"\{k:'\w+'[^}]*\}", fix, s[a0:a1])
    unknown = [k for k in vals if f"k:'{k}'" not in spec]
    open(SRC, 'w', encoding='utf-8').write(s[:a0] + spec + s[a1:])
    for m in re.finditer(r"k:'(\w+)',n:'([^']+)',min:([-\d.]+),max:([-\d.]+),step:[\d.]+,(?:span:[\d.]+,)?def:([-\d.]+)", spec):
        print(f'{m.group(2):10} {m.group(3):>7} … {m.group(5):>6} … {m.group(4)}')
    if unknown:
        print('ignored (not in FACE_SPEC):', ', '.join(unknown))


main()
