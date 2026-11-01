/* ================= 大境界突破（電影版）＝ ASC =================
   築基（realm 9）、結丹（12）、元嬰（15）、化神（18，結局）。完整版約 13 秒，三幕：蓄勢 → 爆發 → 蛻變；短版 5 秒（只播爆發＋蛻變）。
   完整版：靜室打坐、靜室「回看突破」、結局的化神。短版：戰場上引雷劫（全場凍結，播完震開妖群）、結局的突破蒙太奇。
   電影感：上下黑邊、爆發那一秒慢動作、鼓聲蓄勢＋鐘鳴、化神最後一筆寫出兩個大字（置中）。點一下跳過。
   各境界招牌：築基＝靈氣化青龍盤旋灌頂、地面放射裂紋、光柱衝破雲層；結丹＝九顆靈珠繞身匯成金丹、丹火燒遍全身、金蓮滿地開；
   元嬰＝黑雲漩渦、九道紫金天雷、身後巨大法相虛影、元嬰坐蓮升空；化神＝天地全白、萬劍從天而降圍成圓、背後九層光輪。
   所有效果都由「時間 t」直接算出位置（不累積狀態），所以短版可以從中途開始播。 */
const ASC=(()=>{let on=null;const FULL=13,SHORT_T0={zhuji:5.0,jiedan:4.6,yuanying:6.3,huashen:7};// 精簡版：從「靈氣／青龍／金丹灌進主角」那一刻開始、播到完整結尾（光暈與陣圖淡出、鏡頭回到主角）
  const KIND={9:'zhuji',12:'jiedan',15:'yuanying',18:'huashen'};
  const NAME={zhuji:['築基','根基已成・踏入築基期','築'],jiedan:['結丹','金丹凝成・踏入結丹期','丹'],yuanying:['元嬰','元嬰出世・踏入元嬰期','嬰'],huashen:['化神','元嬰化神・踏入化神期','神']};
  const COL={zhuji:0x3fe0a8,jiedan:0xffc040,yuanying:0xc89cff,huashen:0xffe6a0};
  const lowQ=()=>typeof POWER!=='undefined'&&POWER.low;
  // ---------- 畫面上的電影元素（黑邊、閃白、天色、字幕、書法大字＋印章）----------
  const ov=document.createElement('div');ov.id='ascOv';ov.innerHTML='<div class="ascSky"></div><div class="ascFlash"></div><div class="ascBar t"></div><div class="ascBar b"><span class="ascCap"></span></div><div class="ascT"><b></b></div><div class="ascSkip">點一下跳過</div>';document.body.appendChild(ov);
  const st=document.createElement('style');st.textContent=`#ascOv{position:fixed;inset:0;z-index:38;display:none;cursor:pointer;overflow:hidden}#ascOv.on{display:block}
    #ascOv .ascBar{position:absolute;left:0;right:0;height:11vh;background:#000;transition:transform .7s cubic-bezier(.3,.9,.3,1)}#ascOv .ascBar.t{top:0;transform:translateY(-100%)}#ascOv .ascBar.b{bottom:0;transform:translateY(100%);display:grid;place-items:center}
    #ascOv.bars .ascBar{transform:none}#ascOv .ascCap{font-size:14px;letter-spacing:.35em;color:#e8dcc0}
    #ascOv .ascSky{position:absolute;inset:0;opacity:0;pointer-events:none}#ascOv .ascFlash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
    #ascOv .ascT{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;justify-content:center;align-items:center;gap:14px;opacity:0;transition:opacity .4s}#ascOv.show .ascT{opacity:1}
    #ascOv .ascT b{font-family:var(--f-ui);font-weight:700;font-size:min(16vh,78px);letter-spacing:.18em;color:#fff3cf;text-shadow:0 0 22px rgba(242,199,92,.85),0 4px 0 #2a1a04;clip-path:inset(0 100% 0 0);transition:clip-path 1.1s cubic-bezier(.5,0,.3,1)}
    #ascOv.show .ascT b{clip-path:inset(0 0 0 0)}
    #ascOv .ascSkip{position:absolute;right:calc(env(safe-area-inset-right,0px) + 16px);bottom:2vh;font-size:11px;color:rgba(255,255,255,.45);letter-spacing:.2em;z-index:2}`;document.head.appendChild(st);
  // ---------- 花紋貼圖（第一次用到才畫，畫好留著）----------
  const TX={};const cvs=(n,f)=>{const c=document.createElement('canvas');c.width=c.height=n;const x=c.getContext('2d');x.translate(n/2,n/2);f(x,n/2);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
  // 陣圖：雙外圈＋刻度、24 格符文、八卦、雲紋捲草、內圈蓮瓣、中心八芒星（全部白線，靠材質上色）
  function rune(){return TX.rune||(TX.rune=cvs(1024,(x,R)=>{x.strokeStyle=x.fillStyle='#fff';x.lineCap='round';x.shadowColor='#fff';x.shadowBlur=6;
    const ring=(r,w)=>{x.lineWidth=w;x.beginPath();x.arc(0,0,r,0,7);x.stroke()};ring(R*.97,7);ring(R*.93,2);ring(R*.78,3);ring(R*.74,1.5);ring(R*.55,3);ring(R*.36,2.5);ring(R*.16,2);
    for(let i=0;i<144;i++){const a=i/144*6.283,l=i%6?.012:.03;x.lineWidth=i%6?1.5:3;x.beginPath();x.moveTo(Math.cos(a)*R*.93,Math.sin(a)*R*.93);x.lineTo(Math.cos(a)*R*(.93-l),Math.sin(a)*R*(.93-l));x.stroke()}
    let seed=11;const r=()=>(seed=(seed*16807)%2147483647)/2147483647;// 偽篆字：每格幾筆橫豎轉折
    for(let i=0;i<24;i++){x.save();x.rotate(i/24*6.283);x.translate(0,-R*.855);const s=R*.05;x.lineWidth=3.2;for(let k=0;k<4+Math.floor(r()*3);k++){x.beginPath();const a=(r()-.5)*s*1.6,b=(r()-.5)*s*1.6;x.moveTo(a,b);x.lineTo(a+(r()<.5?s*(r()-.5)*2:0),b+(r()<.5?s*(r()-.5)*2:0));if(r()<.5)x.lineTo(a+(r()-.5)*s,b+s*.6);x.stroke()}
      x.lineWidth=1.5;x.strokeRect(-s*1.1,-s*1.1,s*2.2,s*2.2);x.restore()}
    for(let i=0;i<8;i++){x.save();x.rotate(i/8*6.283);x.translate(0,-R*.65);x.lineWidth=7;const code=[7,0,3,6,1,4,5,2][i];for(let j=0;j<3;j++){const y=-16+j*16,broken=!((code>>j)&1);if(broken){x.beginPath();x.moveTo(-26,y);x.lineTo(-6,y);x.moveTo(6,y);x.lineTo(26,y);x.stroke()}else{x.beginPath();x.moveTo(-26,y);x.lineTo(26,y);x.stroke()}}x.restore()}
    x.lineWidth=2.5;for(let i=0;i<12;i++){x.save();x.rotate(i/12*6.283+.26);x.translate(0,-R*.455);x.beginPath();for(let k=0;k<40;k++){const a=k/40*9,rr=3+k*.75;x.lineTo(Math.cos(a)*rr-12,Math.sin(a)*rr)}x.stroke();x.beginPath();for(let k=0;k<40;k++){const a=-k/40*9+3.14,rr=3+k*.75;x.lineTo(Math.cos(a)*rr+12,Math.sin(a)*rr)}x.stroke();x.restore()}
    for(let i=0;i<16;i++){x.save();x.rotate(i/16*6.283);x.lineWidth=2;x.beginPath();x.moveTo(0,-R*.17);x.quadraticCurveTo(R*.05,-R*.27,0,-R*.35);x.quadraticCurveTo(-R*.05,-R*.27,0,-R*.17);x.stroke();x.restore()}
    x.lineWidth=3;x.beginPath();for(let i=0;i<=16;i++){const a=i/16*6.283,rr=i%2?R*.06:R*.15;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.stroke();ring(R*.03,3)}))}
  // 光輪：同心環＋48 道漸細光芒＋外緣火焰卷＋內圈連珠
  function halo(){return TX.halo||(TX.halo=cvs(512,(x,R)=>{x.strokeStyle=x.fillStyle='#fff';x.shadowColor='#fff';x.shadowBlur=8;
    for(let i=0;i<48;i++){x.save();x.rotate(i/48*6.283);x.globalAlpha=i%2?.5:.9;x.beginPath();x.moveTo(-3,-R*.42);x.lineTo(0,-R*(i%2?.8:.9));x.lineTo(3,-R*.42);x.fill();x.restore()}x.globalAlpha=1;
    x.lineWidth=5;x.beginPath();x.arc(0,0,R*.4,0,7);x.stroke();x.lineWidth=2;x.beginPath();x.arc(0,0,R*.34,0,7);x.stroke();
    for(let i=0;i<24;i++){const a=i/24*6.283;x.beginPath();x.arc(Math.cos(a)*R*.37,Math.sin(a)*R*.37,4,0,7);x.fill()}
    x.lineWidth=3;x.beginPath();for(let i=0;i<=72;i++){const a=i/72*6.283,rr=R*(.9+.05*Math.sin(i*6));x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.stroke()}))}
  // 黑雲漩渦：對數螺旋雲帶＋裂紋
  function vortex(){return TX.vortex||(TX.vortex=cvs(1024,(x,R)=>{for(let k=0;k<5;k++)for(let i=0;i<260;i++){const t=i/260,a=k/5*6.283+t*9,rr=R*(.05+t*.95),s=8+t*60;const g=x.createRadialGradient(Math.cos(a)*rr,Math.sin(a)*rr,0,Math.cos(a)*rr,Math.sin(a)*rr,s);
      g.addColorStop(0,`rgba(${20+k*4},${16+k*3},${34+k*6},.32)`);g.addColorStop(1,'rgba(10,8,20,0)');x.fillStyle=g;x.fillRect(Math.cos(a)*rr-s,Math.sin(a)*rr-s,s*2,s*2)}
    x.strokeStyle='rgba(200,170,255,.45)';x.lineWidth=2;for(let k=0;k<14;k++){let a=Math.random()*6.283,rr=R*.15;x.beginPath();x.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);for(let j=0;j<8;j++){a+=(Math.random()-.5)*.5;rr+=R*.08;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.stroke()}}))}
  // 地面放射裂紋（會分岔）
  function crack(){return TX.crack||(TX.crack=cvs(1024,(x,R)=>{x.strokeStyle='#fff';x.shadowColor='#fff';x.shadowBlur=10;x.lineCap='round';
    const br=(px,py,a,len,w,d)=>{if(d>4||w<.6)return;x.lineWidth=w;x.beginPath();x.moveTo(px,py);let cx=px,cy=py;const n=6;for(let i=0;i<n;i++){a+=(Math.random()-.5)*.5;cx+=Math.cos(a)*len/n;cy+=Math.sin(a)*len/n;x.lineTo(cx,cy)}x.stroke();
      br(cx,cy,a+(Math.random()-.5)*.6,len*.7,w*.75,d+1);if(Math.random()<.6)br(cx,cy,a+(Math.random()<.5?.7:-.7),len*.5,w*.6,d+1)};
    for(let i=0;i<18;i++){const a=i/18*6.283+Math.random()*.2;br(Math.cos(a)*R*.04,Math.sin(a)*R*.04,a,R*.32,6,0)}}))}
  // 火苗、雲層
  function flame(){return TX.flame||(TX.flame=ctex(64,64,(x,w,h)=>{const g=x.createRadialGradient(32,40,2,32,36,26);g.addColorStop(0,'rgba(255,250,220,1)');g.addColorStop(.4,'rgba(255,190,80,.9)');g.addColorStop(1,'rgba(255,90,20,0)');x.fillStyle=g;x.beginPath();x.moveTo(32,4);x.quadraticCurveTo(54,36,32,60);x.quadraticCurveTo(10,36,32,4);x.fill()}))}
  function cloudLayer(){return TX.cloud||(TX.cloud=cvs(512,(x,R)=>{for(let i=0;i<160;i++){const a=Math.random()*6.283,rr=R*(.3+Math.random()*.68),s=20+Math.random()*50;const g=x.createRadialGradient(Math.cos(a)*rr,Math.sin(a)*rr,0,Math.cos(a)*rr,Math.sin(a)*rr,s);g.addColorStop(0,'rgba(170,200,210,.25)');g.addColorStop(1,'rgba(170,200,210,0)');x.fillStyle=g;x.fillRect(Math.cos(a)*rr-s,Math.sin(a)*rr-s,s*2,s*2)}}))}
  // ---------- 小工具 ----------
  const root3=new THREE.Group();scene.add(root3);
  const own=[];const keep=o=>{root3.add(o);own.push(o);return o};
  const add=(c,o={})=>new THREE.MeshBasicMaterial(Object.assign({color:LC(c),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide},o));
  const disc=(tex,col,R,y,op=1)=>{const m=keep(new THREE.Mesh(new THREE.PlaneGeometry(R*2,R*2).rotateX(-Math.PI/2),add(col,{map:tex,opacity:op})));m.position.y=y;return m};
  const sprite=(col,s,op=1,map=glowTex)=>{const m=keep(new THREE.Sprite(new THREE.SpriteMaterial({map,color:LC(col),transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false})));m.scale.set(s,s,1);return m};
  function points(n,col,size,map=glowTex){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(n*3),3));const p=keep(new THREE.Points(g,new THREE.PointsMaterial({map,color:LC(col),size,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true})));p.frustumCulled=false;return p}
  // 不能丟的共用資源：主角身體的幾何（元嬰、法相是主角的分身）、金蓮花瓣、精靈共用幾何
  const noDispose=new WeakSet();const share=o=>{o.traverse(c=>{if(c.geometry)noDispose.add(c.geometry)});return o};
  function clear(){for(const o of own){root3.remove(o);o.traverse(c=>{if(c.geometry&&!c.isSprite&&!noDispose.has(c.geometry)&&c.geometry!==LOTUS_PETAL)c.geometry.dispose();if(c.material&&!LOTUS_M.includes(c.material)){if(Array.isArray(c.material))c.material.forEach(m=>m.dispose());else c.material.dispose()}})}own.length=0}
  const sm=(a,b,t)=>{const k=Math.min(1,Math.max(0,(t-a)/(b-a)));return k*k*(3-2*k)};// smoothstep
  const pulse=(t,a,w)=>Math.max(0,1-Math.abs(t-a)/w);
  // 閃電（每道是一條帶寬的折線＋發光點）
  function boltMesh(x,z,col,top=22){const pts=[];let px=x,pz=z;for(let y=top;y>=1;y-=1.4){pts.push(new THREE.Vector3(px,y,pz));px=x+(Math.random()-.5)*1.8;pz=z+(Math.random()-.5)*1.8}pts.push(new THREE.Vector3(x,.2,z));
    const g=new THREE.Group();const M=add(col,{opacity:1});for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],len=a.distanceTo(b),m=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,len,4),M);m.position.copy(a).add(b).multiplyScalar(.5);m.lookAt(b);m.rotateX(Math.PI/2);g.add(m)}
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:LC(col),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(6,6,1);s.position.set(x,.8,z);g.add(s);g.userData.M=M;g.userData.S=s;return keep(g)}
  // ---------- 各境界的場景 ----------
  function build(kind,x,z,yaw){const S={x,z,yaw},q=lowQ()?.5:1,C=COL[kind];
    S.rune=disc(rune(),C,kind==='huashen'?9:7,.06,0);S.rune.position.x=x;S.rune.position.z=z;
    S.rune2=disc(rune(),C,kind==='huashen'?4:3,.07,0);S.rune2.position.set(x,.07,z);
    S.qi=points(Math.round(260*q),kind==='zhuji'?0x5fffc0:kind==='jiedan'?0xffd070:kind==='yuanying'?0xb890ff:0xfff0c0,.35);S.qiSeed=Array.from({length:Math.round(260*q)},()=>[Math.random()*6.283,8+Math.random()*14,Math.random()*6,Math.random()]);
    S.waves=[0,1,2].map(i=>{const m=keep(new THREE.Mesh(new THREE.RingGeometry(.86,1,64).rotateX(-Math.PI/2),add(C,{opacity:0})));m.position.set(x,.1+i*.02,z);return m});
    S.aura=sprite(C,3.2,0);S.aura.position.set(x,1,z);
    if(kind==='zhuji'){// 青龍：40 節由粗到細的身體＋龍頭（雙角、雙目）＋鬃毛光點
      const M=new THREE.MeshBasicMaterial({color:LC(0x2fd8a0),transparent:true,opacity:.95}),M2=add(0x9fffe0,{opacity:.7});S.dragon=[];
      for(let i=0;i<40;i++){const r=.26*(1-i/48),m=keep(new THREE.Mesh(new THREE.SphereGeometry(r,10,8),i%3===0?M2:M));m.visible=false;S.dragon.push(m)}
      const head=keep(new THREE.Group());part(new THREE.ConeGeometry(.26,.8,8),M,head,{r:[Math.PI/2,0,0]});[-1,1].forEach(d=>{part(new THREE.ConeGeometry(.06,.7,5),M2,head,{p:[d*.22,.35,-.25],r:[-.7,0,d*.3]});part(new THREE.SphereGeometry(.07,8,6),new THREE.MeshBasicMaterial({color:0xfff6a0}),head,{p:[d*.2,.12,.25]})});
      for(let i=0;i<4;i++)part(new THREE.ConeGeometry(.03,.6,4),M2,head,{p:[(i-1.5)*.08,-.18,.4],r:[Math.PI/2+.4,0,0]});head.visible=false;S.head=head;
      S.cracks=disc(crack(),0x3fe0a8,26,.05,0);S.cracks.position.x=x;S.cracks.position.z=z;
      S.pil=keep(new THREE.Mesh(new THREE.CylinderGeometry(1,1.4,1,40,1,true),add(0x7fffd0,{map:pillarTex,opacity:0})));S.pil.position.set(x,0,z);
      S.cl=keep(new THREE.Mesh(new THREE.RingGeometry(1,30,48).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({map:cloudLayer(),color:LC(0x9fc0c8),transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide})));S.cl.position.set(x,16,z)}
    if(kind==='jiedan'){S.pearls=[];for(let i=0;i<9;i++){const g=keep(new THREE.Group());const m=new THREE.Mesh(new THREE.SphereGeometry(.22,14,10),new THREE.MeshBasicMaterial({color:LC(0xfff0b0)}));g.add(m);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:LC(0xffb030),transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(1.4,1.4,1);g.add(s);S.pearls.push(g)}
      S.core=keep(new THREE.Group());const cm=new THREE.Mesh(new THREE.SphereGeometry(.7,28,20),new THREE.MeshBasicMaterial({color:LC(0xe8a020),map:rune(),transparent:true}));S.core.add(cm);S.coreG=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:LC(0xffa020),transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));S.coreG.scale.set(4,4,1);S.core.add(S.coreG);S.core.visible=false;
      S.fire=points(Math.round(160*q),0xffa030,.5,flame());S.fireSeed=Array.from({length:Math.round(160*q)},()=>[Math.random()*6.283,Math.random()*.6,Math.random()]);
      // 金蓮滿地：用 InstancedMesh 一次畫好全部花瓣
      const N=Math.round(36*q),P=12;S.lotus=keep(new THREE.InstancedMesh(LOTUS_PETAL,new THREE.MeshBasicMaterial({color:LC(0xffe8a8),vertexColors:true,side:THREE.DoubleSide,transparent:true,depthWrite:false}),N*P));S.lotus.frustumCulled=false;
      S.lotusPos=Array.from({length:N},(_,i)=>{const a=i*2.399,r=2.2+Math.sqrt(i/N)*13;return [x+Math.sin(a)*r,z+Math.cos(a)*r,r/15.2,.6+Math.random()*.5]})}
    if(kind==='yuanying'){S.vort=keep(new THREE.Mesh(new THREE.CircleGeometry(40,64).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({map:vortex(),transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide})));S.vort.position.set(x,20,z);S.bolts=[];
      S.fx=share(soulFig(0xffcf70,.0));S.fx.scale.setScalar(5.2);keep(S.fx);S.fxM=S.fx.userData.M;S.fxHalo=disc(halo(),0xd8a0ff,5,0,0);S.fxHalo.rotation.x=0;S.fxHalo.geometry.rotateX(Math.PI/2);
      S.baby=share(soulFig(0xffd86a,.85));S.baby.scale.setScalar(.55);keep(S.baby);S.baby.visible=false;const lot=keep(new THREE.Group());for(let i=0;i<12;i++){const p=new THREE.Group();p.rotation.y=i/12*6.28;const m=new THREE.Mesh(LOTUS_PETAL,LOTUS_M[i%3]);m.scale.set(.32,.45,1);m.rotation.x=-.95;p.add(m);lot.add(p)}lot.visible=false;S.lot=lot;
      S.bHalo=disc(halo(),0xffd890,1.1,0,0);S.bHalo.geometry.rotateX(Math.PI/2)}
    if(kind==='huashen'){const N=Math.round(720*q);S.swords=keep(new THREE.InstancedMesh(new THREE.ConeGeometry(.08,1.6,4).rotateX(Math.PI),new THREE.MeshBasicMaterial({color:LC(0xffe090),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}),N));S.swords.frustumCulled=false;
      S.swSeed=Array.from({length:N},(_,i)=>{const ring=i%3,a=i/N*6.283*3+ring*.7,r=9+ring*2.6+Math.random()*.8;return [x+Math.sin(a)*r,z+Math.cos(a)*r,Math.random()*2.2,(Math.random()-.5)*.3]});
      S.wheels=[];for(let i=0;i<9;i++){const d=disc(halo(),i%2?0xfff0c0:0xffc860,1.2+i*.55,0,0);d.geometry.rotateX(Math.PI/2);S.wheels.push(d)}}
    return S}
  const dummy=new THREE.Object3D(),V=new THREE.Vector3(),V2=new THREE.Vector3();
  function update(o,t){const S=o.S,x=S.x,z=S.z,kind=o.kind,C=COL[kind],fwd=[Math.sin(S.yaw),Math.cos(S.yaw)];
    const act1=sm(.5,7,t),burst=pulse(t,7.25,.6),act3=sm(8.6,9.6,t);
    // 主角浮起
    root.position.y=o.y0+sm(.8,6.5,t)*.8*(1-sm(11.5,12.6,t));root.rotation.y=S.yaw;mode='cast';
    // 陣圖：蓄勢時慢慢顯現旋轉，爆發時亮到頂，之後淡出
    const ro=Math.min(1,act1*1.2)*(1-sm(11.2,12.6,t));S.rune.material.opacity=.55*ro+.4*burst;S.rune.rotation.y=t*.12;S.rune2.material.opacity=.7*ro+.3*burst;S.rune2.rotation.y=-t*.3;
    S.rune.position.y=.06;S.rune2.position.y=.07+act1*.04;
    // 靈氣從四面八方湧向主角
    {const P=S.qi.geometry.attributes.position,arr=P.array;for(let i=0;i<S.qiSeed.length;i++){const [a0,r0,y0,ph]=S.qiSeed[i],k=((t*.22+ph)%1),r=r0*(1-k),a=a0+k*3;arr[i*3]=x+Math.sin(a)*r;arr[i*3+1]=.3+y0*(1-k)+k*(1.2+root.position.y);arr[i*3+2]=z+Math.cos(a)*r}P.needsUpdate=true;S.qi.material.opacity=(t<7?act1:1-sm(7.2,8,t))*.9}
    // 衝擊波三層
    S.waves.forEach((w,i)=>{const k=Math.max(0,t-7.15-i*.18);w.scale.setScalar(.5+k*22);w.material.opacity=k>0?Math.max(0,.85-k*.75):0});
    // 蛻變：主角光暈
    S.aura.position.set(x,1+root.position.y,z);S.aura.scale.setScalar(3.4+Math.sin(t*4)*.2);S.aura.material.opacity=act3*.55*(1-sm(12,12.8,t))+burst*.6;
    if(kind==='zhuji'){// 青龍盤旋→灌頂
      const dive=sm(5.6,7.1,t),show=sm(.9,2,t);S.head.visible=show>0;S.dragon.forEach((m,i)=>{m.visible=show>0&&t<7.3;const s=t*1.6-i*.11,r=(3.2-s*.12)*(1-dive)+.2,a=s*1.15,y=1.5+2.2*Math.sin(s*.7)+i*.02;
        V.set(x+Math.sin(a)*Math.max(.3,r),y*(1-dive)+(2.3+root.position.y)*dive+i*.03*dive,z+Math.cos(a)*Math.max(.3,r));V2.set(x,2.2+root.position.y+i*.12*(1-dive),z);m.position.lerpVectors(V,V2,dive*dive);m.scale.setScalar(show)});
      const h0=S.dragon[0].position,h1=S.dragon[2].position;S.head.position.copy(h0);S.head.lookAt(V.copy(h0).multiplyScalar(2).sub(h1));S.head.visible=show>0&&t<7.3;
      S.cracks.material.opacity=sm(7.1,7.6,t)*(1-sm(10.5,12.5,t))*.9;S.cracks.scale.setScalar(.2+sm(7.1,8.6,t)*.8);
      const pk=sm(7.2,7.7,t);S.pil.scale.set(.6+pk*.9+Math.sin(t*20)*.05,60*pk,.6+pk*.9);S.pil.position.y=30*pk;S.pil.material.opacity=pk*(1-sm(8.6,10.6,t))*.4;
      S.cl.material.opacity=sm(1,4,t)*.55*(1-sm(10,12,t));S.cl.scale.setScalar(1+sm(7.4,9,t)*.6);S.cl.rotation.y=t*.05}
    if(kind==='jiedan'){const merge=sm(4.8,6.6,t);S.pearls.forEach((g,i)=>{const inc=i/9*3.14,sp=1.6+i*.07,a=t*sp+i,r=(2.6-act1*.6)*(1-merge);V.set(Math.cos(a)*r,Math.sin(a)*r*Math.sin(inc)*.6,Math.sin(a)*r*Math.cos(inc));
        g.position.set(x+V.x,2.6+root.position.y+V.y,z+V.z);g.visible=t>.8&&t<6.7;g.scale.setScalar(sm(.8,1.6,t+i*.05))});
      const cIn=sm(6.6,7.2,t);S.core.visible=t>=6.4&&t<7.4;S.core.position.set(x,2.6+root.position.y-cIn*1.6,z);S.core.scale.setScalar((.3+sm(6.4,6.8,t)*.9)*(1-cIn*.7));S.core.rotation.y=t*3;
      {const P=S.fire.geometry.attributes.position,arr=P.array,fo=sm(7.2,7.6,t)*(1-sm(11,12.5,t));for(let i=0;i<S.fireSeed.length;i++){const [a,r,ph]=S.fireSeed[i],k=(t*1.3+ph)%1;arr[i*3]=x+Math.sin(a+k)*(.35+r);arr[i*3+1]=root.position.y+.1+k*1.7;arr[i*3+2]=z+Math.cos(a+k)*(.35+r)}P.needsUpdate=true;S.fire.material.opacity=fo;S.fire.material.size=.5+.15*Math.sin(t*9)}
      S.lotusPos.forEach(([lx,lz,d,sc],i)=>{const b=sm(7.4+d*1.6,8.4+d*1.6,t)*(1-sm(11.4,12.6,t));for(let p=0;p<12;p++){dummy.position.set(lx,.03,lz);dummy.rotation.set(0,p/12*6.283+i,0);dummy.updateMatrix();const m=dummy.matrix.clone();
          dummy.position.set(0,0,0);dummy.rotation.set(-(.25+b*(p%2?.9:1.25)),0,0);dummy.scale.set(sc*1.1*b+1e-4,sc*1.5*b+1e-4,1);dummy.updateMatrix();m.multiply(dummy.matrix);S.lotus.setMatrixAt(i*12+p,m);dummy.scale.set(1,1,1)}});S.lotus.instanceMatrix.needsUpdate=true}
    if(kind==='yuanying'){S.vort.material.opacity=sm(.5,3,t)*(1-sm(11,12.6,t))*.95;S.vort.rotation.y=-t*.35;
      const due=[2,2.55,3.1,3.6,4.1,4.6,5.1,5.6,6.9];due.forEach((tt,i)=>{if(t>=tt&&!S.bolts[i]&&t>tt+.5){S.bolts[i]={visible:false,userData:{t0:-9,M:{},S:{material:{}}}};return}if(t>=tt&&!S.bolts[i]){const a=Math.random()*6.283,r=i===8?0:1+Math.random()*3;S.bolts[i]=boltMesh(x+Math.sin(a)*r,z+Math.cos(a)*r,i===8?0xfff0c0:i%2?0xc8a0ff:0xffd890);S.bolts[i].userData.t0=tt;if(!simming){SFX.play('thunder');shake=Math.max(shake,i===8?.9:.45)}}});
      S.bolts.forEach(b=>{if(!b)return;const k=t-b.userData.t0,op=Math.max(0,1-k/.45);b.userData.M.opacity=op;b.userData.S.material.opacity=op;b.visible=op>0});
      const ph=sm(7.4,9.4,t)*(1-sm(11.6,12.8,t));S.fx.position.set(x-fwd[0]*3.2,-4+ph*4,z-fwd[1]*3.2);S.fx.rotation.y=S.yaw;if(S.fxM)S.fxM.opacity=ph*.5;S.fx.visible=ph>0.01;
      S.fxHalo.position.set(x-fwd[0]*3.6,6.2*ph+1.2,z-fwd[1]*3.6);S.fxHalo.rotation.y=S.yaw;S.fxHalo.rotation.z=t*.4;S.fxHalo.material.opacity=ph*.75;
      const bk=sm(9,10.2,t),y=1.5+root.position.y+bk*.9;S.baby.visible=S.lot.visible=bk>0;S.baby.position.set(x,y,z);S.baby.rotation.y=S.yaw;S.lot.position.set(x,y-.04,z);S.lot.scale.setScalar(bk*.8);S.bHalo.position.set(x-fwd[0]*.25,y+.55,z-fwd[1]*.25);S.bHalo.rotation.y=S.yaw;S.bHalo.rotation.z=-t;S.bHalo.material.opacity=bk*.85*(1-sm(12,12.8,t))}
    if(kind==='huashen'){S.swSeed.forEach(([sx,sz,dl,tilt],i)=>{const k=sm(1.2+dl,3+dl,t),y=40*(1-k)+.7;dummy.position.set(sx,y,sz);dummy.rotation.set(tilt,0,tilt*.5);dummy.scale.setScalar(k>0?1:1e-4);dummy.updateMatrix();S.swords.setMatrixAt(i,dummy.matrix)});S.swords.instanceMatrix.needsUpdate=true;S.swords.material.opacity=1-sm(11.5,12.8,t);
      S.wheels.forEach((w,i)=>{const k=sm(8.2+i*.18,9+i*.18,t)*(1-sm(11.8,12.8,t));w.position.set(x-fwd[0]*(.6+i*.05),2+root.position.y+i*.02,z-fwd[1]*(.6+i*.05));w.rotation.y=S.yaw;w.rotation.z=(i%2?-1:1)*t*(.2+i*.05);w.material.opacity=k*(.32-i*.02)})}
    // 畫面：天色、閃白、黑邊、書法大字＋印章
    const sky=ov.querySelector('.ascSky');sky.style.background=kind==='yuanying'?'radial-gradient(ellipse at 50% 60%,rgba(0,0,0,0) 25%,rgba(6,2,16,.9) 85%)':kind==='huashen'?'radial-gradient(ellipse at 50% 55%,rgba(255,252,240,.25) 20%,rgba(255,250,232,.92) 85%)':'radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 25%,rgba(2,6,10,.7) 85%)';
    sky.style.opacity=String(Math.min(1,sm(.3,3,t))*(1-sm(11.8,12.8,t)));ov.querySelector('.ascFlash').style.opacity=String(Math.max(0,1-Math.abs(t-7.2)/.35)*.95);
    ov.classList.toggle('bars',t>.1&&t<12.3);ov.classList.toggle('show',kind==='huashen'&&t>9.6&&t<12.4);// 只有化神出現「化神」兩個字（置中、無印章）
    if(!o.drums){o.drums=1}// 音效由 step 依時間觸發
  }
  const SND=[[1,'drum'],[2.6,'drum'],[3.9,'drum'],[4.9,'drum'],[5.7,'drum'],[6.3,'drum'],[6.7,'drum'],[7.05,'whoosh'],[7.2,'gong']];
  // ---------- 播放控制 ----------
  function play(realm,opt={},done){const kind=KIND[realm]||realm;if(!NAME[kind]){if(done)done();return}stop();
    const battle=!!(G&&!G.over),short=!!opt.short;if(battle){G.prevPausedAsc=G.paused;G.paused=true}
    const t0=short?(SHORT_T0[kind]||7):0;on={kind,t:t0,t0,end:FULL,done,battle,y0:root.position.y,cap:opt.caption||'',snd:0,snap:true};on.S=build(kind,HERO.pos.x,HERO.pos.z,root.rotation.y);
    while(on.snd<SND.length&&SND[on.snd][0]<on.t)on.snd++;
    const n=NAME[kind];ov.querySelector('b').textContent=n[0];ov.querySelector('.ascCap').textContent=on.cap;
    ov.classList.remove('show','bars');ov.classList.add('on');if(!short)SFX.play('ult');buzz(40)}
  ov.addEventListener('pointerdown',e=>{e.preventDefault();if(on&&on.t>on.t0+.4)finish()});
  function step(dt){if(!on)return;const o=on;const slow=o.t>7.15&&o.t<8.1?.35:1;o.t+=dt*slow;
    while(o.snd<SND.length&&o.t>=SND[o.snd][0]){if(!simming)SFX.play(SND[o.snd][1]);if(SND[o.snd][1]==='gong'){shake=Math.max(shake,.8);buzz(120)}o.snd++}
    update(o,o.t);if(o.t>=o.end)finish()}
  // 鏡頭：第一幕繞主角拉近、第二幕推近再拉遠、第三幕從正面低角度仰望（法相、光輪在身後）
  function cam(dt){if(!on)return;const o=on,S=o.S,t=o.t,x=S.x,z=S.z,hy=root.position.y;let a,d,h,ly;
    if(t<7){a=S.yaw+Math.PI+.9+t*.22;d=(o.kind==='zhuji'?10:8)-t*.45;h=1.4+t*.3;ly=1.8+hy}
    else if(t<9){const k=sm(7,9,t);a=S.yaw+Math.PI+.9+7*.22+k*.6;d=3.6+k*(o.kind==='zhuji'?9:6);h=1.4+k*(o.kind==='zhuji'?6:3);ly=1.5+hy+k*(o.kind==='zhuji'?4:1)}
    else{const k=sm(9,10.5,t);a=S.yaw+(o.kind==='yuanying'||o.kind==='huashen'?0:.5)+(1-k)*.8;d=(o.kind==='yuanying'?8.5:o.kind==='huashen'?9:6)-k*.8;h=.7+hy;ly=(o.kind==='yuanying'?3.4:2)+hy}
    const p=tmp2.set(x+Math.sin(a)*d,h,z+Math.cos(a)*d);camera.position.lerp(p,o.snap?1:1-Math.exp(-dt*4));o.snap=false;
    if(shake>0){camera.position.x+=(Math.random()-.5)*shake*.35;camera.position.y+=(Math.random()-.5)*shake*.2;shake=Math.max(0,shake-dt*1.4)}
    camera.lookAt(tmp3.set(x,ly,z));camera.updateMatrixWorld();sky.position.copy(camera.position)}
  function finish(){if(!on)return;const o=on;stop();
    if(o.battle&&G&&!G.over){G.paused=G.prevPausedAsc||false;const R=8,dmg=swordDmg()*30;fx({p:tmp.set(o.S.x,.5,o.S.z),col:COL[o.kind],add:true,life:.6,s0:1,s1:R*2.2,op:.8,vy:0});shake=Math.max(shake,.6);SFX.play('boom');
      for(const e of enemies){if(e.dead)continue;const dx=e.x-o.S.x,dz=e.z-o.S.z,d=Math.hypot(dx,dz);if(d<R+e.r)hurtEnemy(e,dmg,dx/(d||1)*3,dz/(d||1)*3,true,8)}if(boss.alive&&Math.hypot(boss.x-o.S.x,boss.z-o.S.z)<R+boss.r)hurtBoss(dmg*.3)}
    if(o.done)o.done()}
  function stop(){if(!on)return;const o=on;on=null;root.position.y=o.y0;clear();ov.classList.remove('on','show','bars');ov.querySelector('.ascFlash').style.opacity='0'}
  // 結局蒙太奇：築基→結丹→元嬰各 5 秒精華（配字幕），最後接完整化神
  // 結局：回放築基→結丹→元嬰（各 5 秒、不放字）；化神另外用 play(18) 在天亮之後放
  function montage(done){const seq=[9,12,15];let i=0;const next=()=>{if(i<seq.length)play(seq[i++],{short:true},next);else if(done)done()};next()}
  return {play,step,cam,montage,tex:{rune,halo},get on(){return !!on},isMajor:r=>!!KIND[r]&&r!==18}})();
