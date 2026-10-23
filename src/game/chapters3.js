/* ================= 第 6～8 章：御劍天空篇（雲海、雷澤、天河）=================
   主角站在飛劍上一直往前飛（鏡頭在背後斜上），左搖桿在前進方向的平面上移動；妖從前方與兩側來，落到後面的就放掉。 */
const SKY_SPEED=2.6;
function skyMap(cloud,haze,stormy){pave.visible=false;const puffs=[];const m=new THREE.MeshLambertMaterial({color:cloud,transparent:true,opacity:.55,depthWrite:false}),g0=new THREE.IcosahedronGeometry(1,1);
  for(let i=0;i<40;i++){const p=new THREE.Mesh(g0,m);const s=1.2+rnd()*2.2;p.scale.set(s*1.6,s*.45,s);p.position.set((rnd()-.5)*70,-2.2-rnd()*1.2,(rnd()-.5)*70);mapG.add(p);puffs.push(p)}
  for(let i=0;i<7;i++){const r=new THREE.Mesh(new THREE.ConeGeometry(1.4+rnd(),9+rnd()*6,6),toon(stormy?0x2a2838:0x6a7a88));r.rotation.x=Math.PI;r.position.set((rnd()-.5)*60,-3,(rnd()-.5)*60);mapG.add(r);puffs.push(r);r.userData.rock=1}
  mapG.userData.puffs=puffs;mapG.userData.stormy=stormy}
MAPS[6]=()=>skyMap(0xdde8f2,0,false);MAPS[7]=()=>skyMap(0x4a4660,0,true);
MAPS[8]=()=>{skyMap(0x8aa4d8,0,false);for(const p of mapG.userData.puffs)if(!p.userData.rock){p.material=p.material.clone();p.material.color.set(0x9ab8ff);p.material.emissive=new THREE.Color(0x1a2a5a)}
  const st=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(Array.from({length:600},(_,i)=>i%3===1?3+rnd()*30:(rnd()-.5)*140),3)),new THREE.PointsMaterial({color:0xcfe0ff,size:.3,sizeAttenuation:true,fog:false}));mapG.add(st);mapG.userData.stars=st};
const fogP0=fogs.map(m=>m.position.clone()),moonP0=moon.position.clone(),GSNAP=160/22;
function stepSky(dt){const hx=HERO.pos.x,hz=HERO.pos.z,P=mapG.userData.puffs||[];
  ground.position.set(Math.round(hx/GSNAP)*GSNAP,0,Math.round(hz/GSNAP)*GSNAP);
  for(const p of P){if(p.position.z<hz-30)p.position.z+=70;else if(p.position.z>hz+40)p.position.z-=70;if(p.position.x<hx-35)p.position.x+=70;else if(p.position.x>hx+35)p.position.x-=70}
  if(mapG.userData.stars)mapG.userData.stars.position.set(hx,0,hz);
  fogs.forEach((m,i)=>{m.position.x=hx+fogP0[i].x;m.position.z=hz+fogP0[i].z});moon.position.set(hx+moonP0.x,moonP0.y,hz+moonP0.z);
  if(mapG.userData.stormy&&!simming&&Math.random()<dt*.5){const x=hx+(Math.random()-.5)*50,z=hz+10+Math.random()*30;boltAt(x,z,0,0,0xc8b8ff,.12,14)}}
function leaveSky(){ground.position.set(0,0,0);fogs.forEach((m,i)=>m.position.copy(fogP0[i]));moon.position.copy(moonP0);root.position.y=0}
// ---------- 新妖 ----------
const wingBody=(B,W,E,s=1)=>[{g:S0,c:B,p:[0,.7,0],s:[.18*s,.16*s,.3*s]},{g:S0,c:B,p:[0,.78,.28*s],s:[.1*s,.1*s,.12*s]},{g:cone(.04*s,.005,.16*s,5),c:E,p:[0,.76,.42*s],r:[Math.PI/2,0,0]},
  {g:B0,c:W,p:[-.4*s,.78,0],s:[.6*s,.03,.3*s],r:[0,0,.25]},{g:B0,c:W,p:[.4*s,.78,0],s:[.6*s,.03,.3*s],r:[0,0,-.25]},{g:cone(.1*s,.005,.4*s,4),c:B,p:[0,.7,-.4*s],r:[-Math.PI/2,0,0]},{g:S0,c:'#ff2',p:[-.05*s,.82,.34*s],s:[.025,.025,.02]},{g:S0,c:'#ff2',p:[.05*s,.82,.34*s],s:[.025,.025,.02]}];
