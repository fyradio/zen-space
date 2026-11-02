/* ================= 三個普通技能：隨境界換一套 =================
   煉氣：青竹劍（綠扇形橫掃）、劍氣長虹（紅直線→散射）、五雷咒（紫色連鎖閃電，點一下自動追妖）
   築基：寒霜劍輪（冰藍劍輪從身邊飛出，緩速→冰封）、赤焰火龍（火龍沿直線飛、留下燃燒）、太極氣旋（自動找妖最多處，捲進來再爆開）
   結丹、元嬰：之後跟著章節做（企劃.md「技能隨境界置換」）。
   進化卡共用：sweepUp／beamUp／thUp 的等級 G.k.*Lv，每套技能自己解釋每一級是什麼。 */
// ---------- 五雷咒・連鎖閃電 ----------
const TH_LV2=['紫電連環：多跳 3 隻，每道雷再電旁邊 2 隻','雙鏈：同時放出兩條連鎖閃電','紫霄神雷：最後一擊劈下巨大天雷柱、大範圍麻痺'];
function pickNear(x,z,r,used){let best=null,bd=r*r;for(const e of enemies){if(e.dead||used.has(e))continue;const d=(e.x-x)**2+(e.z-z)**2;if(d<bd&&onScreen(e.x,.4,e.z)){bd=d;best=e}}return best}
function chainCast(){const lv=G.k.thLv,hops=G.k.thN+(lv>=1?Math.max(1,Math.floor(3*evQ())):0),dmg=swordDmg()*2.8*G.k.thD,used=new Set(),hx=HERO.pos.x,hz=HERO.pos.z,R=SK.thunder.range();
  const starts=[];for(let c=0;c<(lv>=2?2:1);c++){let tg=null;if(c===0&&boss.alive&&bossOnScreen()&&Math.hypot(boss.x-hx,boss.z-hz)<R+boss.r)tg=boss;else tg=pickNear(hx,hz,R,used);if(!tg)break;used.add(tg);starts.push(tg)}
  if(!starts.length)return false;SFX.play('thunder');shake=Math.max(shake,.2);buzz(15);
  starts.forEach(tg0=>{let cur=tg0,px=hx,pz=hz,n=0,end=false;
    act(hops*.09+.2,t=>{while(cur&&t>=n*.09){const x=cur.x,z=cur.z;zap(px,pz,x,z);boltAt(x,z,dmg,1.1,0xb889ff,.07);if(n%3===2)SFX.play('thunder');
        if(cur!==boss)cur.stun=Math.max(cur.stun||0,.8);
        if(lv>=1){const near=enemies.filter(e=>!e.dead&&e!==cur&&(e.x-x)**2+(e.z-z)**2<9).slice(0,2);for(const e of near){zap(x,z,e.x,e.z);hurtEnemy(e,dmg*.5,0,0,false,3)}}
        n++;px=x;pz=z;let nx=n<hops?pickNear(x,z,4.5,used):null;if(nx)used.add(nx);
        if(!nx&&lv>=3&&!end){end=true;boltAt(x,z,dmg*4,2.6,0xe6d2ff,.3,14);shake=Math.max(shake,.6);SFX.play('boom');for(const e of enemies)if(!e.dead&&(e.x-x)**2+(e.z-z)**2<6.8)e.stun=Math.max(e.stun||0,1.5);
          fx({p:tmp.set(x,.5,z),col:0xb98aff,add:true,life:.6,s0:2,s1:8,op:1,vy:0})}
        cur=nx}})});
  return true}
