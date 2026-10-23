/* ================= 三個普通技能：隨境界換一套 =================
   煉氣：青竹劍（綠扇形橫掃）、劍氣長虹（紅直線→散射）、五雷咒（紫色連鎖閃電，點一下自動追妖）
   築基：寒霜劍輪（冰藍劍輪從身邊飛出，緩速→冰封）、赤焰火龍（火龍沿直線飛、留下燃燒）、太極氣旋（自動找妖最多處，捲進來再爆開）
   結丹、元嬰：之後跟著章節做（企劃.md「技能隨境界置換」）。
   進化卡共用：sweepUp／beamUp／thUp 的等級 G.k.*Lv，每套技能自己解釋每一級是什麼。 */
// ---------- 五雷咒・連鎖閃電 ----------
const TH_LV2=['紫電連環：多跳 3 隻，每道雷再電旁邊 2 隻','雙鏈：同時放出兩條連鎖閃電','紫霄神雷：最後一擊劈下巨大天雷柱、大範圍麻痺'];
function pickNear(x,z,r,used){let best=null,bd=r*r;for(const e of enemies){if(e.dead||used.has(e))continue;const d=(e.x-x)**2+(e.z-z)**2;if(d<bd&&onScreen(e.x,.4,e.z)){bd=d;best=e}}return best}
function chainCast(){const lv=G.k.thLv,hops=G.k.thN+(lv>=1?3:0),dmg=swordDmg()*2.8*G.k.thD,used=new Set(),hx=HERO.pos.x,hz=HERO.pos.z,R=SK.thunder.range();
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
const frostRing=(()=>{const g=new THREE.Group();g.visible=false;scene.add(g);const blades=[];
  for(let i=0;i<12;i++){const b=new THREE.Group();g.add(b);part(new THREE.BoxGeometry(.11,.025,.95),iceMat,b,{ol:false});const tp=new THREE.ConeGeometry(.075,.26,4);tp.rotateX(Math.PI/2);part(tp,iceMat,b,{p:[0,0,.6],ol:false});
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0x8fe8ff,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(1.2,1.2,1);b.add(s);blades.push(b)}
  const disc=new THREE.Mesh(new THREE.RingGeometry(.9,1,64).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x8fe8ff,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));disc.visible=false;scene.add(disc);
  return {g,blades,disc}})();
function frostCast(){const lv=G.k.sweepLv,R=SK.sweep.range(),dmg=swordDmg()*4.6*G.k.sweepD,passes=lv>=2?2:1,T=.42,life=passes*T+.25,hit=[new Set(),new Set()];
  SFX.play('sweep');SFX.play('bell');shake=Math.max(shake,.2);buzz(20);frostRing.g.visible=frostRing.disc.visible=true;
  act(life,t=>{const p=Math.min(passes-1,Math.floor(t/T)),k=Math.min(1,(t-p*T)/T),e=1-Math.pow(1-k,2),r=p===0?.4+(R-.4)*e:R-(R-.6)*e,hx=HERO.pos.x,hz=HERO.pos.z;
      frostRing.g.position.set(hx,.8,hz);frostRing.blades.forEach((b,i)=>{const a=i/12*Math.PI*2+t*9;b.position.set(Math.sin(a)*r,0,Math.cos(a)*r);b.rotation.y=a+Math.PI/2});
      frostRing.disc.position.set(hx,.07,hz);frostRing.disc.scale.setScalar(Math.max(.05,r));frostRing.disc.material.opacity=.6*(t>life-.25?Math.max(0,(life-t)/.25):1);if(t>life-.25)frostRing.g.visible=false;
      if(t>passes*T)return;const H=hit[p];let killed=0;
      for(const en of enemies){if(en.dead||H.has(en))continue;const dx=en.x-hx,dz=en.z-hz,d=Math.hypot(dx,dz);
        if(Math.abs(d-r)<.6+en.r||(p===0&&d<r)){H.add(en);en.slowT=3;if(lv>=3)en.stun=Math.max(en.stun||0,1.5);hurtEnemy(en,dmg,dx/(d||1)*.8,dz/(d||1)*.8,false,5);if(en.dead)killed++;
          if(!simming)fx({p:tmp.set(en.x,.7,en.z),col:0xbff4ff,add:true,life:.3,s0:1,s1:.2,op:.9,vy:0})}}
      if(boss.alive&&!H.has(boss)){const d=Math.hypot(boss.x-hx,boss.z-hz);if(Math.abs(d-r)<.6+boss.r||d<r){H.add(boss);hurtBoss(dmg)}}
      if(killed){G.slow=Math.max(G.slow,.06);shake=Math.max(shake,.3)}},
    ()=>{frostRing.g.visible=frostRing.disc.visible=false})}