const birdGeo=merged(wingBody('#c8a26a','#e8d6a8','#ffb43a',1.1));
const crowGeo=merged([...wingBody('#1c1c2a','#2a2a44','#8a6a2a',1.1),{g:S0,c:'#b784ff',p:[0,.7,0],s:[.12,.12,.2]}]);
const cloudGeo=merged([{g:S0,c:'#5a5a78',p:[0,.7,0],s:[.6,.3,.45]},{g:S0,c:'#6a6a88',p:[-.3,.8,.1],s:[.35,.25,.3]},{g:S0,c:'#6a6a88',p:[.3,.8,-.05],s:[.4,.28,.3]},{g:S0,c:'#ffe08a',p:[-.1,.78,.38],s:[.06,.03,.02]},{g:S0,c:'#ffe08a',p:[.1,.78,.38],s:[.06,.03,.02]},{g:cone(.05,.005,.35,4),c:'#e8d8ff',p:[0,.35,0],r:[Math.PI,0,0]}]);
const jiaoGeo=merged([...[0,1,2,3,4,5].map(i=>({g:S0,c:i%2?'#2a7a9a':'#3a8aaa',p:[Math.sin(i)*.1,.8,.5-i*.18],s:[.15-i*.014,.14-i*.014,.15]})),{g:S0,c:'#3a8aaa',p:[0,.85,.68],s:[.17,.15,.22]},{g:cone(.03,.005,.2,4),c:'#e8d8a0',p:[-.1,1,.7],r:[.5,0,.4]},{g:cone(.03,.005,.2,4),c:'#e8d8a0',p:[.1,1,.7],r:[.5,0,-.4]},{g:S0,c:'#fe2',p:[-.07,.9,.78],s:[.03,.03,.02]},{g:S0,c:'#fe2',p:[.07,.9,.78],s:[.03,.03,.02]}]);
const tmqGeo=merged([{g:B0,c:'#2a2a3a',p:[0,.6,0],s:[.3,.3,.7]},{g:B0,c:'#2a2a3a',p:[0,.8,.45],s:[.14,.4,.16],r:[-.5,0,0]},{g:B0,c:'#3a3a52',p:[0,1,.6],s:[.16,.16,.3]},{g:S0,c:'#e22',p:[-.05,1.04,.74],s:[.025,.025,.02]},{g:S0,c:'#e22',p:[.05,1.04,.74],s:[.025,.025,.02]},
  {g:B0,c:'#5a1a1a',p:[0,1.05,-.05],s:[.3,.5,.22]},{g:S0,c:'#d8c8a8',p:[0,1.5,-.05],s:[.13,.14,.12]},{g:cone(.1,.02,.3,4),c:'#e22',p:[0,1.72,-.05]},{g:cone(.015,.01,1.2,5),c:'#cfd8d0',p:[.3,1.1,.3],r:[1.3,0,0]},
  ...[[-.1,.3],[.1,.3],[-.1,-.3],[.1,-.3]].map(([x,z])=>({g:C0,c:'#1a1a22',p:[x,.25,z],s:[.03,.5,.03]}))]);
