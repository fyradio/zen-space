/* ================= 大絕擴充：每章一個＋兩個參悟＋化神「百丈法相」=================
   萬竹穿心（第二章）、百鬼夜行（第四章）、九霄御劍（第六章）、星河倒懸（第八章）、天劫引（第十章）；
   參悟：燈陣（3000 靈石）、光陰凝（5000）；化神後：百丈法相。對魔王一樣有上限（一般 22%、法相 40%）。 */
function ultStart(name){G.ultBoss=0;G.slow=.4;shake=Math.max(shake,.5);SFX.play('ult');buzz(60);const u=$('#ultFx');u.classList.remove('on');void u.offsetWidth;u.classList.add('on');banner(name,'大絕',true)}
function ultBoss(d,cap=.22){if(!boss.alive)return;const room=boss.max*cap-G.ultBoss;if(room<=0)return;const v=Math.min(d,room);G.ultBoss+=v;boss.allow+=v;hurtBoss(v,true)}
function ultAoe(x,z,R,dmg,o={},cap){for(const e of enemies){if(e.dead)continue;const dx=e.x-x,dz=e.z-z,d=Math.hypot(dx,dz);if(d>R+e.r)continue;if(o.stun)e.stun=Math.max(e.stun||0,o.stun);if(o.slow)e.slowT=Math.max(e.slowT||0,o.slow);if(o.burn){e.burn=o.burn;e.burnD=dmg*.1}hurtEnemy(e,dmg,dx/(d||1)*(o.kb||0),dz/(d||1)*(o.kb||0),true,o.fly??5)}
  if(boss.alive&&Math.hypot(boss.x-x,boss.z-z)<R+boss.r)ultBoss(dmg*(o.bm||2),cap)}
// 萬竹穿心：地面竄出一大片竹刺，一圈一圈往外
const bambooSpikeGeo=new THREE.CylinderGeometry(.03,.12,1.8,5).translate(0,.9,0);
function bambooUlt(A){const [x,z]=A.pt,R=SK.ult.r(),dmg=swordDmg()*22;ultStart('萬竹穿心');const M=toon(0x5cc46e,{emissive:0x1f5a2a}),ms=[],rings=5;
  for(let k=1;k<=rings;k++){const rr=R*k/rings,n=Math.round(rr*6);for(let i=0;i<n;i++){const a=i/n*6.28+k,m=new THREE.Mesh(bambooSpikeGeo,M);m.position.set(x+Math.sin(a)*rr*(.85+Math.random()*.3),0,z+Math.cos(a)*rr*(.85+Math.random()*.3));m.rotation.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5);m.scale.setScalar(.01);m.userData.k=k;scene.add(m);ms.push(m)}
    act(k*.13,null,()=>{SFX.play('sweep');shake=Math.max(shake,.2);const r0=R*(k-1)/rings,r1=R*k/rings;for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-x,e.z-z);if(d>=r0-.3&&d<r1+e.r){e.stun=Math.max(e.stun||0,1.2);hurtEnemy(e,dmg,0,0,true,7)}}if(boss.alive){const d=Math.hypot(boss.x-x,boss.z-z);if(d>=r0-boss.r&&d<r1+boss.r)ultBoss(dmg*3)}})}
  act(2.4,t=>{ms.forEach(m=>{const tt=t-m.userData.k*.13;m.scale.setScalar(tt<0?.01:tt<.12?Math.max(.01,tt/.12*1.3):t>2?Math.max(.01,1.3*(2.4-t)/.4):1.3)})},()=>{ms.forEach(m=>scene.remove(m));M.dispose()})}
