/* ================= 第 9～10 章：元嬰鬥法（九霄魔域、渡劫長征）＋元嬰技能組＋元嬰出竅 =================
   鬥法魔王有三層命：護體靈光（盾）→ 肉身（血）→ 元嬰（肉身毀了會出竅逃跑，要追上斬殺）。
   招式：預警紅圈／扇形／直線、瞬移閃身、領域大招（找安全角落）、法寶對撞（狂點畫面拼法力）。 */
function duelMap(stone,glow,col,sky){pave.visible=false;const M=new THREE.MeshBasicMaterial({color:glow,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
  const rg=new THREE.Mesh(new THREE.RingGeometry(ARENA-2.2,ARENA-1.7,64).rotateX(-Math.PI/2),M);rg.position.y=.04;mapG.add(rg);
  const r2=new THREE.Mesh(new THREE.RingGeometry(5.6,6,48).rotateX(-Math.PI/2),M);r2.position.y=.04;mapG.add(r2);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,p=new THREE.Mesh(new THREE.CylinderGeometry(.6,.8,5+rnd()*2.5,6),toon(stone));p.position.set(Math.sin(a)*(ARENA+1),2.6,Math.cos(a)*(ARENA+1));mapG.add(p);
    const t=new THREE.Mesh(new THREE.SphereGeometry(.4,8,6),new THREE.MeshBasicMaterial({color:glow}));t.position.set(p.position.x,5.6,p.position.z);mapG.add(t)}
  for(let i=0;i<6;i++){const rk=new THREE.Mesh(new THREE.DodecahedronGeometry(1.2+rnd()*2,0),toon(stone));const a=rnd()*6.28,r=ARENA+6+rnd()*14;rk.position.set(Math.sin(a)*r,-2-rnd()*3,Math.cos(a)*r);mapG.add(rk)}}
function runeTex(col){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.translate(256,256);x.strokeStyle=col;x.lineCap='round';
  [240,200,120].forEach((r,i)=>{x.lineWidth=i===1?3:6;x.beginPath();x.arc(0,0,r,0,7);x.stroke()});
  for(let i=0;i<8;i++){x.save();x.rotate(i/8*Math.PI*2);for(let k=0;k<3;k++){const brk=(i>>k)&1;x.lineWidth=10;x.beginPath();if(brk){x.moveTo(-34,-150-k*18);x.lineTo(-6,-150-k*18);x.moveTo(6,-150-k*18);x.lineTo(34,-150-k*18)}else{x.moveTo(-34,-150-k*18);x.lineTo(34,-150-k*18)}x.stroke()}x.restore()}
  x.lineWidth=5;x.beginPath();x.arc(0,0,60,0,7);x.stroke();x.beginPath();x.arc(0,-30,30,-Math.PI/2,Math.PI/2);x.arc(0,30,30,-Math.PI/2,Math.PI/2,true);x.stroke();
  const t=new THREE.CanvasTexture(c);return t}
function duelDecor(stone,glow,red){
  const rune=new THREE.Mesh(new THREE.PlaneGeometry(16,16).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:runeTex(red?'#ff6a5a':'#c8a8ff'),transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));rune.position.y=.03;mapG.add(rune);mapG.userData.rune=rune;
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=ARENA-3.2,g=new THREE.Group();g.position.set(Math.sin(a)*r,0,Math.cos(a)*r);mapG.add(g);
    part(new THREE.CylinderGeometry(.14,.2,.7,6),toon(stone),g,{p:[0,.35,0]});part(new THREE.BoxGeometry(.42,.32,.42),toon(stone),g,{p:[0,.86,0]});
    part(new THREE.BoxGeometry(.26,.2,.26),new THREE.MeshBasicMaterial({color:glow}),g,{p:[0,.86,0]});part(new THREE.ConeGeometry(.34,.26,4),toon(stone),g,{p:[0,1.15,0],r:[0,Math.PI/4,0]})}
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.4,r=12+rnd()*4,h=1.2+rnd()*2.2,x=Math.sin(a)*r,z=Math.cos(a)*r;const p=new THREE.Mesh(new THREE.CylinderGeometry(.55,.7,h,7),toon(stone));p.position.set(x,h/2,z);p.rotation.z=(rnd()-.5)*.25;mapG.add(p);
    const top=new THREE.Mesh(new THREE.DodecahedronGeometry(.5,0),toon(stone));top.position.set(x+.7,.3,z+.4);mapG.add(top);HOUSES.push({x,z,r:.8})}
  for(let i=0;i<10;i++){const a=rnd()*6.28,r=ARENA+4+rnd()*10,isl=new THREE.Group();isl.position.set(Math.sin(a)*r,-1.5+rnd()*4,Math.cos(a)*r);mapG.add(isl);
    part(new THREE.ConeGeometry(1.4+rnd(),2.4+rnd()*2,6),toon(stone),isl,{r:[Math.PI,0,0]});part(new THREE.CylinderGeometry(1.5,1.5,.35,6),toon(red?0x4a2a2a:0x4a4a3a),isl,{p:[0,1.3,0]})}
  if(red){const gate=new THREE.Group();gate.position.set(0,0,-ARENA-6);mapG.add(gate);const D=toon(0x1a0a0e);[-3.4,3.4].forEach(x=>part(new THREE.BoxGeometry(1,10,1),D,gate,{p:[x,5,0]}));part(new THREE.BoxGeometry(9,1,1.4),D,gate,{p:[0,10,0]});
    const v=new THREE.Mesh(new THREE.PlaneGeometry(5.8,9),new THREE.MeshBasicMaterial({color:0xff4a3a,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));v.position.set(0,4.8,0);gate.add(v)}}
