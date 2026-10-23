/* ================= 第 4～5 章：鬼市、黃泉渡口；八卦封妖陣；結丹技能組 ================= */
// ---------- 地圖 ----------
Object.assign(MAPS,{
  4:()=>{pave.visible=false;// 鬼市: two rows of stalls with red lanterns along a street
    const wood=toon(0x2a1c14),cloth=[toon(0x7a1c18),toon(0x1c3a5a),toon(0x5a4a1c),toon(0x3a1c5a)],lan=new THREE.MeshBasicMaterial({color:0xff5a2a}),road=toon(0x1c1a18,{roughness:1});
    const st=new THREE.Mesh(new THREE.BoxGeometry(7,.04,60),road);st.position.y=.02;mapG.add(st);
    for(let side=-1;side<=1;side+=2)for(let i=0;i<9;i++){const z=-24+i*6+rnd()*1.5,x=side*(6.5+rnd()*1.2),g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=side>0?-Math.PI/2:Math.PI/2;mapG.add(g);
      [-1,1].forEach(a=>part(new THREE.CylinderGeometry(.06,.06,2.1,6),wood,g,{p:[a*1.2,1.05,0]}));part(new THREE.BoxGeometry(2.8,.1,1.6),cloth[i%4],g,{p:[0,2.1,0],r:[.25,0,0]});part(new THREE.BoxGeometry(2.4,.8,.8),wood,g,{p:[0,.4,-.2]});
      const l=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),lan);l.position.set(1.0,1.8,.6);l.scale.y=1.25;g.add(l);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xff7a3a,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(2,2,1);s.position.copy(l.position);g.add(s);
      HOUSES.push({x,z,r:1.3})}
    for(let i=0;i<6;i++){const a=rnd()*Math.PI*2,r=19+rnd()*8;bareTree(Math.sin(a)*r,Math.cos(a)*r,1+rnd()*.5)}},
  5:()=>{pave.visible=false;// 黃泉渡口: a black river with a ferry, red spider lilies on the bank
    const water=new THREE.Mesh(new THREE.PlaneGeometry(70,9),new THREE.MeshBasicMaterial({color:0x0a1626,transparent:true,opacity:.92}));water.rotation.x=-Math.PI/2;water.position.set(0,.03,-9);mapG.add(water);
    const rip=new THREE.Mesh(new THREE.PlaneGeometry(70,9),new THREE.MeshBasicMaterial({map:glowTex,color:0x2a4a7a,transparent:true,opacity:.25,blending:THREE.AdditiveBlending,depthWrite:false}));rip.rotation.x=-Math.PI/2;rip.position.set(0,.05,-9);mapG.add(rip);
    const wood=toon(0x2a1c14),red=toon(0xc8221c,{emissive:0x5a0806});
    const boat=new THREE.Group();boat.position.set(7,0,-9);boat.rotation.y=.3;mapG.add(boat);part(new THREE.BoxGeometry(5,.5,1.6),wood,boat,{p:[0,.25,0]});part(new THREE.BoxGeometry(1.4,1.2,1.2),wood,boat,{p:[-.8,1,0]});part(new THREE.ConeGeometry(1.1,.6,4),toon(0x15181c),boat,{p:[-.8,1.9,0],r:[0,Math.PI/4,0]});HOUSES.push({x:7,z:-9,r:1.8});
    for(let i=0;i<5;i++){const x=-18+i*8+rnd()*3;part(new THREE.CylinderGeometry(.07,.09,3,6),wood,mapG,{p:[x,1.5,-4.6]});const l=new THREE.Mesh(new THREE.SphereGeometry(.25,10,8),new THREE.MeshBasicMaterial({color:0x6affc8}));l.position.set(x,3,-4.6);mapG.add(l);
      const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0x6affc8,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(2.4,2.4,1);s.position.copy(l.position);mapG.add(s);HOUSES.push({x,z:-4.6,r:.3})}
    for(let c=0;c<40;c++){const x=(rnd()-.5)*44,z=-3+rnd()*20;if(Math.hypot(x,z)<4)continue;const g=new THREE.Group();g.position.set(x,0,z);mapG.add(g);for(let k=0;k<5;k++){const a=k/5*6.28;part(new THREE.ConeGeometry(.04,.5,4),red,g,{p:[Math.sin(a)*.12,.3,Math.cos(a)*.12],r:[Math.cos(a)*.9,0,-Math.sin(a)*.9]})}}
    for(let i=0;i<7;i++){const a=rnd()*Math.PI*2,r=17+rnd()*9;if(Math.cos(a)<-.3)continue;bareTree(Math.sin(a)*r,Math.cos(a)*r,1+rnd()*.5)}}});