// ---------- 寒霜劍輪（築基・冰藍）----------
const FROST_LV=['範圍 +30%、傷害 +30%','雙輪：飛出去再收回來，砍兩次','冰封：砍到的妖直接凍住 1.5 秒'];
const iceMat=new THREE.MeshBasicMaterial({color:0xc8f6ff,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false});
const iceCore=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false});
// 六角雪花符陣（畫在地上，隨劍輪旋轉）
const snowTex=ctex(256,256,x=>{x.translate(128,128);x.strokeStyle='rgba(190,245,255,.95)';x.lineCap='round';
  for(let i=0;i<6;i++){x.save();x.rotate(i*Math.PI/3);x.lineWidth=5;x.beginPath();x.moveTo(0,0);x.lineTo(0,-118);x.stroke();x.lineWidth=3;for(const [y,l] of [[-40,22],[-70,30],[-96,16]]){x.beginPath();x.moveTo(0,y);x.lineTo(-l,y-l*.9);x.moveTo(0,y);x.lineTo(l,y-l*.9);x.stroke()}x.restore()}
  x.lineWidth=3;x.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;x.lineTo(Math.sin(a)*50,-Math.cos(a)*50)}x.closePath();x.stroke();x.lineWidth=2;x.beginPath();x.arc(0,0,122,0,7);x.stroke();
  const g=x.createRadialGradient(0,0,0,0,0,120);g.addColorStop(0,'rgba(140,230,255,.35)');g.addColorStop(1,'rgba(140,230,255,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,120,0,7);x.fill()});
const frostRing=(()=>{const g=new THREE.Group();g.visible=false;scene.add(g);const blades=[];
  // 冰劍：四稜細長劍身＋亮白劍脊＋晶護手
  const bl=new THREE.ConeGeometry(.1,1.15,4);bl.rotateX(Math.PI/2);bl.translate(0,0,.35);bl.scale(1,.38,1);const sp=new THREE.ConeGeometry(.035,1.0,4);sp.rotateX(Math.PI/2);sp.translate(0,0,.33);sp.scale(1,.5,1);
  const gd=new THREE.OctahedronGeometry(.1);gd.scale(1.5,.5,.8);
  for(let i=0;i<12;i++){const b=new THREE.Group();g.add(b);b.add(new THREE.Mesh(bl,iceMat));b.add(new THREE.Mesh(sp,iceCore));const gm=new THREE.Mesh(gd,iceMat);gm.position.z=-.2;b.add(gm);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0x8fe8ff,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(1.3,1.3,1);b.add(s);blades.push(b)}
  const disc=new THREE.Mesh(new THREE.PlaneGeometry(2,2).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:snowTex,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));disc.visible=false;scene.add(disc);
  const rim=new THREE.Mesh(new THREE.RingGeometry(.94,1,64).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xbff4ff,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));disc.add(rim);
  return {g,blades,disc}})();
function frostCast(){const lv=G.k.sweepLv,R=SK.sweep.range(),dmg=swordDmg()*4.6*G.k.sweepD,passes=lv>=2?2:1,T=.42,life=passes*T+.25,hit=[new Set(),new Set()];
  SFX.play('sweep');SFX.play('bell');shake=Math.max(shake,.2);buzz(20);frostRing.g.visible=frostRing.disc.visible=true;
  act(life,t=>{const p=Math.min(passes-1,Math.floor(t/T)),k=Math.min(1,(t-p*T)/T),e=1-Math.pow(1-k,2),r=p===0?.4+(R-.4)*e:R-(R-.6)*e,hx=HERO.pos.x,hz=HERO.pos.z;
      frostRing.g.position.set(hx,.8,hz);frostRing.blades.forEach((b,i)=>{const a=i/12*Math.PI*2+t*9;b.position.set(Math.sin(a)*r,0,Math.cos(a)*r);b.rotation.y=a+Math.PI/2});
      frostRing.disc.position.set(hx,.07,hz);frostRing.disc.rotation.y=-t*2.2;frostRing.disc.scale.setScalar(Math.max(.05,r));frostRing.disc.material.opacity=.85*(t>life-.25?Math.max(0,(life-t)/.25):1);if(!simming&&Math.random()<.7){const ba=Math.random()*6.283;fx({p:tmp.set(hx+Math.sin(ba)*r,.8,hz+Math.cos(ba)*r),col:Math.random()<.5?0xffffff:0x8fe8ff,add:true,life:.5,s0:.35,s1:.05,op:.9,vy:-.4})}if(t>life-.25)frostRing.g.visible=false;
      if(t>passes*T)return;const H=hit[p];let killed=0;
      for(const en of enemies){if(en.dead||H.has(en))continue;const dx=en.x-hx,dz=en.z-hz,d=Math.hypot(dx,dz);
        if(Math.abs(d-r)<.6+en.r||(p===0&&d<r)){H.add(en);en.slowT=3;if(lv>=3)en.stun=Math.max(en.stun||0,1.5);hurtEnemy(en,dmg,dx/(d||1)*.8,dz/(d||1)*.8,false,5);if(en.dead)killed++;
          if(!simming){fx({p:tmp.set(en.x,.7,en.z),col:0xbff4ff,add:true,life:.35,s0:1.6,s1:.2,op:.9,vy:0});for(let q=0;q<5;q++){const sa=Math.random()*6.283;fx({p:tmp.set(en.x,.5,en.z),col:0xe8fbff,add:true,life:.5,s0:.3,s1:.05,op:1,vx:Math.sin(sa)*3,vz:Math.cos(sa)*3,vy:2})}}}}
      if(boss.alive&&!H.has(boss)){const d=Math.hypot(boss.x-hx,boss.z-hz);if(Math.abs(d-r)<.6+boss.r||d<r){H.add(boss);hurtBoss(dmg)}}
      if(killed){G.slow=Math.max(G.slow,.06);shake=Math.max(shake,.3)}},
    ()=>{frostRing.g.visible=frostRing.disc.visible=false})}
