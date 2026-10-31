/* ================= 效能：預先編譯著色器、上傳貼圖；搖桿卡住的保險 =================
   放招會 new 很多 MeshBasicMaterial／SpriteMaterial，第一次用到某種組合時 GPU 要現場編譯著色器 → 首次放招卡一下；
   而且招式結束 dispose 掉最後一個用到它的材質時，three.js 會把著色器丟掉，下次又要重編。
   這裡在載入時把常用的材質組合（有／無貼圖、加亮／一般、單面／雙面、精靈、線、點、拖影）各留一份，畫一次後藏起來但不丟，
   著色器就一直留在快取裡；所有招式用的貼圖也先上傳。 */
const WARM=(()=>{const g=new THREE.Group();g.position.set(0,-40,0);scene.add(g);const geo=new THREE.PlaneGeometry(.1,.1);
  const texs=[null,glowTex,beamTex,wBeamTex,talTex2,coinTex,TG.ring,TG.wash,TG.stroke,TG.lwash,taijiTex,soulGlowTex(),talTex];
  if(typeof thForm!=='undefined'&&thForm.material&&thForm.material.map)texs.push(thForm.material.map);
  for(const map of texs)for(const blending of [THREE.NormalBlending,THREE.AdditiveBlending])for(const side of [THREE.FrontSide,THREE.DoubleSide]){
    g.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map,transparent:true,blending,side,depthWrite:false})));
    if(side===THREE.FrontSide)g.add(new THREE.Sprite(new THREE.SpriteMaterial({map:map||glowTex,transparent:true,blending,depthWrite:false})))}
  g.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0xffffff})));g.add(new THREE.Mesh(geo,toon(0x888888)));g.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:0xffffff,transparent:true})));
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(0,.1,0)]),new THREE.LineBasicMaterial({color:0xffffff,transparent:true})));
  g.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3()]),new THREE.PointsMaterial({size:.1})));
  try{g.add(soulFig(0xffffff,.5))}catch(e){}// 元嬰／元神斬／法相用的分身（同時讓第一次 clone 的 JS 先跑過）
  if(typeof soulTrail!=='undefined'&&!soulTrail)soulTrail=new Trail(30,.55,0xffc040);
  g.traverse(o=>{o.frustumCulled=false});
  let left=2;// 畫兩幀確保都編譯／上傳了，之後藏起來（材質不 dispose，著色器就留在快取）
  return {tick(){if(left===2)try{renderer.compile(scene,camera)}catch(e){}if(left>0&&--left===0)g.visible=false},redo(){g.visible=true;left=2}}})();
// 搖桿卡住保險：手指的 pointerup 有時收不到（例如畫面換了、系統手勢），joy.id 卡著就再也按不動
canvas.addEventListener('lostpointercapture',e=>{if(e.pointerId===joy.id){joy.on=false;joy.id=null;joy.x=joy.y=0;drawJoy()}});
function resetJoy(){joy.on=false;joy.id=null;joy.x=joy.y=0;drawJoy()}
