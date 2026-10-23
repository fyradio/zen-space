/* ================= 敵方預警範圍（紅色）=================
   warnFan 扇形、warnLine 直線（長槍突刺、船槳掃）、wave 擴散環（留一個缺口要鑽過去）。
   狀態：G.rootT 定身、G.slowT 緩速、G.charm 魅惑（搖桿反向）。 */
const HZ=[];const hzMat=c=>new THREE.MeshBasicMaterial({color:c||0xff3b2a,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide});
const lineGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(0,0,.5);
function warnFan(x,z,a0,ang,r,delay,dmg,col,onHit){const m=new THREE.Mesh(fanGeo(ang),hzMat(col));m.position.set(x,.04,z);m.rotation.y=a0;m.scale.setScalar(r);scene.add(m);HZ.push({k:'fan',x,z,a0,ang,r,delay,dmg,t:0,m,onHit})}
function warnLine(x,z,a0,len,w,delay,dmg,col,onHit){const m=new THREE.Mesh(lineGeo,hzMat(col));m.position.set(x,.04,z);m.rotation.y=a0;m.scale.set(w,1,len);scene.add(m);HZ.push({k:'line',x,z,a0,len,w,delay,dmg,t:0,m,onHit})}
function wave(x,z,spd,maxR,gapA,gapW,dmg,col,onHit){const g=new THREE.RingGeometry(.9,1,64,1,-Math.PI/2+gapA+gapW/2,Math.PI*2-gapW).rotateX(-Math.PI/2);
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:col||0xffb35a,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,.08,z);scene.add(m);
  HZ.push({k:'wave',x,z,spd,maxR,gapA,gapW,dmg,t:0,m,onHit,hit:false})}
function inGap(h,ang){return Math.abs(angDiff(ang,h.gapA))<h.gapW/2}
function stepHZ(dt){for(let i=HZ.length-1;i>=0;i--){const h=HZ[i];h.t+=dt;const hx=HERO.pos.x-h.x,hz=HERO.pos.z-h.z,d=Math.hypot(hx,hz);
    if(h.k==='wave'){const R=h.spd*h.t;h.m.scale.setScalar(Math.max(.01,R));h.m.material.opacity=.85*(1-R/h.maxR*.6);
      if(!h.hit&&Math.abs(d-R)<.45&&!inGap(h,Math.atan2(hx,hz))){h.hit=true;hurtHero(h.dmg,0,0,'衝擊波');if(h.onHit)h.onHit()}
      if(R>=h.maxR){scene.remove(h.m);h.m.geometry.dispose();h.m.material.dispose();HZ.splice(i,1)}continue}
    h.m.material.opacity=.22+.2*Math.abs(Math.sin(h.t*12));
    if(h.t>=h.delay){let hit=false;if(h.k==='fan')hit=d<h.r&&Math.abs(angDiff(Math.atan2(hx,hz),h.a0))<=h.ang/2;
      else{const ux=Math.sin(h.a0),uz=Math.cos(h.a0),al=hx*ux+hz*uz,pe=Math.abs(hx*uz-hz*ux);hit=al>-.3&&al<h.len&&pe<h.w/2+.25}
      fx({p:tmp.set(h.x+Math.sin(h.a0)*(h.k==='fan'?h.r*.5:h.len*.5),.5,h.z+Math.cos(h.a0)*(h.k==='fan'?h.r*.5:h.len*.5)),col:0xff6a2a,add:true,life:.35,s0:1,s1:3,op:.9,vy:0});
      if(hit){hurtHero(h.dmg,0,0,h.k==='fan'?'橫掃':'突刺');if(h.onHit)h.onHit()}scene.remove(h.m);h.m.material.dispose();HZ.splice(i,1)}}}
function clearHZ(){HZ.forEach(h=>{scene.remove(h.m);h.m.material.dispose()});HZ.length=0}