// ---------- 赤焰火龍（築基・橘紅）----------
const DRAGON_N=[1,2,3,5,8],DRAGON_SPREAD=[0,.5,.9,1.6,Math.PI*2];
const DRAGON_LV=['兩條火龍','三條火龍','五條火龍','八條火龍，四面八方'];
function dragonCast(A){const lv=G.k.beamLv,L=SK.beam.range(),a0=Math.atan2(A.dir[0],A.dir[1]),n=EVc(DRAGON_N[lv],1),sp=DRAGON_SPREAD[lv],dmg=swordDmg()*6*G.k.beamD*[1,.9,.8,.7,.6][lv],hx=HERO.pos.x,hz=HERO.pos.z,hitN=new Map();
  SFX.play('beam');SFX.play('boom');shake=Math.max(shake,.2);
  for(let j=0;j<n;j++){const a=lv>=4?a0+j/n*Math.PI*2:n>1?fanA(a0,j,n,sp/(n-1)):a0,dx=Math.sin(a),dz=Math.cos(a),mine=new Set(),T=L/15;let trail=0;
    const segs=[];if(!simming)for(let i=0;i<7;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:i===0?0xffe08a:i<3?0xff8a2a:0xff4a1a,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));
      const sc=(i===0?1.7:1.35-i*.12)*1.7;s.scale.set(sc,sc,1);s.visible=false;scene.add(s);segs.push(s)}
    act(T+.4,t=>{segs.forEach((s,i)=>{const tt=t-i*.05;if(tt<0||tt>T){s.visible=false;return}const dd=tt/T*L,w=Math.sin(dd*1.3+j)*.9;s.visible=true;s.position.set(hx+dx*dd+dz*w,.75+Math.sin(dd*2.2)*.2,hz+dz*dd-dx*w)});
        if(t>T)return;const dd=t/T*L,w=Math.sin(dd*1.3+j)*.9,x=hx+dx*dd+dz*w,z=hz+dz*dd-dx*w;
        if(!simming)while(trail<dd){trail+=1;fx({p:tmp.set(hx+dx*trail,.3,hz+dz*trail),col:0xff7a2a,add:true,life:1.5,s0:1,s1:.4,op:.7,vy:.3})}
        for(const en of enemies){if(en.dead||mine.has(en))continue;if((en.x-x)**2+(en.z-z)**2<(1.5+en.r)**2){mine.add(en);const c=hitN.get(en)||0;if(c>=2)continue;hitN.set(en,c+1);en.burn=3;en.burnD=dmg*.12;hurtEnemy(en,dmg,dx*.8,dz*.8,false,4.5)}}
        if(boss.alive&&!mine.has(boss)&&(boss.x-x)**2+(boss.z-z)**2<(1.5+boss.r)**2){mine.add(boss);const c=hitN.get(boss)||0;if(c<3){hitN.set(boss,c+1);hurtBoss(dmg)}}},
      ()=>{segs.forEach(s=>{scene.remove(s);s.material.dispose()})})}}
