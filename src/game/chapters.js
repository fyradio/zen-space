/* ================= 章節：地圖、妖怪、魔王、開場劇情 =================
   CHC[ch] = { map, fog, ground, mobs:[[種類,權重,從第幾分鐘起]], elite, boss, cut }
   難度：妖血 ×1.1^推薦境界×(1+0.08×章)；魔王血 ×1.1^推薦境界×(1+0.15×章)。 */
const chRec=ch=>CH[ch]?CH[ch].rec:0;
const chDmg=ch=>Math.pow(1.06,chRec(ch));// monsters hit harder as the recommended realm (and your own HP) grows
const chHp=ch=>Math.pow(1.1,chRec(ch))*(1+.08*ch),chBoss=ch=>Math.pow(1.1,chRec(ch))*(1+.04*ch);
/* ---------- 地圖 ---------- */
function clearMap(){while(mapG.children.length){const o=mapG.children.pop();o.traverse(n=>{if(n.geometry)n.geometry.dispose()})}HOUSES.length=0}
const MAPS={
  0:()=>{pave.visible=true;// 白石村: houses on a ring around the square, dead lanterns, bare trees, the well
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2+(rnd()-.5)*.15,r=14+rnd()*5,w=2.4+rnd()*1.6,d=2+rnd()*.8;house(Math.sin(a)*r,Math.cos(a)*r,a+Math.PI,w,d);HOUSES.push({x:Math.sin(a)*r,z:Math.cos(a)*r,r:Math.max(w,d)*.55})}
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2;deadLantern(Math.sin(a)*9.6,Math.cos(a)*9.6)}
    for(let i=0;i<9;i++){const a=rnd()*Math.PI*2,r=21+rnd()*8;bareTree(Math.sin(a)*r,Math.cos(a)*r,.9+rnd()*.5)}
    const g=new THREE.Group();g.position.set(3.2,0,-2.4);mapG.add(g);
    part(new THREE.CylinderGeometry(.62,.68,.55,18,1,true),stoneM,g,{p:[0,.27,0]});part(new THREE.TorusGeometry(.64,.07,8,24),stoneM,g,{p:[0,.55,0],r:[Math.PI/2,0,0]});
    part(new THREE.CircleGeometry(.6,18),toon(0x050807),g,{p:[0,.4,0],r:[-Math.PI/2,0,0]});
    [-1,1].forEach(s=>part(new THREE.BoxGeometry(.08,1.3,.08),poleM,g,{p:[s*.62,.9,0]}));part(new THREE.BoxGeometry(1.4,.08,.08),poleM,g,{p:[0,1.52,0]});HOUSES.push({x:3.2,z:-2.4,r:.8})},
  1:()=>{pave.visible=false;// 荒村夜: dry fields in rows, scarecrows, broken walls, a few ruined houses, dead trees
    const soil=toon(0x0e0b07,{roughness:1}),straw=toon(0x8a7440),wood=toon(0x3a2a1e),cloth=toon(0x5a4a3a);
    for(let r=-4;r<=4;r++){const m=new THREE.Mesh(new THREE.BoxGeometry(40,.05,.32),soil);m.position.set(0,.025,r*2.2+1);mapG.add(m)}
    for(let i=0;i<22;i++){const x=(rnd()-.5)*36,z=(rnd()-.5)*36;if(Math.hypot(x,z)<5)continue;const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rnd()*6;mapG.add(g);
      part(new THREE.CylinderGeometry(.04,.05,1.8,5),wood,g,{p:[0,.9,0]});part(new THREE.CylinderGeometry(.03,.03,1.2,5),wood,g,{p:[0,1.35,0],r:[0,0,Math.PI/2]});
      part(new THREE.SphereGeometry(.17,8,6),straw,g,{p:[0,1.75,0]});part(new THREE.ConeGeometry(.32,.18,10),straw,g,{p:[0,1.92,0]});part(new THREE.BoxGeometry(.5,.55,.08),cloth,g,{p:[0,1.25,0]});HOUSES.push({x,z,r:.35})}
    for(let i=0;i<9;i++){const a=rnd()*Math.PI*2,r=12+rnd()*8,w=2+rnd()*3;const m=new THREE.Mesh(new THREE.BoxGeometry(w,.6+rnd()*.9,.35),baseM);m.position.set(Math.sin(a)*r,.4,Math.cos(a)*r);m.rotation.y=a+rnd();mapG.add(m);HOUSES.push({x:m.position.x,z:m.position.z,r:w*.4})}
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.4,r=17+rnd()*3;house(Math.sin(a)*r,Math.cos(a)*r,a+Math.PI,2.6,2.2);HOUSES.push({x:Math.sin(a)*r,z:Math.cos(a)*r,r:1.5})}
    for(let i=0;i<12;i++){const a=rnd()*Math.PI*2,r=18+rnd()*10;bareTree(Math.sin(a)*r,Math.cos(a)*r,1+rnd()*.6)}},
  2:()=>{pave.visible=false;// 竹林小徑: dense bamboo clumps, a stone path through the middle
    const bam=toon(0x3f7a44,{emissive:0x0a2010}),node=toon(0x2a5a30),leaf=toon(0x2f6a36,{side:THREE.DoubleSide}),stone=toon(0x262a24,{roughness:1});
    for(let i=0;i<18;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.38+rnd()*.12,.42,.05,7),stone);m.position.set((rnd()-.5)*1.5,.03,-18+i*2.1);mapG.add(m)}
    for(let c=0;c<26;c++){const cx=(rnd()-.5)*40,cz=(rnd()-.5)*40;if(Math.abs(cx)<3.5||Math.hypot(cx,cz)<6)continue;const n=3+Math.floor(rnd()*4);
      for(let k=0;k<n;k++){const x=cx+(rnd()-.5)*1.4,z=cz+(rnd()-.5)*1.4,h=5+rnd()*4,g=new THREE.Group();g.position.set(x,0,z);g.rotation.set((rnd()-.5)*.12,rnd()*6,(rnd()-.5)*.12);mapG.add(g);
        part(new THREE.CylinderGeometry(.07,.09,h,6),bam,g,{p:[0,h/2,0]});for(let j=1;j<h;j+=1.1)part(new THREE.CylinderGeometry(.1,.1,.06,6),node,g,{p:[0,j,0]});
        for(let j=0;j<4;j++)part(new THREE.PlaneGeometry(.9,.18),leaf,g,{p:[0,h-.4-j*.5,0],r:[0,j*1.6,.5]})}
      HOUSES.push({x:cx,z:cz,r:.9})}},
  3:()=>{pave.visible=true;// 古寺: a temple hall, a pagoda, the bell tower, stone lanterns round the courtyard
    const red=toon(0x5a1812),gold=toon(0x8a6a2a),stone=toon(0x3a3d38,{roughness:1}),roof=toon(0x1a1d22);
    const hall=new THREE.Group();hall.position.set(0,0,-15);mapG.add(hall);part(new THREE.BoxGeometry(10,.6,5),stone,hall,{p:[0,.3,0]});
    for(let i=-2;i<=2;i++)part(new THREE.CylinderGeometry(.18,.2,3,10),red,hall,{p:[i*2.2,1.9,2]});part(new THREE.BoxGeometry(9.4,2.6,3.6),red,hall,{p:[0,1.9,-.4]});
    part(new THREE.ConeGeometry(7.6,2.2,4,1),roof,hall,{p:[0,4.3,0],r:[0,Math.PI/4,0],s:[1,1,.6]});HOUSES.push({x:-3,z:-15,r:3.2},{x:3,z:-15,r:3.2},{x:0,z:-15,r:3})
    const pag=new THREE.Group();pag.position.set(13,0,-6);mapG.add(pag);for(let i=0;i<5;i++){const w=2.6-i*.38;part(new THREE.BoxGeometry(w,1.1,w),i%2?red:stone,pag,{p:[0,.55+i*1.4,0]});part(new THREE.ConeGeometry(w*.95,.5,4),roof,pag,{p:[0,1.3+i*1.4,0],r:[0,Math.PI/4,0]})}HOUSES.push({x:13,z:-6,r:1.6});
    const bt=new THREE.Group();bt.position.set(-12,0,-4);mapG.add(bt);[-1,1].forEach(a=>[-1,1].forEach(b=>part(new THREE.CylinderGeometry(.14,.16,4,8),red,bt,{p:[a*1.1,2,b*1.1]})));
    part(new THREE.ConeGeometry(2.4,1.2,4),roof,bt,{p:[0,4.6,0],r:[0,Math.PI/4,0]});part(new THREE.LatheGeometry(V2([[0,0],[.6,0],[.55,.3],[.45,1],[.3,1.2],[0,1.25]]),18),gold,bt,{p:[0,2.4,0]});HOUSES.push({x:-12,z:-4,r:1.6});
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=10.5,g=new THREE.Group();g.position.set(Math.sin(a)*r,0,Math.cos(a)*r);mapG.add(g);
      part(new THREE.BoxGeometry(.4,.8,.4),stone,g,{p:[0,.4,0]});part(new THREE.BoxGeometry(.6,.4,.6),stone,g,{p:[0,1,0]});part(new THREE.ConeGeometry(.5,.35,4),stone,g,{p:[0,1.38,0],r:[0,Math.PI/4,0]});HOUSES.push({x:g.position.x,z:g.position.z,r:.4})}
    for(let i=0;i<8;i++){const a=rnd()*Math.PI*2,r=20+rnd()*8;bareTree(Math.sin(a)*r,Math.cos(a)*r,1.1+rnd()*.5)}}};