// ---------- 新妖 ----------
const umbGeo=(()=>{const R='#b8322a',Y='#d9ad48',K='#141210',W='#f2ece0';
  return merged([{g:cone(.55,.04,.38,10),c:R,p:[0,.95,0]},{g:cone(.55,.5,.04,10),c:Y,p:[0,.77,0]},{g:C0,c:'#5a3a22',p:[0,.45,0],s:[.025,.65,.025]},{g:S0,c:W,p:[-.12,.82,.2],s:[.08,.1,.04]},{g:S0,c:W,p:[.12,.82,.2],s:[.08,.1,.04]},{g:S0,c:K,p:[-.12,.82,.235],s:[.04,.05,.02]},{g:S0,c:K,p:[.12,.82,.235],s:[.04,.05,.02]},
    {g:B0,c:'#c22',p:[0,.7,.24],s:[.18,.12,.01]},{g:cone(.05,.01,.4,5),c:'#c22',p:[0,.5,.22],r:[.2,0,0]},{g:C0,c:'#5a3a22',p:[0,.07,.03],s:[.04,.14,.04]}])})();
const yakshaGeo=(()=>{const G='#2a3a4a',F='#5a7a6a',R='#e22',K='#101010';
  return merged([{g:B0,c:G,p:[0,.75,0],s:[.5,.7,.3]},{g:S0,c:F,p:[0,1.25,0],s:[.18,.2,.17]},{g:cone(.05,.01,.2,5),c:'#e8e2d0',p:[-.1,1.45,0]},{g:cone(.05,.01,.2,5),c:'#e8e2d0',p:[.1,1.45,0]},{g:S0,c:R,p:[-.06,1.27,.15],s:[.03,.02,.01]},{g:S0,c:R,p:[.06,1.27,.15],s:[.03,.02,.01]},
    {g:C0,c:G,p:[-.34,.8,.1],s:[.06,.5,.06],r:[.8,0,.2]},{g:C0,c:G,p:[.34,.8,.1],s:[.06,.5,.06],r:[.8,0,-.2]},{g:cone(.04,.005,.25,4),c:'#cfd8d0',p:[-.36,.55,.4],r:[1.4,0,0]},{g:cone(.04,.005,.25,4),c:'#cfd8d0',p:[.36,.55,.4],r:[1.4,0,0]},
    {g:C0,c:K,p:[-.12,.2,0],s:[.07,.4,.07]},{g:C0,c:K,p:[.12,.2,0],s:[.07,.4,.07]}])})();
const drownGeo=(()=>{const B='#4a6a6a',H='#0a0e10',R='#e22';
  return merged([{g:lathe([[0,0],[.25,.05],[.2,.6],[.12,.9],[0,.95]],10),c:B},{g:S0,c:'#8aa09a',p:[0,1,0],s:[.12,.13,.12]},{g:lathe([[0,1.18],[.16,1.1],[.2,.8],[.22,.4]],10,Math.PI*.6,Math.PI*1.8),c:H},{g:S0,c:R,p:[-.04,1.02,.1],s:[.02,.015,.01]},{g:S0,c:R,p:[.04,1.02,.1],s:[.02,.015,.01]},
    {g:cone(.04,.025,.4,5),c:'#8aa09a',p:[-.2,.75,.2],r:[1.2,0,.2]},{g:cone(.04,.025,.4,5),c:'#8aa09a',p:[.2,.75,.2],r:[1.2,0,-.2]}])})();
