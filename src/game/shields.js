/* ================= 金鐘罩：隨境界換外型 =================
   煉氣＝玄鐵盾（一面鐵盾繞著主角轉）、築基＝金鐘、結丹＝八卦玉璧罩（玉色半球＋地上八卦＋八塊玉符）、元嬰＝蓮花護體（十片蓮瓣＋腦後光環）。
   狀態一樣：剩一半變橘、開始裂；剩兩成變紅、裂滿而且閃；破掉碎成碎片。 */
const SHIELD=(()=>{const add=(c,op)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
  const crackTex=bellCrack.material.map;const ORANGE=new THREE.Color(0xff6a10),RED=new THREE.Color(0xff3a2a);
  const forms=[];
  // 0 玄鐵盾
  {const g=new THREE.Group(),arm=new THREE.Group();g.add(arm);const iron=toon(0x50565e,{metalness:.6,roughness:.35,emissive:0x000000});
    const sh=new THREE.Group();sh.position.set(0,1,.85);arm.add(sh);
    const disc=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.07,28).rotateX(Math.PI/2),iron);sh.add(disc);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.5,.045,8,32),toon(0x2a2e34,{metalness:.7,roughness:.3}));sh.add(rim);
    const boss=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),toon(0x7a7e86,{metalness:.8,roughness:.25}));boss.position.z=.06;sh.add(boss);
    for(let i=0;i<8;i++){const a=i/8*6.28,r=new THREE.Mesh(new THREE.SphereGeometry(.03,6,4),rim.material);r.position.set(Math.cos(a)*.38,Math.sin(a)*.38,.05);sh.add(r)}
    const cr=new THREE.Mesh(new THREE.CircleGeometry(.5,28),new THREE.MeshBasicMaterial({map:crackTex,color:0xffffff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));cr.position.z=.045;sh.add(cr);
    const ring=new THREE.Mesh(new THREE.RingGeometry(.9,.98,48).rotateX(-Math.PI/2),add(0x9aa4b0,.35));ring.position.y=.03;g.add(ring);
    forms.push({n:'玄鐵盾',g,col:0x9aa4b0,update(fr,crit,t,dt){arm.rotation.y+=dt*1.6;const e=fr>.5?0:fr>.2?.35:.6*(crit?.5+.5*Math.abs(Math.sin(t*14)):1);iron.emissive.copy(fr>.2?ORANGE:RED).multiplyScalar(e);cr.material.opacity=fr>.5?0:fr>.2?.4:.85;cr.material.color.copy(fr>.2?ORANGE:RED);ring.material.color.set(fr>.5?0x9aa4b0:fr>.2?0xff6a10:0xff3a2a)}})}
  // 1 金鐘（原本的）
  {const g=new THREE.Group();scene.remove(bellMesh);bellMesh.visible=true;bellMesh.position.set(0,0,0);g.add(bellMesh);
    forms.push({n:'金鐘',g,col:0xffd65a,update(fr,crit,t,dt){bellMesh.rotation.y+=dt;bellMesh.material.color.copy(fr>.5?BELL_C[2]:fr>.2?BELL_C[1]:BELL_C[0]);
      bellMesh.material.opacity=(crit?.32+Math.abs(Math.sin(t*14))*.25:.28+Math.sin(t*4)*.06);bellCrack.material.opacity=fr>.5?0:fr>.2?.35:.75*(crit?.6+.4*Math.abs(Math.sin(t*14)):1);bellCrack.material.color.copy(bellMesh.material.color)}})}
  // 2 八卦玉璧罩
  {const g=new THREE.Group(),J=add(0x7fffd0,.22),dome=new THREE.Mesh(new THREE.SphereGeometry(1.15,28,14,0,Math.PI*2,0,Math.PI/2),J);g.add(dome);
    const cr=new THREE.Mesh(dome.geometry,new THREE.MeshBasicMaterial({map:crackTex,color:0xffffff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));cr.scale.setScalar(1.01);g.add(cr);
    let bagua=null;const jades=[];const JM=toon(0x5ad8a0,{emissive:0x1a6a4a,roughness:.3});for(let i=0;i<8;i++){const d=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.03,6).rotateX(Math.PI/2),JM);g.add(d);jades.push(d)}
    forms.push({n:'八卦玉璧罩',g,col:0x7fffd0,update(fr,crit,t,dt){if(!bagua&&typeof runeTex==='function'){bagua=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.6).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:runeTex('#9fffd0'),transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));bagua.position.y=.04;g.add(bagua)}
      if(bagua)bagua.rotation.y-=dt*.6;jades.forEach((d,i)=>{const a=t*1.2+i/8*6.28;d.position.set(Math.sin(a)*1.3,.9+Math.sin(t*2+i)*.12,Math.cos(a)*1.3);d.rotation.y=a});
      const c=fr>.5?0x7fffd0:fr>.2?0xff9a3a:0xff3a2a;J.color.set(c);J.opacity=crit?.2+Math.abs(Math.sin(t*14))*.18:.2+Math.sin(t*3)*.04;cr.material.opacity=fr>.5?0:fr>.2?.35:.7;cr.material.color.set(c);if(bagua)bagua.material.color.set(c)}})}
  // 3 蓮花護體
  {const g=new THREE.Group(),P=new THREE.MeshBasicMaterial({color:0xf0a0b8,transparent:true,opacity:.5,depthWrite:false,side:THREE.DoubleSide}),petals=[];const pg=new THREE.SphereGeometry(1,14,10);
    for(let i=0;i<10;i++){const holder=new THREE.Group();holder.rotation.y=i/10*6.28;g.add(holder);const p=new THREE.Mesh(pg,P);p.scale.set(.2,.6,.06);p.position.set(0,.5,.56);holder.add(p);petals.push(p)}
    const inner=new THREE.Mesh(new THREE.CircleGeometry(.9,32).rotateX(-Math.PI/2),add(0xffe08a,.3));inner.position.y=.05;g.add(inner);
    const halo=new THREE.Mesh(new THREE.TorusGeometry(.42,.03,6,40),add(0xffe08a,.8));halo.position.set(0,1.75,-.28);g.add(halo);
    const rays=new THREE.Mesh(new THREE.RingGeometry(.45,.75,40),add(0xffe9b0,.25));rays.position.copy(halo.position);g.add(rays);
    forms.push({n:'蓮花護體',g,col:0xf0a0b8,update(fr,crit,t,dt){const open=.35+.12*Math.sin(t*2);petals.forEach((p,i)=>{p.rotation.x=-open-(i%2)*.12});halo.rotation.z+=dt;
      const c=fr>.5?0xf0a0b8:fr>.2?0xff8a3a:0xff3a2a;P.color.set(c);P.opacity=crit?.3+Math.abs(Math.sin(t*14))*.3:.5;halo.material.color.set(fr>.5?0xffe08a:c);halo.lookAt&&0}})}
  const root=new THREE.Group();root.visible=false;scene.add(root);forms.forEach(f=>{f.g.visible=false;root.add(f.g)});
  let cur=forms[1];
  return {get color(){return cur.col},setTier(t){forms.forEach(f=>f.g.visible=false);cur=forms[Math.max(0,Math.min(3,t))];cur.g.visible=true},
    show(v){root.visible=v},update(fr,crit,t,dt,x,y,z){root.position.set(x,y,z);cur.update(fr,crit,t,dt);if(cur===forms[3])root.rotation.y=root.rotation.y;},
    get name(){return cur.n}}})();