let curMap=-1;
function buildMap(ch){if(curMap===ch)return;clearMap();(MAPS[ch]||MAPS[0])();curMap=ch;const c=CHC[ch]||CHC[0];
  ground.material.color.set(c.ground||0xffffff);NIGHT_FOG.copy(LC(c.fog||FOGHEX));FOG.copy(NIGHT_FOG);sky.material.uniforms.bot.value.copy(NIGHT_FOG);scene.fog.color.copy(NIGHT_FOG);scene.background.copy(NIGHT_FOG)}
/* ---------- 新妖怪 ---------- */
const scareGeo=(()=>{const S='#a8894a',W='#6a4a2e',C='#5a4a3a',K='#141210',R='#8a2a20';
  return merged([{g:C0,c:W,p:[0,.45,0],s:[.04,.9,.04]},{g:C0,c:W,p:[0,.92,0],s:[.03,.9,.03],r:[0,0,Math.PI/2]},
    {g:cone(.32,.22,.6,6),c:C,p:[0,.75,0]},{g:B0,c:R,p:[0,.62,.12],s:[.28,.05,.02]},
    {g:S0,c:'#c9b07a',p:[0,1.12,0],s:[.16,.17,.15]},{g:cone(.36,.02,.22,10),c:S,p:[0,1.3,0]},
    {g:B0,c:K,p:[-.06,1.14,.14],s:[.04,.012,.01],r:[0,0,.6]},{g:B0,c:K,p:[.06,1.14,.14],s:[.04,.012,.01],r:[0,0,-.6]},{g:B0,c:K,p:[0,1.06,.15],s:[.08,.01,.01]},
    {g:cone(.06,.01,.3,4),c:S,p:[-.46,.9,0],r:[0,0,Math.PI/2]},{g:cone(.06,.01,.3,4),c:S,p:[.46,.9,0],r:[0,0,-Math.PI/2]}])})();
const horseGeo=(()=>{const P='#f2ece0',R='#c43a2e',K='#1a1a1a',G='#d9ad48';
  return merged([{g:B0,c:P,p:[0,.62,0],s:[.26,.28,.66]},{g:B0,c:R,p:[0,.78,0],s:[.27,.06,.5]},{g:B0,c:P,p:[0,.92,.36],s:[.14,.36,.14],r:[-.5,0,0]},
    {g:B0,c:P,p:[0,1.1,.5],s:[.15,.15,.3]},{g:B0,c:K,p:[-.08,1.14,.6],s:[.02,.03,.02]},{g:B0,c:K,p:[.08,1.14,.6],s:[.02,.03,.02]},{g:B0,c:R,p:[0,1.2,.3],s:[.04,.16,.2]},
    ...[[-.09,.22],[.09,.22],[-.09,-.22],[.09,-.22]].map(([x,z])=>({g:C0,c:'#7a5a36',p:[x,.25,z],s:[.025,.5,.025]})),{g:cone(.06,.02,.4,5),c:P,p:[0,.7,-.4],r:[-1,0,0]},{g:B0,c:G,p:[0,.62,.34],s:[.28,.08,.02]}])})();
