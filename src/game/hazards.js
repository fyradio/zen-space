/* ================= 敵方預警（水墨筆刷）=================
   圓圈 warn()（在 game.src.html）、扇形 warnFan、直線 warnLine、擴散環 wave、領域 domainWarn。
   墨從中心暈開＝倒數，暈滿了變成「類型色」落下：紅＝扣血、紫＝麻痺／雷、藍＝緩速、綠＝定身。
   暗的地圖用白墨，亮的（雲海）用黑墨。狀態：G.rootT 定身、G.slowT 緩速、G.charm 魅惑（搖桿反向）。 */
const TG=(()=>{const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);return t};
  const R=Math.random;
  // 筆刷圓：好幾筆不同粗細、帶飛白的弧，外面濺幾點墨
  const ring=mk(256,256,(x)=>{x.translate(128,128);x.strokeStyle='#fff';x.lineCap='round';
    for(let k=0;k<5;k++){let a=R()*6.28;const L=4.4+R()*1.6;x.lineWidth=3+R()*7;x.globalAlpha=.55+R()*.45;x.beginPath();for(let s=0;s<=40;s++){const t=a+L*s/40,r=114+Math.sin(t*3+k)*2+(R()-.5)*2;s?x.lineTo(Math.cos(t)*r,Math.sin(t)*r):x.moveTo(Math.cos(t)*r,Math.sin(t)*r)}x.stroke()}
    x.globalAlpha=.25;x.lineWidth=2;for(let k=0;k<26;k++){const a=R()*6.28,r=106+R()*14;x.beginPath();x.moveTo(Math.cos(a)*r,Math.sin(a)*r);x.lineTo(Math.cos(a+.15)*r,Math.sin(a+.15)*r);x.stroke()}
    x.fillStyle='#fff';for(let k=0;k<22;k++){const a=R()*6.28,r=118+R()*9;x.globalAlpha=.4+R()*.6;x.beginPath();x.arc(Math.cos(a)*r,Math.sin(a)*r,1+R()*3,0,7);x.fill()}});
  // 暈開的墨：邊緣比中間濃（宣紙上墨往外滲的樣子），邊緣不規則
  const wash=mk(256,256,(x)=>{x.translate(128,128);for(let k=0;k<7;k++){x.beginPath();for(let s=0;s<=48;s++){const t=s/48*6.28,r=(112-k*9)*(1+(R()-.5)*.08);s?x.lineTo(Math.cos(t)*r,Math.sin(t)*r):x.moveTo(Math.cos(t)*r,Math.sin(t)*r)}x.closePath();x.fillStyle=`rgba(255,255,255,${.06+k*.025})`;x.fill()}
    const g=x.createRadialGradient(0,0,10,0,0,118);g.addColorStop(0,'rgba(255,255,255,.15)');g.addColorStop(.75,'rgba(255,255,255,.3)');g.addColorStop(.95,'rgba(255,255,255,.65)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,120,0,7);x.fill()});
  // 一筆橫畫（給扇形兩邊、直線兩邊用）：v 方向是筆的長度
  const stroke=mk(64,256,(x)=>{x.fillStyle='#fff';for(let k=0;k<6;k++){x.globalAlpha=.35+R()*.5;const w=10+R()*14,o=(R()-.5)*10;x.beginPath();x.moveTo(32+o-w/2,8+R()*10);x.quadraticCurveTo(32+o-w*.7,128,32+o-w/3,248-R()*12);x.lineTo(32+o+w/3,248-R()*12);x.quadraticCurveTo(32+o+w*.7,128,32+o+w/2,8+R()*10);x.fill()}
    x.globalAlpha=1;x.globalCompositeOperation='destination-out';for(let k=0;k<30;k++){x.fillRect(R()*64,R()*256,1+R()*2,8+R()*20)}});
  const lwash=mk(64,256,(x)=>{const g=x.createLinearGradient(0,0,64,0);g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(.18,'rgba(255,255,255,.28)');g.addColorStop(.5,'rgba(255,255,255,.16)');g.addColorStop(.82,'rgba(255,255,255,.28)');g.addColorStop(1,'rgba(255,255,255,.6)');x.fillStyle=g;x.fillRect(0,0,64,256)});
  const TYPE={dmg:new THREE.Color(0xff3324),zap:new THREE.Color(0xb46cff),slow:new THREE.Color(0x3ab4ff),root:new THREE.Color(0x46e070)};
  const ink=()=>G&&G.sky&&G.ch===6?new THREE.Color(0x14110e):new THREE.Color(0xf4efe4);
  // 類型：看 onHit 做什麼（緩速／定身／魅惑），再看原本給的顏色是不是雷紫
  function type(col,onHit){const s=onHit?onHit+'':'';if(/slowT/.test(s))return 'slow';if(/rootT/.test(s))return 'root';if(/charm|stun/.test(s))return 'zap';
    const h={};new THREE.Color(col||0xff3b2a).getHSL(h);return h.h>.68&&h.h<.86&&h.s>.3?'zap':'dmg'}
  const mat=(tex,op)=>new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:op,depthWrite:false,side:THREE.DoubleSide});
  // 依倒數 k（0→1）更新顏色：墨色→最後 30% 漸變成類型色並變濃
  function tint(mats,k,tc,ic){const e=Math.max(0,(k-.7)/.3);for(const [m,base] of mats){m.color.copy(ic).lerp(tc,e);m.opacity=base*(1+e*.6)}}
  return {ring,wash,stroke,lwash,TYPE,ink,type,mat,tint}})();