const soulLampGeo=(()=>{return merged([{g:S0,c:'#6affc8',p:[0,.7,0],s:[.2,.26,.2]},{g:C0,c:'#2a2a2a',p:[0,.98,0],s:[.1,.04,.1]},{g:C0,c:'#2a2a2a',p:[0,.43,0],s:[.1,.04,.1]},{g:S0,c:'#fff',p:[-.07,.74,.16],s:[.04,.05,.02]},{g:S0,c:'#fff',p:[.07,.74,.16],s:[.04,.05,.02]},{g:S0,c:'#0a2a1a',p:[-.07,.74,.18],s:[.02,.03,.01]},{g:S0,c:'#0a2a1a',p:[.07,.74,.18],s:[.02,.03,.01]}])})();
// 雨傘妖: hops and spins toward you
addMob('umb',{n:'雨傘妖',geo:umbGeo,cap:90,hp:30,spd:2.1,r:.34,dmg:8,soul:1,sc:1,glow:.3,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d,ux,uz)=>{const h=Math.abs(Math.sin(e.ph*3.4));e.y=h*.5;e.spin=(e.spin||0)+dt*9;return {v:e.t.spd*(h>.2?1.8:.2)*(e.special||e.elite?1.25:1),x:ux,z:uz}}});
// 夜叉: invisible (only its shadow shows) until it is close, then a fast lunge
addMob('yaksha',{n:'夜叉',geo:yakshaGeo,cap:60,hp:42,spd:1.9,r:.34,dmg:11,soul:2,sc:.95,glow:.3,mat:{},
  ai:(e,dt,d,ux,uz)=>{e.hide=d>3.8&&!(e.flash>0);return {v:e.t.spd*(d<3.8?1.9:1.1),x:ux,z:uz}}});
// 水鬼: rises from the water right beside you and grabs your feet (定身)
addMob('drown',{n:'水鬼',geo:drownGeo,cap:70,hp:34,spd:1.5,r:.3,dmg:7,soul:1,sc:1,glow:.3,mat:{},popNear:1,
  ai:(e,dt,d)=>{if(d<1.5&&(e.cd2=(e.cd2??.5)-dt)<=0){e.cd2=4;G.rootT=Math.max(G.rootT||0,1);say('水鬼抓住腳了！',1.5)}}});
// 引魂燈: drifts to you, then blinks and bursts (red circle first)
addMob('lamp',{n:'引魂燈',geo:soulLampGeo,cap:60,hp:20,spd:2.2,r:.3,dmg:9,soul:1,sc:1.1,glow:.7,float:1,mat:{},
  ai:(e,dt,d,ux,uz)=>{if(e.fuse>0){e.fuse-=dt;e.flash=.04;if(e.fuse<=0){e.dead=true;fx({p:tmp.set(e.x,.6,e.z),col:0x6affc8,add:true,life:.4,s0:1,s1:3,op:1,vy:0})}return {v:0,x:ux,z:uz}}
    if(d<2.4){e.fuse=.8;warn(e.x,e.z,1.9,.8,e.dmg*1.6,null,0x6affc8)}}});