const bambooGeo=(()=>{const G='#4f9a52',D='#2a6a30',L='#7acb6a',K='#0a1a0a';
  return merged([{g:C0,c:G,p:[0,.45,0],s:[.15,.9,.15]},{g:C0,c:D,p:[0,.32,0],s:[.17,.04,.17]},{g:C0,c:D,p:[0,.62,0],s:[.17,.04,.17]},
    {g:S0,c:'#e8f2d0',p:[-.06,.8,.13],s:[.04,.05,.02]},{g:S0,c:'#e8f2d0',p:[.06,.8,.13],s:[.04,.05,.02]},{g:S0,c:K,p:[-.06,.8,.15],s:[.02,.03,.01]},{g:S0,c:K,p:[.06,.8,.15],s:[.02,.03,.01]},
    ...[0,1.2,2.4,3.6,4.8].map(a=>({g:cone(.08,.01,.45,4),c:L,p:[Math.sin(a)*.12,1.05,Math.cos(a)*.12],r:[Math.cos(a)*.7,0,-Math.sin(a)*.7]})),
    {g:cone(.03,.01,.35,4),c:G,p:[-.2,.55,0],r:[0,0,1]},{g:cone(.03,.01,.35,4),c:G,p:[.2,.55,0],r:[0,0,-1]}])})();
const snakeGeo=(()=>{const G='#3a8a5a',Y='#c8d86a',K='#101410';
  return merged([...[0,1,2,3,4,5].map(i=>({g:S0,c:i%2?G:'#2f7a4c',p:[Math.sin(i*1.2)*.12,.12,.45-i*.17],s:[.12-i*.012,.1-i*.01,.13]})),
    {g:S0,c:G,p:[0,.2,.6],s:[.13,.1,.17]},{g:S0,c:Y,p:[-.06,.26,.7],s:[.03,.03,.02]},{g:S0,c:Y,p:[.06,.26,.7],s:[.03,.03,.02]},{g:S0,c:K,p:[-.06,.26,.72],s:[.012,.025,.01]},{g:S0,c:K,p:[.06,.26,.72],s:[.012,.025,.01]},
    {g:B0,c:'#c22',p:[0,.18,.8],s:[.02,.01,.12]}])})();
const skelGeo=(()=>{const B='#e8e2d0',K='#141210';
  return merged([{g:S0,c:B,p:[0,1,0],s:[.13,.14,.13]},{g:S0,c:K,p:[-.05,1.01,.11],s:[.035,.04,.02]},{g:S0,c:K,p:[.05,1.01,.11],s:[.035,.04,.02]},{g:B0,c:B,p:[0,.92,.08],s:[.1,.04,.06]},
    {g:C0,c:B,p:[0,.62,0],s:[.03,.4,.03]},...[0,1,2,3].map(i=>({g:B0,c:B,p:[0,.75-i*.08,.02],s:[.26-i*.03,.025,.12]})),{g:B0,c:B,p:[0,.4,0],s:[.22,.06,.1]},
    {g:C0,c:B,p:[-.17,.62,.12],s:[.02,.36,.02],r:[1,0,.2]},{g:C0,c:B,p:[.17,.62,.12],s:[.02,.36,.02],r:[1,0,-.2]},{g:C0,c:B,p:[-.08,.2,0],s:[.025,.4,.025]},{g:C0,c:B,p:[.08,.2,0],s:[.025,.4,.025]}])})();
const paintGeo=(()=>{const P='#e8dcc0',W='#5a3a22',K='#1a1414',R='#a82a22';
  return merged([{g:B0,c:P,p:[0,.75,0],s:[.62,1.1,.03]},{g:C0,c:W,p:[0,1.32,0],s:[.04,.72,.04],r:[0,0,Math.PI/2]},{g:C0,c:W,p:[0,.18,0],s:[.04,.72,.04],r:[0,0,Math.PI/2]},
    {g:S0,c:K,p:[0,1.02,.02],s:[.09,.1,.01]},{g:cone(.2,.08,.55,8),c:'#3a3a4a',p:[0,.62,.02],s:[1,1,.08]},{g:S0,c:'#f4ece0',p:[0,.95,.025],s:[.065,.07,.01]},
    {g:S0,c:R,p:[0,.9,.03],s:[.015,.01,.005]},{g:B0,c:K,p:[-.025,.97,.03],s:[.02,.005,.005]},{g:B0,c:K,p:[.025,.97,.03],s:[.02,.005,.005]},{g:B0,c:R,p:[.22,.35,.02],s:[.08,.08,.005]}])})();
function addMob(k,def){ET[k]=def;makeET(k)}
// 稻草人: tough and slow; strong ones throw a vine circle that slows you
addMob('scare',{n:'稻草人',geo:scareGeo,cap:70,hp:34,spd:1.15,r:.34,dmg:8,soul:2,sc:.95,glow:.25,mat:{},
  ai:(e,dt,d,ux,uz)=>{if((e.special||e.elite)&&(e.cd2=(e.cd2??3)-dt)<=0&&d<7){e.cd2=4+Math.random()*2;warn(HERO.pos.x,HERO.pos.z,1.3,1,8,()=>{G.slowT=1.8;say('被藤蔓纏住了！',1.5)},0x5aff6a)}}});
// 紙紮馬: gallops in straight lines, pauses, re-aims
addMob('horse',{n:'紙紮馬',geo:horseGeo,cap:60,hp:24,spd:2,r:.34,dmg:9,soul:1,sc:.9,glow:.3,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d,ux,uz)=>{e.gt=(e.gt??Math.random())-dt;if(e.gt<=0){if(e.run){e.run=false;e.gt=.55}else{e.run=true;e.gt=1.2;e.gx=ux;e.gz=uz}}
    return e.run?{v:e.t.spd*(e.special||e.elite?2.8:2.2),x:e.gx,z:e.gz}:{v:.25,x:ux,z:uz}}});
