/* ================= 洞府（取代標題畫面）=================
   分頁：出戰（選章、選夜）／靜室（突破、閉關收靈石）／藥園（真實時間種靈草）／丹房（控火煉丹）／藏經閣（選大絕）／坊市（買種子、替身紙人）。
   背包 save.inv：stone 靈石、seed/herb 種子與靈草、pill 丹藥、yaodan 妖丹、paper 替身紙人。 */
const HERBS={ning:{n:'凝露草',min:10,price:15},chi:{n:'赤陽花',min:30,price:40},shen:{n:'千年參',min:120,price:120}};
const RECIPES=[
  {k:'hui',n:'回春丹',d:'夜裡左下角「丹」一按回 40% 生命',need:{ning:2}},
  {k:'juqi',n:'聚氣丹',d:'修行條件用（煉氣八、九層）',need:{ning:1,chi:1},st:'pill'},
  {k:'zhuji',n:'築基丹',d:'突破築基必備',need:{shen:1,chi:2,yaodan:1},st:'zhuji'},
  {k:'ningdan',n:'凝丹靈液',d:'突破結丹必備',need:{shen:2,yaodan:3},st:'ningdan'},
  {k:'huaying',n:'化嬰丹',d:'突破元嬰必備',need:{shen:3,yaodan:5},st:'huaying'}];
const ULTS=[{k:'wan',n:'萬劍歸宗',ch:0,d:'金色劍陣，萬劍從天而降'},{k:'fire',n:'三昧真火',ch:1,d:'扇形火海，燒一陣子'},{k:'thunder9',n:'九天神雷',ch:3,d:'超大範圍，紫金天雷連劈'},
  {k:'bagua',n:'八卦封妖陣',ch:5,d:'把妖吸進八卦陣定住再引爆'},{k:'sun',n:'劍氣貫日',ch:7,d:'全畫面的巨大劍氣長虹'},{k:'yuanying',n:'元嬰出竅',ch:9,d:'元嬰化身替你斬妖 10 秒'}];
const CH=[{n:'序章',p:'白石村',rec:0},{n:'第一章',p:'荒村夜',rec:0},{n:'第二章',p:'竹林小徑',rec:3},{n:'第三章',p:'古寺',rec:6},{n:'第四章',p:'鬼市',rec:10},{n:'第五章',p:'黃泉渡口',rec:11},
  {n:'第六章',p:'雲海',rec:12},{n:'第七章',p:'雷澤',rec:13},{n:'第八章',p:'天河',rec:14},{n:'第九章',p:'九霄魔域',rec:15},{n:'第十章',p:'渡劫長征',rec:17}];
