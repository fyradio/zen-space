#!/usr/bin/env bash
# 午夜來斬妖 一鍵發佈：git pull → build（語法錯誤會中止）→ sw.js 快取版本 +1 → commit（含署名）→ push
# 用法：bash tools/release.sh "這次更新說明"
# 之後再用 Artifact 工具發佈 game.html 到正式版網址（腳本最後會印出提醒）。
set -euo pipefail
cd "$(dirname "$0")/.."
MSG="${1:?請給更新說明}"
git pull -q --rebase --autostash
[ -d .cache ] || bash tools/fetch_deps.sh
python3 tools/build.py >/tmp/zen_build.log 2>&1 || { cat /tmp/zen_build.log; echo "build 失敗，不發佈"; exit 1; }
tail -1 /tmp/zen_build.log
# sw.js：const V='zen-vN' → N+1
N=$(grep -o "zen-v[0-9]*" sw.js | head -1 | grep -o "[0-9]*")
NN=$((N+1)); sed -i "s/zen-v${N}'/zen-v${NN}'/" sw.js
TRAILERS="${ZEN_TRAILERS:-}"
git add -A
if git diff --cached --quiet; then echo "沒有變更"; else
  git commit -q -m "${MSG}" ${TRAILERS:+-m "$TRAILERS"}
  git push -q
fi
echo "released zen-v${NN} $(git log --oneline -1)"
echo "下一步：Artifact publish file_path=$(pwd)/game.html url=https://claude.ai/artifact/Rxbqh7kS2Hhqk4oftzfd7E"