function addFly(k,def){def.fly=1;addMob(k,def)}
addFly('bird',{n:'飛天妖鳥',geo:birdGeo,cap:90,hp:24,spd:3,r:.3,dmg:8,soul:1,sc:.75,glow:.35,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d,ux,uz)=>{e.y=1.1+Math.sin(e.ph*3)*.3;const w=Math.sin(e.ph*2.4)*.7,c=Math.cos(w),s=Math.sin(w);return {v:e.t.spd*(d<4?1.5:1),x:ux*c-uz*s,z:ux*s+uz*c}}});
addFly('crow',{n:'雷鴉',geo:crowGeo,cap:90,hp:22,spd:3.2,r:.3,dmg:9,soul:1,sc:.75,glow:.4,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d,ux,uz)=>{e.y=1.2+Math.sin(e.ph*3)*.25;if((e.special||e.elite)&&(e.cd2=(e.cd2??2+Math.random()*2)-dt)<=0&&d<9){e.cd2=3.5;warn(HERO.pos.x+HERO.vel.x*.4,HERO.pos.z+HERO.vel.z*.4+.5,1.2,.9,e.dmg*1.3,null,0xb784ff)}return {v:e.t.spd,x:ux,z:uz}}});
addFly('cloud',{n:'雷雲',geo:cloudGeo,cap:60,hp:44,spd:1.3,r:.42,dmg:9,soul:2,sc:.95,glow:.35,mat:{},
  ai:(e,dt,d,ux,uz)=>{e.y=1.4+Math.sin(e.ph*1.5)*.2;if((e.cd2=(e.cd2??1.5+Math.random()*2)-dt)<=0&&d<10){e.cd2=e.special||e.elite?2.4:4;const x=HERO.pos.x+(Math.random()-.5)*2,z=HERO.pos.z+1.5+Math.random()*2;warn(x,z,1.4,1,e.dmg*1.5,null,0xb784ff);act(1,null,()=>{if(G&&!G.over)boltAt(x,z,0,0,0xd8c8ff,.1,14)})}return {v:d<5?.2:e.t.spd,x:ux,z:uz}}});
addFly('jiaoling',{n:'雲中蛟',geo:jiaoGeo,cap:80,hp:34,spd:2.6,r:.33,dmg:9,soul:1,sc:.85,glow:.3,mat:{},
  ai:(e,dt,d,ux,uz)=>{e.y=.9+Math.sin(e.ph*2)*.3;if((e.special||e.elite)&&(e.cd2=(e.cd2??2)-dt)<=0&&d<9){e.cd2=3.2;enemyShot(e.x,.9,e.z,ux,uz,3.4,e.dmg*.8,0x6ac8ff)}const w=Math.sin(e.ph*3.2)*.6,c=Math.cos(w),s=Math.sin(w);return {v:e.t.spd,x:ux*c-uz*s,z:ux*s+uz*c}}});
addFly('tmq',{n:'天魔騎',geo:tmqGeo,cap:60,hp:48,spd:2,r:.36,dmg:11,soul:2,sc:.8,glow:.3,mat:{},
  ai:(e,dt,d,ux,uz)=>{e.y=.9;e.gt=(e.gt??Math.random())-dt;if(e.gt<=0){if(e.run){e.run=false;e.gt=.6}else{e.run=true;e.gt=1.1;e.gx=ux;e.gz=uz}}return e.run?{v:e.t.spd*(e.special||e.elite?2.8:2.2),x:e.gx,z:e.gz}:{v:.3,x:ux,z:uz}}});
