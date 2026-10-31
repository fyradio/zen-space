/* ================= 技能庫：四個境界 × 三格 × 各三招，藏經閣自選 =================
   第一格近身（sweep）、第二格方向（beam，拖曳瞄準）、第三格自動（thunder，點一下）。
   到了境界送該境界的預設招（★）；其他兩招用靈石在藏經閣「參悟」。低階招也能裝。
   強度：同一境界的三招拉平（NORM 表是實測校正值），每高一個大境界 ×1.3（castSkill 時乘上 SK.x.mul）。
   第二格的進化改成三級（G.k.beamStep 0→3），每級大跳；舊的直線招把三級對應到原本的 0/2/3/4 級。 */
const sprM=(col,tex=glowTex,op=1)=>new THREE.SpriteMaterial({map:tex,color:col,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false});
const spr=(col,s=1,tex)=>{const m=new THREE.Sprite(sprM(col,tex));m.scale.set(s,s,1);scene.add(m);return m};
const unspr=o=>{scene.remove(o);if(o.material)o.material.dispose()};
const talTex2=ctex(48,96,(x,w,h)=>{x.fillStyle='#f2d36a';x.fillRect(6,4,w-12,h-8);x.strokeStyle='#b0201a';x.lineWidth=4;x.beginPath();x.moveTo(24,14);x.lineTo(24,82);x.moveTo(14,30);x.lineTo(34,30);x.moveTo(12,50);x.quadraticCurveTo(24,40,36,52);x.moveTo(16,68);x.lineTo(32,68);x.stroke()});
const coinTex=ctex(64,64,(x)=>{x.fillStyle='#e8c25a';x.beginPath();x.arc(32,32,28,0,7);x.fill();x.strokeStyle='#8a6a1a';x.lineWidth=3;x.stroke();x.fillStyle='#000';x.fillRect(24,24,16,16)});
const wBeamTex=ctex(64,16,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.3,'rgba(255,255,255,.75)');g.addColorStop(.5,'rgba(255,255,255,1)');g.addColorStop(.7,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h)});
const GHOSTY=new Set(['ghost','lgh','drown','lamp','yaksha','paint','skel','jiang','umb','foxling','paper']);
function nearE(x,z,R,skip){let b=null,bd=R*R;for(const e of enemies){if(e.dead||(skip&&skip.has(e)))continue;const d=(e.x-x)**2+(e.z-z)**2;if(d<bd){bd=d;b=e}}return b}
// 範圍傷害：o={kb,stun,slow,burn,root,mark,boss(預設會打)}
function aoe(x,z,R,dmg,o={}){let n=0;for(const e of enemies){if(e.dead)continue;const dx=e.x-x,dz=e.z-z,d=Math.hypot(dx,dz);if(d>R+e.r)continue;n++;
    if(o.stun)e.stun=Math.max(e.stun||0,o.stun);if(o.slow)e.slowT=Math.max(e.slowT||0,o.slow);if(o.burn){e.burn=o.burn;e.burnD=dmg*.12}if(o.mark)e.markT=o.mark;
    const k=o.kb||0;hurtEnemy(e,dmg*(o.ghost&&GHOSTY.has(e.type)?2:1),dx/(d||1)*k,dz/(d||1)*k,!!o.crit,o.fly??3)}
  if(o.boss!==false&&boss.alive&&Math.hypot(boss.x-x,boss.z-z)<R+boss.r){hurtBoss(dmg*(o.bossMul||1));if(o.bstun)boss.stun=Math.max(boss.stun||0,o.bstun)}return n}
// 直線上：起點 x,z 方向 a、長 L、寬 W
function inLine(px,pz,x,z,a,L,W,r){const dx=Math.sin(a),dz=Math.cos(a),qx=px-x,qz=pz-z,al=qx*dx+qz*dz,pe=Math.abs(qx*dz-qz*dx);return al>-r&&al<L+r&&pe<W/2+r}
// 飛行物：sprite 沿方向飛，可追蹤；碰到就 onHit（回傳 true 表示結束）
function shot(o){const s=spr(o.col,o.size||.8,o.tex);let x=o.x,z=o.z,vx=o.dx,vz=o.dz,done=false,tg=null;const hit=new Set();let n=o.pierce||1;if(o.rot!==undefined)s.material.rotation=o.rot;
  act(o.life,(t,dt)=>{if(done)return;if(o.home&&t>(o.homeDelay||0)){if(!tg||tg.dead)tg=nearE(x,z,o.seek||7,hit);if(tg){const ax=tg.x-x,az=tg.z-z,l=Math.hypot(ax,az)||1,k=Math.min(1,dt*o.home);vx+=(ax/l-vx)*k;vz+=(az/l-vz)*k;const l2=Math.hypot(vx,vz)||1;vx/=l2;vz/=l2}}
      const sp=o.spdF?o.spdF(t):o.spd;x+=vx*sp*dt;z+=vz*sp*dt;s.position.set(x,o.y??.8,z);if(o.spin)s.material.rotation+=dt*o.spin;if(o.trail&&!simming&&Math.random()<.5)fx({p:tmp.set(x,o.y??.8,z),col:o.col,add:true,life:.3,s0:(o.size||.8)*.7,s1:.1,op:.7,vy:0});
      const end=()=>{done=true;s.visible=false;if(o.end)o.end(x,z)};
      for(const e of enemies){if(e.dead||hit.has(e))continue;if((e.x-x)**2+(e.z-z)**2<(o.r+e.r)**2){hit.add(e);if(o.onHit)o.onHit(e,x,z,vx,vz);else hurtEnemy(e,o.dmg,vx*.6,vz*.6,false,3);if(--n<=0){end();return}}}
      if(boss.alive&&!hit.has(boss)&&(boss.x-x)**2+(boss.z-z)**2<(o.r+boss.r)**2){hit.add(boss);hurtBoss(o.bossDmg??o.dmg);if(--n<=0){end();return}}
      if(t>=o.life-.03){end()}},()=>{if(!done&&o.end)o.end(x,z);unspr(s)})}
const ringFx=(x,z,R,col,life=.45)=>fx({p:tmp.set(x,.35,z),col,add:true,life,s0:1,s1:R*2.4,op:.95,vy:0});
const aimD=A=>Math.atan2(A.dir[0],A.dir[1]);
const bs=()=>G.k.beamStep||0;// 第二格三級
const SL=()=>G.k.sweepLv,TL=()=>G.k.thLv;