// ---------- 太極氣旋（築基・黑白）----------
const TAIJI_LV=['範圍 +30%','雙氣旋：同時捲兩團妖','爆開後定身 1.5 秒、傷害 +50%'];
const taijiTex=ctex(256,256,x=>{x.translate(128,128);const R=116;x.fillStyle='rgba(240,238,228,.92)';x.beginPath();x.arc(0,0,R,0,7);x.fill();
  x.fillStyle='rgba(12,12,16,.92)';x.beginPath();x.arc(0,0,R,-Math.PI/2,Math.PI/2);x.arc(0,R/2,R/2,Math.PI/2,Math.PI*1.5);x.arc(0,-R/2,R/2,Math.PI/2,-Math.PI/2,true);x.fill();
  x.beginPath();x.arc(0,-R/2,R/7,0,7);x.fill();x.fillStyle='rgba(240,238,228,.92)';x.beginPath();x.arc(0,R/2,R/7,0,7);x.fill();
  x.strokeStyle='rgba(255,216,106,.95)';x.lineWidth=6;x.beginPath();x.arc(0,0,R+4,0,7);x.stroke()});
function crowdSpots(hx,hz,R,r,n){const cand=enemies.filter(e=>!e.dead&&(e.x-hx)**2+(e.z-hz)**2<R*R&&onScreen(e.x,.4,e.z));const out=[];
  for(let k=0;k<n;k++){let best=null,bn=0;const step=Math.max(1,Math.floor(cand.length/40));
    for(let i=0;i<cand.length;i+=step){const e=cand[i];if(out.some(([x,z])=>(e.x-x)**2+(e.z-z)**2<(r*1.6)**2))continue;let c=0;for(const o of cand)if((o.x-e.x)**2+(o.z-e.z)**2<r*r)c++;if(c>bn){bn=c;best=e}}
    if(!best)break;out.push([best.x,best.z])}
  if(!out.length&&boss.alive&&bossOnScreen()&&Math.hypot(boss.x-hx,boss.z-hz)<R+2)out.push([boss.x,boss.z]);return out}
function taijiAt(x,z,r,dmg,lv){const m=new THREE.Mesh(new THREE.CircleGeometry(1,48).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:taijiTex,transparent:true,opacity:0,depthWrite:false}));
  m.position.set(x,.07,z);m.scale.setScalar(r);m.renderOrder=3;scene.add(m);let burst=false,tick=0;
  act(1.9,(t,dt)=>{m.rotation.y-=dt*(3+t*5);m.material.opacity=Math.min(.85,t*3)*(t>1.6?Math.max(0,1-(t-1.6)/.3):1);
      if(t<1.4){tick-=dt;for(const e of enemies){if(e.dead||e.elite)continue;const dx=x-e.x,dz=z-e.z,d=Math.hypot(dx,dz);if(d<r+1.6&&d>.25){const v=Math.min(d,(3+4*(1-d/(r+1.6)))*dt);e.x+=dx/d*v;e.z+=dz/d*v}}
        if(tick<=0){tick=.35;for(const e of enemies)if(!e.dead&&(e.x-x)**2+(e.z-z)**2<r*r)hurtEnemy(e,dmg*.12,0,0,false,0);
          if(!simming)fx({p:tmp.set(x+(Math.random()-.5)*r,.5,z+(Math.random()-.5)*r),col:Math.random()<.5?0xf0eee4:0x101014,life:.6,s0:.8,s1:.2,op:.8,vy:1.2})}}
      else if(!burst){burst=true;SFX.play('boom');shake=Math.max(shake,.4);buzz(25);
        fx({p:tmp.set(x,.5,z),col:0xfff6d8,add:true,life:.5,s0:1,s1:r*2.8,op:1,vy:0});fx({p:tmp.set(x,.5,z),col:0x101014,life:.8,s0:1,s1:r*2.2,op:.7,vy:.8});
        const D=dmg*(lv>=3?1.5:1);for(const e of enemies){if(e.dead)continue;const dx=e.x-x,dz=e.z-z,d=Math.hypot(dx,dz);if(d<r+.3){if(lv>=3)e.stun=Math.max(e.stun||0,1.5);hurtEnemy(e,D,dx/(d||1)*1.5,dz/(d||1)*1.5,false,6)}}
        if(boss.alive&&(boss.x-x)**2+(boss.z-z)**2<(r+boss.r)**2)hurtBoss(D)}},
    ()=>{scene.remove(m);m.geometry.dispose();m.material.dispose()})}
function taijiCast(){const lv=G.k.thLv,R=SK.thunder.range(),r=2.4*EVm(lv>=1?1.3:1),dmg=swordDmg()*5.5*G.k.thD,spots=crowdSpots(HERO.pos.x,HERO.pos.z,R,r,lv>=2?2:1);
  if(!spots.length)return false;spots.forEach(([x,z])=>taijiAt(x,z,r,dmg,lv));SFX.play('wan');return true}
