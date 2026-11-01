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
    forms.push({n:'金鐘罩',g,col:0xffd65a,update(fr,crit,t,dt){bellMesh.rotation.y+=dt;bellMesh.material.color.copy(fr>.5?BELL_C[2]:fr>.2?BELL_C[1]:BELL_C[0]);
      bellMesh.material.opacity=(crit?.32+Math.abs(Math.sin(t*14))*.25:.28+Math.sin(t*4)*.06);bellCrack.material.opacity=fr>.5?0:fr>.2?.35:.75*(crit?.6+.4*Math.abs(Math.sin(t*14)):1);bellCrack.material.color.copy(bellMesh.material.color)}})}
  // 2 八卦玉璧罩
  {const g=new THREE.Group(),J=add(0x7fffd0,.22),dome=new THREE.Mesh(new THREE.SphereGeometry(1.15,28,14,0,Math.PI*2,0,Math.PI/2),J);g.add(dome);
    const cr=new THREE.Mesh(dome.geometry,new THREE.MeshBasicMaterial({map:crackTex,color:0xffffff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));cr.scale.setScalar(1.01);g.add(cr);
    let bagua=null;const jades=[];const JM=toon(0x5ad8a0,{emissive:0x1a6a4a,roughness:.3});for(let i=0;i<8;i++){const d=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.03,6).rotateX(Math.PI/2),JM);g.add(d);jades.push(d)}
    forms.push({n:'八卦玉璧罩',g,col:0x7fffd0,update(fr,crit,t,dt){if(!bagua&&typeof runeTex==='function'){bagua=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.6).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:runeTex('#9fffd0'),transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));bagua.position.y=.04;g.add(bagua)}
      if(bagua)bagua.rotation.y-=dt*.6;jades.forEach((d,i)=>{const a=t*1.2+i/8*6.28;d.position.set(Math.sin(a)*1.3,.9+Math.sin(t*2+i)*.12,Math.cos(a)*1.3);d.rotation.y=a});
      const c=fr>.5?0x7fffd0:fr>.2?0xff9a3a:0xff3a2a;J.color.set(c);J.opacity=crit?.2+Math.abs(Math.sin(t*14))*.18:.2+Math.sin(t*3)*.04;cr.material.opacity=fr>.5?0:fr>.2?.35:.7;cr.material.color.set(c);if(bagua)bagua.material.color.set(c)}})}
  // 3 蓮花護體（重製）：腳下金色陣圖、兩層半透明金蓮（內八外十二）托住全身、腦後細紋光輪、六片小蓮瓣繞身飄；
  //   血越少蓮瓣越往外垂、顏色 金粉→橘→紅，剩兩成時閃爍。蓮瓣、陣圖、光輪貼圖第一次顯示才建（那時其他檔案都載入了）。
  {const g=new THREE.Group();let built=null;
    function build(){const PM=c=>new THREE.MeshBasicMaterial({color:LC(c),vertexColors:true,transparent:true,opacity:.62,depthWrite:false,side:THREE.DoubleSide});
      const inM=PM(0xffe6c8),outM=PM(0xffc8d8),rows=[];
      [[8,.42,.62,inM,.32],[12,.6,.95,outM,.62]].forEach(([n,w,h,M,base])=>{const row=[];for(let i=0;i<n;i++){const hol=new THREE.Group();hol.rotation.y=i/n*6.283+(n===8?.2:0);g.add(hol);const m=new THREE.Mesh(LOTUS_PETAL,M);m.scale.set(w,h,1);m.position.set(0,.02,.18);hol.add(m);row.push(m)}rows.push({row,base})});
      const tex=typeof ASC!=='undefined'&&ASC.tex?ASC.tex:null;
      const disc=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.6).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:tex?tex.rune():null,color:LC(0xe8b860),transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));disc.position.y=.04;g.add(disc);
      const halo=new THREE.Mesh(new THREE.PlaneGeometry(.95,.95),new THREE.MeshBasicMaterial({map:tex?tex.halo():null,color:LC(0xffd890),transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));halo.position.set(0,1.62,-.32);g.add(halo);
      const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:LC(0xffb0c8),transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(2.4,2.8,1);glow.position.y=.9;g.add(glow);
      const motes=[];for(let i=0;i<6;i++){const m=new THREE.Mesh(LOTUS_PETAL,outM);m.scale.set(.16,.22,1);g.add(m);motes.push(m)}
      built={rows,inM,outM,disc,halo,glow,motes}}
    forms.push({n:'蓮花護體',g,col:0xf0a0b8,update(fr,crit,t,dt){if(!built){if(typeof LOTUS_PETAL==='undefined')return;build()}const B=built;
      const droop=(1-Math.max(0,Math.min(1,fr)))*.55,br=.06*Math.sin(t*2);B.rows.forEach(({row,base},ri)=>row.forEach((m,i)=>{m.rotation.x=-(base+droop*(ri?1:.6)+br+(i%2)*.05)}));
      const c=fr>.5?null:fr>.2?0xff9a4a:0xff4a3a,flick=crit?.45+Math.abs(Math.sin(t*14))*.5:1;
      B.inM.color.set(c?LC(c):LC(0xffe6c8));B.outM.color.set(c?LC(c):LC(0xffc8d8));B.inM.opacity=.62*flick;B.outM.opacity=.55*flick;
      B.disc.rotation.y=t*.4;B.disc.material.color.set(LC(c||0xe8b860));B.halo.position.set(-HERO.fwd.x*.32,1.62,-HERO.fwd.z*.32);B.halo.rotation.set(0,Math.atan2(HERO.fwd.x,HERO.fwd.z),-t*.5);B.halo.material.color.set(LC(c||0xffd890));B.halo.material.opacity=.55*flick;
      B.glow.material.color.set(LC(c||0xffb0c8));B.glow.material.opacity=.22+.08*Math.sin(t*3);
      B.motes.forEach((m,i)=>{const a=t*.9+i/6*6.283;m.position.set(Math.sin(a)*1.05,.5+((t*.25+i/6)%1)*1.6,Math.cos(a)*1.05);m.rotation.set(-.6,a,0)})}})}
  const root=new THREE.Group();root.visible=false;scene.add(root);forms.forEach(f=>{f.g.visible=false;root.add(f.g)});
  let cur=forms[1];
  return {get color(){return cur.col},setTier(t){forms.forEach(f=>f.g.visible=false);cur=forms[Math.max(0,Math.min(3,t))];cur.g.visible=true},
    show(v){root.visible=v},update(fr,crit,t,dt,x,y,z){root.position.set(x,y,z);cur.update(fr,crit,t,dt);if(cur===forms[3])root.rotation.y=root.rotation.y;},
    get name(){return cur.n}}})();