// 竹精: pops out of the ground close to you
addMob('bamboo',{n:'竹精',geo:bambooGeo,cap:80,hp:30,spd:1.9,r:.3,dmg:8,soul:1,sc:.95,glow:.25,mat:{},popNear:1});
// 青蛇: fast and zig-zagging
addMob('snake',{n:'青蛇',geo:snakeGeo,cap:80,hp:22,spd:3,r:.3,dmg:7,soul:1,sc:1,glow:.3,mat:{},
  ai:(e,dt,d,ux,uz)=>{const w=Math.sin(e.ph*4)*.9,c=Math.cos(w),s=Math.sin(w);return {v:e.t.spd*(e.special||e.elite?1.3:1),x:ux*c-uz*s,z:ux*s+uz*c}}});
// 小骷髏: falls apart once and pulls itself back together (unless a skill blew it away)
addMob('skel',{n:'小骷髏',geo:skelGeo,cap:90,hp:30,spd:1.9,r:.3,dmg:8,soul:1,sc:.85,glow:.3,mat:{},revive:1});
// 畫中人: blinks to your side every few seconds
addMob('paint',{n:'畫中人',geo:paintGeo,cap:50,hp:40,spd:1.2,r:.34,dmg:10,soul:2,sc:1,glow:.35,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d)=>{if((e.cd2=(e.cd2??2+Math.random()*3)-dt)<=0&&d>2.5){e.cd2=(e.special||e.elite?2.5:4)+Math.random()*2;fx({p:tmp.set(e.x,.8,e.z),col:0x1a1414,life:.5,s0:.6,s1:1.6,op:.8,vy:.6});
      const a=Math.random()*Math.PI*2;e.x=HERO.pos.x+Math.sin(a)*2.4;e.z=HERO.pos.z+Math.cos(a)*2.4;fx({p:tmp.set(e.x,.8,e.z),col:0x1a1414,life:.5,s0:1.4,s1:.4,op:.8,vy:0})}}});
const foxlingGeo=(()=>{const W='#f4f0ea',R='#c8322a',P='#b46aff';
  return merged([{g:S0,c:W,p:[0,.35,0],s:[.16,.14,.26]},{g:S0,c:W,p:[0,.52,.2],s:[.11,.1,.11]},{g:cone(.05,.01,.13,5),c:W,p:[-.06,.64,.2]},{g:cone(.05,.01,.13,5),c:W,p:[.06,.64,.2]},
    {g:cone(.09,.01,.45,6),c:W,p:[0,.5,-.3],r:[-.9,0,0]},{g:cone(.045,.01,.12,5),c:R,p:[0,.67,-.46],r:[-.9,0,0]},{g:S0,c:P,p:[-.045,.54,.3],s:[.022,.022,.01]},{g:S0,c:P,p:[.045,.54,.3],s:[.022,.022,.01]}])})();
