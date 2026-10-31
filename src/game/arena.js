/* ================= 鬥法台（3D）=================
   對電腦：五個鬥法魔王隨機一位，用一般關卡的操作打（G.ch===12，見 CHC[12]）。
   雙人同機：左半邊玩家一（目前的主角）、右半邊玩家二（另一位主角，同樣有完整動作和捏臉）。
     各一支搖桿＋「劍招」「閃身」，飛劍自動打對手；三層命：護體 → 肉身 → 元嬰（肉身破了變小元嬰，
     12 秒內被斬掉就輸，撐過就重聚肉身回 30 血）。一局決勝，照各自境界（同一支手機＝同一個存檔，一樣強）。
   玩家二的角色：把 hero_core.js 再引入一次（在函式裡，有自己的一份骨架、捏臉、動畫），模型搬進主場景。 */
let HERO2=null;
function makeHero2(){if(HERO2)return HERO2;
  HERO2=(function(){
/*@include hero_core.js*/
    return {root,body,HERO,lantern,shadow,sky,scene,useChar,applyFace,applyBody,buildHair,setMode:m=>{mode=m},walk:v=>{walkPh+=v},animate:dt=>{clock+=dt;animateHero(dt)}}})();
  const inner=HERO2.scene,main=root.parent;for(const o of [...inner.children]){if(o===HERO2.sky||o.isDirectionalLight||o.isHemisphereLight)continue;main.add(o)}
  return HERO2}