// 百鬼夜行：一列友善的鬼燈籠遊行，沿路燒妖
function paradeUlt(A){const a0=Math.atan2(A.dir[0],A.dir[1]),L=16,sx=HERO.pos.x,sz=HERO.pos.z,dx=Math.sin(a0),dz=Math.cos(a0),dmg=swordDmg()*3.2,T=3,N=12;ultStart('百鬼夜行');
  const ps=[];for(let i=0;i<N;i++){const lan=spr(0xff9a3a,1.1),gh=spr(0xd8f0e8,.9);ps.push([lan,gh])}let tk=0;
  act(T+.5,(t,dt)=>{ps.forEach(([lan,gh],i)=>{const d=Math.max(0,(t-i*.12)/T)*L,side=(i%2?1:-1)*.9,x=sx+dx*d+dz*side,z=sz+dz*d-dx*side;lan.position.set(x,1.6+Math.sin(t*6+i)*.15,z);gh.position.set(x-dz*side*.4,.9+Math.sin(t*5+i)*.2,z+dx*side*.4);
      const op=Math.min(1,(T+.5-t)/.5);lan.material.opacity=op;gh.material.opacity=op*.7;if(!simming&&Math.random()<.15)fx({p:tmp.set(x,.4,z),col:0xff7a2a,add:true,life:.8,s0:.8,s1:.2,op:.7,vy:.6})});
      tk-=dt;if(tk>0)return;tk=.25;for(let i=0;i<N;i+=2){const d=Math.max(0,(t-i*.12)/T)*L,x=sx+dx*d,z=sz+dz*d;ultAoe(x,z,2.2,dmg,{burn:3},.22)}},
    ()=>ps.forEach(([a,b])=>{unspr(a);unspr(b)}))}
// 九霄御劍：化身飛劍在全場來回穿梭（本體無敵）
function swordFormUlt(){const T=4,dmg=swordDmg()*7;ultStart('九霄御劍');G.medit=T;body.visible=false;
  const sw=new THREE.Group(),M=new THREE.MeshBasicMaterial({color:0xbff8ff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});const bl=new THREE.Mesh(new THREE.ConeGeometry(.22,3,4).rotateX(Math.PI/2),M);sw.add(bl);const gl=spr(0x8fffe0,3);sw.add(gl);scene.add(sw);
  if(!soulTrail)soulTrail=new Trail(30,.55,0xffc040);const tr=new Trail(30,.8,0x8fffe0);let x=HERO.pos.x,z=HERO.pos.z,tx=x,tz=z,hit=new Set();
  const nextT=()=>{const e=enemies.filter(e=>!e.dead&&onScreen(e.x,.4,e.z));const tg=boss.alive&&Math.random()<.3?boss:e[Math.floor(Math.random()*e.length)];if(tg){const a=Math.atan2(tg.x-x,tg.z-z);tx=tg.x+Math.sin(a)*4;tz=tg.z+Math.cos(a)*4}else{const a=Math.random()*6.28;tx=HERO.pos.x+Math.sin(a)*7;tz=HERO.pos.z+Math.cos(a)*7}hit=new Set()};nextT();
  act(T,(t,dt)=>{const dx=tx-x,dz=tz-z,d=Math.hypot(dx,dz)||1,v=Math.min(d,26*dt);x+=dx/d*v;z+=dz/d*v;sw.position.set(x,1,z);sw.rotation.y=Math.atan2(dx,dz);tr.push(tmp.set(x,1,z));tr.build(.9);if(d<.5)nextT();
      for(const e of enemies){if(e.dead||hit.has(e))continue;if((e.x-x)**2+(e.z-z)**2<(1.6+e.r)**2){hit.add(e);hurtEnemy(e,dmg,dx/d,dz/d,true,6)}}if(boss.alive&&!hit.has(boss)&&Math.hypot(boss.x-x,boss.z-z)<1.6+boss.r){hit.add(boss);ultBoss(dmg*3)}},
    ()=>{scene.remove(sw);M.dispose();gl.material.dispose();tr.build(0);scene.remove(tr.mesh);body.visible=true;G.medit=0;fx({p:tmp.set(HERO.pos.x,1,HERO.pos.z),col:0x8fffe0,add:true,life:.4,s0:1,s1:4,op:.9,vy:0})})}