// ---------- 魔王 ----------
const skyFollow=(b,dt,ahead,side)=>{const tx=HERO.pos.x+Math.sin(b.t*.5)*side,tz=HERO.pos.z+ahead+Math.cos(b.t*.4)*2,k=Math.min(1,dt*1.3);b.x+=(tx-b.x)*k;b.z+=(tz-b.z)*k};
Object.assign(BOSSES,{
  nine:{name:'九頭鳥',line:'九頭鳥：「九張嘴，吃你一個夠不夠？」',rage:'九頭鳥：「九頭齊鳴！」',tip:'九頭鳥的火球會一排噴出來，俯衝前先畫紅色長條！',r:1.4,dmg:18,spd:1.7,bob:1.2,y:2.2,
    build(g){const P=toon(0x6a3a2a,{emissive:0x200a06}),Y=toon(0xd8a03a,{emissive:0x3a2208}),body=new THREE.Group();body.scale.setScalar(1.6);g.add(body);part(new THREE.SphereGeometry(.8,16,12),P,body,{s:[1,.8,1.3]});
      [-1,1].forEach(d=>part(new THREE.BoxGeometry(2.4,.06,1),P,body,{p:[d*1.6,.1,0],r:[0,0,d*.3]}));
      const heads=[];for(let i=0;i<9;i++){const a=(i-4)/4*1.3,h=new THREE.Group();h.position.set(Math.sin(a)*.5,.4,.6);body.add(h);part(new THREE.CylinderGeometry(.06,.09,.9,6),P,h,{p:[Math.sin(a)*.3,.45,.3],r:[.6,0,-a*.6]});part(new THREE.SphereGeometry(.17,10,8),P,h,{p:[Math.sin(a)*.5,.85,.7]});part(new THREE.ConeGeometry(.06,.25,5),Y,h,{p:[Math.sin(a)*.5,.82,.95],r:[Math.PI/2,0,0]});heads.push(h)}
      part(new THREE.ConeGeometry(.3,1.4,6),Y,body,{p:[0,0,-1.2],r:[-Math.PI/2,0,0]});
      return {body,spin:b=>heads.forEach((h,i)=>{h.rotation.x=Math.sin(b.t*2+i)*.12})}},
    act(b,dt){if(b.dash>0){b.dash-=dt;b.x+=b.dx*13*dt;b.z+=b.dz*13*dt;return}skyFollow(b,dt,7,5);b.cd-=dt;
      if(b.cd<=0){b.k=(b.k||0)+1;
        if(b.k%3){b.cd=b.rage?1.8:2.6;const a0=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z),n=b.rage?9:5;for(let j=0;j<n;j++){const a=a0+(j-(n-1)/2)*.28;enemyShot(b.x,2,b.z,Math.sin(a),Math.cos(a),3.4,14)}}
        else{b.cd=3.2;const a0=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z);b.dx=Math.sin(a0);b.dz=Math.cos(a0);warnLine(b.x,b.z,a0,16,2,1,22);act(1,null,()=>{b.dash=.9})}}
      b.sum-=dt;if(b.sum<=0){b.sum=7;for(let i=0;i<6;i++)spawn('bird',b.x+(Math.random()-.5)*6,b.z+(Math.random()-.5)*3)}}},
  kui:{name:'雷獸夔',line:'雷獸夔：「轟——！」',rage:'雷獸夔：「雷霆萬鈞！」',tip:'雷獸會一排排落雷：先看紫色圈圈，再橫向閃開！',r:1.3,dmg:20,spd:1.6,bob:0,y:0,
    build(g){const D=toon(0x2a2838,{emissive:0x0a0814}),P=new THREE.MeshBasicMaterial({color:0xb784ff}),body=new THREE.Group();body.scale.setScalar(1.7);g.add(body);part(new THREE.SphereGeometry(.7,14,10),D,body,{p:[0,.9,0],s:[1,.9,1.5]});part(new THREE.SphereGeometry(.4,12,10),D,body,{p:[0,1.2,1.1]});
      [-1,1].forEach(d=>{[.7,-.7].forEach(z=>part(C0,D,body,{p:[d*.4,.35,z],s:[.12,.7,.12]}));part(new THREE.ConeGeometry(.06,.5,5),P,body,{p:[d*.2,1.7,1.15],r:[0,0,-d*.3]});part(new THREE.SphereGeometry(.05,6,5),P,body,{p:[d*.15,1.3,1.45]})});
      for(let i=0;i<5;i++)part(new THREE.ConeGeometry(.1,.45,5),P,body,{p:[0,1.6-i*.1,.6-i*.35],r:[-.2,0,0]});
      const L=new THREE.PointLight(0xb784ff,2,10,1.4);L.position.y=1.5;body.add(L);return {body,L,Li:2,spin:b=>{}}},
    act(b,dt){if(b.dash>0){b.dash-=dt;b.x+=b.dx*13*dt;b.z+=b.dz*13*dt;return}skyFollow(b,dt,6,4);b.cd-=dt;
      if(b.cd<=0){b.k=(b.k||0)+1;
        if(b.k%3===1){b.cd=b.rage?2.6:3.4;const rows=b.rage?4:3;for(let r=0;r<rows;r++)for(let i=-3;i<=3;i++){if(i===(r%2?-1:1)*2&&r%2===0)continue;const x=HERO.pos.x+i*2.1,z=HERO.pos.z+2+r*2.4;warn(x,z,1.1,1+r*.3,16,null,0xb784ff);act(1+r*.3,null,()=>{if(G&&!G.over)boltAt(x,z,0,0,0xd8c8ff,.1,14)})}}
        else if(b.k%3===2){b.cd=3;const a0=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z);b.dx=Math.sin(a0);b.dz=Math.cos(a0);warnLine(b.x,b.z,a0,15,2.2,1,24);act(1,null,()=>{b.dash=.85})}
        else{b.cd=3;const gap=Math.random()*6.28;wave(b.x,b.z,5,13,gap,1.1,12,0xb784ff)}}}},
  dragon:{name:'蛟龍',line:'蛟龍：「天河是我的，誰准你們過？」',rage:'蛟龍：「水漫天河——！」',tip:'蛟龍的水龍捲會一路追，甩尾前先畫扇形，繞到側面！',r:1.3,dmg:20,spd:1.8,bob:1,y:1.6,
    build(g){const S=toon(0x2a7aaa,{emissive:0x081a2a}),B=toon(0xd8e8f0),body=new THREE.Group();g.add(body);const segs=[];
      for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.95-i*.07,12,10),i%2?S:toon(0x3a8ab8,{emissive:0x081a2a}));body.add(m);segs.push(m)}
      const head=segs[0];[-1,1].forEach(d=>{part(new THREE.ConeGeometry(.12,.7,5),B,head,{p:[d*.5,.8,-.2],r:[-.4,0,-d*.5]});part(new THREE.SphereGeometry(.1,6,5),new THREE.MeshBasicMaterial({color:0xffee22}),head,{p:[d*.4,.3,.8]})});part(new THREE.ConeGeometry(.3,.6,6),S,head,{p:[0,-.1,1],r:[Math.PI/2,0,0]});
      return {body,spin:b=>segs.forEach((m,i)=>{m.position.set(Math.sin(b.t*2.2-i*.7)*.8*Math.min(1,i*.5),Math.cos(b.t*1.6-i*.5)*.2,-i*1.2)})}},
    act(b,dt){if(b.dash>0){b.dash-=dt;b.x+=b.dx*12*dt;b.z+=b.dz*12*dt;return}skyFollow(b,dt,7,6);b.cd-=dt;
      if(b.cd<=0){b.k=(b.k||0)+1;
        if(b.k%3===1){b.cd=b.rage?2.2:3;let px=HERO.pos.x,pz=HERO.pos.z+1;for(let i=0;i<(b.rage?6:4);i++){const x=px+(Math.random()-.5)*3,z=pz+i*1.8;warn(x,z,1.5,.9+i*.25,16,()=>{G.slowT=1.2},0x6ac8ff)}}
        else if(b.k%3===2){b.cd=3;const a0=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z)+Math.PI;warnFan(b.x,b.z,a0,2.8,6,1,22)}
        else{b.cd=3.2;const a0=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z);b.dx=Math.sin(a0);b.dz=Math.cos(a0);warnLine(b.x,b.z,a0,15,2.2,1,22);act(1,null,()=>{b.dash=.85})}}
      b.sum-=dt;if(b.sum<=0){b.sum=7;for(let i=0;i<5;i++)spawn('jiaoling',b.x+(Math.random()-.5)*6,b.z+(Math.random()-.5)*3)}}}});
