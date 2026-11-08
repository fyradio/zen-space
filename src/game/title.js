/* ================= 標題畫面、存讀檔、遊戲說明 =================
   開啟遊戲先到標題：3D 崖邊提燈背影＋大字＋「重新開始／載入遊戲／遊戲說明」。
   存檔：自動 1 格（原本的 zk-game-v1，隨時自動存）＋手動 3 格（zk-slot-1～3：{t,save}）。捏臉另外存，所有存檔共用。
   載入／重新開始＝把資料寫進自動那格後重新整理頁面（網址加 #home／#new），這樣所有初始化都照常跑一次。 */
const SLOT_KEYS=['zk-slot-1','zk-slot-2','zk-slot-3'];
const readSlot=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const autoSave=()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return s&&Object.keys(s).length>4?{t:s.at||0,save:s}:null}catch(e){return null}};
function slotInfo(d){if(!d||!d.save)return null;const s=d.save;let top=-1;for(const k in (s.won||{}))top=Math.max(top,+k.split('-')[0]);
  const chs=top<0?'還沒打贏任何一夜':`打到${(CH[Math.min(top+1,CH.length-1)]||{}).n||'終章'}`,when=d.t?new Date(d.t).toLocaleString('zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
  return `${REALMS[s.realm||0]||'煉氣一層'}・${chs}・靈石 ${fmt((s.inv&&s.inv.stone)||0)}${when?`<small>${when}</small>`:''}`}
let titleOn=false;
const TITLE=(()=>{const g=new THREE.Group();g.visible=false;scene.add(g);
  // 崖：主角腳下一塊大岩，前面是深谷，遠處一層層山（月亮在標題時壓低一點，才能和主角同框）
  const dir=new THREE.Vector3(moon.position.x,0,moon.position.z).normalize(),side=new THREE.Vector3(-dir.z,0,dir.x),yaw=Math.atan2(dir.x,dir.z);
  const R=toon(0x23282a),cliff=new THREE.Mesh(new THREE.DodecahedronGeometry(3,1),R);cliff.scale.set(1.3,1.7,1.3);cliff.position.copy(dir).multiplyScalar(-2.2).setY(-5.05);g.add(cliff);
  for(let i=0;i<6;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(.06,.3+Math.random()*.2,4),toon(0x34442f));t.position.copy(dir).multiplyScalar(-.4-Math.random()*1.5).addScaledVector(side,(Math.random()-.5)*2.4);t.position.y=.1;g.add(t)}
  const MB=c=>new THREE.MeshBasicMaterial({color:c});
  for(let row=0;row<3;row++)for(let i=0;i<7;i++){const d=46+row*18,o=(i-3)*18+(row%2)*9+(Math.random()-.5)*6,h=13+Math.random()*9+row*6,m=new THREE.Mesh(new THREE.ConeGeometry(11+Math.random()*5+row*4,h,6),MB([0x26323a,0x1b252c,0x121a20][row]));
    m.position.copy(dir).multiplyScalar(d).addScaledVector(side,o);m.position.y=h/2-19+row*1.5;m.rotation.y=Math.random()*6;g.add(m)}
  const mists=[];for(let i=0;i<9;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xaabcc0,transparent:true,opacity:.2,depthWrite:false}));s.scale.set(34,5,1);s.position.copy(dir).multiplyScalar(18+i*6).addScaledVector(side,(Math.random()-.5)*40);s.position.y=-3.5+Math.random()*3;g.add(s);mists.push(s)}
  let t=0,saved=null,snap=false;const moon0=moon.position.clone(),moonT=dir.clone().multiplyScalar(60).addScaledVector(side,-9).setY(17);
  function show(){titleOn=true;g.visible=true;snap=true;saved={ground:ground.visible,map:mapG.visible,pave:pave.visible};ground.visible=mapG.visible=pave.visible=false;moon.position.copy(moonT);root.position.set(0,0,0);root.rotation.y=yaw;mode='idle';
    $('#startOv').classList.remove('on');$('#titleOv').classList.add('on');$('#tLoad').disabled=!autoSave()&&!SLOT_KEYS.some(k=>readSlot(k));BGM.play('home')}
  function hide(){titleOn=false;g.visible=false;moon.position.copy(moon0);if(saved){ground.visible=saved.ground;mapG.visible=saved.map;pave.visible=saved.pave}$('#titleOv').classList.remove('on')}
  function step(dt){t+=dt;root.rotation.y=yaw;mode='idle';mists.forEach((s,i)=>{s.position.addScaledVector(side,dt*(.5+i*.06));if(s.position.dot(side)>26)s.position.addScaledVector(side,-52);s.material.opacity=.16+.07*Math.sin(t*.3+i)})}
  // 鏡頭在主角背後偏右、略低，看過主角肩膀望向月亮；慢慢呼吸般推近
  function cam(dt){const k=snap?1:1-Math.exp(-dt*2);snap=false;const p=tmp2.copy(dir).multiplyScalar(-2.5+Math.sin(t*.15)*.15).addScaledVector(side,-.1);p.y=.8;
    camera.position.lerp(p,k);camera.lookAt(tmp3.copy(dir).multiplyScalar(10).addScaledVector(side,.6).setY(1.75));camera.updateMatrixWorld();
    lantern.position.copy(HERO.pos).addScaledVector(HERO.right,-.42).addScaledVector(HERO.fwd,.12);lantern.position.y=.6+Math.sin(t*1.3)*.025;sky.position.copy(camera.position)}
  return {show,hide,step,cam}})();
