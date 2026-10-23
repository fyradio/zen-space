/* ================= 鬥法台：雙人同機（左右各一組搖桿＋兩招）／對電腦 =================
   公平鬥法（兩邊一樣強）：護體靈光 40 → 肉身 100 → 元嬰 30，三局兩勝。
   招式：飛劍（點一下，自動瞄準對手）、瞬移閃身（往搖桿方向衝一段，瞬間無敵）。飛劍對撞會互相抵銷。 */
const DUEL=(()=>{let ov,cv,x,W,H,st=null,raf=0,last=0;
  const mk=(side,col)=>({side,col,x:0,y:0,sh:40,hp:100,sl:30,cdA:0,cdB:0,inv:0,jx:0,jy:0,flash:0,face:side?-1:1});
  function build(){if(ov)return;ov=document.createElement('div');ov.id='duelOv';ov.style.cssText='position:fixed;inset:0;z-index:60;background:#0d0a1c;touch-action:none;user-select:none;-webkit-user-select:none;display:none';
    ov.innerHTML=`<canvas style="position:absolute;inset:0;width:100%;height:100%"></canvas>
      <button class="dbtn" data-b="1a" style="left:27%;bottom:16%">劍</button><button class="dbtn" data-b="1b" style="left:27%;bottom:44%">閃</button>
      <button class="dbtn" data-b="2a" style="right:27%;bottom:16%">劍</button><button class="dbtn" data-b="2b" style="right:27%;bottom:44%">閃</button>
      <button id="duelX" style="position:absolute;left:50%;transform:translateX(-50%);top:6px;padding:6px 12px;border-radius:10px;border:1px solid #fff5;background:#0008;color:#fff;font-size:15px">離開</button>
      <div id="duelMsg" style="position:absolute;left:0;right:0;top:34%;text-align:center;color:#ffe9a0;font:900 30px/1.4 system-ui;text-shadow:0 0 12px #e8a830,0 2px 4px #000;pointer-events:none"></div>
      <div id="duelEnd" style="display:none;position:absolute;inset:0;background:#000a;align-items:center;justify-content:center;flex-direction:column;gap:14px;color:#fff;font:700 24px system-ui"><div id="duelRes"></div><div><button class="btn gold" id="duelAgain">再來一場</button> <button class="btn" id="duelBye">回洞府</button></div></div>
      <style>.dbtn{position:absolute;width:62px;height:62px;border-radius:50%;border:2px solid #ffe9a0;background:#2a1a4acc;color:#ffe9a0;font:900 24px system-ui;box-shadow:0 0 12px #b784ff88}.dbtn:active{background:#6a4ab0}</style>`;
    document.body.appendChild(ov);cv=ov.querySelector('canvas');x=cv.getContext('2d');
    ov.querySelectorAll('.dbtn').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!st)return;const p=st.p[+b.dataset.b[0]-1];b.dataset.b[1]==='a'?fire(p):dash(p)}));
    $('#duelX').onclick=close;$('#duelBye').onclick=close;$('#duelAgain').onclick=()=>open(st.mode);
    const joy={};ov.addEventListener('pointerdown',e=>{if(!st||e.target.tagName==='BUTTON')return;const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
      const side=px<.3?0:px>.7?1:-1;if(side<0||py<.3||(side===1&&st.mode==='ai'))return;joy[e.pointerId]={side,ox:e.clientX,oy:e.clientY}});
    ov.addEventListener('pointermove',e=>{const j=joy[e.pointerId];if(!j||!st)return;let dx=e.clientX-j.ox,dy=e.clientY-j.oy;const d=Math.hypot(dx,dy);if(d>46){dx*=46/d;dy*=46/d}const p=st.p[j.side];p.jx=dx/46;p.jy=dy/46});
    const up=e=>{const j=joy[e.pointerId];if(!j)return;delete joy[e.pointerId];if(st){const p=st.p[j.side];p.jx=p.jy=0}};ov.addEventListener('pointerup',up);ov.addEventListener('pointercancel',up)}
  function open(mode){build();SFX.resume();ov.style.display='block';$('#duelEnd').style.display='none';
    ov.querySelectorAll('[data-b^="2"]').forEach(b=>b.style.display=mode==='ai'?'none':'');
    const r=cv.getBoundingClientRect();cv.width=W=Math.round(r.width);cv.height=H=Math.round(r.height);
    st={mode,p:[mk(0,'#7fe3c6'),mk(1,'#ff6a5a')],bolts:[],fx:[],w:[0,0],round:1,state:'go',t:0,ai:{cd:.8,dc:0,sx:1,sy:0,st:0}};reset();BGM.play('boss');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
  function close(){cancelAnimationFrame(raf);st=null;if(ov)ov.style.display='none';BGM.play('home');DF.render&&DF.render()}
  function reset(){const [a,b]=st.p;a.x=W*.2;b.x=W*.8;a.y=b.y=H*.55;for(const p of st.p){p.sh=40;p.hp=100;p.sl=30;p.cdA=p.cdB=.5;p.inv=1;p.jx=p.jy=0}st.bolts.length=0;st.state='go';st.t=0;msg(`第 ${st.round} 局`,1.2)}
  let msgT=0;function msg(t,s){$('#duelMsg').textContent=t;msgT=s}
  function fire(p){if(p.cdA>0||st.state!=='go')return;const o=st.p[1-p.side],dx=o.x-p.x,dy=o.y-p.y,d=Math.hypot(dx,dy)||1;p.cdA=.55;st.bolts.push({x:p.x,y:p.y,vx:dx/d*400,vy:dy/d*400,own:p.side,t:0});SFX.play('sweep')}
  function dash(p){if(p.cdB>0||st.state!=='go')return;let dx=p.jx,dy=p.jy;if(Math.hypot(dx,dy)<.2){const o=st.p[1-p.side];dx=p.x-o.x;dy=p.y-o.y}const d=Math.hypot(dx,dy)||1;p.cdB=2.2;p.inv=.3;p.x+=dx/d*120;p.y+=dy/d*120;st.fx.push({x:p.x,y:p.y,r:10,t:0,c:p.col});SFX.play('soul')}
  function hurt(p,d){if(p.inv>0)return;p.inv=.15;p.flash=.15;SFX.play('hurt');let s=Math.min(p.sh,d);p.sh-=s;d-=s;if(d>0){const h=Math.min(p.hp,d);p.hp-=h;d-=h}if(d>0)p.sl=Math.max(0,p.sl-d);}
  function ai(dt){const a=st.ai,p=st.p[1],o=st.p[0];a.cd-=dt;a.dc-=dt;a.st-=dt;if(a.st<=0){a.st=.6+Math.random()*.8;a.sx=Math.random()<.5?1:-1}
    const dx=o.x-p.x,dy=o.y-p.y,d=Math.hypot(dx,dy)||1,want=W*.3;let mx=0,my=0;if(d>want+30){mx=dx/d;my=dy/d}else if(d<want-30){mx=-dx/d;my=-dy/d}
    mx+= -dy/d*a.sx*.8;my+=dx/d*a.sx*.8;const m=Math.hypot(mx,my)||1;p.jx=mx/m*.8;p.jy=my/m*.8;
    if(a.cd<=0){a.cd=.9+Math.random()*.5;fire(p)}
    for(const b of st.bolts)if(b.own===0&&Math.hypot(b.x-p.x,b.y-p.y)<110&&a.dc<=0&&p.cdB<=0&&Math.random()<.04){a.dc=.8;p.jx=-b.vy/400;p.jy=b.vx/400;dash(p)}}
  function step(dt){const [a,b]=st.p;for(const p of st.p){p.cdA-=dt;p.cdB-=dt;p.inv-=dt;p.flash-=dt}
    if(st.state==='go'){if(st.mode==='ai')ai(dt);
      for(const p of st.p){p.x=Math.max(20,Math.min(W-20,p.x+p.jx*150*dt));p.y=Math.max(40,Math.min(H-20,p.y+p.jy*150*dt))}
      for(let i=st.bolts.length-1;i>=0;i--){const bo=st.bolts[i];bo.x+=bo.vx*dt;bo.y+=bo.vy*dt;bo.t+=dt;const o=st.p[1-bo.own];let dead=bo.x<-20||bo.x>W+20||bo.y<-20||bo.y>H+20||bo.t>3;
        if(!dead&&Math.hypot(bo.x-o.x,bo.y-o.y)<22){hurt(o,8);st.fx.push({x:bo.x,y:bo.y,r:6,t:0,c:'#ffe9a0'});dead=true}
        if(!dead)for(let j=i-1;j>=0;j--){const c=st.bolts[j];if(c.own!==bo.own&&Math.hypot(c.x-bo.x,c.y-bo.y)<12){st.fx.push({x:bo.x,y:bo.y,r:8,t:0,c:'#fff'});st.bolts.splice(j,1);i--;dead=true;break}}
        if(dead)st.bolts.splice(i,1)}
      const dead=st.p.findIndex(p=>p.sl<=0);if(dead>=0){const win=1-dead;st.w[win]++;st.state='end';st.t=0;msg(`${st.mode==='ai'?(win?'電腦':'你'):(win?'右方':'左方')}贏下這一局`,1.8);SFX.play('bossDie')}}
    else if(st.state==='end'&&(st.t+=dt)>2){if(st.w[0]>=2||st.w[1]>=2)finish();else{st.round++;reset()}}
    if(msgT>0&&(msgT-=dt)<=0)$('#duelMsg').textContent='';st.fx.forEach(f=>f.t+=dt);st.fx=st.fx.filter(f=>f.t<.4)}
  function finish(){st.state='over';const w=st.w[0]>=2?0:1,ai=st.mode==='ai';let t=ai?(w?'電腦勝，再接再厲':'你贏了！'):(w?'右方勝！':'左方勝！');
    if(ai&&!w){save.st.duel++;writeSave();t+=`（累計鬥法台勝場 ${save.st.duel}）`;SFX.play('win')}$('#duelRes').textContent=t;$('#duelEnd').style.display='flex'}
  function draw(){x.fillStyle='#0d0a1c';x.fillRect(0,0,W,H);const g=x.createRadialGradient(W/2,H/2,10,W/2,H/2,W*.6);g.addColorStop(0,'#2a1e4a');g.addColorStop(1,'#0d0a1c');x.fillStyle=g;x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(183,132,255,.45)';x.lineWidth=3;x.strokeRect(12,36,W-24,H-48);x.beginPath();x.arc(W/2,H*.55,H*.22,0,7);x.stroke();x.beginPath();x.moveTo(W/2,36);x.lineTo(W/2,H-12);x.setLineDash([6,8]);x.stroke();x.setLineDash([]);
    for(const f of st.fx){x.strokeStyle=f.c;x.globalAlpha=1-f.t/.4;x.lineWidth=3;x.beginPath();x.arc(f.x,f.y,f.r+f.t*90,0,7);x.stroke();x.globalAlpha=1}
    for(const b of st.bolts){x.fillStyle=b.own?'#ffb0a0':'#b0ffe8';x.shadowColor=x.fillStyle;x.shadowBlur=10;x.beginPath();x.arc(b.x,b.y,6,0,7);x.fill();x.shadowBlur=0}
    for(const p of st.p){x.globalAlpha=p.inv>0&&p.flash<=0?.55:1;x.fillStyle=p.flash>0?'#fff':p.col;x.shadowColor=p.col;x.shadowBlur=16;x.beginPath();x.arc(p.x,p.y,17,0,7);x.fill();x.shadowBlur=0;x.fillStyle='#0d0a1c';x.beginPath();x.arc(p.x+(p.side?-5:5),p.y-3,3,0,7);x.fill();x.globalAlpha=1;
      if(p.sh>0){x.strokeStyle='rgba(127,224,255,'+(.3+p.sh/60)+')';x.lineWidth=3;x.beginPath();x.arc(p.x,p.y,23,0,7);x.stroke()}}
    for(const p of st.p){const bx=p.side?W-12-170:12,by=8;x.font='12px system-ui';x.fillStyle='#fff';x.fillText((st.mode==='ai'?(p.side?'電腦':'你'):(p.side?'右':'左'))+'　'+'●'.repeat(st.w[p.side])+'○'.repeat(2-st.w[p.side]),bx,by+10);
      [[p.sh/40,'#7fe0ff',0],[p.hp/100,'#ff6a5a',1],[p.sl/30,'#ffd65a',2]].forEach(([v,c,i])=>{x.fillStyle='#fff2';x.fillRect(bx,by+16+i*7,170,5);x.fillStyle=c;x.fillRect(bx,by+16+i*7,170*Math.max(0,v),5)})}}
  function loop(now){raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;if(!st)return;step(dt);draw()}
  return{open,close}})();