// 狐影: the fox's little shadow-copies, fast and fragile
addMob('foxling',{n:'狐影',geo:foxlingGeo,cap:40,hp:18,spd:3.1,r:.28,dmg:7,soul:1,sc:1.25,glow:.5,float:1,mat:{transparent:true,opacity:.82}});
/* ---------- 魔王 ---------- */
const BOSSES={
  lantern:{name:'燈籠大王',line:'燈籠大王：「誰敢在子時點燈——！」',rage:'燈籠大王：「你惹火我了——！」',tip:'是燈籠大王！它的火球會先畫紅圈，快躲開！',r:1.15,dmg:16,spd:1.7,bob:1.4,
    build(g){const faceT=ctex(512,256,(x,w,h)=>{x.fillStyle='#ffb257';x.fillRect(0,0,w,h);x.strokeStyle='rgba(140,50,10,.5)';x.lineWidth=4;for(let i=0;i<16;i++){x.beginPath();x.moveTo(i*w/16,0);x.lineTo(i*w/16,h);x.stroke()}
        const cx=w*.25;x.fillStyle='#2a0904';[-1,1].forEach(d=>{x.beginPath();x.moveTo(cx+d*18,92);x.lineTo(cx+d*58,74);x.lineTo(cx+d*50,112);x.closePath();x.fill()});
        x.beginPath();x.moveTo(cx-60,150);x.quadraticCurveTo(cx,215,cx+60,150);x.quadraticCurveTo(cx,175,cx-60,150);x.fill();
        x.fillStyle='#fff3d0';for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(cx+i*20-7,156+Math.abs(i)*-3);x.lineTo(cx+i*20+7,156+Math.abs(i)*-3);x.lineTo(cx+i*20,176);x.fill()}
        x.fillStyle='#c42a20';x.font='bold 90px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('王',w*.75,h*.5)});
      const body=part(new THREE.LatheGeometry(lanternPts,28),new THREE.MeshStandardMaterial({map:faceT,emissive:LC(0x9a3a0a),emissiveIntensity:.8,roughness:.6}),g,{s:[3.4,3.4,3.4],p:[0,2.1,0]});body.rotation.y=-Math.PI/2;
      part(new THREE.CylinderGeometry(.44,.5,.22,16),toon(0x24160f),g,{p:[0,3.25,0]});part(new THREE.CylinderGeometry(.5,.44,.22,16),toon(0x24160f),g,{p:[0,.95,0]});
      [-1,1].forEach(d=>part(new THREE.ConeGeometry(.16,.7,8),toon(0x24160f),g,{p:[d*.45,3.6,0],r:[0,0,-d*.4]}));
      const L=new THREE.PointLight(0xff8a3a,2.4,12,1.4);L.position.y=2.1;g.add(L);const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xff9a4a,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.set(6,6,1);gl.position.y=2.1;g.add(gl);
      return {body,L,spin:b=>{body.rotation.y=-Math.PI/2+Math.sin(b.t*2)*.1;if(b.rage)body.scale.setScalar(3.4*(1+Math.sin(b.t*10)*.03))}}},
    act(b,dt){b.cd-=dt;if(b.cd<=0){b.cd=Math.max(b.rage?1.2:1.8,(b.rage?2.2:3.2)-minute()*.12);const n=3+Math.floor(Math.random()*3);
        for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,r=i===0?0:1.2+Math.random()*2.8;warn(HERO.pos.x+Math.sin(a)*r+HERO.vel.x*.5,HERO.pos.z+Math.cos(a)*r+HERO.vel.z*.5,1.1,1.25,14)}}
      if(b.rage){b.ring-=dt;if(b.ring<=0){b.ring=5;for(let j=0;j<10;j++){const a=j/10*Math.PI*2+b.t;enemyShot(b.x,1.2,b.z,Math.sin(a),Math.cos(a),3,14)}}}
      b.sum-=dt;if(b.sum<=0){b.sum=6;for(let i=0;i<6;i++){const a=i/6*Math.PI*2;spawn('ghost',b.x+Math.sin(a)*1.8,b.z+Math.cos(a)*1.8)}}}},
  general:{name:'紙紮將軍',line:'紙紮將軍：「陰兵借道，生人迴避！」',rage:'紙紮將軍：「三軍聽令——殺！」',tip:'紙紮將軍的長槍會先畫出紅色扇形，跑出去！',r:1.1,dmg:18,spd:1.5,bob:0,
    build(g){const R=toon(0xb8322a,{emissive:0x3a0a06}),Y=toon(0xd9ad48,{emissive:0x3a2a08}),P=toon(0xf2ece0,{emissive:0x2a2620}),K=toon(0x1a1a1a),Wd=toon(0x6a4a2a);
      const faceT=ctex(128,128,(x,w,h)=>{x.fillStyle='#f4ece0';x.fillRect(0,0,w,h);x.fillStyle='#111';x.fillRect(30,50,22,6);x.fillRect(76,50,22,6);x.fillStyle='#d22';x.beginPath();x.arc(36,78,10,0,7);x.arc(92,78,10,0,7);x.fill();x.fillRect(54,94,20,6)});
      const s=1.8;const body=new THREE.Group();body.scale.setScalar(s);g.add(body);
      part(B0,R,body,{p:[0,.95,0],s:[.5,.6,.28]});part(B0,Y,body,{p:[0,1.12,.15],s:[.42,.12,.02]});[-1,1].forEach(d=>{part(B0,Y,body,{p:[d*.32,1.22,0],s:[.22,.08,.3]});part(B0,K,body,{p:[d*.12,.4,0],s:[.14,.5,.16]})});
      part(B0,R,body,{p:[0,.6,0],s:[.56,.2,.32]});const head=part(new THREE.BoxGeometry(.3,.32,.26),new THREE.MeshStandardMaterial({map:faceT,roughness:.8}),body,{p:[0,1.48,0]});
      part(new THREE.ConeGeometry(.22,.3,4),K,body,{p:[0,1.75,0],r:[0,Math.PI/4,0]});part(new THREE.ConeGeometry(.04,.4,6),R,body,{p:[0,2.05,-.05],r:[-.4,0,0]});
      const arm=new THREE.Group();arm.position.set(.36,1.15,0);body.add(arm);part(B0,R,arm,{p:[0,-.2,0],s:[.12,.4,.12]});
      part(new THREE.CylinderGeometry(.02,.02,2.2,6),Wd,arm,{p:[0,-.35,.6],r:[Math.PI/2,0,0]});part(new THREE.ConeGeometry(.06,.3,4),Y,arm,{p:[0,-.35,1.8],r:[Math.PI/2,0,0]});part(new THREE.SphereGeometry(.07,6,5),R,arm,{p:[0,-.35,1.6]});
      return {body,arm,spin:b=>{arm.rotation.y=b.swing>0?Math.sin((1-b.swing/.5)*Math.PI)*1.6-.8:Math.sin(b.t*1.3)*.15}}},
    act(b,dt){b.swing=Math.max(0,(b.swing||0)-dt);b.cd-=dt;const a0=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z);
      if(b.cd<=0){b.k=(b.k||0)+1;
        if(b.k%3===1){b.cd=b.rage?2:2.8;warnFan(b.x,b.z,a0,2.2,4.8,1,18);act(.7,null,()=>{b.swing=.5})}
        else if(b.k%3===2){b.cd=b.rage?2.2:3.2;const n=b.rage?3:1;for(let j=0;j<n;j++){const a=a0+(j-(n-1)/2)*.35;warnLine(b.x,b.z,a,9,1.1,1+j*.15,16)}}
        else{b.cd=2.5;const fx0=Math.sin(a0),fz0=Math.cos(a0);for(let i=-1;i<=1;i++)for(let j=1;j<=3;j++)spawn('paper',b.x+fx0*j*1.1+fz0*i*1.1,b.z+fz0*j*1.1-fx0*i*1.1);banner('紙兵列陣','',false)}}}},
  fox:{name:'九尾狐',line:'九尾狐：「小道士，陪姐姐玩一會兒～」',rage:'九尾狐：「九尾齊開！」',tip:'九尾狐的紫色光環碰到會讓搖桿反向！從缺口鑽過去。',r:1,dmg:14,spd:2.2,bob:0,keep:4.5,
    build(g){const W=toon(0xf4f0ea,{emissive:0x3a3430}),R=toon(0xc8322a,{emissive:0x3a0806}),K=toon(0x141414),E=new THREE.MeshBasicMaterial({color:0xffd23a});
      const body=new THREE.Group();body.scale.setScalar(1.7);g.add(body);part(new THREE.SphereGeometry(.4,16,12),W,body,{p:[0,.7,0],s:[.8,.75,1.3]});
      [-1,1].forEach(d=>{part(C0,W,body,{p:[d*.15,.32,.3],s:[.06,.4,.06]});part(C0,W,body,{p:[d*.15,.32,-.3],s:[.06,.4,.06]})});
      part(new THREE.SphereGeometry(.24,14,10),W,body,{p:[0,1.05,.5]});part(new THREE.ConeGeometry(.12,.3,8),W,body,{p:[0,1,.78],r:[Math.PI/2,0,0]});part(new THREE.SphereGeometry(.03,6,5),K,body,{p:[0,1,.93]});
      [-1,1].forEach(d=>{part(new THREE.ConeGeometry(.08,.24,6),W,body,{p:[d*.13,1.3,.45],r:[0,0,-d*.2]});part(new THREE.SphereGeometry(.04,6,5),E,body,{p:[d*.09,1.1,.7]});part(B0,R,body,{p:[d*.1,1.18,.68],s:[.08,.02,.02],r:[0,0,d*.4]})});
      const tails=[];for(let i=0;i<9;i++){const t=new THREE.Group();t.position.set(0,.8,-.45);body.add(t);part(new THREE.ConeGeometry(.12,1.1,8),W,t,{p:[0,.5,0]});part(new THREE.ConeGeometry(.07,.25,6),R,t,{p:[0,1.02,0]});tails.push(t)}
      return {body,spin:b=>tails.forEach((t,i)=>{const a=(i-4)/4;t.rotation.set(-.9+Math.sin(b.t*2+i)*.12,0,a*1.1+Math.sin(b.t*1.6+i*.7)*.15)})}},
    act(b,dt){b.cd-=dt;if(b.cd<=0){b.k=(b.k||0)+1;
        if(b.k%2){b.cd=b.rage?2:2.8;const n=b.rage?9:4;for(let j=0;j<n;j++){const a=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z)+(j-(n-1)/2)*.4;enemyShot(b.x,1.4,b.z,Math.sin(a),Math.cos(a),3.2,12,0xb46aff,1.6)}}
        else{b.cd=b.rage?2.6:3.6;const gap=Math.random()*Math.PI*2;wave(b.x,b.z,4.2,11,gap,1,10,0xc07cff,()=>{G.charm=2;say('被魅惑了！方向反過來了！',2)});if(b.rage)act(.9,null,()=>{if(boss.alive)wave(b.x,b.z,4.2,11,gap+Math.PI,1,10,0xc07cff,()=>{G.charm=2})})}}
      b.sum-=dt;if(b.sum<=0){b.sum=b.rage?6:8;for(let i=0;i<(b.rage?5:3);i++){const a=i/5*Math.PI*2+b.t;spawn('foxling',b.x+Math.sin(a)*1.6,b.z+Math.cos(a)*1.6)}if(!simming)fx({p:tmp.set(b.x,1.2,b.z),col:0xc07cff,add:true,life:.6,s0:1.5,s1:5,op:.9,vy:0})}}},
  bell:{name:'古鐘精',line:'古鐘精：「噹——！聽鐘聲，入長眠……」',rage:'古鐘精：「百八鐘響！」',tip:'鐘聲的金色衝擊波會留一個缺口，從缺口鑽過去！',r:1.3,dmg:18,spd:1.2,bob:1,
    build(g){const Br=toon(0x8a6a2a,{emissive:0x2a1a06,roughness:.35,metalness:.6}),K=toon(0x1a1410);
      const faceT=ctex(256,128,(x,w,h)=>{x.fillStyle='#8a6a2a';x.fillRect(0,0,w,h);x.fillStyle='#1a0e04';const cx=w*.25;[-1,1].forEach(d=>{x.beginPath();x.ellipse(cx+d*22,52,12,8,0,0,7);x.fill()});x.beginPath();x.ellipse(cx,88,26,10,0,0,7);x.fill();
        x.strokeStyle='#c8a050';x.lineWidth=3;for(let i=0;i<6;i++){x.beginPath();x.arc(w*.75,64,10+i*8,0,7);x.stroke()}});
      const body=part(new THREE.LatheGeometry(V2([[0,0],[1.15,0],[1.05,.3],[.85,1.3],[.7,2],[.5,2.3],[0,2.4]]),28),new THREE.MeshStandardMaterial({map:faceT,roughness:.4,metalness:.5,emissive:LC(0x2a1a06)}),g,{p:[0,.6,0]});body.rotation.y=-Math.PI/2;
      part(new THREE.TorusGeometry(.25,.07,8,16),K,g,{p:[0,3.1,0]});const L=new THREE.PointLight(0xffc860,1.6,10,1.4);L.position.y=1.6;g.add(L);
      return {body,L,spin:b=>{body.rotation.z=Math.sin(b.t*3)*(b.ring>0?.12:.04)}}},
    act(b,dt){b.ring=Math.max(0,(b.ring||0)-dt);b.cd-=dt;if(b.cd<=0){b.k=(b.k||0)+1;
        if(b.k%3!==0){b.cd=b.rage?1.9:2.8;b.ring=.8;SFX.play('bell');const gap=Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z)+(Math.random()-.5)*2.6;wave(b.x,b.z,5,13,gap,.9,15,0xffc860,()=>{G.slowT=1})}
        else{b.cd=2.6;const x=HERO.pos.x+HERO.vel.x*.4,z=HERO.pos.z+HERO.vel.z*.4;warn(x,z,1.5,1.1,16,()=>{G.rootT=1.4;say('被大鐘扣住了！',1.4)},0xffb35a);
          if(b.rage)for(let i=0;i<3;i++){const a=i/3*Math.PI*2;warn(x+Math.sin(a)*3,z+Math.cos(a)*3,1.3,1.4,14,null,0xffb35a)}}}
      b.sum-=dt;if(b.sum<=0){b.sum=7;for(let i=0;i<6;i++){const a=i/6*Math.PI*2;spawn('skel',b.x+Math.sin(a)*2,b.z+Math.cos(a)*2)}}}}};