const HZ=[];const lineGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(0,0,.5);
const strokeGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(0,0,.5);
function hzBase(k,x,z,o){const g=new THREE.Group();g.position.set(x,.05,z);scene.add(g);const h=Object.assign({k,x,z,t:0,g,mats:[],tc:TG.TYPE[TG.type(o.col,o.onHit)],ic:TG.ink()},o);HZ.push(h);return h}
function hzMesh(h,geo,tex,op){const m=new THREE.Mesh(geo,TG.mat(tex,op));h.g.add(m);h.mats.push([m.material,op]);return m}
function warnFan(x,z,a0,ang,r,delay,dmg,col,onHit){const h=hzBase('fan',x,z,{a0,ang,r,delay,dmg,col,onHit});h.g.rotation.y=a0;
  h.fill=hzMesh(h,fanGeo(ang),TG.wash,.9);h.fill.scale.setScalar(.01);const arc=hzMesh(h,fanGeo(ang),TG.ring,.95);arc.scale.setScalar(r/0.9);
  for(const s of [-1,1]){const m=hzMesh(h,strokeGeo,TG.stroke,.9);m.rotation.y=s*ang/2;m.scale.set(.5,1,r)}}
function warnLine(x,z,a0,len,w,delay,dmg,col,onHit){const h=hzBase('line',x,z,{a0,len,w,delay,dmg,col,onHit});h.g.rotation.y=a0;
  h.fill=hzMesh(h,lineGeo,TG.lwash,.9);h.fill.scale.set(w,1,.01);
  for(const s of [-1,1]){const m=hzMesh(h,strokeGeo,TG.stroke,.95);m.position.x=s*w/2;m.scale.set(.45,1,len)}
  const end=hzMesh(h,strokeGeo,TG.stroke,.9);end.rotation.y=Math.PI/2;end.position.set(-w/2,0,len);end.scale.set(.45,1,w)}
function wave(x,z,spd,maxR,gapA,gapW,dmg,col,onHit){const h=hzBase('wave',x,z,{spd,maxR,gapA,gapW,dmg,col,onHit,hit:false});
  const g=new THREE.RingGeometry(.86,1,72,1,-Math.PI/2+gapA+gapW/2,Math.PI*2-gapW).rotateX(-Math.PI/2);h.ringM=hzMesh(h,g,TG.ring,1);h.ringM.scale.setScalar(.01);h.g.position.y=.08}