/* ================= 煉氣 ================= */
// 桃木三刺：扇形連刺，擊退
function peachCast(A){const lv=SL(),a0=aimD(A),R=SK.sweep.range(),n=lv>=2?5:3,dmg=swordDmg()*2.2*G.k.sweepD;
  for(let i=0;i<n;i++)act(i*.11,null,()=>{const a=a0+(i%2?.25:-.25)*(i?1:0),hx=HERO.pos.x,hz=HERO.pos.z;SFX.play('sweep');
    const m=new THREE.Mesh(fanGeo(1),new THREE.MeshBasicMaterial({color:0xe0a060,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(hx,.12,hz);m.rotation.y=a;m.scale.setScalar(R);scene.add(m);
    const sw=new THREE.Mesh(new THREE.BoxGeometry(.12,.06,R).translate(0,0,R/2),new THREE.MeshBasicMaterial({color:0xffc890,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));sw.position.set(hx,.9,hz);sw.rotation.y=a;scene.add(sw);
    act(.22,t=>{m.material.opacity=.75*(1-t/.22);sw.scale.z=.4+t/.22*.8;sw.material.opacity=1-t/.22},()=>{scene.remove(m,sw);m.material.dispose();sw.geometry.dispose();sw.material.dispose()});
    const last=i===n-1;for(const e of enemies){if(e.dead)continue;const dx=e.x-hx,dz=e.z-hz,d=Math.hypot(dx,dz);if(d<R+e.r&&Math.abs(angDiff(Math.atan2(dx,dz),a))<.55){if(last&&lv>=3)e.stun=Math.max(e.stun||0,1);hurtEnemy(e,dmg,dx/(d||1)*(last?2:.7),dz/(d||1)*(last?2:.7),false,last?6:0)}}
    if(boss.alive){const dx=boss.x-hx,dz=boss.z-hz;if(Math.hypot(dx,dz)<R+boss.r&&Math.abs(angDiff(Math.atan2(dx,dz),a))<.6)hurtBoss(dmg)}})}
// 金剛符陣：身邊炸開一圈符紙
function vajraCast(){const lv=SL(),R=SK.sweep.range(),dmg=swordDmg()*4*G.k.sweepD,waves=lv>=2?2:1;
  for(let w=0;w<waves;w++)act(w*.4,null,()=>{const hx=HERO.pos.x,hz=HERO.pos.z,rr=R*(1+w*.2);SFX.play('bell');
    for(let i=0;i<14;i++){const a=i/14*6.28+w*.2;shot({x:hx,z:hz,dx:Math.sin(a),dz:Math.cos(a),spd:rr/.3,life:.3,r:.01,dmg:0,col:0xffe08a,tex:talTex2,size:.5,rot:a,pierce:99,onHit:()=>{}})}
    act(.28,null,()=>{ringFx(hx,hz,rr,0xffd86a);aoe(hx,hz,rr,dmg,{stun:lv>=3?1.5:.5,kb:1})})})}
// 追魂符：符紙飛出、會轉彎追妖，碰到就爆
function talisSeekCast(A){const st=bs(),n=[3,5,8,12][st],a0=aimD(A),dmg=swordDmg()*3.2*G.k.beamD,R=st>=2?2:1.4;SFX.play('beam');
  for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*(st>=3?.5:.22);act(i*.04,null,()=>shot({x:HERO.pos.x,z:HERO.pos.z,dx:Math.sin(a),dz:Math.cos(a),spd:9,life:1.6,r:.35,home:4,homeDelay:.15,seek:8,col:0xffe08a,tex:talTex2,size:.5,spin:6,trail:1,
    onHit:(e,x,z)=>{ringFx(x,z,R,0xff8a3a,.35);aoe(x,z,R,dmg,{burn:st>=1?2:0,kb:.5});if(st>=3&&!simming)for(let k=0;k<2;k++){const b=Math.random()*6.28;shot({x,z,dx:Math.sin(b),dz:Math.cos(b),spd:8,life:.8,r:.35,home:5,seek:6,col:0xffe08a,tex:talTex2,size:.5,onHit:(e2,x2,z2)=>{aoe(x2,z2,1.1,dmg*.5)}})}}}))}}
// 銅錢鏢：一串銅錢穿透，飛到底再回旋
function coinCast(A){const st=bs(),lines=[1,3,5,8][st],a0=aimD(A),L=SK.beam.range(),dmg=swordDmg()*2.4*G.k.beamD;SFX.play('beam');
  for(let j=0;j<lines;j++){const a=lines>1?a0+(j-(lines-1)/2)*(st>=3?.32:.22):a0;for(let c=0;c<4;c++)act(c*.05,null,()=>{const sx=HERO.pos.x,sz=HERO.pos.z;
    shot({x:sx,z:sz,dx:Math.sin(a),dz:Math.cos(a),spdF:t=>t<.55?16:-14,life:1.15,r:.3,pierce:99,dmg,col:0xffe08a,tex:coinTex,size:.32,spin:20,onHit:(e,x,z,vx,vz)=>{if(st>=3)e.stun=Math.max(e.stun||0,.5);hurtEnemy(e,dmg,vx*.3,vz*.3,false,0)}})})}}
// 引雷符：往妖最多處落雷
function talisThunderCast(){const lv=TL(),n=[4,6,6,8][lv],R=1.6,dmg=swordDmg()*3.6*G.k.thD,spots=crowdSpots(HERO.pos.x,HERO.pos.z,SK.thunder.range(),R,n);if(!spots.length)return false;SFX.play('thunder');
  spots.forEach(([x,z],i)=>act(i*.12,null,()=>{boltAt(x,z,0,0,0xffe08a,.08,12);ringFx(x,z,R,0xffe08a,.3);aoe(x,z,R,dmg,{stun:.4});if(lv>=2){const e=nearE(x,z,4);if(e){zap(x,z,e.x,e.z,0xffe08a);hurtEnemy(e,dmg*.6)}}
    if(lv>=3&&i===spots.length-1)act(.3,null,()=>{boltAt(x,z,0,0,0xffffff,.25,16);ringFx(x,z,3.4,0xfff0b0,.5);aoe(x,z,3.4,dmg*2.5,{stun:1});shake=Math.max(shake,.5)})}));return true}
// 鎮魂鈴：搖鈴震波，周圍妖定身
function soulBellCast(){const lv=TL(),R=5*(lv>=1?1.25:1),dmg=swordDmg()*3*G.k.thD,rings=lv>=2?2:1;SFX.play('bell');
  const b=spr(0xffd86a,1.6);b.position.set(HERO.pos.x,2.6,HERO.pos.z);act(.9,t=>{b.position.set(HERO.pos.x,2.6+Math.sin(t*20)*.08,HERO.pos.z);b.material.opacity=1-t/.9},()=>unspr(b));
  for(let w=0;w<rings;w++)act(w*.35,null,()=>{const hx=HERO.pos.x,hz=HERO.pos.z;SFX.play('bell');wave&&0;ringFx(hx,hz,R,0xffe08a,.55);fx({p:tmp.set(hx,.3,hz),col:0xb0fff0,add:true,life:.7,s0:1,s1:R*2.2,op:.6,vy:0});
    aoe(hx,hz,R,dmg,{stun:lv>=3?2.5:1.5,bstun:.5});if(lv>=3)G.hp=Math.min(G.maxhp,G.hp+G.maxhp*.05)});return true}

/* ================= 築基 ================= */
// 烈焰劍舞：火劍繞身三圈並點燃
function fireDanceCast(){const lv=SL(),R=2.6*G.k.sweepR,n=lv>=2?5:3,dmg=swordDmg()*1.5*G.k.sweepD,T=1.5;SFX.play('sweep');SFX.play('boom');
  const sw=[];for(let i=0;i<n;i++){const s=spr(0xff7a2a,1.2);sw.push(s)}const hitT=new Map();
  act(T,(t,dt)=>{const hx=HERO.pos.x,hz=HERO.pos.z;sw.forEach((s,i)=>{const a=t*12+i/n*6.28;s.position.set(hx+Math.sin(a)*R,.9,hz+Math.cos(a)*R);if(!simming&&Math.random()<.4)fx({p:tmp.copy(s.position),col:0xff5a1a,add:true,life:.35,s0:.8,s1:.1,op:.8,vy:.5})});
      for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-hx,e.z-hz);if(Math.abs(d-R)<.8+e.r&&(hitT.get(e)||-1)<t-.3){hitT.set(e,t);e.burn=3;e.burnD=dmg*.2;hurtEnemy(e,dmg,0,0,false,0)}}
      if(boss.alive&&Math.abs(Math.hypot(boss.x-hx,boss.z-hz)-R)<.8+boss.r&&(hitT.get(boss)||-1)<t-.3){hitT.set(boss,t);hurtBoss(dmg)}},
    ()=>{sw.forEach(unspr);if(lv>=3){const hx=HERO.pos.x,hz=HERO.pos.z;ringFx(hx,hz,R+1,0xff7a2a,.5);aoe(hx,hz,R+1,dmg*3,{burn:3,kb:1.5});SFX.play('boom')}})}
// 石牢：身邊突出一圈石刺，定身
const spikeGeo=new THREE.ConeGeometry(.28,1.3,5).translate(0,.65,0);
function stoneCast(){const lv=SL(),R=SK.sweep.range(),dmg=swordDmg()*4*G.k.sweepD*(lv>=3?1.5:1),rings=lv>=2?2:1;SFX.play('boom');shake=Math.max(shake,.3);
  for(let w=0;w<rings;w++)act(w*.3,null,()=>{const hx=HERO.pos.x,hz=HERO.pos.z,rr=R*(w?1.35:1),n=Math.round(rr*5),M=toon(0x7a6a58),ms=[];
    for(let i=0;i<n;i++){const a=i/n*6.28,m=new THREE.Mesh(spikeGeo,M);m.position.set(hx+Math.sin(a)*rr,0,hz+Math.cos(a)*rr);m.rotation.set((Math.random()-.5)*.4,0,(Math.random()-.5)*.4);m.scale.setScalar(.01);scene.add(m);ms.push(m)}
    act(1.4,t=>{const k=t<.15?t/.15:t>1.1?Math.max(.01,1-(t-1.1)/.3):1;ms.forEach(m=>m.scale.setScalar(Math.max(.01,k)))},()=>{ms.forEach(m=>scene.remove(m));M.dispose()});
    aoe(hx,hz,rr,dmg,{stun:lv>=3?2.5:1.5,bstun:.6})})}
// 冰錐連射：扇面射出冰錐、緩速
function iceConeCast(A){const st=bs(),n=[5,9,15,24][st],a0=aimD(A),spread=[.8,1.3,2,Math.PI*2][st],dmg=swordDmg()*2.4*G.k.beamD;SFX.play('beam');
  for(let i=0;i<n;i++){const a=st>=3?a0+i/n*6.28:a0-spread/2+spread*i/(n-1);act((i%5)*.03,null,()=>shot({x:HERO.pos.x,z:HERO.pos.z,dx:Math.sin(a),dz:Math.cos(a),spd:14,life:.75,r:.3,pierce:st>=2?2:1,dmg,col:0xbff4ff,size:.6,trail:1,
    onHit:(e,x,z,vx,vz)=>{e.slowT=3;if(st>=3)e.stun=Math.max(e.stun||0,.8);hurtEnemy(e,dmg,vx*.4,vz*.4,false,0)}}))}}
// 風刃：旋風直線推進，把妖捲走
function windCast(A){const st=bs(),n=[1,1,2,3][st],L=SK.beam.range()*(st>=3?1.4:1),W=st>=1?2.4:1.8,a0=aimD(A),dmg=swordDmg()*1.3*G.k.beamD;SFX.play('beam');
  for(let j=0;j<n;j++){const a=n>1?a0+(j-(n-1)/2)*.35:a0,dx=Math.sin(a),dz=Math.cos(a),sx=HERO.pos.x,sz=HERO.pos.z,T=L/8,parts=[],hitT=new Map();
    for(let i=0;i<5;i++)parts.push(spr(0xd8fff0,1.4-i*.15));
    act(T,(t,dt)=>{const d=t/T*L,x=sx+dx*d,z=sz+dz*d;parts.forEach((p,i)=>{const a2=t*14+i*1.3;p.position.set(x+Math.sin(a2)*.4*(i*.3),.3+i*.35,z+Math.cos(a2)*.4*(i*.3));p.material.opacity=.7});
        if(!simming&&Math.random()<.6)fx({p:tmp.set(x+(Math.random()-.5),.4,z+(Math.random()-.5)),col:0xc8ffe8,add:true,life:.4,s0:.7,s1:.1,op:.6,vy:1});
        for(const e of enemies){if(e.dead||e.elite)continue;const q=Math.hypot(e.x-x,e.z-z);if(q<W/2+e.r){e.x+=(x+dx*.5-e.x)*Math.min(1,dt*6);e.z+=(z+dz*.5-e.z)*Math.min(1,dt*6);if((hitT.get(e)||-1)<t-.25){hitT.set(e,t);hurtEnemy(e,dmg,0,0,false,0)}}}
        if(boss.alive&&Math.hypot(boss.x-x,boss.z-z)<W/2+boss.r&&(hitT.get(boss)||-1)<t-.25){hitT.set(boss,t);hurtBoss(dmg)}},
      ()=>{parts.forEach(unspr);aoe(sx+dx*L,sz+dz*L,W,dmg*2,{kb:1.5})})}}
// 落石術：往妖群頭上砸巨石
const rockGeo=new THREE.DodecahedronGeometry(.9,0);
function rockCast(){const lv=TL(),n=[1,2,3,3][lv],R=2.2,dmg=swordDmg()*6*G.k.thD,spots=crowdSpots(HERO.pos.x,HERO.pos.z,SK.thunder.range(),R,n);if(!spots.length)return false;
  spots.forEach(([x,z],i)=>{const M=toon(0x6a5a4a),m=new THREE.Mesh(rockGeo,M);m.position.set(x,9,z);scene.add(m);const sh=new THREE.Mesh(new THREE.CircleGeometry(R,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.35,depthWrite:false}));sh.position.set(x,.05,z);scene.add(sh);
    act(.55+i*.1,t=>{const k=Math.max(0,(t-i*.1)/.55);m.position.y=9*(1-k*k);m.rotation.x+=.1;sh.scale.setScalar(.4+.6*k)},()=>{scene.remove(m,sh);M.dispose();sh.material.dispose();SFX.play('boom');shake=Math.max(shake,.4);
      fx({p:tmp.set(x,.4,z),col:0x8a7a6a,life:.7,s0:1,s1:R*2.6,op:.8,vy:.6});aoe(x,z,R,dmg,{stun:.8,kb:1.2});
      if(lv>=3)for(let k=0;k<6;k++){const b=k/6*6.28;shot({x,z,dx:Math.sin(b),dz:Math.cos(b),spd:10,life:.4,r:.35,pierce:3,dmg:dmg*.4,col:0xb8a890,size:.5})}})});return true}