// 星河倒懸：天河的水從天倒灌，大範圍沖刷＋緩速
function galaxyUlt(A){const [x,z]=A.pt,R=SK.ult.r(),dmg=swordDmg()*4.2,T=2.2;ultStart('星河倒懸');let tk=0;
  const sheet=new THREE.Mesh(new THREE.CircleGeometry(R,48).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x4a8aff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));sheet.position.set(x,.06,z);scene.add(sheet);
  act(T+.6,(t,dt)=>{sheet.material.opacity=.35*Math.min(1,t/.3,(T+.6-t)/.5);if(!simming&&t<T)for(let i=0;i<4;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*R;const px=x+Math.sin(a)*r,pz=z+Math.cos(a)*r;fx({p:tmp.set(px,6+Math.random()*3,pz),col:Math.random()<.3?0xffffff:0x6ab4ff,add:true,life:.5,s0:.5,s1:.2,op:1,vy:-14})}
      tk-=dt;if(tk>0||t>T)return;tk=.3;ultAoe(x,z,R,dmg,{slow:3,kb:.4},.22)},
    ()=>{scene.remove(sheet);sheet.geometry.dispose();sheet.material.dispose();ringFx(x,z,R,0x8ac8ff,.6);ultAoe(x,z,R,dmg*2.5,{kb:1.5,slow:3},.22);shake=Math.max(shake,.5)})}
// 天劫引：引九重雷劫劈全場
function jieUlt(){const dmg=swordDmg()*3.4;ultStart('天劫引');for(let r=0;r<9;r++)act(r*.3,null,()=>{const e=enemies.filter(e=>!e.dead&&onScreen(e.x,.4,e.z)).sort(()=>Math.random()-.5).slice(0,8);SFX.play('thunder');shake=Math.max(shake,.35);
    for(const t of e){boltAt(t.x,t.z,0,0,0xd8c8ff,.12,16);ultAoe(t.x,t.z,1.6,dmg,{stun:.6},.22)}if(boss.alive&&bossOnScreen()){boltAt(boss.x,boss.z,0,0,0xffffff,.2,18);ultBoss(dmg*2.2)}
    if(r===8){const x=HERO.pos.x,z=HERO.pos.z;boltAt(x+3,z+3,0,0,0xffffff,.5,22);fx({p:tmp.set(x,.5,z),col:0xe0d0ff,add:true,life:.6,s0:1,s1:20,op:1,vy:0});ultAoe(x,z,11,dmg*2,{stun:1.5},.22)}})}