/* ---------- 章節設定 ---------- */
const CHC={
  0:{map:0,fog:FOGHEX,ground:0xffffff,mobs:[['ghost',3,0],['paper',2.2,.8],['jiang',1.4,2.8],['lgh',1.2,4.5]],elite:'lgh',boss:'lantern'},
  1:{map:1,fog:0x2a3226,ground:0xc8b890,mobs:[['ghost',2,0],['paper',1.6,0],['scare',2,.5],['horse',1.8,2],['jiang',1,4]],elite:'scare',boss:'general'},
  2:{map:2,fog:0x1c3226,ground:0x8ab890,mobs:[['bamboo',2.4,0],['snake',2.2,.5],['ghost',1.4,0],['lgh',1,3.5],['horse',.8,5]],elite:'snake',boss:'fox'},
  3:{map:3,fog:0x262634,ground:0xb0a8b8,mobs:[['skel',2.6,0],['paint',1.6,1],['ghost',1.4,0],['jiang',1.2,2.5],['lgh',1,4]],elite:'paint',boss:'bell'}};
/* ---------- 開場劇情 ---------- */
Object.assign(INK.scenes,{
  field:(x,I)=>{I.paper(x);I.moon(x,640,70,30);I.wash(x,220,50,.3,1.2);for(let i=0;i<7;i++){const px=80+i*105,py=250+(i%2)*20;x.fillStyle='rgba(20,18,16,.9)';x.fillRect(px-2,py-60,4,60);x.fillRect(px-26,py-46,52,4);x.beginPath();x.arc(px,py-66,9,0,7);x.fill();x.beginPath();x.moveTo(px-18,py-70);x.lineTo(px+18,py-70);x.lineTo(px,py-84);x.fill()}
    I.wash(x,320,12,.8,2.6);I.seal(x,'荒')},
  general:(x,I)=>{I.paper(x);I.wash(x,230,60,.35,1.9);I.ghosts(x,4);I.figure(x,560,330,2.2,{sword:1,col:'rgba(150,30,24,.92)'});I.seal(x,'將')},
  bamboo:(x,I)=>{I.paper(x);for(let i=0;i<34;i++){const px=Math.random()*800,w=4+Math.random()*7,a=.25+Math.random()*.6;x.fillStyle=`rgba(30,50,34,${a})`;x.fillRect(px,0,w,360);for(let j=40;j<360;j+=50+Math.random()*30)x.fillRect(px-2,j,w+4,3)}
    I.moon(x,120,70,26);I.seal(x,'竹')},
  fox:(x,I)=>{I.paper(x);I.moon(x,400,90,60,'rgba(255,240,230,.9)');x.fillStyle='rgba(20,18,16,.92)';x.beginPath();x.ellipse(400,250,70,40,0,0,7);x.fill();x.beginPath();x.arc(460,205,26,0,7);x.fill();
    x.beginPath();x.moveTo(450,185);x.lineTo(458,160);x.lineTo(468,184);x.fill();x.beginPath();x.moveTo(470,186);x.lineTo(482,164);x.lineTo(486,192);x.fill();
    for(let i=0;i<9;i++){const a=-Math.PI*.9+i*.12;x.beginPath();x.moveTo(340,240);x.quadraticCurveTo(340+Math.cos(a)*120,240+Math.sin(a)*120,340+Math.cos(a)*190,240+Math.sin(a)*170);x.lineWidth=14-i*.6;x.strokeStyle='rgba(20,18,16,.85)';x.stroke()}I.seal(x,'狐')},
  temple:(x,I)=>{I.paper(x);I.moon(x,660,70,28);I.wash(x,230,60,.35,1.4);x.fillStyle='rgba(20,18,16,.92)';for(let i=0;i<5;i++){const w=110-i*18,y=300-i*42;x.fillRect(200-w/2,y-30,w,30);x.beginPath();x.moveTo(200-w*.7,y-26);x.quadraticCurveTo(200,y-50,200+w*.7,y-26);x.fill()}
    x.fillRect(480,230,180,70);x.beginPath();x.moveTo(450,236);x.quadraticCurveTo(570,180,690,236);x.fill();I.seal(x,'寺')},
  bell:(x,I)=>{I.paper(x);I.wash(x,250,40,.3,2.2);x.fillStyle='rgba(120,90,40,.92)';x.beginPath();x.moveTo(330,300);x.quadraticCurveTo(320,150,400,120);x.quadraticCurveTo(480,150,470,300);x.closePath();x.fill();
    x.strokeStyle='rgba(20,18,16,.8)';x.lineWidth=3;for(let i=0;i<4;i++){x.beginPath();x.arc(400,330,90+i*40,Math.PI*1.1,Math.PI*1.9);x.stroke()}I.figure(x,640,330,1,{});I.seal(x,'鐘')},
  tribulation:(x,I)=>{const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'#2a2438');g.addColorStop(1,'#5a5068');x.fillStyle=g;x.fillRect(0,0,800,360);I.wash(x,280,60,.6,1.1);
    x.strokeStyle='rgba(220,200,255,.95)';x.lineWidth=4;for(let k=0;k<3;k++){let px=300+k*120,py=0;x.beginPath();x.moveTo(px,py);while(py<250){px+=(Math.random()-.5)*50;py+=30;x.lineTo(px,py)}x.stroke()}
    I.figure(x,420,300,1.2,{col:'rgba(10,8,12,.95)'});I.seal(x,'劫')}});