// 藤縛：地上長藤纏住、帶毒
function vineCast(){const lv=TL(),n=[3,4,5,6][lv],R=1.8,T=lv>=2?3:2,dmg=swordDmg()*3*G.k.thD,spots=crowdSpots(HERO.pos.x,HERO.pos.z,SK.thunder.range(),R,n);if(!spots.length)return false;SFX.play('soul');
  spots.forEach(([x,z])=>{const M=toon(0x3a7a2a),vs=[];for(let i=0;i<7;i++){const v=new THREE.Mesh(new THREE.TorusGeometry(.5+Math.random()*.7,.06,5,16,Math.PI*1.4),M);v.position.set(x+(Math.random()-.5)*1.4,.2,z+(Math.random()-.5)*1.4);v.rotation.set(Math.PI/2+(Math.random()-.5)*.6,0,Math.random()*6.28);v.scale.setScalar(.01);scene.add(v);vs.push(v)}
    aoe(x,z,R,dmg*.5,{stun:T,bstun:lv>=3?1:0});let tick=0;
    act(T,(t,dt)=>{vs.forEach(v=>v.scale.setScalar(Math.min(1,t*5)*(t>T-.3?Math.max(.01,(T-t)/.3):1)));tick-=dt;if(tick<=0){tick=.5;for(const e of enemies)if(!e.dead&&(e.x-x)**2+(e.z-z)**2<R*R){hurtEnemy(e,dmg*.25*(lv>=3?1.6:1),0,0,false,0);if(!simming)fx({p:tmp.set(e.x,.6,e.z),col:0x7aff5a,add:true,life:.4,s0:.6,s1:.1,op:.8,vy:1})}}},
      ()=>{vs.forEach(v=>{scene.remove(v);v.geometry.dispose()});M.dispose()})});return true}