// ---------- 小視窗（確認、選格子）----------
function modal(html,wire){const ov=$('#mdOv');$('#mdBox').innerHTML=html;ov.classList.add('on');wire(ov);return ()=>ov.classList.remove('on')}
function confirmBox(text,btns){const close=modal(`<p class="mdt">${text}</p><div class="mdbtns">${btns.map((b,i)=>`<button class="btn${b.go?' go':''}" data-i="${i}">${b.t}</button>`).join('')}</div>`,ov=>{
  ov.querySelectorAll('[data-i]').forEach(e=>e.onclick=()=>{close();const b=btns[+e.dataset.i];if(b.f)b.f()})})}
// 選格子：mode='save' 存進手動格（蓋掉先確認）；mode='load' 四格都能讀
function slotPicker(mode,done){const rows=[];if(mode==='load'){const a=autoSave();rows.push({k:'auto',n:'自動存檔',d:a})}SLOT_KEYS.forEach((k,i)=>rows.push({k,n:`存檔 ${i+1}`,d:readSlot(k)}));
  const close=modal(`<h3 class="mdh">${mode==='save'?'存到哪一格？':'載入哪一個存檔？'}</h3><div class="slots">${rows.map(r=>{const info=slotInfo(r.d);
      return `<button class="slot" data-k="${r.k}" ${mode==='load'&&!info?'disabled':''}><b>${r.n}</b><span>${info||'（空）'}</span></button>`}).join('')}</div><button class="btn" data-x>取消</button>`,ov=>{
    ov.querySelector('[data-x]').onclick=()=>close();
    ov.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k,r=rows.find(r=>r.k===k);
      if(mode==='save'){const doSave=()=>{writeSave();try{localStorage.setItem(k,JSON.stringify({t:Date.now(),save}))}catch(e){}SFX.play('gold');close();banner('存檔完成',r.n);if(done)done()};
        if(r.d)confirmBox(`${r.n}已經有存檔：<br>${slotInfo(r.d)}<br>要蓋掉嗎？`,[{t:'蓋掉',go:1,f:doSave},{t:'取消',f:()=>slotPicker(mode,done)}]);else doSave()}
      else{close();loadSlot(k)}})})}