Object.assign(CUTS,{
  ch1:[{scene:'field',t:'第一章・荒村夜。田裡的稻草人一個個轉過頭來，看著你。'},{scene:'general',t:'遠處傳來鑼鼓聲——「陰兵借道，生人迴避！」紙紮將軍帶著紙兵來了。'}],
  ch2:[{scene:'bamboo',t:'第二章・竹林小徑。竹子底下有東西在動，草叢裡沙沙作響。'},{scene:'fox',t:'月亮底下，一隻九條尾巴的白狐笑著：「小道士，好久沒人陪我玩了～」'}],
  ch3:[{scene:'temple',t:'第三章・古寺。寺裡沒有和尚，只有一口沒人敲卻自己會響的大鐘。'},{scene:'bell',t:'噹——鐘聲一響，畫裡的人走了出來，骨頭一根根爬了起來。'}],
  ch3end:[{scene:'tribulation',t:'鎮魂燈亮起第三盞。你體內的靈氣翻湧——是築基的時候了。'},{scene:'tribulation',t:'集齊築基丹，在靜室打坐、或在戰場上引雷劫，就能踏入築基。'}]});
/* ---------- 新大絕 ---------- */
// 三昧真火: a fan of fire that rolls outward and keeps burning what it touched
function fireCast(A){const S=SK.ult,ang=S.ang,R=S.range(),a0=Math.atan2(A.dir[0],A.dir[1]),hx=HERO.pos.x,hz=HERO.pos.z,dmg=swordDmg()*50;
  G.slow=.4;shake=Math.max(shake,.4);SFX.play('ult');buzz(50);const u=$('#ultFx');u.classList.remove('on');void u.offsetWidth;u.classList.add('on');banner('三昧真火','大絕',true);
  const m=new THREE.Mesh(fanGeo(ang),new THREE.MeshBasicMaterial({color:0xff6a1a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.set(hx,.06,hz);m.rotation.y=a0;scene.add(m);let hit=false;
  act(2.2,(t)=>{const k=Math.min(1,t/.5);m.scale.setScalar(R*k);m.material.opacity=t<1.6?.55+.15*Math.sin(t*20):Math.max(0,.6*(1-(t-1.6)/.6));
      if(Math.random()<.7){const a=a0+(Math.random()-.5)*ang,r=Math.random()*R*k;fx({p:tmp.set(hx+Math.sin(a)*r,.4,hz+Math.cos(a)*r),col:Math.random()<.5?0xff8a2a:0xffd060,add:true,life:.6,s0:1.2,s1:.3,op:1,vy:2})}
      if(!hit&&t>=.3){hit=true;for(const e of enemies){if(e.dead)continue;const dx=e.x-hx,dz=e.z-hz,d=Math.hypot(dx,dz);if(d<R+e.r&&Math.abs(angDiff(Math.atan2(dx,dz),a0))<=ang/2+.1){e.burn=3.5;e.burnD=dmg*.15;hurtEnemy(e,dmg,dx/(d||1)*1.2,dz/(d||1)*1.2,false,4)}}
        if(boss.alive){const dx=boss.x-hx,dz=boss.z-hz,d=Math.hypot(dx,dz);if(d<R+boss.r&&Math.abs(angDiff(Math.atan2(dx,dz),a0))<=ang/2+.3){const room=boss.max*.22;boss.allow+=Math.min(room,dmg*3);hurtBoss(Math.min(room,dmg*3),true)}}}},
    ()=>{scene.remove(m);m.material.dispose()})}
// 九天神雷: a huge circle of purple-gold thunder, everything inside stunned (the boss too, briefly)
const thForm=(()=>{const t=ctex(512,512,x=>{x.translate(256,256);x.strokeStyle=x.fillStyle='#d8b0ff';x.lineWidth=7;x.beginPath();x.arc(0,0,244,0,7);x.stroke();x.lineWidth=3;x.beginPath();x.arc(0,0,196,0,7);x.stroke();
    for(let i=0;i<8;i++){x.save();x.rotate(i/8*Math.PI*2);for(let j=0;j<3;j++){const bro=(i>>j)&1;if(bro){x.fillRect(-16,-168+j*16,12,8);x.fillRect(4,-168+j*16,12,8)}else x.fillRect(-16,-168+j*16,32,8)}x.restore()}
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;x.beginPath();let px=Math.cos(a)*60,py=Math.sin(a)*60;x.moveTo(px,py);for(let k=1;k<5;k++){const rr=60+k*24,aa=a+(k%2?.08:-.08);x.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr)}x.stroke()}
    x.font='bold 96px serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ffe08a';x.fillText('雷',0,6)});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(2,2).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:t,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));m.visible=false;m.renderOrder=4;scene.add(m);return m})();