/* ---------- 技能組 ---------- */
const SKILL_SETS=[
  {name:'煉氣',sweep:{n:'青竹劍',ic:'竹',col:0x5dff7a,shape:'fan',ang:2.3,range:()=>4.6*G.k.sweepR,cd:()=>6.5*G.k.sweepCd,full:()=>G.k.sweepLv>=3,lv:SWEEP_LV,cast:sweepCast},
    beam:{n:'劍氣長虹',ic:'虹',col:0xff5a46,shape:'line',w:1.1,range:()=>9,cd:()=>5*G.k.beamCd,spread:()=>G.k.beamLv>0?Math.min(Math.PI*2,BEAM_SPREAD[G.k.beamLv]+.12):0,lv:BEAM_LV,cast:beamCast},
    thunder:{n:'五雷咒',ic:'雷',col:0xb784ff,shape:'auto',range:()=>9,cd:()=>9,lv:TH_LV2,cast:chainCast}},
  {name:'築基',sweep:{n:'寒霜劍輪',ic:'霜',col:0x8fe8ff,shape:'self',range:()=>4.2*G.k.sweepR,cd:()=>7*G.k.sweepCd,lv:FROST_LV,cast:frostCast},
    beam:{n:'赤焰火龍',ic:'龍',col:0xff8a2a,shape:'line',w:1.4,range:()=>10,cd:()=>5.5*G.k.beamCd,spread:()=>G.k.beamLv>0?Math.min(Math.PI*2,DRAGON_SPREAD[G.k.beamLv]+.12):0,lv:DRAGON_LV,cast:dragonCast},
    thunder:{n:'太極氣旋',ic:'極',col:0xe8e4d8,shape:'auto',range:()=>8,cd:()=>10,lv:TAIJI_LV,cast:taijiCast}}];
const skillTier=()=>Math.min(SKILL_SETS.length-1,save.realm>=15?3:save.realm>=12?2:save.realm>=9?1:0);
// 裝備哪三招改由 skilllib.js 的 equipSkills()（藏經閣自選）

// ---------- 閃現／風雷翼 ----------
function setBlink(){const b=skBtn.blink,on=save.realm>=12,wing=save.realm>=15;b.hidden=!on;SK.blink.n=wing?'風雷翼':'閃現';SK.blink.ic=wing?'翼':'閃';b.querySelector('.ic').textContent=SK.blink.ic;b.querySelector('em').textContent=SK.blink.n;G.blink2=false;blinkTick(0)}
// 閃現／風雷翼 存次數：結丹 1 次；元嬰 初／中／後期 2／3／4 次；化神（化身）6 次。每 5 秒慢慢回 1 次，用一次扣一次（連點間隔 0.35 秒）
const BLINK_CD=5;
const blinkMax=()=>save.realm>=18?6:save.realm>=17?4:save.realm>=16?3:save.realm>=15?2:save.realm>=12?1:0;
function blinkTick(dt){if(!G)return;const m=blinkMax();if(G.blinkMax===undefined){G.blinkMax=m;G.blinkN=m;G.blinkT=0}else if(m!==G.blinkMax){G.blinkN+=Math.max(0,m-G.blinkMax);G.blinkMax=m}
  if(G.blinkN<m){G.blinkT+=dt;if(G.blinkT>=BLINK_CD){G.blinkT=0;G.blinkN++;if(!simming)SFX.play('ready')}}else G.blinkT=0;
  const b=skBtn.blink;if(!b||b.hidden)return;b.style.setProperty('--p',((G.blinkN>=m?0:1-G.blinkT/BLINK_CD)*100).toFixed(1)+'%');
  if(b._t!==''){b._t='';b.querySelector('b').textContent=''}const n2=G.blinkN>0?(m>1?String(G.blinkN):''):Math.ceil(BLINK_CD-G.blinkT)+'s';if(b.dataset.n!==n2)b.dataset.n=n2}