window.__asc=ASC;
// 突破後主角身上的境界氣息：身邊微微竄動的細小電弧（築基玉綠、結丹金、元嬰紫金），偶爾閃一下，加一層很淡的光
const tierAura=(()=>{const g=new THREE.Group();root.add(g);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,opacity:.15,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(1.1,1.5,1);s.position.y=.55;g.add(s);
  const arcs=[];for(let i=0;i<6;i++){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(7*3),3));const l=new THREE.Line(geo,new THREE.LineBasicMaterial({transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false}));l.frustumCulled=false;g.add(l);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(.2,.2,1);g.add(sp);arcs.push({l,sp,life:0,next:Math.random()*.6})}
  // 一道電弧：從身體表面一點跳到附近另一點，中間鋸齒
  function zap(a){const P=a.l.geometry.attributes.position.array,t0=Math.random()*6.283,y0=.12+Math.random()*.8,t1=t0+(Math.random()-.5)*1.4,y1=y0+(Math.random()-.5)*.45,r=.27;
    for(let k=0;k<7;k++){const f=k/6,t=t0+(t1-t0)*f,y=y0+(y1-y0)*f,j=k&&k<6?(Math.random()-.5)*.07:0,rr=r+(k&&k<6?.03+Math.random()*.05:0);P[k*3]=Math.sin(t)*rr+j;P[k*3+1]=y+j;P[k*3+2]=Math.cos(t)*rr+j}a.l.geometry.attributes.position.needsUpdate=true;a.sp.position.set(P[9],P[10],P[11]);a.life=.1+Math.random()*.1}
  let t=0;return {update(dt){const r=save.realm||0,tier=r>=18?0:r>=15?3:r>=12?2:r>=9?1:0;g.visible=tier>0&&!titleOn&&!(typeof ASC!=='undefined'&&ASC.on);if(!g.visible)return;t+=dt;
    const col=LC([0,0x5fffc0,0xffd060,0xc8a0ff][tier]);s.material.color.copy(col);s.material.opacity=.1+.05*Math.sin(t*2.2);
    arcs.forEach((a,i)=>{const c=i%2&&tier===3?LC(0xffe090):col;a.l.material.color.copy(c);a.sp.material.color.copy(c);if(a.life>0){a.life-=dt;const o=Math.random()<.8?1:.35;a.l.material.opacity=o;a.sp.material.opacity=o*.8;if(a.life<=0)a.l.material.opacity=a.sp.material.opacity=0}else{a.next-=dt;if(a.next<=0){zap(a);a.next=.15+Math.random()*(1.1-tier*.2)}}})}}})();