const NIGHTS=['夜一・一般','夜二・快攻','夜三・圍城'];
let CH_READY=4;// how many chapters are playable so far (the rest show 製作中)
save.inv=Object.assign({stone:0,seed:{ning:3,chi:1,shen:0},herb:{ning:0,chi:0,shen:0},pill:{hui:1,juqi:0,zhuji:0,ningdan:0,huaying:0},yaodan:0,paper:0},save.inv||{});
save.garden=save.garden||[null,null,null,null];save.won=save.won||{};save.ults=save.ults||['wan'];save.ult=save.ult||'wan';save.lastSeen=save.lastSeen||Date.now();
const chUnlocked=i=>i===0||[0,1,2].some(n=>save.won[`${i-1}-${n}`]);
const DF=(()=>{let tab='go',tick=0;
  const TABS=[['go','出戰'],['med','靜室'],['garden','藥園'],['alch','丹房'],['lib','藏經閣'],['shop','坊市']];
  const el=$('#dfBody');
  function head(){$('#dfRealm').textContent=REALMS[save.realm];$('#dfStone').textContent=`靈石 ${fmt(save.inv.stone)}・妖丹 ${save.inv.yaodan}`}
  function tabs(){$('#dfTabs').innerHTML=TABS.map(([k,n])=>`<button data-tab="${k}" aria-pressed="${k===tab}">${n}${k==='med'&&canBreak(false)?'<i class="dot"></i>':''}${k==='garden'&&save.garden.some(p=>p&&ripe(p))?'<i class="dot"></i>':''}</button>`).join('');
    $$('#dfTabs [data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;SFX.play('soul');render()})}
  const ripe=p=>Date.now()-p.t0>=HERBS[p.h].min*60000;
  const left=p=>{const m=Math.max(0,HERBS[p.h].min*60000-(Date.now()-p.t0))/60000;return m>=60?`${Math.floor(m/60)} 小時 ${Math.ceil(m%60)} 分`:`${Math.ceil(m)} 分`};
  const offline=()=>{const h=Math.min(8,(Date.now()-save.lastSeen)/3600000);return Math.floor(h*(6+4*save.realm))};
  function body(){const inv=save.inv;
    if(tab==='go'){el.innerHTML=CH.map((c,i)=>{const open=chUnlocked(i),ready=i<CH_READY;
        return `<div class="chrow${open&&ready?'':' lock'}"><div class="chn"><b>${c.n}</b><span>${c.p}</span><small>推薦 ${REALMS[c.rec]}</small></div><div class="chnights">${NIGHTS.map((n,j)=>
          `<button class="nb${save.won[`${i}-${j}`]?' won':''}" data-ch="${i}" data-n="${j}" ${open&&ready?'':'disabled'}>${n}${save.won[`${i}-${j}`]?' ✓':''}</button>`).join('')}</div>${!ready?'<em>製作中</em>':!open?'<em>打贏上一章任一夜開放</em>':''}</div>`}).join('');
      $$('#dfBody [data-ch]').forEach(b=>b.onclick=()=>go(+b.dataset.ch,+b.dataset.n))}
    else if(tab==='med'){const off=offline(),can=canBreak(false);
      el.innerHTML=`<div class="dfsec"><h3>${REALMS[save.realm]}${reqs()?` → ${REALMS[save.realm+1]}`:''}</h3><ul class="reqs">${reqHTML(false)}</ul>
        <button class="btn gold" id="medBtn" ${can?'':'hidden'}>靜室打坐・突破境界<small>條件都達成了，安全突破</small></button>
        <p class="tag">${can?'':'條件達成後可以在這裡安全突破，或在戰場上按「突破」引雷劫（更快、這一夜更強）。'}</p></div>
        <div class="dfsec"><h3>閉關</h3><p class="tag">離開遊戲時也在修行，最多累積 8 小時，每小時 ${6+4*save.realm} 靈石。</p>
        <button class="btn" id="collect" ${off>0?'':'disabled'}>收下閉關所得：${off} 靈石</button></div>`;
      $('#medBtn').onclick=meditate;$('#collect').onclick=()=>{inv.stone+=offline();save.lastSeen=Date.now();writeSave();SFX.play('gold');render()}}
    else if(tab==='garden'){el.innerHTML=`<div class="plots">${save.garden.map((p,i)=>{if(!p)return `<div class="plot"><b>空地</b><div class="seeds">${Object.entries(HERBS).map(([k,h])=>
          `<button data-plant="${i}" data-h="${k}" ${inv.seed[k]>0?'':'disabled'}>種${h.n}（${inv.seed[k]}）</button>`).join('')}</div></div>`;
        const h=HERBS[p.h],r=ripe(p),f=Math.min(1,(Date.now()-p.t0)/(h.min*60000));
        return `<div class="plot${r?' ripe':''}"><b>${h.n}</b><div class="wu"><i style="width:${f*100}%"></i></div>${r?`<button data-harvest="${i}" class="go">收成</button>`:`<span class="tag">還要 ${left(p)}</span>`}</div>`}).join('')}</div>
        <p class="tag">背包：${Object.entries(HERBS).map(([k,h])=>`${h.n} ${inv.herb[k]}`).join('、')}。種子去坊市買。</p>`;
      $$('#dfBody [data-plant]').forEach(b=>b.onclick=()=>{const k=b.dataset.h;if(inv.seed[k]<=0)return;inv.seed[k]--;save.garden[+b.dataset.plant]={h:k,t0:Date.now()};writeSave();SFX.play('soul');render()});
      $$('#dfBody [data-harvest]').forEach(b=>b.onclick=()=>{const i=+b.dataset.harvest,p=save.garden[i];inv.herb[p.h]+=2;if(Math.random()<.35)inv.seed[p.h]++;save.garden[i]=null;writeSave();SFX.play('gold');render()})}
    else if(tab==='alch'){const have=k=>k==='yaodan'?inv.yaodan:inv.herb[k],nm=k=>k==='yaodan'?'妖丹':HERBS[k].n;
      el.innerHTML=RECIPES.map(r=>{const ok=Object.entries(r.need).every(([k,v])=>have(k)>=v);
        return `<div class="recipe"><div><b>${r.n}</b>（有 ${inv.pill[r.k]}）<span class="tag">${r.d}</span><small>${Object.entries(r.need).map(([k,v])=>`${nm(k)} ${have(k)}/${v}`).join('、')}</small></div><button class="btn${ok?' go':''}" data-brew="${r.k}" ${ok?'':'disabled'}>煉製</button></div>`}).join('');
      $$('#dfBody [data-brew]').forEach(b=>b.onclick=()=>brew(RECIPES.find(r=>r.k===b.dataset.brew)))}
    else if(tab==='lib'){el.innerHTML=ULTS.map(u=>{const has=save.ults.includes(u.k);
        return `<button class="ultpick${save.ult===u.k?' on':''}" data-ult="${u.k}" ${has?'':'disabled'}><b>${u.n}</b><span>${has?u.d:`打贏${CH[u.ch].n}解鎖`}</span></button>`}).join('');
      $$('#dfBody [data-ult]').forEach(b=>b.onclick=()=>{save.ult=b.dataset.ult;writeSave();SFX.play('ready');render()})}
    else if(tab==='shop'){const items=[...Object.entries(HERBS).map(([k,h])=>({id:'seed-'+k,n:`${h.n}種子`,d:`種下 ${h.min>=60?h.min/60+' 小時':h.min+' 分'}收成兩株`,p:h.price,buy:()=>{inv.seed[k]++}})),
        {id:'paper',n:'替身紙人',d:'夜裡倒下時替你擋一次，原地復活',p:100,buy:()=>{inv.paper++}},{id:'hui',n:'回春丹',d:'夜裡回 40% 生命',p:60,buy:()=>{inv.pill.hui++}}];
      el.innerHTML=items.map(it=>`<div class="recipe"><div><b>${it.n}</b><span class="tag">${it.d}</span></div><button class="btn${inv.stone>=it.p?' go':''}" data-buy="${it.id}" ${inv.stone>=it.p?'':'disabled'}>${it.p} 靈石</button></div>`).join('')+
        `<p class="tag">替身紙人 ${inv.paper}、回春丹 ${inv.pill.hui}。靈石靠斬妖和閉關。</p>`;
      $$('#dfBody [data-buy]').forEach(b=>b.onclick=()=>{const it=items.find(x=>x.id===b.dataset.buy);if(inv.stone<it.p)return;inv.stone-=it.p;it.buy();writeSave();SFX.play('gold');render()})}}
  function render(){head();tabs();body()}
  function go(ch,n){SFX.resume();const start=()=>startNight(NIGHT,{ch,nt:n});
    if(ch===0&&!save.seenIntro){save.seenIntro=1;writeSave();BGM.play('night');INK.play(CUTS.intro,start)}else if(CUTS['ch'+ch]&&!save['seen'+ch]){save['seen'+ch]=1;writeSave();INK.play(CUTS['ch'+ch],start)}else start()}
  function meditate(){if(G||med||!canBreak(false))return;SFX.resume();$('#startOv').classList.remove('on');med={t:0};root.rotation.y=0;SFX.play('ult');banner('靜室打坐','運轉周天，衝擊瓶頸')}
  // 丹房 control-fire game: hold 搧火 to raise the heat, keep the needle inside the gold band for 6 seconds
  function brew(r){const inv=save.inv,have=k=>k==='yaodan'?inv.yaodan:inv.herb[k];if(!Object.entries(r.need).every(([k,v])=>have(k)>=v))return;
    Object.entries(r.need).forEach(([k,v])=>{if(k==='yaodan')inv.yaodan-=v;else inv.herb[k]-=v});writeSave();
    const ov=$('#alcOv');ov.classList.add('on');$('#alcName').textContent=`煉製 ${r.n}`;let heat=30,zone=55,zd=1,t=0,inside=0,hold=false,last=performance.now(),raf=0;
    const btn=$('#alcFan');btn.onpointerdown=e=>{e.preventDefault();hold=true};btn.onpointerup=btn.onpointerleave=btn.onpointercancel=()=>{hold=false};
    function step(now){const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;heat=Math.max(0,Math.min(100,heat+(hold?62:-38)*dt+(Math.random()-.5)*14*dt));
      zone+=zd*9*dt;if(zone>66||zone<40)zd=-zd;const inZ=heat>zone-9&&heat<zone+9;if(inZ)inside+=dt;
      $('#alcZone').style.bottom=(zone-9)+'%';$('#alcNeedle').style.bottom=heat+'%';$('#alcNeedle').classList.toggle('ok',inZ);$('#alcTime').style.width=(100-t/6*100)+'%';
      if(t<6){raf=requestAnimationFrame(step);return}
      const f=inside/6,q=f>=.8?3:f>=.6?2:f>=.35?1:0,cnt=[1,1,2,3][q];inv.pill[r.k]+=cnt;if(r.st)save.st[r.st]=(save.st[r.st]||0)+cnt;writeSave();
      $('#alcName').textContent=`${['下品','中品','上品','極品'][q]}${r.n} ×${cnt}！`;SFX.play(q>=2?'gold':'ready');setTimeout(()=>{ov.classList.remove('on');render()},1400)}
    raf=requestAnimationFrame(step)}
  setInterval(()=>{if(!G&&$('#startOv').classList.contains('on')&&tab==='garden')body()},5000);
  return {render,set tab(v){tab=v}}})();