// 領域：全場一大片墨，只留一個安全圈（綠色筆圈），時間到沒站進去就挨打
function domainWarn(cx,cz,R,sx,sz,sr,delay,dmg){const h=hzBase('domain',cx,cz,{R,sx,sz,sr,delay,dmg,col:0xff3b2a});
  h.fill=hzMesh(h,new THREE.CircleGeometry(1,64).rotateX(-Math.PI/2),TG.wash,.9);h.fill.scale.setScalar(.01);const rim=hzMesh(h,new THREE.PlaneGeometry(2,2).rotateX(-Math.PI/2),TG.ring,1);rim.scale.setScalar(R/0.9);
  const safe=new THREE.Mesh(new THREE.PlaneGeometry(2,2).rotateX(-Math.PI/2),TG.mat(TG.ring,1));safe.material.color.set(0x7fffa0);safe.position.set(sx-cx,.04,sz-cz);safe.scale.setScalar(sr/0.9);h.g.add(safe);h.safe=safe;
  const hole=new THREE.Mesh(new THREE.CircleGeometry(sr*.92,40).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x0a140e,transparent:true,opacity:.55,depthWrite:false}));hole.position.set(sx-cx,.03,sz-cz);h.g.add(hole)}
function inGap(h,ang){return Math.abs(angDiff(ang,h.gapA))<h.gapW/2}
function hzDone(h,i){scene.remove(h.g);h.g.traverse(o=>{if(o.material)o.material.dispose()});HZ.splice(i,1)}
function stepHZ(dt){for(let i=HZ.length-1;i>=0;i--){const h=HZ[i];h.t+=dt;const hx=HERO.pos.x-h.x,hz=HERO.pos.z-h.z,d=Math.hypot(hx,hz);
    if(h.k==='wave'){const R=h.spd*h.t;h.ringM.scale.setScalar(Math.max(.01,R/0.93));TG.tint(h.mats,1,h.tc,h.ic);h.ringM.material.opacity=1-R/h.maxR*.5;
      if(!h.hit&&Math.abs(d-R)<.45&&!inGap(h,Math.atan2(hx,hz))){h.hit=true;hurtHero(h.dmg,0,0,'衝擊波');if(h.onHit)h.onHit()}
      if(R>=h.maxR)hzDone(h,i);continue}
    const k=Math.min(1,h.t/h.delay);TG.tint(h.mats,k,h.tc,h.ic);
    if(h.k==='fan')h.fill.scale.setScalar(Math.max(.01,h.r*k/0.93));else if(h.k==='line')h.fill.scale.set(h.w,1,Math.max(.01,h.len*k));else if(h.k==='domain'){h.fill.scale.setScalar(Math.max(.01,h.R*k));h.safe.scale.setScalar(h.sr/0.9*(1+.06*Math.sin(h.t*8)))}
    if(h.t>=h.delay){let hit=false,cx=h.x,cz=h.z;
      if(h.k==='fan'){hit=d<h.r&&Math.abs(angDiff(Math.atan2(hx,hz),h.a0))<=h.ang/2;cx+=Math.sin(h.a0)*h.r*.5;cz+=Math.cos(h.a0)*h.r*.5}
      else if(h.k==='line'){const ux=Math.sin(h.a0),uz=Math.cos(h.a0),al=hx*ux+hz*uz,pe=Math.abs(hx*uz-hz*ux);hit=al>-.3&&al<h.len&&pe<h.w/2+.25;cx+=ux*h.len*.5;cz+=uz*h.len*.5}
      else if(h.k==='domain'){hit=Math.hypot(HERO.pos.x-h.sx,HERO.pos.z-h.sz)>h.sr;shake=Math.max(shake,.5)}
      const c=h.tc.getHex();fx({p:tmp.set(cx,.5,cz),col:c,add:true,life:.4,s0:1,s1:h.k==='domain'?h.R*2:3.4,op:.9,vy:0});
      if(hit){hurtHero(h.dmg,0,0,h.k==='fan'?'橫掃':h.k==='line'?'突刺':'領域');if(h.onHit)h.onHit()}hzDone(h,i)}}}
function clearHZ(){for(let i=HZ.length-1;i>=0;i--)hzDone(HZ[i],i)}