function bootTo(h){try{location.hash=h}catch(e){}location.reload()}
function loadSlot(k){if(k==='auto'){TITLE.hide();$('#startOv').classList.add('on');DF.render();return}const d=readSlot(k);if(!d)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify(d.save))}catch(e){}bootTo('home')}
function newGame(){const go=()=>{try{localStorage.removeItem(SAVE_KEY)}catch(e){}bootTo('new')};
  if(!autoSave()){go();return}
  confirmBox('重新開始會洗掉<b>自動存檔</b>的進度（手動存的三格不受影響）。<br>要先把目前進度存進手動格嗎？',[{t:'先存檔',go:1,f:()=>slotPicker('save',go)},{t:'直接重新開始',f:go},{t:'取消'}])}
// ---------- 遊戲說明（分頁）----------
const ADD_SOP=`<div class="sop"><h3>iPhone（Safari）</h3><ol><li>一定要用 <b>Safari</b> 開這個遊戲網址（Line、Chrome、Instagram 內建瀏覽器都不行）。</li><li>點畫面下方中間的「<b>分享</b>」方塊箭頭。</li><li>往下滑，點「<b>加入主畫面</b>」。</li><li>名稱可自己改，按右上「<b>新增</b>」。</li><li>回到主畫面，點新出現的圖示開玩。</li></ol>
<h3>Android（Chrome）</h3><ol><li>用 <b>Chrome</b> 開這個遊戲網址。</li><li>點右上角「<b>⋮</b>」選單。</li><li>點「<b>加到主畫面</b>」或「<b>安裝應用程式</b>」，再按「安裝／新增」。</li><li>回到桌面，點新圖示開玩。</li></ol>
<h3>加入之後</h3><p>全螢幕、不顯示網址列，第一次連線載入後<b>離線也能玩</b>。</p><p>存檔放在這支手機的這個圖示裡，換手機或清除網站資料會不見，重要進度請用「存檔」存到手動格。</p><p>遊戲有新版時，把圖示完全關掉再開兩次就會更新。</p>
<h3>找不到「加入主畫面」？</h3><p>iPhone：多半不是在 Safari 裡，用 Safari 重開網址。Android：換成 Chrome，或在選單裡找「安裝應用程式」。</p></div>`;
const HELP=[
 ['操作',`<p><b>左手</b>：按住畫面左半邊任何地方就是搖桿，往哪拖就往哪走。</p><p><b>右手</b>：四個技能鍵。<b>點一下</b>自動瞄準放出；<b>按住拖曳</b>自己瞄準，拖到右上角「取消」放開就不放。</p><p><b>閃現</b>（結丹期開放）：技能群左下角的紫色小鍵，點一下自動閃到妖少的地方。</p><p><b>御劍</b>（天空篇、第十章夜三、無盡之夜按「飛」）：一直往前飛，搖桿往哪推就往哪轉，推滿飛更快。</p><p><b>視</b>：切換視角（俯視／斜視／追尾；天空篇多一個自動運鏡）。<b>丹</b>：吃回春丹回血。</p>`],
 ['一夜怎麼過',`<p>每一夜 3 分鐘（築基章 3 分半、結丹章 4 分、元嬰章 4 分半），撐到<b>雞啼</b>就天亮過關。</p><p>斬妖數到<b>目標</b>（左上「斬妖 目前／目標」）會提早天亮。</p><p>夜裡會出精英和<b>魔王</b>；看到地上的水墨圈慢慢暈開就快閃，<b>紅</b>扣血、<b>紫</b>雷、<b>藍</b>緩速、<b>綠</b>定身。</p><p>吸青色<b>魂火</b>會「頓悟」三選一，只在這一夜有效。斬妖越多，殺氣越重、飛劍越強。</p>`],
 ['修行與突破',`<p>境界：煉氣一～九層 → 築基 → 結丹 → 元嬰（各分初／中／後期）。每升一層更強。</p><p>條件達成後，可以在洞府<b>靜室</b>安全突破，或在戰場上按「突破」引雷劫（更快、這一夜更強）。</p><p>大境界要煉丹：築基丹、凝丹靈液、化嬰丹。</p><p>打贏每一章任一夜就能去下一章；破過的章再打，要斬滿更多妖才算過。</p>`],
 ['洞府',`<p><b>出戰</b>：選章、選夜。<b>靜室</b>：突破、收閉關靈石。<b>藥園</b>：種靈草。<b>丹房</b>：控火煉丹。<b>造型</b>：捏臉換裝。</p><p><b>藏經閣</b>：三個技能格各有每個境界三種招、還有大絕，到境界送一招，其他用靈石參悟。</p><p><b>坊市</b>：買種子、替身紙人、回春丹。<b>鬥法台</b>（元嬰）：對電腦或雙人同機。<b>存檔</b>：存進三個手動格。</p>`],
 ['加入主畫面',ADD_SOP],
 ['小技巧',`<p>站著不動時飛劍出得更快，但小心被圍。</p><p>被圍住就用閃現或第一格的近身招。魔王出大招前地上會先畫墨圈，先躲再打。</p><p>護體罩（玄鐵盾／金鐘罩／八卦玉璧罩／蓮花護體）快破時會變橘、變紅，記得拉開距離。</p><p>打不贏就回洞府煉丹、參悟新招、閉關存靈石，境界高一層差很多。</p>`]];