// 風雷翼：掛在身體（body）背上、跟著姿勢走（御劍趴著飛也貼在背上）。翼的骨架＝肩→肘→腕，
//   飛羽從「腕」往外上方開成扇、次級羽沿手臂往下垂、覆羽／小覆羽一層層蓋在上面 → 有翅膀輪廓，不是一圈尖刺。
//   深藍→藍→（飛羽）金橙／（次級羽）青，小覆羽帶金；白色雷弧沿翼骨與羽尖跳。小小一對貼在肩膀兩側（點綴），維持 2 秒淡出。
let WING=null;const V3=new THREE.Vector3();
const WPAL={pri:[0x071650,0x0a44a0,0xd8661a],sec:[0x071650,0x0a58b0,0x1898c8],cov:[0x081c62,0x0c5ab0,0x2a8ad0],mar:[0x6a3a0a,0xb87a24,0xe0a848]};
function featherGeo(pal,dim){const sh=new THREE.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.55,.12,.52,.82,.04,1);sh.bezierCurveTo(-.48,.84,-.55,.12,0,0);
  const g=new THREE.ShapeGeometry(sh,7),P=g.attributes.position,col=new Float32Array(P.count*3),c=new THREE.Color(),A=new THREE.Color(pal[0]),B=new THREE.Color(pal[1]),C=new THREE.Color(pal[2]);
  for(let i=0;i<P.count;i++){const y=Math.max(0,Math.min(1,P.getY(i))),e=Math.abs(P.getX(i))*1.6;if(y<.5)c.copy(A).lerp(B,y/.5);else c.copy(B).lerp(C,Math.pow((y-.5)/.5,1.3));c.lerp(C,Math.min(.35,e*.4*y));c.multiplyScalar(dim);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));return g}
function wingBuild(){const g=new THREE.Group(),M=new THREE.MeshBasicMaterial({fog:false,vertexColors:true,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
  const geos={};for(const k in WPAL)geos[k]=[featherGeo(WPAL[k],1),featherGeo(WPAL[k],.78)];
  const S0=[.04,0],EL=[.42,.3],WR=[.72,.52];const lerp2=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const arm=t=>t<.55?lerp2(S0,EL,t/.55):lerp2(EL,WR,(t-.55)/.45);
  const sides=[];const LM=new THREE.LineBasicMaterial({color:0xeaf6ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthTest:false});
  for(const sd of [1,-1]){const w=new THREE.Group();w.position.set(sd*.24,0,0);w.scale.x=sd;g.add(w);const fe=[];
    const add=(k,i,x,y,ang,L,W,z,ro)=>{const f=new THREE.Mesh(geos[k][i%2],M);f.position.set(x,y,z);f.rotation.z=ang;f.scale.set(L*W,L,1);f.renderOrder=ro;f.userData={ang,L};w.add(f);fe.push(f);return f};
    // 飛羽：腕部往外上→往外下開扇（rotation.z：0＝朝上，負＝往外）
    const pri=[];for(let i=0;i<9;i++){const u=i/8,p=lerp2(WR,[.8,.6],u);pri.push(add('pri',i,p[0],p[1],-(.55+u*1.55),.78-.2*u*u,.24,-.006*i,6))}
    // 次級羽：沿肩→腕往下垂，靠外的稍往外斜
    for(let i=0;i<9;i++){const u=i/8,p=arm(.08+u*.9);add('sec',i,p[0],p[1],-(2.75+u*.42)+Math.PI,.6+.1*u,.26,.01,7)}
    // 大覆羽、小覆羽（金邊），一層層蓋住羽根
    for(let i=0;i<10;i++){const u=i/9,p=arm(.05+u*.95);add('cov',i,p[0],p[1]+.02,-(2.6+u*.6)+Math.PI,.32+.06*u,.34,.02,8)}
    for(let i=0;i<9;i++){const u=i/8,p=arm(.02+u*.98);add('mar',i,p[0],p[1]+.03,-(2.3+u*.8)+Math.PI,.16,.42,.03,9)}
    const lines=[];for(let i=0;i<3;i++){const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:9},()=>new THREE.Vector3())),LM);ln.renderOrder=10;w.add(ln);lines.push(ln)}
    sides.push({w,sd,fe,pri,lines})}
  // 背心（劍匣下方）往後一點，整片略往後傾
  g.position.set(0,.8,-.13);g.rotation.x=-.2;body.add(g);return WING={g,M,LM,sides,arm,WR,t:99,tj:0}}