const DUEL=(()=>{let st=null,ov=null;const BOSSKEYS=['yinshi','xuanbing','jinjia','shenhan','xuehe'];
  function open(m){SFX.resume();$('#startOv').classList.remove('on');if(m==='ai'){startNight(150,{ch:12,nt:0});return}start2p()}
  // ---------- 雙人同機 ----------
  function ui(){if(ov)return ov;ov=document.createElement('div');ov.id='duel2';ov.innerHTML=`
    <div class="d2bar l"><b id="d2n0"></b><i class="sh"><u id="d2s0"></u></i><i class="hp"><u id="d2h0"></u></i><i class="so"><u id="d2o0"></u></i></div>
    <div class="d2bar r"><b id="d2n1"></b><i class="sh"><u id="d2s1"></u></i><i class="hp"><u id="d2h1"></u></i><i class="so"><u id="d2o1"></u></i></div>
    <div class="d2zone l" data-p="0"><span class="d2joy"><i></i></span></div><div class="d2zone r" data-p="1"><span class="d2joy"><i></i></span></div>
    <button class="d2b a l" data-p="0" data-k="a">劍招</button><button class="d2b b l" data-p="0" data-k="b">閃身</button>
    <button class="d2b a r" data-p="1" data-k="a">劍招</button><button class="d2b b r" data-p="1" data-k="b">閃身</button>
    <button id="d2x">離開</button><div id="d2msg"></div>
    <div id="d2end"><div id="d2res"></div><div class="row"><button class="btn gold" id="d2again">再來一局</button><button class="btn" id="d2bye">回洞府</button></div></div>`;
    document.body.appendChild(ov);
    const st2=document.createElement('style');st2.textContent=`#duel2{position:fixed;inset:0;z-index:40;display:none;pointer-events:none;font-family:var(--f-ui)}
      .d2bar{position:absolute;top:calc(env(safe-area-inset-top,0px) + 8px);width:min(36vw,260px);display:grid;gap:3px}.d2bar.l{left:calc(env(safe-area-inset-left,0px) + 12px)}.d2bar.r{right:calc(env(safe-area-inset-right,0px) + 12px);text-align:right}
      .d2bar b{font-weight:400;font-size:13px;color:#fff;text-shadow:0 1px 3px #000}.d2bar i{display:block;height:6px;border-radius:9px;background:#fff2;overflow:hidden}.d2bar i u{display:block;height:100%;width:100%}
      .d2bar .sh u{background:#7fe0ff}.d2bar .hp u{background:#ff6a5a}.d2bar .so u{background:#ffd65a}.d2bar.r i u{margin-left:auto}
      .d2zone{position:absolute;bottom:0;top:30%;width:44%;pointer-events:auto;touch-action:none}.d2zone.l{left:0}.d2zone.r{right:0}
      .d2joy{position:absolute;width:110px;height:110px;margin:-55px 0 0 -55px;border-radius:50%;border:2px solid #fff4;background:#0003;display:none}.d2joy i{position:absolute;left:35px;top:35px;width:40px;height:40px;border-radius:50%;background:#fff6}
      .d2b{all:unset;position:absolute;pointer-events:auto;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;font-size:15px;color:#fff;border:2px solid;background:#0a141399;touch-action:none}
      .d2b.a{bottom:calc(env(safe-area-inset-bottom,0px) + 18px)}.d2b.b{bottom:calc(env(safe-area-inset-bottom,0px) + 88px);width:50px;height:50px}
      .d2b.l.a{left:calc(44% - 74px)}.d2b.l.b{left:calc(44% - 62px)}.d2b.r.a{right:calc(44% - 74px)}.d2b.r.b{right:calc(44% - 62px)}
      .d2b.l{border-color:#7fe3c6}.d2b.r{border-color:#ff8a7a}.d2b.b{border-color:#b46cff}.d2b[disabled]{opacity:.35}
      #d2x{all:unset;position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);pointer-events:auto;padding:5px 14px;border-radius:9px;border:1px solid #fff5;background:#0008;color:#fff;font-size:13px}
      #d2msg{position:absolute;left:0;right:0;top:32%;text-align:center;color:#ffe9a0;font:400 30px/1.4 var(--f-title);text-shadow:0 0 12px #e8a830,0 2px 4px #000}
      #d2end{position:absolute;inset:0;display:none;place-items:center;align-content:center;gap:14px;background:#000a;pointer-events:auto;color:#fff;font-size:22px}#d2end .row{display:flex;gap:12px}#d2end .btn{width:auto;padding:0 18px}`;document.head.appendChild(st2);
    // 搖桿：在自己那半邊按下的位置當中心
    ov.querySelectorAll('.d2zone').forEach(z=>{const p=+z.dataset.p,j=z.querySelector('.d2joy'),k=j.querySelector('i');let id=null,ox=0,oy=0;
      z.addEventListener('pointerdown',e=>{if(!st||id!==null)return;id=e.pointerId;try{z.setPointerCapture(id)}catch(_){}const r=z.getBoundingClientRect();ox=e.clientX;oy=e.clientY;j.style.left=(ox-r.left)+'px';j.style.top=(oy-r.top)+'px';j.style.display='block'});
      z.addEventListener('pointermove',e=>{if(e.pointerId!==id||!st)return;let dx=e.clientX-ox,dy=e.clientY-oy;const d=Math.hypot(dx,dy);if(d>45){dx*=45/d;dy*=45/d}k.style.transform=`translate(${dx}px,${dy}px)`;st.p[p].jx=dx/45;st.p[p].jy=dy/45});
      const up=e=>{if(e.pointerId!==id)return;id=null;j.style.display='none';k.style.transform='';if(st){st.p[p].jx=st.p[p].jy=0}};z.addEventListener('pointerup',up);z.addEventListener('pointercancel',up)});
    ov.querySelectorAll('.d2b').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!st||st.over)return;const P=st.p[+b.dataset.p];b.dataset.k==='a'?slash(P):blink2(P)}));
    $('#d2x').onclick=close2;$('#d2bye').onclick=close2;$('#d2again').onclick=()=>{close2(true);start2p()};
    addEventListener('keydown',e=>{if(!st)return;const k=e.key.toLowerCase();if(k==='f')slash(st.p[0]);if(k==='g')blink2(st.p[0]);if(k==='.')slash(st.p[1]);if(k==='/')blink2(st.p[1])});
    return ov}
  function mkP(i,api,col,name){return {i,api,col,name,x:i?4:-4,z:0,rot:i?-Math.PI/2:Math.PI/2,jx:0,jy:0,sh:30,hp:100,soul:0,soulT:0,cdA:1,cdB:0,swT:.5+i*.3,inv:0,cast:0}}
  function start2p(){const H2=makeHero2();ui();leaveSky();buildMap(9);resetWorld();G=null;med=null;bannerT=0;$('#banner').classList.remove('on');sayT=0;$('#bubble').classList.remove('on');$('#pillBtn').hidden=true;$('#bossBox').classList.remove('on');$('#endOv').classList.remove('on');boss.alive=false;boss.g.visible=false;clearHZ();
    const other=1-who;H2.useChar(other);H2.applyFace({g:1,x:1});H2.applyBody();H2.buildHair();H2.root.visible=H2.lantern.visible=H2.shadow.visible=true;
    st={p:[mkP(0,null,0x7fe3c6,CHARS[who].n),mkP(1,H2,0xff8a7a,CHARS[other].n)],shots:[],over:false,t:0};
    $('#d2n0').textContent='左・'+st.p[0].name;$('#d2n1').textContent=st.p[1].name+'・右';
    ov.style.display='block';$('#d2end').style.display='none';$('#hud').hidden=$('#skills').hidden=$('#joy').hidden=true;BGM.play('boss');msg('鬥法開始！',1.6);D2.on=true}
  function close2(again){D2.on=false;st=null;if(ov)ov.style.display='none';if(HERO2){HERO2.root.visible=HERO2.lantern.visible=HERO2.shadow.visible=false}root.scale.setScalar(1);body.visible=true;
    if(again===true)return;BGM.play('home');$('#startOv').classList.add('on');buildMap(0);DF.render()}
  let msgT=0;function msg(t,s){$('#d2msg').textContent=t;msgT=s}
  const foe=P=>st.p[1-P.i];
  function hurtP(P,d){if(st.over||P.inv>0)return;P.inv=.18;SFX.play('hurt');buzz(20);
    if(P.soul){P.soul-=d;if(P.soul<=0){P.soul=0;win(foe(P))}return}
    const s=Math.min(P.sh,d);P.sh-=s;d-=s;if(d<=0)return;P.hp-=d;
    if(P.hp<=0){P.hp=0;P.soul=25;P.soulT=12;msg(`${P.name}肉身被毀，元嬰出竅！`,2);SFX.play('boss');shake=.6}}
  function slash(P){if(P.cdA>0||P.soul||st.over)return;P.cdA=3.5;P.cast=.45;const Q=foe(P),a=Math.atan2(Q.x-P.x,Q.z-P.z),L=10,W=1.6;P.rot=a;SFX.play('beam');
    const m=new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({map:wBeamTex,color:P.col,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(P.x,.9,P.z);m.rotation.y=a;m.scale.set(W,1,L);scene.add(m);
    let t=0;st.fx=st.fx||[];st.fx.push({t:0,life:.4,f:k=>{m.material.opacity=1-k;m.scale.x=W*(1+k*.5)},end:()=>{scene.remove(m);m.material.dispose()}});
    if(inLine(Q.x,Q.z,P.x,P.z,a,L,W,.4))hurtP(Q,16)}
  function blink2(P){if(P.cdB>0||st.over)return;P.cdB=3;let dx=P.jx,dz=P.jy;if(Math.hypot(dx,dz)<.2){const Q=foe(P);dx=P.x-Q.x;dz=P.z-Q.z}const d=Math.hypot(dx,dz)||1,sx=P.x,sz=P.z;P.x+=dx/d*4;P.z+=dz/d*4;P.inv=.25;SFX.play('soul');
    const r=Math.hypot(P.x,P.z);if(r>ARENA-1.5){P.x*=(ARENA-1.5)/r;P.z*=(ARENA-1.5)/r}for(let i=0;i<6;i++){const k=i/5;fx({p:tmp.set(sx+(P.x-sx)*k,.8,sz+(P.z-sz)*k),col:0xb46cff,add:true,life:.4,s0:1,s1:.2,op:.9,vy:.3})}}
  function win(P){st.over=true;msg('',0);SFX.play('win');$('#d2res').textContent=`${P.i?'右方':'左方'}・${P.name} 勝！`;setTimeout(()=>{if(st)$('#d2end').style.display='grid'},1400)}
  function step(dt){if(!st)return;st.t+=dt;if(msgT>0&&(msgT-=dt)<=0)$('#d2msg').textContent='';
    for(const P of st.p){P.cdA-=dt;P.cdB-=dt;P.inv-=dt;P.cast-=dt;
      if(!st.over){const sp=(P.soul?4.4:3.4),mv=Math.hypot(P.jx,P.jy)>.15;if(mv){P.x+=P.jx*sp*dt;P.z+=P.jy*sp*dt;P.rot=angLerp(P.rot,Math.atan2(P.jx,P.jy),1-Math.exp(-dt*12))}
        const r=Math.hypot(P.x,P.z);if(r>ARENA-1.5){P.x*=(ARENA-1.5)/r;P.z*=(ARENA-1.5)/r}for(const h of HOUSES){const dx=P.x-h.x,dz=P.z-h.z,d=Math.hypot(dx,dz),rr=h.r+.3;if(d<rr&&d>1e-4){P.x=h.x+dx/d*rr;P.z=h.z+dz/d*rr}}
        if(P.soul){P.soulT-=dt;if(P.soulT<=0){P.soul=0;P.hp=30;msg(`${P.name}重聚肉身！`,1.6)}}
        P.swT-=dt;if(P.swT<=0&&!P.soul){P.swT=.7;const Q=foe(P),a=Math.atan2(Q.x-P.x,Q.z-P.z);st.shots.push({x:P.x,z:P.z,vx:Math.sin(a),vz:Math.cos(a),o:P,t:0,s:spr(P.col,.6)})}
        const m=mv?'walk':P.cast>0?'cast':'idle';
        if(P.i===0){mode=m;if(mv)walkPh+=dt*7;root.position.set(P.x,0,P.z);root.rotation.y=P.rot;root.scale.setScalar(P.soul?.55:1)}
        else{P.api.setMode(m);if(mv)P.api.walk(dt*7);P.api.root.position.set(P.x,0,P.z);P.api.root.rotation.y=P.rot;P.api.root.scale.setScalar(P.soul?.55:1)}
        if(P.soul&&!simming&&Math.random()<.3)fx({p:tmp.set(P.x,.8,P.z),col:0xffd86a,add:true,life:.5,s0:.8,s1:.2,op:.8,vy:.4})}}
    for(let i=st.shots.length-1;i>=0;i--){const s=st.shots[i],Q=foe(s.o);s.t+=dt;const ax=Q.x-s.x,az=Q.z-s.z,l=Math.hypot(ax,az)||1;s.vx+=(ax/l-s.vx)*Math.min(1,dt*2.2);s.vz+=(az/l-s.vz)*Math.min(1,dt*2.2);const n=Math.hypot(s.vx,s.vz)||1;s.vx/=n;s.vz/=n;
      s.x+=s.vx*12*dt;s.z+=s.vz*12*dt;s.s.position.set(s.x,1,s.z);let dead=s.t>2.2;
      if(l<.6&&!st.over){hurtP(Q,4);dead=true;fx({p:tmp.set(s.x,1,s.z),col:s.o.col,add:true,life:.25,s0:.8,s1:1.6,op:.9,vy:0})}
      for(let j=i-1;j>=0&&!dead;j--){const o=st.shots[j];if(o.o!==s.o&&(o.x-s.x)**2+(o.z-s.z)**2<.3){dead=true;o.t=99;fx({p:tmp.set(s.x,1,s.z),col:0xffffff,add:true,life:.25,s0:.6,s1:1.4,op:.9,vy:0})}}
      if(dead){unspr(s.s);st.shots.splice(i,1)}}
    if(st.fx)for(let i=st.fx.length-1;i>=0;i--){const f=st.fx[i];f.t+=dt;f.f(Math.min(1,f.t/f.life));if(f.t>=f.life){f.end();st.fx.splice(i,1)}}
    for(const P of st.p){const k=P.i;$('#d2s'+k).style.width=(P.sh/30*100)+'%';$('#d2h'+k).style.width=(P.hp)+'%';$('#d2o'+k).style.width=(P.soul/25*100)+'%'}
    ov.querySelectorAll('.d2b').forEach(b=>{const P=st.p[+b.dataset.p];b.disabled=(b.dataset.k==='a'?P.cdA>0||P.soul:P.cdB>0)})}
  // 鏡頭：兩人中點、拉遠到兩個都框得進來
  function cam(dt){if(!st)return;const [a,b]=st.p,mx=(a.x+b.x)/2,mz=(a.z+b.z)/2,sep=Math.hypot(a.x-b.x,a.z-b.z),D=Math.min(14,Math.max(6.5,sep*.8+4.5)),P=.74,k=1-Math.exp(-dt*4);
    camT.lerp(tmp.set(mx,.6,mz),k);camD=lerp(camD,D,k);camera.position.set(camT.x,camT.y+Math.sin(P)*camD,camT.z+Math.cos(P)*camD);camera.lookAt(camT);camera.updateMatrixWorld();sky.position.copy(camera.position)}
  if(HERO2===null){}
  return {open,step,cam,get on(){return D2.on}}})();
const D2={on:false};
