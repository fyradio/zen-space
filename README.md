# 午夜來斬妖

古風仙俠 × 怪談的割草修仙手機遊戲（橫向）。序章＋十章＋無盡之夜、洞府修行、鬥法台。

- 試玩：https://fyradio.github.io/zen-space/ （整個遊戲，可加入主畫面離線玩）；主角試做頁：…/hero.html
- 企劃與造型紀錄：claude.ai 專案「製作遊戲」裡的《御劍小道士-企劃》（遊戲名已定為《午夜來斬妖》）與《午夜來斬妖-主角造型》

## 檔案

| 路徑 | 內容 |
|---|---|
| `src/hero.src.html` | 原始碼（單檔 HTML＋Three.js r128，字體位置留 `/*FONTS*/`） |
| `index.html` | 建置結果＝整個遊戲（GitHub Pages 首頁，字體子集已內嵌，PWA 可離線） |
| `game.html` | 同一個遊戲的片段版，發佈成 Artifact 用 |
| `hero.html` | 主角試做頁 |
| `tools/fetch_deps.sh` | 下載建置需要的字體與本機測試用的 Three.js 到 `.cache/` |
| `tools/build.py` | 內嵌字體子集、語法檢查，輸出 `index.html`／`game.html`／`hero.html` 與 `.cache/*.test.html` |
| `tools/shot.py` | 用 Playwright 以手機尺寸截圖到 `.cache/shots/` |

## 建置

```bash
bash tools/fetch_deps.sh      # 第一次
python3 tools/build.py        # 改完 src 後
python3 tools/shot.py idle:face:0 idle:full fly:full
```

## 字體授權

標題用 Potta One、Reggae One、Rampart One、Yuji Boku，介面用 LXGW WenKai TC（霞鶩文楷），皆為 SIL Open Font License 1.1，只內嵌用到的字。