// ---------- 魔王 ----------
Object.assign(BOSSES,{
  hungry:{name:'餓鬼王',line:'餓鬼王：「餓……好餓……把你們都吃了！」',rage:'餓鬼王：「還要！還要！」',tip:'餓鬼王會吞掉身邊的小妖回血，先清小妖！黑霧會讓你變慢。',r:1.3,dmg:18,spd:1.3,bob:0,
    build(g){const P=toon(0x4a5a3a,{emissive:0x10180a}),K=toon(0x120c0a),T=new THREE.MeshBasicMaterial({color:0xe8e2d0}),B=new THREE.MeshBasicMaterial({color:0xe22});const body=new THREE.Group();body.scale.setScalar(1.7);g.add(body);
      part(new THREE.SphereGeometry(.7,16,12),P,body,{p:[0,.8,0],s:[1.1,1,1]});part(new THREE.SphereGeometry(.3,14,10),P,body,{p:[0,1.65,.2]});part(new THREE.BoxGeometry(.3,.12,.08),K,body,{p:[0,1.55,.46]});
      [-1,1].forEach(d=>{part(new THREE.SphereGeometry(.04,6,5),B,body,{p:[d*.1,1.72,.45]});part(new THREE.ConeGeometry(.12,.35,5),T,body,{p:[d*.5,1.2,.1],r:[1.4,0,d*.4]});part(C0,P,body,{p:[d*.3,.1,0],s:[.1,.4,.1]});
        for(let i=-1;i<=1;i++)part(new THREE.ConeGeometry(.02,.1,4),T,body,{p:[i*.08,1.5,.5],r:[Math.PI,0,0]})});
      return {body,spin:b=>{body.scale.setScalar(1.7*(1+Math.sin(b.t*2)*.03+(b.ate>0?.12:0)))}}},
    act(b,dt){b.ate=Math.max(0,(b.ate||0)-dt);b.cd-=dt;
      if(b.cd<=0){b.cd=b.rage?2.4:3.4;const pts=b.rage?4:2;for(let i=0;i<pts;i++){const a=Math.random()*6.28,r=i?2+Math.random()*3:0;warn(HERO.pos.x+Math.sin(a)*r,HERO.pos.z+Math.cos(a)*r,2.2,1.2,8,()=>{G.slowT=2.2;say('黑霧纏身，變慢了！',1.5)},0x5a2a7a)}}
      b.eat=(b.eat??4)-dt;if(b.eat<=0){b.eat=b.rage?3.5:5;let n=0;for(const e of enemies){if(e.dead||e.elite||(e.x-b.x)**2+(e.z-b.z)**2>64)continue;e.dead=true;n++;if(n>=(b.rage?10:6))break;
          if(!simming)fx({p:tmp.set(e.x,.8,e.z),col:0xe22,add:true,life:.4,s0:.8,s1:.2,op:.8,vy:0})}
        if(n){b.hp=Math.min(b.max,b.hp+b.max*.012*n);b.ate=.5;banner('餓鬼王吞食小妖','回血中，先清小妖！','');shake=.3}}
      b.sum-=dt;if(b.sum<=0){b.sum=b.rage?4:6;for(let i=0;i<8;i++){const a=i/8*6.28;spawn(i%2?'ghost':'umb',b.x+Math.sin(a)*2,b.z+Math.cos(a)*2)}}}},
  ferry:{name:'黃泉擺渡人',line:'黃泉擺渡人：「船票呢？沒有的，都得上船。」',rage:'黃泉擺渡人：「開船了——！」',tip:'船槳會先畫出紅色長條，橫著跑出去！水面的綠燈會爆炸。',r:1.1,dmg:20,spd:1.4,bob:.8,
    build(g){const R=toon(0x181a22,{emissive:0x080a10}),H=toon(0x6a5a3a),W=toon(0x8a8a82,{emissive:0x181818}),body=new THREE.Group();body.scale.setScalar(1.9);g.add(body);
      part(lathe([[0,0],[.5,0],[.4,.8],[.25,1.5],[0,1.6]],12),R,body,{p:[0,0,0]});part(new THREE.SphereGeometry(.2,12,10),W,body,{p:[0,1.65,0]});part(new THREE.ConeGeometry(.5,.35,12),H,body,{p:[0,1.95,0]});
      const oar=new THREE.Group();oar.position.set(.45,1.1,.2);body.add(oar);part(new THREE.CylinderGeometry(.03,.03,2.6,6),H,oar,{p:[0,0,.9],r:[Math.PI/2,0,0]});part(new THREE.BoxGeometry(.5,.04,.8),H,oar,{p:[0,0,2.1]});
      const L=new THREE.PointLight(0x6affc8,1.4,9,1.4);L.position.set(-.5,1.3,.4);body.add(L);const lm=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),new THREE.MeshBasicMaterial({color:0x6affc8}));lm.position.copy(L.position);body.add(lm);
      return {body,oar,spin:b=>{oar.rotation.y=b.swing>0?Math.sin((1-b.swing/.5)*Math.PI)*1.7-.85:Math.sin(b.t*1.2)*.15}}},
    act(b,dt){b.swing=Math.max(0,(b.swing||0)-dt);b.cd-=dt;const a0=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z);
      if(b.cd<=0){b.k=(b.k||0)+1;const m=b.k%4;
        if(m===1){b.cd=b.rage?2:2.8;warnLine(b.x,b.z,a0,11,1.5,1,20);warnLine(b.x,b.z,a0+Math.PI/2,11,1.5,1,20);if(b.rage){warnLine(b.x,b.z,a0+Math.PI,11,1.5,1,20);warnLine(b.x,b.z,a0-Math.PI/2,11,1.5,1,20)}act(.8,null,()=>{b.swing=.5})}
        else if(m===2){b.cd=2.6;for(let i=0;i<(b.rage?5:3);i++){const a=i/5*6.28+Math.random();spawn('lamp',HERO.pos.x+Math.sin(a)*5,HERO.pos.z+Math.cos(a)*5)}banner('魂燈陣','',false)}
        else if(m===3){b.cd=3;banner('擺渡人拉你上船','往反方向跑！','');b.pull=1.4;warn(b.x,b.z,2.2,1.4,18)}
        else{b.cd=2.4;warnFan(b.x,b.z,a0,2.4,5,1,18)}}
      if(b.pull>0){b.pull-=dt;const dx=b.x-HERO.pos.x,dz=b.z-HERO.pos.z,d=Math.hypot(dx,dz)||1;if(d>2){root.position.x+=dx/d*3.2*dt;root.position.z+=dz/d*3.2*dt}}}}});