/* ================= 結丹 ================= */
// 乾坤圈：金圈擴出去再收回，打兩次
function ringCast(){const lv=SL(),R=SK.sweep.range()*1.1,dmg=swordDmg()*3*G.k.sweepD,n=lv>=2?2:1;SFX.play('sweep');
  for(let j=0;j<n;j++){const M=new THREE.MeshBasicMaterial({color:0xffd86a,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}),m=new THREE.Mesh(new THREE.TorusGeometry(1,.09,8,48).rotateX(Math.PI/2),M);scene.add(m);const hit=[new Set(),new Set()];
    act(1,t=>{const hx=HERO.pos.x,hz=HERO.pos.z,k=t<.5?t/.5:1-(t-.5)/.5,r=.5+(R*(1+j*.3)-.5)*Math.sin(k*Math.PI/2),p=t<.5?0:1;m.position.set(hx,.8+j*.3,hz);m.scale.setScalar(r);m.rotation.y+=.3;
        for(const e of enemies){if(e.dead||hit[p].has(e))continue;const d=Math.hypot(e.x-hx,e.z-hz);if(Math.abs(d-r)<.5+e.r){hit[p].add(e);if(lv>=3)e.stun=Math.max(e.stun||0,1);hurtEnemy(e,dmg,0,0,false,0)}}
        if(boss.alive&&!hit[p].has(boss)&&Math.abs(Math.hypot(boss.x-hx,boss.z-hz)-r)<.5+boss.r){hit[p].add(boss);hurtBoss(dmg)}},()=>{scene.remove(m);m.geometry.dispose();M.dispose()})}}
// 玄龜震：龜殼震地，擋一下傷害並擊退
function turtleCast(){const lv=SL(),R=SK.sweep.range(),dmg=swordDmg()*4.2*G.k.sweepD;SFX.play('boom');shake=Math.max(shake,.45);G.turtle=Math.max(G.turtle||0,lv>=2?2:1);
  const hx=HERO.pos.x,hz=HERO.pos.z,M=new THREE.MeshBasicMaterial({color:0x5ad8a0,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),sh=new THREE.Mesh(new THREE.SphereGeometry(1.3,16,8,0,6.28,0,Math.PI/2),M);sh.position.set(hx,0,hz);scene.add(sh);
  const hexes=new THREE.Mesh(new THREE.CircleGeometry(1.3,6).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x5ad8a0,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));sh.add(hexes);
  act(.7,t=>{sh.position.set(HERO.pos.x,0,HERO.pos.z);sh.scale.setScalar(1+t*.4);M.opacity=.5*(1-t/.7)},()=>{scene.remove(sh);M.dispose();hexes.material.dispose()});
  ringFx(hx,hz,R,0x5ad8a0);aoe(hx,hz,R,dmg,{kb:2.2,fly:6,stun:lv>=3?1.2:0})}
// 照妖鏡光：被照到的妖 3 秒內受傷加倍
function mirrorCast(A){const st=bs(),n=[1,2,3,5][st],a0=aimD(A),L=SK.beam.range(),W=2.4,dmg=swordDmg()*3.6*G.k.beamD,mk=st>=3?5:3;SFX.play('beam');SFX.play('gold');
  const mir=spr(0xffe9a0,1.4);mir.position.set(HERO.pos.x,2.2,HERO.pos.z);act(.6,t=>{mir.material.opacity=1-t/.6},()=>unspr(mir));
  for(let j=0;j<n;j++){const a=n>1?a0+(j-(n-1)/2)*.4:a0,hx=HERO.pos.x,hz=HERO.pos.z;const m=new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({map:wBeamTex,color:0xffd86a,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(hx,.9,hz);m.rotation.y=a;m.scale.set(W,1,L);scene.add(m);
    act(.5,t=>{m.material.opacity=1-t/.5},()=>{scene.remove(m);m.material.dispose()});
    for(const e of enemies)if(!e.dead&&inLine(e.x,e.z,hx,hz,a,L,W,e.r)){e.markT=mk;hurtEnemy(e,dmg,0,0,true,0);if(!simming)fx({p:tmp.set(e.x,1.2,e.z),col:0xffe9a0,add:true,life:.5,s0:.8,s1:.2,op:.9,vy:.5})}
    if(boss.alive&&inLine(boss.x,boss.z,hx,hz,a,L,W,boss.r)){boss.markT=mk;hurtBoss(dmg)}}}
// 縛妖索：金繩串起沿路的妖，綁住精英或魔王並拉近
function ropeCast(A){const st=bs(),n=[1,1,2,3][st],a0=aimD(A),L=SK.beam.range()*1.1,W=st>=1?1.6:1.1,dmg=swordDmg()*3.4*G.k.beamD,hold=st>=2?2.2:1.4;SFX.play('beam');
  for(let j=0;j<n;j++){const a=n>1?a0+(j-(n-1)/2)*.4:a0,hx=HERO.pos.x,hz=HERO.pos.z,dx=Math.sin(a),dz=Math.cos(a);
    const pts=[];for(let i=0;i<=16;i++)pts.push(new THREE.Vector3());const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xffd86a,transparent:true}));scene.add(line);
    act(.7,t=>{const k=Math.min(1,t/.2);for(let i=0;i<=16;i++){const d=L*k*i/16;pts[i].set(hx+dx*d+Math.sin(i+t*20)*.08,.8,hz+dz*d)}line.geometry.setFromPoints(pts);line.material.opacity=t>.5?(.7-t)/.2:1},()=>{scene.remove(line);line.geometry.dispose();line.material.dispose()});
    for(const e of enemies)if(!e.dead&&inLine(e.x,e.z,hx,hz,a,L,W,e.r)){e.stun=Math.max(e.stun||0,hold);if(e.elite){e.x+=(hx-e.x)*.5;e.z+=(hz-e.z)*.5}hurtEnemy(e,dmg,0,0,false,0)}
    if(boss.alive&&inLine(boss.x,boss.z,hx,hz,a,L,W,boss.r)){boss.stun=Math.max(boss.stun||0,hold*.6);boss.x+=(hx-boss.x)*.35;boss.z+=(hz-boss.z)*.35;hurtBoss(dmg)}}}