// 七星燈陣（參悟）：七團金黃火球（七盞明燈）從天而降懸在空中排成北斗七星，燈與燈拉出金色火線，地上水墨符文圈；陣內冒火星、妖著火、你回血；結束七燈齊爆
const DIPPER=(()=>{const P=[[0,0],[0,-.5],[.62,-.62],[.72,-.1],[1.25,.05],[1.72,.18],[2.2,-.08]],cx=P.reduce((a,p)=>a+p[0],0)/7,cz=P.reduce((a,p)=>a+p[1],0)/7;return P.map(([x,z])=>[(x-cx)/1.15,(z-cz)/1.15])})();
const LANT={geo:new THREE.SphereGeometry(.3,16,12),body:new THREE.MeshBasicMaterial({color:LC(0xffc850)})};// 火球的白熱核心
const fireLineM=new THREE.MeshBasicMaterial({color:0xffb040,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
function lampArrayUlt(A){const [x,z]=A.pt,R=SK.ult.r(),dmg=swordDmg()*2.6,T=6;ultStart('七星燈陣');
  const rot=Math.random()*6.28,ls=DIPPER.map(([px,pz],i)=>{const a=Math.atan2(px,pz)+rot,d=Math.hypot(px,pz)*R,g=new THREE.Group();const b=new THREE.Mesh(LANT.geo,LANT.body.clone());b.material.transparent=true;g.add(b);
      const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:LC(0xe08a20),transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.set(1.5,1.7,1);g.add(gl);
      const g2=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:LC(0xc04a08),transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false}));g2.scale.set(3.2,3.2,1);g.add(g2);g.userData.g2=g2;
      g.scale.setScalar(1.2);const tx=x+Math.sin(a)*d,tz=z+Math.cos(a)*d;g.position.set(tx,14,tz);scene.add(g);return {g,b,gl,tx,tz,land:.25+i*.09,boom:false}});
  // 地上：水墨符文圈＋金色火線（北斗）
  const rune=new THREE.Mesh(new THREE.CircleGeometry(R*1.2,48).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:(LANT.rt=LANT.rt||(typeof runeTex==='function'?runeTex('#c89040'):null)),color:0xb8803a,transparent:true,opacity:0,depthWrite:false}));rune.position.set(x,.04,z);scene.add(rune);
  if(!simming)BRUSH.circle(x,z,R*1.2,0xffb35a,null,.5);
  const lines=[];[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]].forEach(([i,j])=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(0,0,.5),fireLineM.clone());m.material.opacity=0;scene.add(m);lines.push({m,i,j})});
  let tk=0,spark=0;
  act(T+.5,(t,dt)=>{rune.rotation.y+=dt*.25;rune.material.opacity=.55*Math.min(1,t/.6)*Math.min(1,(T-t)/.4+1e-3);
      ls.forEach((l,i)=>{const k=Math.min(1,t/l.land),y=t<l.land?14-(14-1.8)*k*k:1.8+Math.sin(t*3+i)*.12;l.g.position.set(l.tx,y,l.tz);const fl=1+.12*Math.sin(t*17+i*2)+.06*Math.sin(t*31+i);l.gl.scale.set(1.5*fl,1.75*fl,1);l.g.userData.g2.material.opacity=.4+.12*Math.sin(t*9+i);if(!simming&&Math.random()<dt*8)fx({p:tmp.set(l.tx+(Math.random()-.5)*.3,y+.3,l.tz+(Math.random()-.5)*.3),col:0xffa040,add:true,life:.45,s0:.35,s1:.08,op:.9,vy:1.4});
        if(t>=l.land&&!l.hit){l.hit=1;if(!simming){fx({p:tmp.set(l.tx,.3,l.tz),col:0xffa040,add:true,life:.4,s0:.6,s1:2.4,op:.7,vy:0});shake=Math.max(shake,.15)}}
        if(t>T&&!l.boom){l.boom=true;l.g.visible=false;if(!simming)fx({p:tmp.set(l.tx,1.2,l.tz),col:0xff8a2a,add:true,life:.5,s0:1,s1:4.5,op:.9,vy:0});ultAoe(l.tx,l.tz,2.4,dmg*3,{burn:2,kb:1.2},.04)}});
      const lit=Math.min(1,Math.max(0,(t-1)/.5));lines.forEach(L=>{const a=ls[L.i],b=ls[L.j],dx=b.tx-a.tx,dz=b.tz-a.tz,len=Math.hypot(dx,dz);L.m.position.set(a.tx,.08,a.tz);L.m.rotation.y=Math.atan2(dx,dz);L.m.scale.set(.18+.06*Math.sin(t*12),1,len*lit);L.m.material.opacity=t>T?0:.85});
      if(t>T){if(t>T+.05)shake=Math.max(shake,.4);return}
      if(Math.hypot(HERO.pos.x-x,HERO.pos.z-z)<R*1.2)G.hp=Math.min(G.maxhp,G.hp+G.maxhp*.03*dt);
      if(!simming&&(spark-=dt)<=0){spark=.05;const a=Math.random()*6.28,r=Math.sqrt(Math.random())*R*1.1;fx({p:tmp.set(x+Math.sin(a)*r,.2,z+Math.cos(a)*r),col:Math.random()<.5?0xffb040:0xff6a2a,add:true,life:.6,s0:.25,s1:.05,op:.9,vy:1.6})}
      tk-=dt;if(tk>0)return;tk=.35;ultAoe(x,z,R*1.2,dmg,{burn:2},.22)},
    ()=>{ls.forEach(l=>{scene.remove(l.g);l.b.material.dispose();l.gl.material.dispose();l.g.userData.g2.material.dispose()});scene.remove(rune);rune.geometry.dispose();rune.material.dispose();lines.forEach(L=>{scene.remove(L.m);L.m.geometry.dispose();L.m.material.dispose()})})}