CHC[4]={map:4,fog:0x2a1a1e,ground:0x6a5a5a,mobs:[['umb',2.4,0],['ghost',1.4,0],['yaksha',1.8,1],['paper',1.2,2],['lgh',1.2,3.5]],elite:'yaksha',boss:'hungry'};
CHC[5]={map:5,fog:0x10202c,ground:0x5a6a78,mobs:[['drown',2.2,0],['lamp',1.8,.5],['ghost',1.6,0],['jiang',1.1,2.5],['umb',1,3]],elite:'drown',boss:'ferry'};

// ---------- 八卦封妖陣 ----------
function baguaCast(A){const [x,z]=A.pt,r=SK.ult.r(),dmg=swordDmg()*9;G.ultBoss=0;G.slow=.5;shake=Math.max(shake,.5);SFX.play('ult');buzz(60);const u=$('#ultFx');u.classList.remove('on');void u.offsetWidth;u.classList.add('on');banner('八卦封妖陣','大絕',true);
  thForm.visible=true;thForm.material.color.setHex(0xffe08a);thForm.position.set(x,.08,z);thForm.scale.setScalar(r);let boom=false;
  act(2.3,(t,dt)=>{thForm.rotation.y+=dt*1.2;thForm.material.opacity=Math.min(1,t/.2)*(t>1.9?Math.max(0,1-(t-1.9)/.4):1);
      if(t<1.4){for(const e of enemies){if(e.dead)continue;const dx=x-e.x,dz=z-e.z,d=Math.hypot(dx,dz);if(d<r+2.5&&d>.3){const v=Math.min(d,(5+3*(1-d/(r+2.5)))*dt);e.x+=dx/d*v;e.z+=dz/d*v;e.stun=Math.max(e.stun||0,.4)}}
        if(Math.random()<.5&&!simming)fx({p:tmp.set(x+(Math.random()-.5)*r*2,.4,z+(Math.random()-.5)*r*2),col:Math.random()<.5?0xffe08a:0x101014,life:.5,s0:.8,s1:.2,op:.8,vy:1.4})}
      else if(!boom){boom=true;SFX.play('bossDie');shake=Math.max(shake,1);buzz(80);fx({p:tmp.set(x,.5,z),col:0xfff0c0,add:true,life:.6,s0:2,s1:r*3,op:1,vy:0});
        for(let i=0;i<6;i++)boltAt(x+(Math.random()-.5)*r,z+(Math.random()-.5)*r,0,0,0xffe08a,.1,12);ultHit(x,z,r,dmg*1.4)}},
    ()=>{thForm.visible=false;thForm.material.color.setHex(0xffffff)})}