// 五行珠：五色光珠輪流射出，各帶效果（金暴擊、木定身、水緩速、火燃燒、土暈）
const WUXING=[[0xffe08a,{crit:1}],[0x6aff7a,{stun:1.2}],[0x6ac8ff,{slow:3}],[0xff6a2a,{burn:3}],[0xc8a06a,{stun:.8,kb:1}]];
function orbCast(){const lv=TL(),n=[5,8,8,12][lv],R=lv>=2?1.8:1.3,dmg=swordDmg()*2.6*G.k.thD,used=new Set();let cnt=0;
  for(let i=0;i<n;i++){const tg=i===0&&boss.alive&&bossOnScreen()?boss:pickNear(HERO.pos.x,HERO.pos.z,SK.thunder.range(),used);if(!tg)break;used.add(tg);cnt++;const [col,o]=WUXING[i%5];
    act(i*.08,null,()=>{const a=Math.atan2(tg.x-HERO.pos.x,tg.z-HERO.pos.z);shot({x:HERO.pos.x,z:HERO.pos.z,dx:Math.sin(a),dz:Math.cos(a),spd:13,life:1.2,r:.4,home:8,seek:9,col,size:.8,trail:1,onHit:(e,x,z)=>{ringFx(x,z,R,col,.3);aoe(x,z,R,dmg*(o.crit?1.6:1),o)},end:(x,z)=>{}})})}
  if(!cnt)return false;SFX.play('gold');return true}
// 聚魂瓶：把妖吸到一點再爆開
function gourdCast(){const lv=TL(),R=3*(lv>=1?1.25:1),dmg=swordDmg()*5.5*G.k.thD,spots=crowdSpots(HERO.pos.x,HERO.pos.z,SK.thunder.range(),R*.6,lv>=2?2:1);if(!spots.length)return false;SFX.play('wan');
  spots.forEach(([x,z])=>{const g=spr(0x7affd0,1.8);g.position.set(x,1.6,z);let tick=0;
    act(1.6,(t,dt)=>{g.material.rotation+=dt*4;g.scale.setScalar(1.8+Math.sin(t*10)*.15);if(t<1.2){for(const e of enemies){if(e.dead||e.elite)continue;const dx=x-e.x,dz=z-e.z,d=Math.hypot(dx,dz);if(d<R+1.5&&d>.2){const v=Math.min(d,5*dt);e.x+=dx/d*v;e.z+=dz/d*v}}
        tick-=dt;if(tick<=0&&!simming){tick=.08;const a=Math.random()*6.28,r=R+1;fx({p:tmp.set(x+Math.sin(a)*r,.8,z+Math.cos(a)*r),col:0x7affd0,add:true,life:.4,s0:.6,s1:.1,op:.8,vy:0})}}},
      ()=>{unspr(g);SFX.play('boom');shake=Math.max(shake,.4);ringFx(x,z,R,0x7affd0,.5);aoe(x,z,R,dmg*(lv>=3?1.4:1),{kb:1.8,fly:6})})});return true}

/* ================= 元嬰 ================= */
// 周天劍陣：36 把飛劍列陣旋轉，收攏絞殺，再向外爆射
const swordGeo=new THREE.ConeGeometry(.07,.9,4).rotateX(Math.PI/2);
function zhoutianCast(){const lv=SL(),R=SK.sweep.range()*1.1,n=lv>=3?72:36,cyc=lv>=2?2:1,dmg=swordDmg()*2.4*G.k.sweepD;SFX.play('wan');
  const M=new THREE.MeshBasicMaterial({color:0xbff8ff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}),sw=[];for(let i=0;i<n;i++){const m=new THREE.Mesh(swordGeo,M);scene.add(m);sw.push(m)}
  const C=1.1,T=C*cyc;let fired=-1,inn=-1;
  act(T,t=>{const c=Math.min(cyc-1,Math.floor(t/C)),u=t-c*C,hx=HERO.pos.x,hz=HERO.pos.z;let r;
      if(u<.45)r=R;else if(u<.65)r=R-(R-.4)*(u-.45)/.2;else r=.4+(R*1.7-.4)*Math.min(1,(u-.65)/.35);
      sw.forEach((m,i)=>{const a=i/n*6.28+t*(u<.45?6:2),y=.8+(i%2)*.3;m.position.set(hx+Math.sin(a)*r,y,hz+Math.cos(a)*r);m.rotation.y=u<.65?a+Math.PI/2:a});M.opacity=t>T-.2?(T-t)/.2:1;
      if(u>=.6&&inn<c){inn=c;SFX.play('sweep');aoe(hx,hz,R,dmg,{stun:.4});shake=Math.max(shake,.3)}
      if(u>=.8&&fired<c){fired=c;ringFx(hx,hz,R*1.7,0xbff8ff,.4);aoe(hx,hz,R*1.7,dmg*1.2,{kb:1.6,fly:5})}},
    ()=>{sw.forEach(m=>scene.remove(m));M.dispose()})}
// 六臂法相：身後升起三頭六臂金身，六拳連打四周
function sixArmCast(){const lv=SL(),R=SK.sweep.range(),n=lv>=2?12:6,dmg=swordDmg()*1.7*G.k.sweepD,T=n*.12+.5;SFX.play('ult');
  const g=new THREE.Group(),fig=soulFig(0xe0a030,.55),M=fig.userData.M;fig.scale.setScalar(2.4);g.add(fig);const heads=[-1,1].map(d=>{const h=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),M);h.position.set(d*.45,2.15*2.4/2.4*1,0);fig.add(h);return h});
  const arms=[];for(let i=0;i<6;i++){const a=new THREE.Group(),side=i%2?1:-1,row=Math.floor(i/2);a.position.set(side*.55*2.4/2.4,(1.5-row*.25)*2.4/1.6,0);fig.add(a);
    const up=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,.8,6).translate(0,-.4,0),M);up.rotation.z=side*(1.1+row*.3);a.add(up);const fist=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),M);fist.position.set(side*.75,-.3,0);a.add(fist);arms.push(a)}
  g.position.set(HERO.pos.x,0,HERO.pos.z);scene.add(g);let k=0;
  act(T,t=>{g.position.set(HERO.pos.x,0,HERO.pos.z);g.rotation.y=root.rotation.y+Math.PI;M.opacity=.55*Math.min(1,t/.2,(T-t)/.25);arms.forEach((a,i)=>a.rotation.x=Math.sin(t*18+i)*.8);
      while(k<n&&t>=.2+k*.12){const a=k/n*6.28*1.618+Math.random()*.4,d=R*.6,x=HERO.pos.x+Math.sin(a)*d,z=HERO.pos.z+Math.cos(a)*d;k++;SFX.play('hit');shake=Math.max(shake,.2);
        fx({p:tmp.set(x,.5,z),col:0xffd86a,add:true,life:.35,s0:1,s1:4,op:.95,vy:0});aoe(x,z,2,dmg,{kb:1,fly:4});if(lv>=3&&k===n){ringFx(HERO.pos.x,HERO.pos.z,R*1.3,0xffe08a,.6);aoe(HERO.pos.x,HERO.pos.z,R*1.3,dmg*3,{stun:1.5,bstun:1})}}},
    ()=>{scene.remove(g);M.dispose()})}
