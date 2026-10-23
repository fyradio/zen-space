#!/usr/bin/env bash
# Download build/test dependencies into .cache (ignored by git):
#  - the five OFL fonts used by the page (sparse checkout of google/fonts)
#  - Three.js r128 build (for local screenshot tests; the page itself loads it from cdnjs)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/.cache"
cd "$ROOT/.cache"
if [ ! -d gfonts ]; then
  git clone -q --depth 1 --filter=blob:none --sparse https://github.com/google/fonts gfonts
  git -C gfonts sparse-checkout set ofl/pottaone ofl/reggaeone ofl/rampartone ofl/yujiboku ofl/lxgwwenkaitc
fi
if [ ! -d three-r128 ]; then
  git clone -q --depth 1 --branch r128 --filter=blob:none --sparse https://github.com/mrdoob/three.js three-r128
  git -C three-r128 sparse-checkout set build
fi
pip list 2>/dev/null | grep -qi fonttools || pip install --break-system-packages -q fonttools brotli
echo "deps ready in $ROOT/.cache"