ULT_DEF.bagua={n:'八卦封妖陣',ic:'卦',col:0xffe08a,shape:'circle',ult:1,r:()=>5,range:()=>8,cast:baguaCast};
// ---------- 結丹技能組 ----------
// 金蓮劍陣: a lotus of golden sword-light opens around you, twice
const LOTUS_LV=['範圍 +30%、傷害 +30%','開兩次蓮：第二次更大','蓮心：花開時回復一成生命'];
function lotusCast(){const lv=G.k.sweepLv,R=SK.sweep.range(),dmg=swordDmg()*5.2*G.k.sweepD,n=lv>=2?2:1;SFX.play('sweep');SFX.play('gold');shake=Math.max(shake,.3);buzz(25);
  const hx=HERO.pos.x,hz=HERO.pos.z;
  for(let w=0;w<n;w++){const rr=R*(1+w*.35),t0=w*.45;let hit=false;const petals=[];
    for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(.35,1,4),new THREE.MeshBasicMaterial({color:0xffd86a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.order='YXZ';scene.add(m);petals.push(m)}
    act(.7+t0,t=>{const tt=t-t0;if(tt<0)return;const k=Math.min(1,tt/.35);petals.forEach((m,i)=>{const a=i/8*6.28+w*.4;m.position.set(HERO.pos.x+Math.sin(a)*rr*.6*k,.6,HERO.pos.z+Math.cos(a)*rr*.6*k);m.rotation.set(Math.PI/2,a,0);m.scale.set(1,rr*.9*k,1);m.material.opacity=.7*(1-Math.max(0,tt-.35)/.35)});
        if(!hit&&tt>=.2){hit=true;if(lv>=3&&w===0){G.hp=Math.min(G.maxhp,G.hp+G.maxhp*.1)}fx({p:tmp.set(HERO.pos.x,.4,HERO.pos.z),col:0xffe08a,add:true,life:.5,s0:1,s1:rr*2.4,op:.9,vy:0});
          for(const e of enemies){if(e.dead)continue;const dx=e.x-HERO.pos.x,dz=e.z-HERO.pos.z,d=Math.hypot(dx,dz);if(d<rr+e.r)hurtEnemy(e,dmg,dx/(d||1)*1.4,dz/(d||1)*1.4,false,6)}
          if(boss.alive&&Math.hypot(boss.x-HERO.pos.x,boss.z-HERO.pos.z)<rr+boss.r)hurtBoss(dmg)}},
      ()=>petals.forEach(m=>{scene.remove(m);m.material.dispose()}))}
  return true}
// 玄冰長河: a wide river of ice down a line, freezing what it crosses
const RIVER_LV=['河面變寬','兩道冰河','三道，冰封 1.5 秒','五道冰河'];
const RIVER_N=[1,1,2,3,5],RIVER_W=[2,2.6,2.6,2.6,2.6],RIVER_SP=[0,0,.6,1.1,2.2];
function riverCast(A){const lv=G.k.beamLv,L=SK.beam.range(),a0=Math.atan2(A.dir[0],A.dir[1]),dmg=swordDmg()*4*G.k.beamD*[1,1,.9,.8,.7][lv],hx=HERO.pos.x,hz=HERO.pos.z,n=RIVER_N[lv],W=RIVER_W[lv];
  SFX.play('beam');SFX.play('bell');shake=Math.max(shake,.25);
  for(let j=0;j<n;j++){const a=n>1?a0-RIVER_SP[lv]/2+RIVER_SP[lv]*j/(n-1):a0,dx=Math.sin(a),dz=Math.cos(a),hit=new Set();
    const m=new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({color:0x9fe8ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(hx,.1,hz);m.rotation.y=a;scene.add(m);
    act(.8,t=>{const k=Math.min(1,t/.18);m.scale.set(W*(.6+.4*k),1,L*k);m.material.opacity=.6*(t>.4?Math.max(0,1-(t-.4)/.4):1);
        const front=L*k;for(const e of enemies){if(e.dead||hit.has(e))continue;const px=e.x-hx,pz=e.z-hz,al=px*dx+pz*dz,pe=Math.abs(px*dz-pz*dx);if(al>0&&al<front&&pe<W/2+e.r){hit.add(e);e.slowT=3;if(lv>=2)e.stun=Math.max(e.stun||0,1.5);hurtEnemy(e,dmg,dx*.5,dz*.5,false,4)}}
        if(boss.alive&&!hit.has(boss)){const px=boss.x-hx,pz=boss.z-hz,al=px*dx+pz*dz,pe=Math.abs(px*dz-pz*dx);if(al>0&&al<front&&pe<W/2+boss.r){hit.add(boss);hurtBoss(dmg)}}},
      ()=>{scene.remove(m);m.material.dispose()})}}
// 紫霄雷網: bolts rain on the nearest monsters and lightning links them into a net
const NET_LV=['落雷更多','雷網：被劈到的妖之間連電','雷網麻痺 1.5 秒','雷暴：落雷再翻倍'];
function netCast(){const lv=G.k.thLv,n=8+G.k.thN+(lv>=3?8:0),dmg=swordDmg()*2.6*G.k.thD,hx=HERO.pos.x,hz=HERO.pos.z,R=SK.thunder.range(),used=new Set(),hits=[];
  for(let i=0;i<n;i++){const tg=(i===0&&boss.alive&&bossOnScreen())?boss:pickNear(hx,hz,R,used);if(!tg)break;used.add(tg);hits.push(tg)}
  if(!hits.length)return false;SFX.play('thunder');shake=Math.max(shake,.3);
  hits.forEach((tg,i)=>act(i*.05+.1,null,()=>{boltAt(tg.x,tg.z,dmg,1.2,0xb889ff,.07);if(tg!==boss&&lv>=2)tg.stun=Math.max(tg.stun||0,lv>=3?1.5:.6)}));
  if(lv>=1)act(hits.length*.05+.3,null,()=>{for(let i=0;i<hits.length;i++)for(let j=i+1;j<Math.min(hits.length,i+3);j++){const a=hits[i],b=hits[j];if(a.dead||b.dead)continue;zap(a.x,a.z,b.x,b.z);
      for(const e of enemies){if(e.dead)continue;const px=e.x-a.x,pz=e.z-a.z,dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,(px*dx+pz*dz)/(dx*dx+dz*dz+1e-6)));if((px-dx*t)**2+(pz-dz*t)**2<.5)hurtEnemy(e,dmg*.5,0,0,false,3)}}});
  return true}
SKILL_SETS.push({name:'結丹',sweep:{n:'金蓮劍陣',ic:'蓮',col:0xffd86a,shape:'self',range:()=>4.4*G.k.sweepR,cd:()=>7*G.k.sweepCd,lv:LOTUS_LV,cast:lotusCast},
  beam:{n:'玄冰長河',ic:'冰',col:0x9fe8ff,shape:'line',w:2.2,range:()=>11,cd:()=>5.5*G.k.beamCd,spread:()=>RIVER_SP[G.k.beamLv]>0?RIVER_SP[G.k.beamLv]+.2:0,lv:RIVER_LV,cast:riverCast},
  thunder:{n:'紫霄雷網',ic:'網',col:0xc89aff,shape:'auto',range:()=>9,cd:()=>10,lv:NET_LV,cast:netCast}});
// ---------- 水墨過場 ----------
Object.assign(INK.scenes,{
  market:(x,I)=>{I.paper(x);I.wash(x,230,40,.3,1.7);for(let i=0;i<8;i++){const px=60+i*95;x.fillStyle='rgba(20,18,16,.9)';x.fillRect(px-30,200,60,90);x.beginPath();x.moveTo(px-42,200);x.lineTo(px,170);x.lineTo(px+42,200);x.fill();I.lantern(x,px,160+(i%2)*14,9,i%3!==0)}I.ghosts(x,5);I.seal(x,'市')},
  hungry:(x,I)=>{I.paper(x);I.wash(x,260,40,.3,2.1);x.fillStyle='rgba(30,36,24,.92)';x.beginPath();x.ellipse(400,230,120,90,0,0,7);x.fill();x.beginPath();x.arc(400,130,50,0,7);x.fill();x.fillStyle='#d22';[-1,1].forEach(d=>{x.beginPath();x.arc(400+d*18,126,6,0,7);x.fill()});x.fillStyle='#f4ece0';for(let i=-3;i<=3;i++)x.fillRect(400+i*8-2,150,4,14);I.seal(x,'餓')},
  river:(x,I)=>{I.paper(x);I.moon(x,640,70,26);I.wash(x,200,50,.35,1.3);x.fillStyle='rgba(30,50,80,.5)';x.fillRect(0,250,800,110);x.fillStyle='rgba(20,18,16,.92)';x.beginPath();x.moveTo(250,270);x.quadraticCurveTo(400,310,560,262);x.lineTo(540,250);x.lineTo(270,252);x.fill();I.figure(x,420,258,.9,{});x.fillStyle='rgba(190,40,30,.85)';for(let i=0;i<40;i++){x.beginPath();x.arc(20+Math.random()*760,300+Math.random()*50,3,0,7);x.fill()}I.seal(x,'渡')},
  master:(x,I)=>{I.paper(x);I.moon(x,400,100,50);I.wash(x,260,50,.4,1.6);I.figure(x,330,320,1.3,{sword:1});I.figure(x,470,320,1.1,{col:'rgba(60,60,64,.8)'});I.seal(x,'師')},
  core:(x,I)=>{const g=x.createRadialGradient(400,200,10,400,200,340);g.addColorStop(0,'#ffe9a8');g.addColorStop(.4,'#f2b84a');g.addColorStop(1,'#3a2a18');x.fillStyle=g;x.fillRect(0,0,800,360);I.figure(x,400,320,1.4,{col:'rgba(10,8,6,.95)'});x.strokeStyle='rgba(255,240,190,.9)';x.lineWidth=3;x.beginPath();x.arc(400,200,70,0,7);x.stroke();I.seal(x,'丹')}});
Object.assign(CUTS,{
  ch4:[{scene:'market',t:'第四章・鬼市。三更天，沒有活人的街市亮起了紅燈籠，攤販都沒有臉。'},{scene:'hungry',t:'街尾坐著一團胖大的黑影，肚子咕嚕嚕地響：「餓……」'}],
  ch5:[{scene:'river',t:'第五章・黃泉渡口。黑色的河水不流，岸邊開滿了紅色的彼岸花。'}],
  ch5end:[{scene:'master',t:'擺渡人沉入河底。師父的身影在岸邊出現，他笑著對你點點頭，慢慢散成了光。'},{scene:'core',t:'你把他的一生修為壓入丹田，一顆金丹慢慢轉動——結丹了。'}]});