// 破煞金雷：金雷沿直線一路炸過去，對鬼怪傷害加倍
function goldThunderCast(A){const st=bs(),n=[1,1,3,5][st],a0=aimD(A),L=SK.beam.range()*(st>=1?1.3:1),dmg=swordDmg()*3.2*G.k.beamD;SFX.play('thunder');
  for(let j=0;j<n;j++){const a=n>1?a0+(j-(n-1)/2)*.42:a0,hx=HERO.pos.x,hz=HERO.pos.z,dx=Math.sin(a),dz=Math.cos(a),steps=Math.ceil(L/1.3);
    for(let i=1;i<=steps;i++)act(i*.05,null,()=>{const x=hx+dx*i*1.3,z=hz+dz*i*1.3;boltAt(x,z,0,0,0xffe08a,.09,10);aoe(x,z,1.3,dmg,{ghost:1,stun:.3});if(i%2)SFX.play('thunder');
      if(st>=3&&i===steps)act(.15,null,()=>{boltAt(x,z,0,0,0xffffff,.35,16);ringFx(x,z,3,0xfff0b0,.5);aoe(x,z,3,dmg*3,{ghost:1,stun:1.2});shake=Math.max(shake,.5)})})}}
// 玄冥冰焰：藍白冰焰噴流，燒加凍結，留下冰焰地
function iceFireCast(A){const st=bs(),a0=aimD(A),L=SK.beam.range()*.9,ang=[.55,.8,1.1,1.6][st],dmg=swordDmg()*1.1*G.k.beamD,T=st>=2?1.1:.8,hx0=HERO.pos.x,hz0=HERO.pos.z;let tick=0;SFX.play('boom');
  act(T,(t,dt)=>{const hx=HERO.pos.x,hz=HERO.pos.z;if(!simming)for(let i=0;i<3;i++){const a=a0+(Math.random()-.5)*ang,d=Math.random()*L;fx({p:tmp.set(hx+Math.sin(a)*d,.5+Math.random()*.6,hz+Math.cos(a)*d),col:Math.random()<.5?0xbff4ff:0x6ab4ff,add:true,life:.45,s0:.9+d*.12,s1:.2,op:.85,vy:.6})}
      tick-=dt;if(tick>0)return;tick=.15;for(const e of enemies){if(e.dead)continue;const dx=e.x-hx,dz=e.z-hz,d=Math.hypot(dx,dz);if(d<L+e.r&&Math.abs(angDiff(Math.atan2(dx,dz),a0))<ang/2){e.slowT=3;e.burn=2;e.burnD=dmg*.3;if(st>=3)e.stun=Math.max(e.stun||0,.6);hurtEnemy(e,dmg,0,0,false,0)}}
      if(boss.alive){const dx=boss.x-hx,dz=boss.z-hz;if(Math.hypot(dx,dz)<L+boss.r&&Math.abs(angDiff(Math.atan2(dx,dz),a0))<ang/2)hurtBoss(dmg)}},
    ()=>{if(st>=1){const x=hx0+Math.sin(a0)*L*.6,z=hz0+Math.cos(a0)*L*.6,r=2.2;let tk=0;const m=new THREE.Mesh(new THREE.CircleGeometry(r,32).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x6ab4ff,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.set(x,.05,z);scene.add(m);
      act(3,(t,dt)=>{m.material.opacity=.35*(1-t/3);tk-=dt;if(tk<=0){tk=.4;aoe(x,z,r,dmg*.8,{slow:2,boss:true})}},()=>{scene.remove(m);m.geometry.dispose();m.material.dispose()})}})}
// 兩儀磁光：黑白磁光先把線上的妖吸在一起再爆開
function magnetCast(A){const st=bs(),n=[1,1,2,3][st],a0=aimD(A),L=SK.beam.range()*(st>=1?1.3:1),W=2.6,dmg=swordDmg()*4.6*G.k.beamD;SFX.play('beam');
  for(let j=0;j<n;j++){const a=n>1?a0+(j-(n-1)/2)*.5:a0,hx=HERO.pos.x,hz=HERO.pos.z,dx=Math.sin(a),dz=Math.cos(a),cx=hx+dx*L*.55,cz=hz+dz*L*.55;
    const mk=c=>{const m=new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({map:wBeamTex,color:c,transparent:true,depthWrite:false,side:THREE.DoubleSide}));m.position.set(hx,.85,hz);m.rotation.y=a;m.scale.set(W*.5,1,L);scene.add(m);return m};
    const bw=[mk(0xf8f4ea),mk(0x14141a)];bw[1].position.y=.8;
    act(1,(t,dt)=>{bw.forEach((m,i)=>{m.position.x=hx+dz*Math.sin(t*20+i*3)*.4;m.position.z=hz-dx*Math.sin(t*20+i*3)*.4;m.material.opacity=t>.85?(1-t)/.15:1});
        if(t<.75)for(const e of enemies){if(e.dead||e.elite||!inLine(e.x,e.z,hx,hz,a,L,W+1.5,e.r))continue;const ex=cx-e.x,ez=cz-e.z,d=Math.hypot(ex,ez);if(d>.3){const v=Math.min(d,7*dt);e.x+=ex/d*v;e.z+=ez/d*v}}},
      ()=>{bw.forEach(m=>{scene.remove(m);m.material.dispose()});SFX.play('boom');shake=Math.max(shake,.45);fx({p:tmp.set(cx,.5,cz),col:0xffffff,add:true,life:.5,s0:1,s1:7,op:1,vy:0});fx({p:tmp.set(cx,.5,cz),col:0x101014,life:.7,s0:1,s1:6,op:.7,vy:.6});aoe(cx,cz,3,dmg,{kb:1.6,fly:6,stun:st>=3?1:0})})}}
// 噬靈金蟲：一群金蟲追妖，吃一隻分裂一隻
function bugCast(){const lv=TL(),n0=lv>=1?12:8,T=lv>=2?7.5:6,dmg=swordDmg()*1.2*G.k.thD,cap=lv>=3?40:30;if(!enemies.some(e=>!e.dead&&onScreen(e.x,.4,e.z))&&!boss.alive)return false;SFX.play('soul');
  const bugs=[];const add=(x,z)=>{if(bugs.length>=cap)return;bugs.push({x,z,s:spr(0xffd040,.45),tg:null,bite:0,a:Math.random()*6.28})};for(let i=0;i<n0;i++)add(HERO.pos.x,HERO.pos.z);
  act(T,(t,dt)=>{for(const b of bugs){if(!b.tg||b.tg.dead||(b.tg===boss&&!boss.alive)){b.tg=(lv>=3&&boss.alive&&Math.random()<.3)?boss:nearE(b.x,b.z,9)}
      let tx,tz;if(b.tg){tx=b.tg.x;tz=b.tg.z}else{b.a+=dt*4;tx=HERO.pos.x+Math.sin(b.a)*1.5;tz=HERO.pos.z+Math.cos(b.a)*1.5}
      const dx=tx-b.x,dz=tz-b.z,d=Math.hypot(dx,dz)||1,v=Math.min(d,11*dt);b.x+=dx/d*v+Math.sin(t*30+b.a)*.03;b.z+=dz/d*v+Math.cos(t*27+b.a)*.03;b.s.position.set(b.x,.7+Math.sin(t*25+b.a)*.15,b.z);b.s.material.opacity=Math.min(1,(T-t)/.4);
      b.bite-=dt;if(b.tg&&d<(b.tg.r||.4)+.3&&b.bite<=0){b.bite=.3;if(b.tg===boss)hurtBoss(dmg);else{const was=b.tg;hurtEnemy(was,dmg,0,0,false,0);if(was.dead)add(b.x,b.z)}}}},
    ()=>bugs.forEach(b=>unspr(b.s)));return true}
