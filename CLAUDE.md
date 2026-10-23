# 午夜來斬妖 repo 說明（給 Claude）

- 使用者用繁體中文、多半在手機上看結果；回覆簡短，說清楚改了什麼、哪些沒在真機驗證。
- 改 `src/hero.src.html`，不要直接改 `index.html`（它是 `tools/build.py` 產生的）。
- 流程：`bash tools/fetch_deps.sh`（.cache 不在時）→ `python3 tools/build.py`（語法錯誤會中止）→ `python3 tools/shot.py ...` 看截圖 → commit。
- 試做頁同時發佈為 Artifact：https://claude.ai/artifact/84tPRa2m9C3SZtaAAPkgGe（用 Artifact 工具 publish：`file_path=<repo>/index.html`，帶這個 `url`，就會更新同一個網址；發佈前先 `git pull`，網址上若有更新的版本會被擋下來，要先合併）。GitHub Pages：https://fyradio.github.io/zen-space/
- **企劃與造型文件在 repo 的 `docs/`**（`docs/企劃.md`＝企劃 v4：玩法、劇情、境界、章節、版本規劃；`docs/主角造型.md`＝造型演進與捏臉系統），**以這裡為準**；claude.ai 專案「製作遊戲」裡的舊檔只當備份，有 Projects 工具時才順手同步。重要決定改完就更新 docs 並 commit。
- 目前進度：主角試做（含捏臉面板、預設＝使用者捏的臉）；下一步是遊戲 v0.1「關卡手感」（見 `docs/企劃.md` 第十二節）。待決定：標題字體（墨團／怪奇／立體／毛筆）、主角名字。
- 設定捏臉預設：使用者貼「午夜來斬妖・捏臉設定 {...}」→ `python3 tools/set_face.py '<整段貼來的文字>'`：把**全部**數值設成預設，並把每根滑桿移成「預設在正中間」（寬度不變，使用者要能往上往下調）。使用者會這樣來回好幾輪（細節見 `docs/主角造型.md`）。
- 多個 session 可能同時改這個 repo：動手前先 `git pull`，推送前再確認。
- 原則：只借類型，角色、名稱、美術全部自創；人物走古風仙俠、氣氛偏怪談、不見血。
