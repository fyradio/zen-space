# 午夜來斬妖 repo 說明（給 Claude）

- 使用者用繁體中文、多半在手機上看結果；回覆簡短，說清楚改了什麼、哪些沒在真機驗證。
- 原始碼在 `src/`：`hero_core.js`＝共用的主角模型（場景、燈光、捏臉、身形、髮型、表情、布料動畫）；`hero.src.html`＝主角試做頁 → `index.html`；`game.src.html`＝關卡 → `game.html`。不要直接改 `index.html`／`game.html`（`tools/build.py` 產生的，`/*@include hero_core.js*/` 會被換成共用檔）。
- 流程：`bash tools/fetch_deps.sh`（.cache 不在時）→ `python3 tools/build.py`（語法錯誤會中止）→ `python3 tools/shot.py ...` 看主角試做頁截圖 → commit。關卡用 Playwright 開 `.cache/game.test.html`，`window.__game` 有 `start()`、`setCam(i)`、`auto(true)`（自動走位）、`sim(秒)`（不渲染快轉，用來測平衡）、`god()`、`spawnRing()`。
- 試做頁同時發佈為 Artifact：https://claude.ai/artifact/84tPRa2m9C3SZtaAAPkgGe（用 Artifact 工具 publish：`file_path=<repo>/index.html`，帶這個 `url`，就會更新同一個網址；發佈前先 `git pull`，網址上若有更新的版本會被擋下來，要先合併）。GitHub Pages：https://fyradio.github.io/zen-space/ （關卡：…/game.html）。
- 關卡另外發佈為 Artifact：https://claude.ai/artifact/Rxbqh7kS2Hhqk4oftzfd7E（`file_path=<repo>/game.html`，帶這個 `url`）。
- **企劃與造型文件在 repo 的 `docs/`**（`docs/企劃.md`＝企劃 v4：玩法、劇情、境界、章節、版本規劃；`docs/主角造型.md`＝造型演進與捏臉系統），**以這裡為準**；claude.ai 專案「製作遊戲」裡的舊檔只當備份，有 Projects 工具時才順手同步。重要決定改完就更新 docs 並 commit。
- 目前進度：主角試做（捏臉告一段落）；遊戲 v0.1 序章關卡已改成**橫向**（左手搖桿、右手四技能鍵，大絕萬劍歸宗靠斬妖充能），並有**修行突破條件**（`REQS`，戰場雷劫或靜室打坐突破，每層 ×1.1）。設計與數值見 `docs/企劃.md` 的「v0.1 手感改版」「v0.1 橫向＋技能鍵」「修行：突破條件」。下一步：洞府（靜室、藥園、煉丹）讓煉丹條件可以完成。待決定：標題字體、主角名字。測試：`window.__game.auto(true)` 會自動放技能、`auto('wander')`＝繞圈不閃躲、`auto(false)`＝原地不動、`G.simPick='rand'` 亂選卡；模擬請用橫向視窗（844×390）。
- 設定捏臉預設：使用者貼「午夜來斬妖・捏臉設定 {...}」→ `python3 tools/set_face.py '<整段貼來的文字>'`：把**全部**數值設成預設，並把每根滑桿移成「預設在正中間」（寬度不變，使用者要能往上往下調）。使用者會這樣來回好幾輪。設定裡的 `who` 決定是哪個角色（0＝女主角，預設寫在 `FACE_SPEC`；1＝男主角，寫在 `MALE`），工具會自己判斷（細節見 `docs/主角造型.md`）。
- 多個 session 可能同時改這個 repo：動手前先 `git pull`，推送前再確認。
- 原則：只借類型，角色、名稱、美術全部自創；人物走古風仙俠、氣氛偏怪談、不見血。