// 天罰雷雲：頭頂雷雲跟著你，自動劈附近的妖
function cloudCast(){const lv=TL(),n=lv>=2?2:1,T=5,iv=lv>=1?.3:.4,dmg=swordDmg()*2.4*G.k.thD,R=6;SFX.play('thunder');
  for(let j=0;j<n;j++){const cl=[];for(let i=0;i<5;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0x5a5070,transparent:true,opacity:.85,depthWrite:false}));s.scale.set(2.2,1.2,1);scene.add(s);cl.push(s)}let tk=j*.15;
    act(T,(t,dt)=>{const cx=HERO.pos.x+(j?2:-1)*Math.sin(t),cz=HERO.pos.z+(j?-1.5:1.5);cl.forEach((s,i)=>{s.position.set(cx+(i-2)*.7,4.2+Math.sin(t*2+i)*.15,cz+Math.sin(i*2)*.4);s.material.opacity=.85*Math.min(1,t/.3,(T-t)/.4)});
        tk-=dt;if(tk<=0){tk=iv;const e=(boss.alive&&Math.random()<.25&&Math.hypot(boss.x-HERO.pos.x,boss.z-HERO.pos.z)<R+2)?boss:nearE(HERO.pos.x+(Math.random()-.5)*4,HERO.pos.z+(Math.random()-.5)*4,R);if(e){boltAt(e.x,e.z,0,0,0xc8b8ff,lv>=3?.14:.08,4.2);aoe(e.x,e.z,lv>=3?1.4:.9,dmg,{stun:lv>=3?.8:.3})}}},
      ()=>cl.forEach(unspr))}return true}

/* ================= 技能表 ================= */
const SKILL_LIB={sweep:[],beam:[],thunder:[]};
const SKILL_PRICE=[200,500,1200,2500];
function addSk(slot,tier,id,def,dflt){def.id=id;def.tier=tier;def.slot=slot;def.dflt=!!dflt;SKILL_LIB[slot].push(def);return def}
const R_SW=()=>4.6*G.k.sweepR;
// 舊招沿用（煉氣、築基、結丹的預設；元嬰的元神斬、分神劍影變成可選）
SKILL_SETS.forEach((S,t)=>{for(const slot of ['sweep','beam','thunder']){const d=S[slot];if(t===3&&slot==='beam')continue;addSk(slot,t,slot+t,d,t<3)}});
SKILL_LIB.sweep.find(s=>s.id==='sweep3').d='金色虛影揮巨劍橫掃一圈';SKILL_LIB.thunder.find(s=>s.id==='thunder3').d='飛劍影子自動追妖';
const DESC={sweep0:'綠色竹劍扇形橫掃',beam0:'紅色劍氣直線，升級變散射',thunder0:'紫色連鎖閃電',sweep1:'冰劍輪飛出再收回、緩速',beam1:'火龍蛇行燃燒',thunder1:'把妖捲進太極再爆開',sweep2:'金蓮花開，八片劍瓣',beam2:'冰河凍結一路',thunder2:'落雷成網、連電'};
for(const slot in SKILL_LIB)for(const s of SKILL_LIB[slot])if(DESC[s.id])s.d=DESC[s.id];
// 新招
const NEW=[
 ['sweep',0,'peach',{n:'桃木三刺',ic:'桃',col:0xe0a060,shape:'fan',ang:1.2,range:R_SW,cd:()=>6.5*G.k.sweepCd,lv:['範圍 +30%','五連刺','最後一刺震暈 1 秒'],d:'扇形連刺三下、擊退',cast:peachCast}],
 ['sweep',0,'vajra',{n:'金剛符陣',ic:'符',col:0xffd86a,shape:'self',range:()=>4*G.k.sweepR,cd:()=>7*G.k.sweepCd,lv:['範圍 +30%','炸兩圈','暈 1.5 秒'],d:'身邊炸開一圈符紙，暈 0.5 秒',cast:vajraCast}],
 ['beam',0,'seek',{n:'追魂符',ic:'追',col:0xffd86a,shape:'line',w:1,range:()=>9,cd:()=>5.5*G.k.beamCd,lv3:['五張，爆炸帶火','八張，爆炸變大','十二張，爆開再分裂'],d:'三張符飛出、轉彎追妖、碰到就爆',cast:talisSeekCast}],
 ['beam',0,'coin',{n:'銅錢鏢',ic:'錢',col:0xffd86a,shape:'line',w:.8,range:()=>9,cd:()=>5*G.k.beamCd,spread:()=>[0,.5,.9,2.4][bs()],lv3:['三串','五串','八串，打中暈 0.5 秒'],d:'一串銅錢穿透，飛到底再回旋',cast:coinCast}],
 ['thunder',0,'yinlei',{n:'引雷符',ic:'引',col:0xffe08a,shape:'auto',range:()=>9,cd:()=>9,lv:['六道雷','落雷再電旁邊一隻','最後一道巨雷'],d:'往妖最多處落 4 道雷',cast:talisThunderCast}],
 ['thunder',0,'bell2',{n:'鎮魂鈴',ic:'鈴',col:0xb0fff0,shape:'auto',range:()=>5,cd:()=>10,lv:['範圍 +25%','搖兩次','定身 2.5 秒、回 5% 血'],d:'搖鈴震波，周圍妖定身 1.5 秒',cast:soulBellCast}],
 ['sweep',1,'firedance',{n:'烈焰劍舞',ic:'焰',col:0xff7a2a,shape:'self',range:()=>2.6*G.k.sweepR,cd:()=>7*G.k.sweepCd,lv:['範圍 +30%','五把火劍','結束時爆炸'],d:'火劍繞身三圈並點燃',cast:fireDanceCast}],
 ['sweep',1,'stone',{n:'石牢',ic:'岩',col:0xc8a06a,shape:'self',range:()=>3.6*G.k.sweepR,cd:()=>7*G.k.sweepCd,lv:['範圍 +30%','兩圈石刺','傷害 +50%、定身 2.5 秒'],d:'身邊突出一圈石刺，定身',cast:stoneCast}],
 ['beam',1,'icecone',{n:'冰錐連射',ic:'錐',col:0xbff4ff,shape:'line',w:1,range:()=>10,cd:()=>5.5*G.k.beamCd,spread:()=>[.8,1.3,2,Math.PI*2][bs()],lv3:['九根','十五根、穿透','二十四根四面八方、凍住'],d:'扇面射出冰錐、緩速',cast:iceConeCast}],
 ['beam',1,'wind',{n:'風刃',ic:'風',col:0xc8ffe8,shape:'line',w:2,range:()=>10,cd:()=>6*G.k.beamCd,lv3:['旋風變寬','兩道旋風','三道、飛得更遠'],d:'旋風直線推進，把妖捲走',cast:windCast}],
 ['thunder',1,'rock',{n:'落石術',ic:'石',col:0xc8a06a,shape:'auto',range:()=>9,cd:()=>9,lv:['兩顆','三顆','落地碎成石片'],d:'往妖群頭上砸巨石',cast:rockCast}],
 ['thunder',1,'vine',{n:'藤縛',ic:'藤',col:0x6aff5a,shape:'auto',range:()=>9,cd:()=>10,lv:['四處','纏 3 秒','毒更重、魔王也纏得住'],d:'地上長藤纏住 2 秒、帶毒',cast:vineCast}],
 ['sweep',2,'qkring',{n:'乾坤圈',ic:'圈',col:0xffd86a,shape:'self',range:()=>4*G.k.sweepR,cd:()=>7*G.k.sweepCd,lv:['範圍 +30%','兩個圈','打中暈 1 秒'],d:'金圈擴出去再收回，打兩次',cast:ringCast}],
 ['sweep',2,'turtle',{n:'玄龜震',ic:'龜',col:0x5ad8a0,shape:'self',range:()=>4*G.k.sweepR,cd:()=>7.5*G.k.sweepCd,lv:['範圍 +30%','擋兩下','震暈 1.2 秒'],d:'龜殼震地，擋一下傷害並擊退',cast:turtleCast}],
 ['beam',2,'mirror',{n:'照妖鏡光',ic:'鏡',col:0xffe9a0,shape:'line',w:2.4,range:()=>11,cd:()=>6*G.k.beamCd,lv3:['兩道光','三道光','五道光、照 5 秒'],d:'被照到的妖 3 秒內受傷加倍',cast:mirrorCast}],
 ['beam',2,'rope',{n:'縛妖索',ic:'索',col:0xffd86a,shape:'line',w:1.2,range:()=>11,cd:()=>6*G.k.beamCd,lv3:['繩子變粗','綁更久','三條繩'],d:'金繩串起沿路的妖，綁住精英或魔王並拉近',cast:ropeCast}],
 ['thunder',2,'wuxing',{n:'五行珠',ic:'珠',col:0xffe08a,shape:'auto',range:()=>9,cd:()=>9,lv:['八顆','爆炸變大','十二顆'],d:'五色光珠輪流射出，各帶效果',cast:orbCast}],
 ['thunder',2,'gourd',{n:'聚魂瓶',ic:'瓶',col:0x7affd0,shape:'auto',range:()=>9,cd:()=>10,lv:['範圍 +25%','兩個瓶','爆炸 +40%'],d:'把妖吸到一點再爆開',cast:gourdCast}],
 ['sweep',3,'zhoutian',{n:'周天劍陣',ic:'陣',col:0xbff8ff,shape:'self',range:R_SW,cd:()=>7*G.k.sweepCd,lv:['範圍 +30%','轉兩輪','七十二把劍'],d:'36 把飛劍列陣旋轉，收攏絞殺再向外爆射',cast:zhoutianCast},1],
 ['sweep',3,'sixarm',{n:'六臂法相',ic:'臂',col:0xffd86a,shape:'self',range:()=>4.4*G.k.sweepR,cd:()=>7.5*G.k.sweepCd,lv:['範圍 +30%','十二拳','最後一掌震暈全場'],d:'身後升起三頭六臂金身，六拳連打四周',cast:sixArmCast}],
 ['beam',3,'goldlei',{n:'破煞金雷',ic:'煞',col:0xffe08a,shape:'line',w:1.4,range:()=>10,cd:()=>5.5*G.k.beamCd,lv3:['打得更遠','三道金雷','五道，最後一記巨雷'],d:'金雷沿直線一路炸過去，對鬼怪傷害加倍',cast:goldThunderCast},1],
 ['beam',3,'icefire',{n:'玄冥冰焰',ic:'冥',col:0x8ad8ff,shape:'fan',ang:.8,range:()=>9,cd:()=>6*G.k.beamCd,lv3:['留下冰焰地','噴更久','凍住'],d:'藍白冰焰噴流，燒加凍結',cast:iceFireCast}],
 ['beam',3,'magnet',{n:'兩儀磁光',ic:'儀',col:0xf0ece0,shape:'line',w:2.6,range:()=>10,cd:()=>6*G.k.beamCd,lv3:['光束變長','兩道','三道、爆開暈 1 秒'],d:'黑白磁光先把線上的妖吸在一起再爆開',cast:magnetCast}],
 ['thunder',3,'bugs',{n:'噬靈金蟲',ic:'蟲',col:0xffd040,shape:'auto',range:()=>9,cd:()=>10,lv:['十二隻','飛更久','會咬魔王、最多 40 隻'],d:'一群金蟲追妖，吃一隻分裂一隻',cast:bugCast},1],
 ['thunder',3,'leiyun',{n:'天罰雷雲',ic:'雲',col:0xc8b8ff,shape:'auto',range:()=>6,cd:()=>10,lv:['劈更快','兩朵雷雲','雷更粗、會暈'],d:'頭頂雷雲跟著你 5 秒，自動劈附近的妖',cast:cloudCast}]];
