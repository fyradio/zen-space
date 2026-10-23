# 午夜來斬妖 repo 說明（給 Claude）

- 使用者用繁體中文、多半在手機上看結果；回覆簡短，說清楚改了什麼、哪些沒在真機驗證。
- 改 `src/hero.src.html`，不要直接改 `index.html`（它是 `tools/build.py` 產生的）。
- 流程：`bash tools/fetch_deps.sh`（.cache 不在時）→ `python3 tools/build.py`（語法錯誤會中止）→ `python3 tools/shot.py ...` 看截圖 → commit。
- 試做頁同時發佈為 Artifact：https://claude.ai/artifact/84tPRa2m9C3SZtaAAPkgGe（用 Artifact 工具 publish：`file_path=/home/user/zen-space/index.html`，帶這個 `url`，就會更新同一個網址）。
- 企劃、劇情、造型決定記在 claude.ai 專案「製作遊戲」的文件裡（Projects 工具），重要決定要同步更新。
- 原則：只借類型，角色、名稱、美術全部自創；人物走古風仙俠、氣氛偏怪談、不見血。