MAPS[9]=()=>{duelMap(0x3a3050,0xb784ff);duelDecor(0x4a4060,0xd8b8ff,false)};MAPS[10]=()=>{duelMap(0x3a1a22,0xff5a4a);duelDecor(0x4a2a30,0xff8a6a,true)};
// ---------- 招式庫 ----------
const aimA=b=>Math.atan2(HERO.pos.x-b.x,HERO.pos.z-b.z);
function tele(b,x,z){fx({p:tmp.set(b.x,1.2,b.z),col:b.def&&b.def.col||0xc8b8ff,add:true,life:.5,s0:1,s1:3,op:.9,vy:0});const r=Math.hypot(x,z);if(r>ARENA-2){x*=(ARENA-2)/r;z*=(ARENA-2)/r}b.x=x;b.z=z;fx({p:tmp.set(x,1.2,z),col:0xffffff,add:true,life:.4,s0:1,s1:2.5,op:.8,vy:0})}
function domain(b,name){const sa=Math.random()*6.28,sx=Math.sin(sa)*ARENA*.6,sz=Math.cos(sa)*ARENA*.6;banner(`${b.def.name}・領域`,'全場紅圈，快跑到安全的角落！',true);shake=Math.max(shake,.4);
  for(let x=-17;x<=17;x+=4)for(let z=-17;z<=17;z+=4){if(x*x+z*z>19*19)continue;if((x-sx)**2+(z-sz)**2<4.6*4.6)continue;warn(x,z,2.9,2.6,b.dmg*.9,null,b.def.col||0xff3b2a)}
  const m=new THREE.Mesh(new THREE.RingGeometry(1.4,1.9,32).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x7fff9a,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.set(sx,.12,sz);scene.add(m);act(3,t=>{m.scale.setScalar(1+.15*Math.sin(t*8))},()=>{scene.remove(m);m.material.dispose()})}
function clash(b){if(G.clash)return;G.clash={t:3,n:0,need:16};let el=$('#clashBox');if(!el){el=document.createElement('div');el.id='clashBox';el.style.cssText='position:fixed;left:50%;top:34%;transform:translate(-50%,-50%);z-index:30;text-align:center;pointer-events:none;color:#ffe9a0;font:900 26px/1.3 system-ui;text-shadow:0 0 12px #e8a830,0 2px 4px #000';document.body.appendChild(el)}
  el.style.display='block';banner('法寶對撞！','狂點畫面，拼法力！',true);const C=G.clash;
  act(3,t=>{if(!G||G.over){el.style.display='none';return}el.innerHTML=`狂點畫面！<br><span style="display:inline-block;width:200px;height:12px;border:2px solid #ffe9a0;border-radius:9px;overflow:hidden;vertical-align:middle"><i style="display:block;height:100%;width:${Math.min(100,C.n/C.need*100)}%;background:linear-gradient(90deg,#ff8a2a,#ffe9a0)"></i></span>`;b.stun=Math.max(b.stun||0,.2)},
    ()=>{el.style.display='none';if(!G||G.over){return}G.clash=null;if(C.n>=C.need){banner('法寶對撞・你贏了！','',true);SFX.play('bossDie');shake=.8;b.stun=2.5;b.allow=Math.max(b.allow,b.max*.08);hurtBoss(b.max*.07,true)}else{banner('法力不如人……','',true);hurtHero(b.dmg*.8,0,0,'法寶對撞')}})}
document.addEventListener('pointerdown',()=>{if(window.__clashHit)window.__clashHit()});window.__clashHit=()=>{if(G&&G.clash)G.clash.n++};
const AT={
  fan:(b,n=1)=>{const a0=aimA(b);for(let i=0;i<n;i++)warnFan(b.x,b.z,a0+(i-(n-1)/2)*.9,1.1,7.5,.9,b.dmg*.7)},
  lines:(b,n=3)=>{const a0=aimA(b);for(let i=0;i<n;i++)warnLine(b.x,b.z,a0+(i-(n-1)/2)*.42,18,1.7,1,b.dmg*.7)},
  rain:(b,n=8)=>{for(let i=0;i<n;i++){const x=HERO.pos.x+(Math.random()-.5)*10,z=HERO.pos.z+(Math.random()-.5)*10;warn(x,z,1.5,.9+i*.12,b.dmg*.6,null,b.def.col||0xff3b2a);act(.9+i*.12,null,()=>{if(G&&!G.over)boltAt(x,z,0,0,b.def.col||0xd8c8ff,.08,12)})}},
  ring:b=>wave(b.x,b.z,5.2,15,Math.random()*6.28,1.15,b.dmg*.6,b.def.col||0xb784ff),
  slam:(b,r=5)=>{warn(b.x,b.z,r,1.1,b.dmg*.8,null,0xffa02a);shake=Math.max(shake,.15)},
  dash:b=>{const a0=aimA(b);b.dx=Math.sin(a0);b.dz=Math.cos(a0);warnLine(b.x,b.z,a0,15,2.2,.9,b.dmg*.8);act(.9,null,()=>{b.dash=.8})},
  blink:b=>{const a=Math.random()*6.28;tele(b,HERO.pos.x+Math.sin(a)*4,HERO.pos.z+Math.cos(a)*4);act(.15,null,()=>AT.fan(b,1))},
  shots:(b,n=5,spd=3.6)=>{const a0=aimA(b);for(let j=0;j<n;j++){const a=a0+(j-(n-1)/2)*.3;enemyShot(b.x,1.2,b.z,Math.sin(a),Math.cos(a),spd,b.dmg*.35,b.def.col||0xb784ff)}},
  homing:(b,n=3)=>{for(let j=0;j<n;j++){const a=Math.random()*6.28;enemyShot(b.x,1.4,b.z,Math.sin(a),Math.cos(a),2.6,b.dmg*.4,b.def.col||0xb784ff,true)}},
  summon:(b,k,n=4)=>{for(let i=0;i<n;i++){const a=i/n*6.28;spawn(k,b.x+Math.sin(a)*2.5,b.z+Math.cos(a)*2.5)}}};
function duelAct(moves,cd,sum){return (b,dt)=>{if(b.dash>0){b.dash-=dt;b.x+=b.dx*13*dt;b.z+=b.dz*13*dt;const rr=Math.hypot(b.x,b.z);if(rr>ARENA-1){b.dash=0}return}
  if(G.clash)return;b.cl=(b.cl??16)-dt;b.dm=(b.dm??12)-dt;b.cd-=dt;
  if(b.cl<=0&&b.cd>1){b.cl=24;clash(b);return}
  if(b.dm<=0&&b.cd>1){b.dm=b.rage?19:26;domain(b);b.cd=3.2;return}
  if(b.cd<=0){const m=moves[(b.k=(b.k||0)+1)%moves.length];b.cd=cd*(b.rage?.75:1);m(b)}
  if(sum){b.sum-=dt;if(b.sum<=0){b.sum=sum[2]||9;AT.summon(b,sum[0],sum[1])}}}}
// ---------- 模型 ----------
function robed(o){return g=>{const R=toon(o.robe,{emissive:o.em||0x080810}),A=toon(o.acc),F=toon(o.skin||0xd8c8b0),body=new THREE.Group();body.scale.setScalar(o.s||1);g.add(body);
  part(new THREE.ConeGeometry(.75,1.9,10),R,body,{p:[0,.95,0]});part(new THREE.SphereGeometry(.26,12,10),F,body,{p:[0,2.1,0]});part(new THREE.ConeGeometry(.3,.5,8),A,body,{p:[0,2.5,0]});
  [-1,1].forEach(d=>{part(new THREE.CylinderGeometry(.09,.12,.9,6),R,body,{p:[d*.6,1.3,.2],r:[.9,0,d*.5]});part(new THREE.SphereGeometry(.05,6,5),new THREE.MeshBasicMaterial({color:o.eye||0xff3a3a}),body,{p:[d*.1,2.15,.22]})});
  const orb=[];for(let i=0;i<(o.n||4);i++){const m=new THREE.Mesh(o.orb||new THREE.OctahedronGeometry(.28),new THREE.MeshBasicMaterial({color:o.glow||0xb784ff}));body.add(m);orb.push(m)}
  const L=new THREE.PointLight(o.glow||0xb784ff,2,11,1.4);L.position.y=1.8;body.add(L);if(o.extra)o.extra(body,A,R);
  return {body,L,Li:2.2,spin:b=>orb.forEach((m,i)=>{const a=b.t*1.6+i/orb.length*6.28;m.position.set(Math.sin(a)*1.5,1.6+Math.sin(b.t*2+i)*.3,Math.cos(a)*1.5);m.rotation.y=a})}}}
// ---------- 魔王 ----------
Object.assign(BOSSES,{
  yinshi:{duel:1,col:0x7fff9a,name:'陰屍宗主',line:'陰屍宗主：「嬰兒？正好拿來煉屍。」',rage:'陰屍宗主：「屍海翻騰！」',tip:'陰屍宗主愛召屍傀，也會放全場領域，找綠色圈圈站！',r:1.2,dmg:13,spd:1.5,keep:3,
    build:robed({robe:0x2a3a30,acc:0x6a8a5a,glow:0x7fff9a,eye:0x7fff9a,skin:0x9aa890,em:0x0a2010,n:5,orb:new THREE.SphereGeometry(.26,8,6),extra:(b,A,R)=>{part(new THREE.BoxGeometry(.5,.7,.5),A,b,{p:[0,2.65,0]});part(new THREE.CylinderGeometry(.04,.04,2.6,6),toon(0x3a2a1a),b,{p:[.85,1.3,.3]});part(new THREE.SphereGeometry(.2,10,8),new THREE.MeshBasicMaterial({color:0x7fff9a}),b,{p:[.85,2.65,.3]});part(new THREE.BoxGeometry(.6,1.6,.25),toon(0x1a1a14),b,{p:[0,1.2,-.8],r:[.2,0,0]});part(new THREE.BoxGeometry(.36,.06,.02),toon(0xe8d86a),b,{p:[0,2.05,.27]})}}),
    act:duelAct([b=>AT.rain(b,8),b=>AT.ring(b),b=>AT.fan(b,3),b=>AT.homing(b,3)],2.8,['skel',4,8])},
  xuanbing:{duel:1,col:0x9fe8ff,name:'玄冰妖王',line:'玄冰妖王：「凍成冰雕，陪我看一萬年雪。」',rage:'玄冰妖王：「六月飛雪——！」',tip:'玄冰妖王會瞬移到你身邊再橫掃，留意殘影！',r:1.2,dmg:13,spd:1.9,keep:3,
    build:robed({robe:0xcfe8f4,acc:0x9fe8ff,glow:0x9fe8ff,eye:0x4aaaff,skin:0xe8f0f4,em:0x1a3a4a,n:6,orb:new THREE.OctahedronGeometry(.3),extra:(b,A)=>{for(let i=0;i<7;i++){const a=(i-3)*.32;part(new THREE.ConeGeometry(.06,.45,4),A,b,{p:[Math.sin(a)*.28,2.45,Math.cos(a)*.1],r:[0,0,-a*.6]})}[-1,0,1].forEach(d=>part(new THREE.ConeGeometry(.22,1.6,8),toon(0xf4fbff,{emissive:0x2a4a5a}),b,{p:[d*.45,.9,-.75],r:[-1.1,0,d*.35]}));[-1,1].forEach(d=>part(new THREE.ConeGeometry(.08,.32,4),toon(0xf4fbff),b,{p:[d*.18,2.35,0]}))}}),
    act:duelAct([AT.blink,b=>AT.lines(b,5),b=>AT.rain(b,10),b=>AT.fan(b,3),AT.blink,b=>AT.ring(b)],2.4)},
  jinjia:{duel:1,col:0xffc84a,name:'金甲老怪',line:'金甲老怪：「肉身成聖，一拳碎你的元嬰！」',rage:'金甲老怪：「金身不壞——！」',tip:'金甲老怪是體修，近身砸地很痛，看到圈圈就退開！',r:1.5,dmg:14,spd:2.2,keep:0,
    build:robed({robe:0x8a6a20,acc:0xffd86a,glow:0xffc84a,eye:0xffe08a,skin:0xc89868,em:0x3a2808,n:3,s:1.25,orb:new THREE.DodecahedronGeometry(.3),extra:(b,A)=>{const G2=toon(0xd8a83a,{emissive:0x3a2808,metalness:.6,roughness:.35});part(new THREE.BoxGeometry(1.5,1,.9),G2,b,{p:[0,1.55,0]});[-1,1].forEach(d=>{part(new THREE.SphereGeometry(.42,12,10),G2,b,{p:[d*.85,1.95,0],s:[1,.75,1]});part(new THREE.CylinderGeometry(.2,.24,.9,8),G2,b,{p:[d*.95,1.25,.15]});part(new THREE.BoxGeometry(.42,.42,.42),G2,b,{p:[d*.98,.72,.25]});part(new THREE.CylinderGeometry(.18,.22,.8,8),G2,b,{p:[d*.3,.4,0]})});part(new THREE.BoxGeometry(1.2,.16,.85),toon(0x6a1a14),b,{p:[0,1.05,0]});part(new THREE.SphereGeometry(.22,8,6),G2,b,{p:[0,2.55,0],s:[1.2,.6,1.2]})}}),
    act:duelAct([b=>AT.slam(b,5.5),AT.dash,b=>{AT.slam(b,4);act(.7,null,()=>AT.slam(b,7))},b=>AT.ring(b),AT.dash],2.3,['yaksha',3,10])},
  shenhan:{duel:1,col:0xdfe6ff,name:'沈寒',line:'沈寒：「師弟……跑。我……控制不住了。」',rage:'沈寒：「不要看我的劍——！」',tip:'師兄被血河老祖佔據了身體！他的劍影很快，別硬接。',r:1.1,dmg:13,spd:2.4,keep:2,
    build:robed({robe:0xe8ecf4,acc:0x2a2a3a,glow:0xb4a8ff,eye:0xff4a4a,skin:0xe8d8c8,em:0x14143a,n:7,orb:new THREE.ConeGeometry(.12,.7,4),extra:(b,A)=>{part(new THREE.BoxGeometry(.05,1.8,.12),toon(0xdfe6ff,{emissive:0x4a3a8a}),b,{p:[.7,1.4,.5],r:[.5,0,-.2]});part(new THREE.SphereGeometry(.3,10,8),A,b,{p:[0,2.15,-.1],s:[1,1.05,1.1]});part(new THREE.CylinderGeometry(.06,.02,.9,5),A,b,{p:[0,2,-.35],r:[-.4,0,0]});part(new THREE.TorusGeometry(.95,.05,6,40),new THREE.MeshBasicMaterial({color:0xff3a4a,transparent:true,opacity:.6}),b,{p:[0,.1,0],r:[Math.PI/2,0,0]});[-1,1].forEach(d=>part(new THREE.BoxGeometry(.08,.9,.02),toon(0x7a6ac8),b,{p:[d*.3,1.2,.62],r:[0,0,d*.15]}))}}),
    act:duelAct([AT.blink,b=>AT.lines(b,3),b=>AT.shots(b,7,4.2),AT.blink,b=>AT.rain(b,9),b=>AT.homing(b,4)],2.1)},
  xuehe:{duel:1,col:0xff5a4a,name:'血河老祖',line:'血河老祖：「千年等一次子時，今夜，鬼門歸我！」',rage:'血河老祖：「血河倒灌——！」',tip:'最後一戰！護體靈光 → 肉身 → 元嬰，一層一層打穿他。',r:1.4,dmg:14,spd:2,keep:2,
    build:robed({robe:0x3a0e14,acc:0xc02a2a,glow:0xff5a4a,eye:0xff2a2a,skin:0xb8a8a0,em:0x300808,n:8,s:1.2,orb:new THREE.SphereGeometry(.26,8,6),extra:(b,A,R)=>{part(new THREE.TorusGeometry(.62,.06,8,40),new THREE.MeshBasicMaterial({color:0xff4a3a}),b,{p:[0,2.2,-.35]});[-1,1].forEach(d=>part(new THREE.ConeGeometry(.42,1.3,8),R,b,{p:[d*.75,1.15,.15],r:[0,0,d*1.1]}));part(new THREE.TorusGeometry(1.25,.12,6,48),new THREE.MeshBasicMaterial({color:0x8a1a1a,transparent:true,opacity:.75}),b,{p:[0,.06,0],r:[Math.PI/2,0,0]});for(let i=0;i<5;i++)part(new THREE.ConeGeometry(.05,.35,4),A,b,{p:[(i-2)*.12,2.48,0],r:[0,0,(i-2)*-.2]})}}),
    act:duelAct([b=>AT.ring(b),AT.blink,b=>AT.lines(b,5),b=>AT.rain(b,10),b=>AT.fan(b,3),b=>AT.homing(b,4),AT.dash],2.1,['lamp',3,11])},
  jie:{duel:1,noHit:1,col:0xd8c8ff,name:'九重雷劫',winText:'你渡過了九重雷劫，元嬰更凝實了！',line:'天空黑了——九重雷劫，降下！',rage:'',tip:'撐過九重雷劫！看紫色圈圈，一道一道閃開。',r:.1,dmg:14,spd:0,y:9,
    build(g){const L=new THREE.PointLight(0xb784ff,3,30,1.2);L.position.y=0;g.add(L);const body=new THREE.Group();g.add(body);return {body,L,Li:3,spin:()=>{}}},
    act(b,dt){b.x=HERO.pos.x;b.z=HERO.pos.z;if(G.clash)return;b.rd=b.rd??0;b.cd-=dt;
      if(b.cd<=0&&b.rd<9){b.rd++;const r=b.rd;b.cd=4.4;banner(`第 ${r} 道雷劫`,r===9?'最後一道！':'',false);const n=3+r*1.3|0,dl=Math.max(.7,1.4-r*.08);
        for(let i=0;i<n;i++)act(i*.18,null,()=>{if(!G||G.over)return;const lead=i%2===0,a=Math.random()*6.28,d=lead?Math.random()*1.2:1.5+Math.random()*(r>5?5:3.5),x=HERO.pos.x+(lead?HERO.vel.x*dl:0)+Math.sin(a)*d,z=HERO.pos.z+(lead?HERO.vel.z*dl:0)+Math.cos(a)*d;warn(x,z,1.35,dl,b.dmg*(.5+r*.08),null,0xb784ff);act(dl,null,()=>{if(G&&!G.over)boltAt(x,z,0,0,0xe0d0ff,.1+r*.01,16)})});
        if(r===9){const x=HERO.pos.x,z=HERO.pos.z;act(.6,null,()=>{warn(x,z,4.2,1.8,b.dmg*1.2,null,0xffe08a);act(1.8,null,()=>boltAt(x,z,0,0,0xffffff,.4,20))})}
        b.hp=b.max*(1-r/9)}
      if(b.rd>=9&&b.cd<=1.2&&!b.done){b.done=true;b.hp=0;act(1.2,null,()=>{if(G&&!G.over&&boss.alive){banner('雷劫渡過了！','','');bossDown()}})}}}});
// ---------- 章節設定 ----------
CHC[9]={map:9,fog:0x1a1430,ground:0x2a2440,rate:.3,noElite:1,mobs:[['skel',2,0],['yaksha',1.2,0],['ghost',1,0]],elite:'skel',boss:['yinshi','xuanbing','jinjia']};
CHC[10]={map:10,fog:0x24101a,ground:0x3a2028,rate:.3,noElite:1,mobs:[['skel',2,0],['lamp',1.2,0],['drown',1,0]],elite:'skel',boss:['jie','shenhan','xuehe']};
CHC[11]={rate:1.6,map:0,fog:0x1a1a26,ground:0xb8b0c0,mobs:[['ghost',2,0]],elite:'skel',boss:['lantern']};
const ENDLESS_BOSS=['lantern','general','fox','bell','hungry','ferry','yinshi','xuanbing','jinjia','shenhan','xuehe'];
// 無盡之夜：沒有雞啼，魔王一波一波輪番上（每波更硬），中間夾精英；倒下才結束
function stepEndless(dt){const g=G;if(g.enNext===undefined){g.enNext=30;g.wave=0}
  if(!boss.alive&&!g.enOn&&g.t>=g.enNext){g.wave++;g.endBoss=ENDLESS_BOSS[Math.floor(Math.random()*ENDLESS_BOSS.length)];g.mod.boss=Math.pow(1.3,g.wave-1);g.enOn=true;startBoss();say(`第 ${g.wave} 波魔王：${BOSSES[g.endBoss].name}`,3)}
  if(g.enOn&&!boss.alive){g.enOn=false;g.enNext=g.t+25;g.enElite=g.t+12}
  if(g.enElite&&g.t>=g.enElite){g.enElite=0;startElite()}}
function endlessPick(){const m=Math.floor(Math.random()*6),src=CHC[m];Object.assign(CHC[11],{map:m,fog:src.fog,ground:src.ground,mobs:src.mobs.concat([['skel',1,2]]),elite:src.elite});curMap=-1}
// ---------- 元嬰技能組 ----------
const SOUL_LV=['範圍 +30%、傷害 +30%','雙斬：回頭再斬一次','斬得更重，斬完回復一成生命'];
function soulCast(){const lv=G.k.sweepLv,R=SK.sweep.range(),dmg=swordDmg()*4.2*G.k.sweepD*(lv>=3?1.25:1),n=lv>=2?2:1;SFX.play('sweep');shake=Math.max(shake,.3);buzz(25);
  for(let w=0;w<n;w++)act(w*.32,null,()=>{const rr=R*(1+w*.18),a0=Math.random()*6.28;fx({p:tmp.set(HERO.pos.x,.5,HERO.pos.z),col:0xffe9a0,add:true,life:.45,s0:1,s1:rr*2.4,op:.95,vy:0});fx({p:tmp.set(HERO.pos.x,.9,HERO.pos.z),col:0xffffff,add:true,life:.3,s0:1,s1:rr*1.6,op:.8,vy:0});
    if(w===n-1&&lv>=3)G.hp=Math.min(G.maxhp,G.hp+G.maxhp*.1);SFX.play('sweep');
    for(const e of enemies){if(e.dead)continue;const dx=e.x-HERO.pos.x,dz=e.z-HERO.pos.z,d=Math.hypot(dx,dz);if(d<rr+e.r)hurtEnemy(e,dmg,dx/(d||1)*1.5,dz/(d||1)*1.5,false,6)}
    if(boss.alive&&Math.hypot(boss.x-HERO.pos.x,boss.z-HERO.pos.z)<rr+boss.r)hurtBoss(dmg)})}
const HONG_LV=['光柱變寬','兩道貫虹','三道，被貫穿的定身 1 秒','五道貫虹'];const HONG_N=[1,1,2,3,5],HONG_W=[1.8,2.6,2.6,2.6,2.6],HONG_SP=[0,0,.5,.9,1.8];
function hongCast(A){const lv=G.k.beamLv,L=SK.beam.range(),a0=Math.atan2(A.dir[0],A.dir[1]),dmg=swordDmg()*9*G.k.beamD*[1,1,.9,.8,.7][lv],hx=HERO.pos.x,hz=HERO.pos.z,n=HONG_N[lv],W=HONG_W[lv];SFX.play('beam');shake=Math.max(shake,.3);
  for(let j=0;j<n;j++){const a=n>1?a0-HONG_SP[lv]/2+HONG_SP[lv]*j/(n-1):a0,dx=Math.sin(a),dz=Math.cos(a),hit=new Set();
    const m=new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({map:beamTex,color:0xfff0b0,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(hx,.8,hz);m.rotation.y=a;scene.add(m);
    act(.7,t=>{const k=Math.min(1,t/.12);m.scale.set(W*(.7+.3*k),1,L*k);m.material.opacity=.9*(t>.3?Math.max(0,1-(t-.3)/.4):1);
        for(const e of enemies){if(e.dead||hit.has(e))continue;const px=e.x-hx,pz=e.z-hz,al=px*dx+pz*dz,pe=Math.abs(px*dz-pz*dx);if(al>0&&al<L*k&&pe<W/2+e.r){hit.add(e);if(lv>=2)e.stun=Math.max(e.stun||0,1);hurtEnemy(e,dmg,dx*.6,dz*.6,true,4)}}
        if(boss.alive&&!hit.has(boss)){const px=boss.x-hx,pz=boss.z-hz,al=px*dx+pz*dz,pe=Math.abs(px*dz-pz*dx);if(al>0&&al<L*k&&pe<W/2+boss.r){hit.add(boss);hurtBoss(dmg,true)}}},
      ()=>{scene.remove(m);m.material.dispose()})}}
const SHADOW_LV=['劍影 +3 把','持續更久','劍影更快更痛','劍影 +4 把，會追魔王'];
function shadowCast(){const lv=G.k.thLv,n=8+G.k.thN+(lv>=1?3:0)+(lv>=4?4:0),dur=3.6+(lv>=2?1.4:0),dmg=swordDmg()*3.4*G.k.thD*(lv>=3?1.3:1),spd=lv>=3?15:11;
  if(!enemies.some(e=>!e.dead&&onScreen(e.x,.4,e.z))&&!boss.alive)return false;SFX.play('thunder');
  for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(.12,1.1,4),new THREE.MeshBasicMaterial({color:0xdfe8ff,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.order='YXZ';scene.add(m);
    const s={x:HERO.pos.x,z:HERO.pos.z,tg:null,cd:0,hit:new Map(),a:i/n*6.28};
    act(dur,(t,dt)=>{s.cd-=dt;if(!s.tg||s.tg.dead||s.cd<=0){s.cd=.7;let best=null,bd=1e9;const pool=(lv>=4&&boss.alive&&i%3===0)?[boss]:enemies;for(const e of pool){if(e.dead)continue;const d=Math.hypot(e.x-s.x,e.z-s.z)+Math.random()*3;if(d<bd){bd=d;best=e}}s.tg=best}
        let tx,tz;if(s.tg){tx=s.tg.x;tz=s.tg.z}else{s.a+=dt*3;tx=HERO.pos.x+Math.sin(s.a)*2.5;tz=HERO.pos.z+Math.cos(s.a)*2.5}
        const dx=tx-s.x,dz=tz-s.z,d=Math.hypot(dx,dz)||1,v=Math.min(d,spd*dt);s.x+=dx/d*v;s.z+=dz/d*v;m.position.set(s.x,.9,s.z);m.rotation.set(Math.PI/2,Math.atan2(dx,dz),0);m.material.opacity=.9*Math.min(1,(dur-t)/.5);
        if(s.tg&&d<s.tg.r+.6&&(s.hit.get(s.tg)||0)<t-.45){s.hit.set(s.tg,t);if(s.tg===boss)hurtBoss(dmg);else hurtEnemy(s.tg,dmg,dx/d*.8,dz/d*.8,false,3)}},
      ()=>{scene.remove(m);m.material.dispose()})}
  return true}
SKILL_SETS.push({name:'元嬰',sweep:{n:'元神斬',ic:'神',col:0xffe9a0,shape:'self',range:()=>5*G.k.sweepR,cd:()=>7*G.k.sweepCd,lv:SOUL_LV,cast:soulCast},
  beam:{n:'劍氣貫虹',ic:'貫',col:0xfff0b0,shape:'line',w:1.8,range:()=>13,cd:()=>5.5*G.k.beamCd,spread:()=>HONG_SP[G.k.beamLv]>0?HONG_SP[G.k.beamLv]+.2:0,lv:HONG_LV,cast:hongCast},
  thunder:{n:'分神劍影',ic:'影',col:0xdfe8ff,shape:'auto',range:()=>9,cd:()=>10,lv:SHADOW_LV,cast:shadowCast}});
// ---------- 大絕：元嬰出竅 ----------
function yuanyingCast(A){const [px,pz]=A.pt,dmg=swordDmg()*5;G.ultBoss=0;G.slow=.4;shake=Math.max(shake,.5);SFX.play('ult');buzz(60);const u=$('#ultFx');u.classList.remove('on');void u.offsetWidth;u.classList.add('on');banner('元嬰出竅','元嬰化身替你斬妖',true);
  const av=new THREE.Group(),M=new THREE.MeshBasicMaterial({color:0xffe9a0,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false});
  const c=new THREE.Mesh(new THREE.ConeGeometry(1.1,3,10),M);c.position.y=1.5;av.add(c);const h=new THREE.Mesh(new THREE.SphereGeometry(.55,12,10),M);h.position.y=3.3;av.add(h);
  const sw=new THREE.Mesh(new THREE.ConeGeometry(.18,4,4),M);sw.position.set(1.4,2.2,0);sw.rotation.z=-.4;av.add(sw);av.position.set(px,0,pz);scene.add(av);let tk=0;const DUR=9;
  act(DUR,(t,dt)=>{G.iframe=Math.max(G.iframe,.3);let best=null,bd=1e9;for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-av.position.x,e.z-av.position.z);if(d<bd){bd=d;best=e}}
      const tg=boss.alive&&(!best||bd>8)?boss:best;if(tg){const dx=tg.x-av.position.x,dz=tg.z-av.position.z,d=Math.hypot(dx,dz)||1;if(d>2){const v=Math.min(d,9*dt);av.position.x+=dx/d*v;av.position.z+=dz/d*v}av.rotation.y=Math.atan2(dx,dz)}
      av.position.y=Math.sin(t*5)*.3;M.opacity=.7*Math.min(1,(DUR-t)/.8);tk-=dt;
      if(tk<=0){tk=.3;sw.rotation.x=(sw.rotation.x||0)+1.2;fx({p:tmp.set(av.position.x,.8,av.position.z),col:0xffe9a0,add:true,life:.3,s0:1,s1:11,op:.8,vy:0});
        for(const e of enemies)if(!e.dead&&Math.hypot(e.x-av.position.x,e.z-av.position.z)<5.5)hurtEnemy(e,dmg,0,0,false,3);
        if(boss.alive&&Math.hypot(boss.x-av.position.x,boss.z-av.position.z)<5.5+boss.r){const room=boss.max*.22-G.ultBoss;if(room>0){const d=Math.min(dmg*2.5,room);G.ultBoss+=d;boss.allow+=d;hurtBoss(d,true)}}}},
    ()=>{scene.remove(av);M.dispose()})}
ULT_DEF.yuanying={n:'元嬰出竅',ic:'嬰',col:0xffe9a0,shape:'circle',ult:1,r:()=>2,range:()=>8,cast:yuanyingCast};
// ---------- 水墨過場 ----------
Object.assign(INK.scenes,{
  baby:(x,I)=>{const g=x.createRadialGradient(400,190,10,400,190,330);g.addColorStop(0,'#fff4d0');g.addColorStop(.5,'#c8a8ff');g.addColorStop(1,'#1a1030');x.fillStyle=g;x.fillRect(0,0,800,360);I.figure(x,400,330,1.3,{col:'rgba(10,8,20,.9)'});x.fillStyle='rgba(255,250,220,.95)';x.beginPath();x.arc(400,170,28,0,7);x.fill();x.beginPath();x.ellipse(400,214,20,26,0,0,7);x.fill();I.seal(x,'嬰')},
  realm9:(x,I)=>{const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'#1a1430');g.addColorStop(1,'#4a3a70');x.fillStyle=g;x.fillRect(0,0,800,360);x.strokeStyle='rgba(200,170,255,.7)';x.lineWidth=3;x.beginPath();x.ellipse(400,260,300,50,0,0,7);x.stroke();x.fillStyle='rgba(20,14,40,.95)';for(let i=0;i<8;i++){const a=i/8*6.28;x.fillRect(400+Math.sin(a)*290-12,250+Math.cos(a)*45-80,24,80)}I.figure(x,400,270,.9,{});I.seal(x,'域')},
  gate:(x,I)=>{const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'#14080e');g.addColorStop(1,'#5a1a24');x.fillStyle=g;x.fillRect(0,0,800,360);x.fillStyle='rgba(8,4,6,.95)';x.fillRect(250,60,60,260);x.fillRect(490,60,60,260);x.fillRect(230,50,340,30);x.fillStyle='rgba(255,90,70,.85)';x.beginPath();x.ellipse(400,190,70,110,0,0,7);x.fill();I.ghosts(x,6);I.seal(x,'門')},
  brother:(x,I)=>{I.paper(x);I.moon(x,400,90,46);I.wash(x,250,40,.35,1.5);I.figure(x,330,320,1.2,{sword:1});I.figure(x,470,320,1.2,{col:'rgba(120,20,30,.85)',sword:1});I.seal(x,'兄')},
  home:(x,I)=>{I.paper(x);I.moon(x,640,80,34);I.wash(x,230,40,.3,1.6);x.fillStyle='rgba(20,18,16,.92)';x.fillRect(300,200,200,90);x.beginPath();x.moveTo(280,200);x.lineTo(400,150);x.lineTo(520,200);x.fill();I.lantern(x,400,170,14,true);I.figure(x,560,300,.9,{sword:1});I.seal(x,'燈')}});
