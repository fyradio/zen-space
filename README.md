# 午夜來斬妖

古風仙俠 × 怪談的割草修仙手機遊戲（企劃中）。目前這個 repo 放的是**主角 3D 試做**：古風小道士站在霧夜墳場，可切換負手／行走／施法／御劍、特寫／全身／遊戲視角、三套道袍配色，並比較四種標題字體。

- 試玩：`index.html`（開啟 GitHub Pages 後網址是 https://fyradio.github.io/zen-space/）
- 企劃與造型紀錄：claude.ai 專案「製作遊戲」裡的《御劍小道士-企劃》（遊戲名已定為《午夜來斬妖》）與《午夜來斬妖-主角造型》

## 檔案

| 路徑 | 內容 |
|---|---|
| `src/hero.src.html` | 原始碼（單檔 HTML＋Three.js r128，字體位置留 `/*FONTS*/`） |
| `index.html` | 建置結果：字體子集已內嵌，可直接開、可離線（Three.js 從 cdnjs 載入） |
| `tools/fetch_deps.sh` | 下載建置需要的字體與本機測試用的 Three.js 到 `.cache/` |
| `tools/build.py` | 內嵌字體子集、語法檢查，輸出 `index.html` 與 `.cache/hero.test.html` |
| `tools/shot.py` | 用 Playwright 以手機尺寸截圖到 `.cache/shots/` |

## 建置

```bash
bash tools/fetch_deps.sh      # 第一次
python3 tools/build.py        # 改完 src 後
python3 tools/shot.py idle:face:0 idle:full fly:full
```

## 字體授權

標題用 Potta One、Reggae One、Rampart One、Yuji Boku，介面用 LXGW WenKai TC（霞鶩文楷），皆為 SIL Open Font License 1.1，只內嵌用到的字。