function showHelp(i=0){const close=modal(`<div class="hlp"><div class="hlptabs">${HELP.map((h,j)=>`<button data-h="${j}" aria-pressed="${i===j}">${h[0]}</button>`).join('')}</div><div class="hlpbody">${HELP[i][1]}</div>
  <div class="mdbtns">${i>0?'<button class="btn" data-p>上一頁</button>':''}${i<HELP.length-1?'<button class="btn go" data-n>下一頁</button>':''}<button class="btn" data-x>關閉</button></div></div>`,ov=>{
  ov.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{close();showHelp(+b.dataset.h)});const p=ov.querySelector('[data-p]'),n=ov.querySelector('[data-n]');if(p)p.onclick=()=>{close();showHelp(i-1)};if(n)n.onclick=()=>{close();showHelp(i+1)};ov.querySelector('[data-x]').onclick=()=>close()})}
$('#tNew').textContent=autoSave()?'重新開始':'開始遊戲';$('#tNew').onclick=()=>{SFX.resume();newGame()};$('#tLoad').onclick=()=>{SFX.resume();slotPicker('load')};$('#tHelp').onclick=()=>{SFX.resume();showHelp(0)};$('#rotAdd').onclick=()=>showHelp(HELP.findIndex(h=>h[0]==='加入主畫面'));$('#tAdd').onclick=()=>{SFX.resume();showHelp(HELP.findIndex(h=>h[0]==='加入主畫面'))};
// 開機：#home＝直接進洞府，#new＝新的一局（直接播序章開頭），其他＝標題
{let h='';try{h=location.hash.slice(1);if(h)history.replaceState(null,'',location.pathname+location.search)}catch(e){}
  if(h==='home'){DF.render()}else if(h==='new'){$('#startOv').classList.add('on');DF.render();setTimeout(()=>DF.go(0,0),300)}else TITLE.show()}
window.__title={dbg:()=>({cam:camera.position.toArray().map(v=>+v.toFixed(2)),fov:camera.fov,rv:root.visible,bv:body.visible,lan:lantern.position.toArray().map(v=>+v.toFixed(2)),rs:root.scale.x,hero:root.position.toArray(),ry:root.rotation.y,titleOn}),show:()=>TITLE.show(),scene:()=>scene,mapG:()=>mapG,ground:()=>ground,tp:(x,z)=>root.position.set(x,root.position.y,z)};