Object.assign(CUTS,{
  ch9:[{scene:'baby',t:'第九章・九霄魔域。心魔被你斬了，丹田裡坐起一個小小的人影——元嬰成了。'},{scene:'realm9',t:'魔域的天上有一圈石柱。三位元嬰老怪輪番站上來：「想喚醒你師父？先過我們這關。」'}],
  ch9end:[{scene:'master',t:'你把元嬰之力送進師父的眉心。他眼皮動了動，嘆了一口氣：「……酒呢？」'}],
  ch10:[{scene:'gate',t:'第十章・渡劫長征。千年一次的子時，鬼門緩緩打開，天上的雷雲也跟著壓了下來。'},{scene:'brother',t:'雷雲下，師兄沈寒站在鬼門前。他的眼睛，是紅色的。'}],
  ch10end:[{scene:'gate',t:'血河老祖的元嬰被斬，鬼門轟然合上，千年的怨氣散成了星光。'},{scene:'brother',t:'師兄醒了。他跪在地上哭了很久，你只是遞給他一壺酒：「回家吧。」'},{scene:'dawn',t:'喔喔喔——公雞終於啼了，天亮了。'},{scene:'home',t:'你接下了青燈觀。從此，每到午夜，你仍提著那盞會說話的燈籠下山——午夜來斬妖。（全劇終・無盡之夜開放）'}]});