CHC[6]={map:6,sky:1,fog:0x6a84a0,ground:0xdde8f4,mobs:[['bird',2.4,0],['crow',1.6,.5],['ghost',.8,0],['cloud',1,3]],elite:'crow',boss:'nine'};
CHC[7]={map:7,sky:1,fog:0x2a2840,ground:0x7a7494,mobs:[['crow',2.6,0],['cloud',1.8,.5],['bird',1.2,0],['tmq',.8,4]],elite:'cloud',boss:'kui'};
CHC[8]={map:8,sky:1,fog:0x1a2a54,ground:0x7a98d8,mobs:[['jiaoling',2.4,0],['tmq',1.8,.5],['bird',1.2,0],['crow',1,3]],elite:'tmq',boss:'dragon'};
// ---------- 劍氣貫日（第七章大絕）：全畫面的巨大劍氣長虹 ----------
function sunCast(A){const a0=Math.atan2(A.dir[0],A.dir[1]),hx=HERO.pos.x,hz=HERO.pos.z,L=18,W=5,dmg=swordDmg()*95,dx=Math.sin(a0),dz=Math.cos(a0);G.ultBoss=0;G.slow=.5;shake=Math.max(shake,.7);SFX.play('ult');buzz(70);
  const u=$('#ultFx');u.classList.remove('on');void u.offsetWidth;u.classList.add('on');banner('劍氣貫日','大絕',true);
  const m=new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({map:beamTex,color:0xffe9a0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(hx,.8,hz);m.rotation.y=a0;scene.add(m);let hit=false;
  act(1.6,t=>{const k=Math.min(1,t/.25);m.position.set(HERO.pos.x,.8,HERO.pos.z);m.scale.set(W*(t>.9?Math.max(.1,1-(t-.9)/.7):1),1,L*k);m.material.opacity=t<1.1?1:Math.max(0,1-(t-1.1)/.5);
      if(!hit&&t>=.25){hit=true;SFX.play('bossDie');shake=Math.max(shake,1);const inside=(x,z,r)=>{const px=x-hx,pz=z-hz,al=px*dx+pz*dz,pe=Math.abs(px*dz-pz*dx);return al>-r&&al<L+r&&pe<W/2+r};
        for(const e of enemies)if(!e.dead&&inside(e.x,e.z,e.r))hurtEnemy(e,dmg,dx*1.5,dz*1.5,true,8);
        if(boss.alive&&inside(boss.x,boss.z,boss.r)){const room=boss.max*.22-G.ultBoss;if(room>0){const d=Math.min(dmg*3,room);G.ultBoss+=d;boss.allow+=d;hurtBoss(d,true)}}}},()=>{scene.remove(m);m.material.dispose()})}
ULT_DEF.sun={n:'劍氣貫日',ic:'日',col:0xffe9a0,shape:'line',ult:1,w:5,range:()=>18,cast:sunCast};
// ---------- 水墨過場 ----------
Object.assign(INK.scenes,{
  sky:(x,I)=>{const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'#cfe0ee');g.addColorStop(1,'#f4ece0');x.fillStyle=g;x.fillRect(0,0,800,360);I.wash(x,300,40,.25,1.2);x.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<9;i++){x.beginPath();x.ellipse(60+i*90,260+(i%3)*30,70,18,0,0,7);x.fill()}
    x.fillStyle='rgba(20,18,16,.92)';x.save();x.translate(400,180);x.rotate(-.12);x.fillRect(-90,20,180,6);x.restore();I.figure(x,400,205,.8,{sword:0});I.seal(x,'御')},
  nine:(x,I)=>{I.paper(x);I.moon(x,640,80,40);x.fillStyle='rgba(20,18,16,.92)';x.beginPath();x.ellipse(330,230,90,50,0,0,7);x.fill();for(let i=0;i<9;i++){const a=-Math.PI*.9+i*.22;x.lineWidth=10;x.strokeStyle='rgba(20,18,16,.9)';x.beginPath();x.moveTo(330,200);x.quadraticCurveTo(330+Math.cos(a)*90,200+Math.sin(a)*120,330+Math.cos(a)*130,110+Math.sin(a)*70);x.stroke();x.beginPath();x.arc(330+Math.cos(a)*130,110+Math.sin(a)*70,11,0,7);x.fill()}I.seal(x,'鳥')},
  storm:(x,I)=>{const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'#2a2838');g.addColorStop(1,'#6a6488');x.fillStyle=g;x.fillRect(0,0,800,360);x.strokeStyle='rgba(225,210,255,.95)';x.lineWidth=4;for(let k=0;k<4;k++){let px=140+k*170,py=0;x.beginPath();x.moveTo(px,py);while(py<300){px+=(Math.random()-.5)*60;py+=34;x.lineTo(px,py)}x.stroke()}I.wash(x,320,40,.6,1.4);I.seal(x,'雷')},
  heaven:(x,I)=>{const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'#0e1a3a');g.addColorStop(1,'#3a5a9a');x.fillStyle=g;x.fillRect(0,0,800,360);x.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<90;i++){x.fillRect(Math.random()*800,Math.random()*200,2,2)}
    x.strokeStyle='rgba(160,200,255,.7)';x.lineWidth=40;x.beginPath();x.moveTo(-20,300);x.bezierCurveTo(250,180,500,360,820,200);x.stroke();I.figure(x,420,230,.8,{});I.seal(x,'河')}});
Object.assign(CUTS,{
  ch6:[{scene:'sky',t:'第六章・雲海。你的金丹轉動，腳下的劍輕輕一震——你可以御劍了。'},{scene:'nine',t:'雲海深處傳來九個聲音一起說話：「又有活人飛上來了。」'}],
  ch7:[{scene:'storm',t:'第七章・雷澤。雲層裡全是紫色的電，一頭長著獨角的巨獸在雲裡打滾。'}],
  ch8:[{scene:'heaven',t:'第八章・天河。星星流成一條河，河裡有什麼東西慢慢游過來，比整片雲都長。'}]});