// 光陰凝（參悟）：全場妖定住 3 秒（魔王也定住 2 秒），畫面褪色
function timeStopUlt(){ultStart('光陰凝');const T=3;for(const e of enemies)if(!e.dead)e.stun=Math.max(e.stun||0,T);if(boss.alive)boss.stun=Math.max(boss.stun||0,2);for(const b of ebs)b.t=99;
  const cv=renderer.domElement;cv.style.transition='filter .3s';cv.style.filter='grayscale(.85) sepia(.25)';fx({p:tmp.set(HERO.pos.x,1,HERO.pos.z),col:0xffffff,add:true,life:.6,s0:1,s1:24,op:.8,vy:0});
  act(T,null,()=>{cv.style.filter=''})}
// 百丈法相（化神）：身後升起十倍高的金色法相，一巴掌按下全場
function fashenUlt(){ultStart('百丈法相');const g=new THREE.Group(),fig=soulFig(0xd89420,.0),M=fig.userData.M;fig.scale.setScalar(.1);g.add(fig);g.position.set(HERO.pos.x,0,HERO.pos.z-4);g.rotation.y=0;scene.add(g);
  const palm=new THREE.Mesh(new THREE.CircleGeometry(1,40).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xffd86a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(palm);const L=new FxLight(0xffd86a,0,40,1.2);L.position.y=12;g.add(L);
  let slam=false;G.iframe=Math.max(G.iframe,3);
  act(3,(t)=>{const k=Math.min(1,t/.9);fig.scale.setScalar(.1+9.4*k*k*(3-2*k)/1);M.opacity=.55*Math.min(1,t/.4,(3-t)/.5);L.intensity=3*M.opacity;g.position.set(HERO.pos.x,0,HERO.pos.z-4);
      palm.position.set(HERO.pos.x,.08,HERO.pos.z);const pk=t<1.3?0:Math.min(1,(t-1.3)/.25);palm.scale.setScalar(.5+pk*18);palm.material.opacity=pk<1?pk*.6:Math.max(0,.6-(t-1.55)*.5);
      if(!slam&&t>=1.55){slam=true;SFX.play('bossDie');SFX.play('boom');shake=1.2;buzz(150);fx({p:tmp.set(HERO.pos.x,.5,HERO.pos.z),col:0xffe08a,add:true,life:.9,s0:2,s1:40,op:1,vy:0});
        for(const e of enemies)if(!e.dead&&onScreen(e.x,.4,e.z))hurtEnemy(e,e.hp+1,0,0,true,9);if(boss.alive&&bossOnScreen())ultBoss(boss.max*.4,.4)}},
    ()=>{scene.remove(g,palm);M.dispose();palm.geometry.dispose();palm.material.dispose()})}
Object.assign(ULT_DEF,{
  bamboo:{n:'萬竹穿心',ic:'竹',col:0x5cc46e,shape:'circle',ult:1,r:()=>5.5,range:()=>8,cast:bambooUlt},
  parade:{n:'百鬼夜行',ic:'鬼',col:0xff9a3a,shape:'line',ult:1,w:4,range:()=>16,cast:paradeUlt},
  swordform:{n:'九霄御劍',ic:'霄',col:0x8fffe0,shape:'self',ult:1,range:()=>8,cast:swordFormUlt},
  galaxy:{n:'星河倒懸',ic:'河',col:0x6ab4ff,shape:'circle',ult:1,r:()=>6.5,range:()=>8,cast:galaxyUlt},
  jieyin:{n:'天劫引',ic:'劫',col:0xd8c8ff,shape:'self',ult:1,range:()=>8,cast:jieUlt},
  lamps:{n:'七星燈陣',ic:'燈',col:0xffb35a,shape:'circle',ult:1,r:()=>5,range:()=>7,cast:lampArrayUlt},
  timestop:{n:'光陰凝',ic:'凝',col:0xf0ece0,shape:'self',ult:1,range:()=>8,cast:timeStopUlt},
  fashen:{n:'百丈法相',ic:'相',col:0xffd86a,shape:'self',ult:1,range:()=>8,cast:fashenUlt}});