for(const [slot,tier,id,def,dflt] of NEW)addSk(slot,tier,id,def,dflt);
// 同境界拉平（實測每秒傷害校正；1＝沒校正）。每高一個大境界 ×1.3
const NORM={"sweep0": 1.0, "sweep1": 0.75, "sweep2": 0.85, "sweep3": 1.19, "peach": 1.75, "vajra": 0.74, "firedance": 0.65, "stone": 0.78, "qkring": 0.85, "turtle": 1.87, "zhoutian": 1.1, "sixarm": 1.54, "beam0": 1.0, "beam1": 1.25, "beam2": 2.21, "seek": 0.79, "coin": 1.72, "icecone": 3.12, "wind": 1.98, "mirror": 1.92, "rope": 3.04, "goldlei": 2.37, "icefire": 3.73, "magnet": 3.62, "thunder0": 1.0, "thunder1": 1.37, "thunder2": 1.25, "thunder3": 1.4, "yinlei": 1.35, "bell2": 1.62, "rock": 1.71, "vine": 1.6, "wuxing": 1.4, "gourd": 1.8, "bugs": 1.48, "leiyun": 1.89};// m.py 實測（30 隻木樁、初始與滿級的幾何平均）
function skMul(S){return NORM[S.id]||Math.pow(1.3,S.tier)}
// 第二格三級：舊的直線招用原本的 0/2/3/4 級
const BEAM_MAP=[0,2,3,4];
function beamText(S,step){if(S.lv3)return S.lv3[step];const a=BEAM_MAP[step],b=BEAM_MAP[step+1];return S.lv.slice(a,b).join('，')}
// 存檔：裝備中的三招、已參悟的招、上次送招的境界
const skById=id=>{for(const slot in SKILL_LIB){const s=SKILL_LIB[slot].find(s=>s.id===id);if(s)return s}return null};
const skDefault=(slot,t)=>SKILL_LIB[slot].find(s=>s.tier===t&&s.dflt);
function grantSkills(){save.skOwn=save.skOwn||[];const t=skillTier();for(let i=0;i<=t;i++)for(const slot in SKILL_LIB){const d=skDefault(slot,i);if(d&&!save.skOwn.includes(d.id))save.skOwn.push(d.id)}
  if(!save.sk||(save.skTier??-1)<t){save.sk={sweep:skDefault('sweep',t).id,beam:skDefault('beam',t).id,thunder:skDefault('thunder',t).id};save.skTier=t;writeSave();return true}return false}
function equipSkills(){grantSkills();for(const slot of ['sweep','beam','thunder']){let S=skById(save.sk[slot]);if(!S||S.slot!==slot)S=skDefault(slot,skillTier());S.mul=skMul(S);SK[slot]=S;
    const b=skBtn[slot],c='#'+S.col.toString(16).padStart(6,'0');b.querySelector('.ic').textContent=S.ic;b.querySelector('em').textContent=S.n;b.setAttribute('aria-label',S.n);b.style.borderColor=c;b.style.boxShadow=`0 0 12px ${c}66`;b.querySelector('.ic').style.textShadow=`0 0 8px ${c}`}}
function setSkills(){equipSkills()}