function wingsShow(){if(simming)return;const W=WING||wingBuild();W.t=0;W.g.visible=true;W.on=true}
function wingsStep(dt){const W=WING;if(!W||!W.on)return;W.t+=dt;const t=W.t,a=Math.min(1,t/.18)*Math.min(1,Math.max(0,(2-t)/.4));
  if(t>=2){W.on=false;W.g.visible=false;W.M.opacity=W.LM.opacity=0;return}
  W.M.opacity=.96*a;W.LM.opacity=.9*a;const sp=1-Math.pow(1-Math.min(1,t/.28),3),fl=Math.sin(t*8);
  W.g.scale.setScalar((.35+.65*sp)*.36);
  for(const S of W.sides){S.w.rotation.y=-S.sd*(.42+.2*fl);S.w.rotation.z=S.sd*(-.45+.08*fl);
    S.pri.forEach((f,i)=>{f.rotation.z=f.userData.ang*(.55+.45*sp)})}
  W.tj-=dt;if(W.tj<=0){W.tj=.05;for(const S of W.sides){S.lines.forEach((ln,li)=>{const P=ln.geometry.attributes.position;
      for(let k=0;k<9;k++){let x,y;const u=k/8;
        if(li===0){const p=W.arm(u);x=p[0];y=p[1]+.02}// 沿翼骨
        else{const f=S.pri[li===1?1+Math.floor(Math.random()*3):4+Math.floor(Math.random()*4)],L=f.scale.y*u,rz=f.rotation.z;x=f.position.x-Math.sin(rz)*L;y=f.position.y+Math.cos(rz)*L}
        const j=(k&&k<8)?(Math.random()-.5)*.09:0;P.setXYZ(k,x+j,y+j,.05)}P.needsUpdate=true});
      S.lines.forEach(ln=>ln.visible=Math.random()<.85)}}}
function blinkSpot(){const hx=HERO.pos.x,hz=HERO.pos.z;let best=null,bs=1e9;
  for(let i=0;i<20;i++){const a=i/20*6.28,r=i%2?4:3;let x=hx+Math.sin(a)*r,z=hz+Math.cos(a)*r;if(arenaOn()&&Math.hypot(x,z)>ARENA-1)continue;let s=0;
    for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-x,e.z-z);if(d<3.5)s+=(3.5-d)}
    for(const w of warnPool)if(w.on&&Math.hypot(w.x-x,w.z-z)<w.r+.8)s+=40;for(const h of HZ)if(h.k!=='wave'&&Math.hypot(h.x-x,h.z-z)<(h.r||h.len||h.R||3))s+=20;
    if(boss.alive&&Math.hypot(boss.x-x,boss.z-z)<boss.r+2)s+=30;s+=Math.random()*.3;if(s<bs){bs=s;best=[x,z]}}
  return {pt:best||[hx,hz-3]}}
function blinkCast(A){const [tx0,tz0]=A.pt,hx=HERO.pos.x,hz=HERO.pos.z;let dx=tx0-hx,dz=tz0-hz,d=Math.hypot(dx,dz)||1;const R=SK.blink.range();if(d>R){dx*=R/d;dz*=R/d;d=R}
  const tx=hx+dx,tz=hz+dz;SFX.play('soul');buzz(15);G.iframe=Math.max(G.iframe,.2);root.position.x=tx;root.position.z=tz;root.rotation.y=Math.atan2(dx,dz);
  G.blinkN=Math.max(0,(G.blinkN||0)-1);if(save.realm>=15)wingsShow();
  const m=new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({map:wBeamTex,color:0x9a5aff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(hx,.9,hz);m.rotation.y=Math.atan2(dx,dz);m.scale.set(.9,1,d);scene.add(m);
  act(.35,t=>{m.material.opacity=1-t/.35;m.scale.x=.9*(1-t/.35)+.1},()=>{scene.remove(m);m.material.dispose()});
  for(let i=0;i<6;i++){const k=i/5;fx({p:tmp.set(hx+dx*k,.6+Math.random()*.8,hz+dz*k),col:i%2?0xd8b0ff:0x9a5aff,add:true,life:.45,s0:1.1,s1:.2,op:.9,vy:.4})}
  fx({p:tmp.set(tx,.4,tz),col:0xc89aff,add:true,life:.35,s0:.6,s1:2.6,op:.9,vy:0});if(save.realm>=15)boltAt(tx,tz,0,0,0xd8c8ff,.06,6)}