// ---------- 赤焰火龍（築基・橘紅）----------
const DRAGON_N=[1,2,3,5,8],DRAGON_SPREAD=[0,.5,.9,1.6,Math.PI*2];
const DRAGON_LV=['兩條火龍','三條火龍','五條火龍','八條火龍，四面八方'];
function dragonCast(A){const lv=G.k.beamLv,L=SK.beam.range(),a0=Math.atan2(A.dir[0],A.dir[1]),n=DRAGON_N[lv],sp=DRAGON_SPREAD[lv],dmg=swordDmg()*6*G.k.beamD*[1,.9,.8,.7,.6][lv],hx=HERO.pos.x,hz=HERO.pos.z,hitN=new Map();
  SFX.play('beam');SFX.play('boom');shake=Math.max(shake,.2);
  for(let j=0;j<n;j++){const a=lv>=4?a0+j/n*Math.PI*2:n>1?a0-sp/2+sp*j/(n-1):a0,dx=Math.sin(a),dz=Math.cos(a),mine=new Set(),T=L/15;let trail=0;
    const segs=[];if(!simming)for(let i=0;i<7;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:i===0?0xffe08a:i<3?0xff8a2a:0xff4a1a,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));
      const sc=i===0?1.7:1.35-i*.12;s.scale.set(sc,sc,1);s.visible=false;scene.add(s);segs.push(s)}
    act(T+.4,t=>{segs.forEach((s,i)=>{const tt=t-i*.05;if(tt<0||tt>T){s.visible=false;return}const dd=tt/T*L,w=Math.sin(dd*1.3+j)*.5;s.visible=true;s.position.set(hx+dx*dd+dz*w,.75+Math.sin(dd*2.2)*.2,hz+dz*dd-dx*w)});
        if(t>T)return;const dd=t/T*L,w=Math.sin(dd*1.3+j)*.5,x=hx+dx*dd+dz*w,z=hz+dz*dd-dx*w;
        if(!simming)while(trail<dd){trail+=1;fx({p:tmp.set(hx+dx*trail,.3,hz+dz*trail),col:0xff7a2a,add:true,life:1.5,s0:1,s1:.4,op:.7,vy:.3})}
        for(const en of enemies){if(en.dead||mine.has(en))continue;if((en.x-x)**2+(en.z-z)**2<(1+en.r)**2){mine.add(en);const c=hitN.get(en)||0;if(c>=2)continue;hitN.set(en,c+1);en.burn=3;en.burnD=dmg*.12;hurtEnemy(en,dmg,dx*.8,dz*.8,false,4.5)}}
        if(boss.alive&&!mine.has(boss)&&(boss.x-x)**2+(boss.z-z)**2<(1+boss.r)**2){mine.add(boss);const c=hitN.get(boss)||0;if(c<3){hitN.set(boss,c+1);hurtBoss(dmg)}}},
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
function taijiCast(){const lv=G.k.thLv,R=SK.thunder.range(),r=2.4*(lv>=1?1.3:1),dmg=swordDmg()*5.5*G.k.thD,spots=crowdSpots(HERO.pos.x,HERO.pos.z,R,r,lv>=2?2:1);
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
function setSkills(t){const S=SKILL_SETS[t];
  for(const k of ['sweep','beam','thunder']){SK[k]=S[k];const b=skBtn[k],c='#'+S[k].col.toString(16).padStart(6,'0');b.querySelector('.ic').textContent=S[k].ic;b.querySelector('em').textContent=S[k].n;b.setAttribute('aria-label',S[k].n);
    b.style.borderColor=c;b.style.boxShadow=`0 0 12px ${c}66`;b.querySelector('.ic').style.textShadow=`0 0 8px ${c}`}}
setSkills(0);