function thunder9Cast(A){const [x,z]=A.pt,r=SK.ult.r(),dmg=swordDmg()*9;G.ultBoss=0;
  G.slow=.5;shake=Math.max(shake,.5);SFX.play('ult');buzz(60);const u=$('#ultFx');u.classList.remove('on');void u.offsetWidth;u.classList.add('on');banner('九天神雷','大絕',true);
  thForm.visible=true;thForm.position.set(x,.08,z);thForm.scale.setScalar(r);for(const e of enemies)if(!e.dead&&(e.x-x)**2+(e.z-z)**2<r*r)e.stun=2.5;if(boss.alive&&(boss.x-x)**2+(boss.z-z)**2<(r+boss.r)**2)boss.stun=1.5;
  let n=0,big=false;act(2.2,(t,dt)=>{thForm.rotation.y-=dt;thForm.material.opacity=Math.min(1,t/.2)*(t>1.8?Math.max(0,1-(t-1.8)/.4):1);
      while(n<26&&t>=.2+n*.05){const a=Math.random()*Math.PI*2,rr=Math.sqrt(Math.random())*r;boltAt(x+Math.sin(a)*rr,z+Math.cos(a)*rr,dmg,1.5,n%2?0xd8b0ff:0xffe08a,.08);if(n%4===0)SFX.play('thunder');n++}
      if(!big&&t>=1.65){big=true;boltAt(x,z,0,0,0xffe8b0,.45,16);ultHit(x,z,r,dmg*4);shake=Math.max(shake,1);SFX.play('bossDie')}},
    ()=>{thForm.visible=false})}
/* ---------- 大絕表（藏經閣選哪個，右下角就是哪個） ---------- */
const ULT_DEF={wan:{n:'萬劍歸宗',ic:'萬',col:0xffd86a,shape:'circle',ult:1,r:()=>3.8,range:()=>8,cast:A=>ultCast(A.pt)},
  fire:{n:'三昧真火',ic:'火',col:0xff7a2a,shape:'fan',ult:1,ang:1.7,range:()=>6.5,cast:fireCast},
  thunder9:{n:'九天神雷',ic:'霆',col:0xc89aff,shape:'circle',ult:1,r:()=>5.5,range:()=>9,cast:thunder9Cast}};
SK.ult=ULT_DEF.wan;
function setUlt(k){const U=ULT_DEF[k]||ULT_DEF.wan;SK.ult=U;const b=skBtn.ult;b.querySelector('.ic').textContent=U.ic;b.querySelector('em').textContent=U.n;b.setAttribute('aria-label',U.n)}
buildMap(0);
