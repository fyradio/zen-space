/* ================= 水墨放招：玩家技能的地面效果＋瞄準框 =================
   玩家的招＝乾筆一筆刷過（淡灰米色的墨＋技能色混金的勾邊），收尾濺幾顆墨點再淡出；
   妖怪預警（hazards.js）是濕墨慢慢暈開、沒有勾邊，兩者一眼分得出來。
   三種筆觸共用：扇形＝弧形揮掃、直線＝飛白長筆、圓＝一筆圓相；少數招加點綴（竹葉、桃花、蓮瓣、電紋）。
   材質開場一次畫好；每次放招只複製一份 uniforms（同一個著色器程式，不會重新編譯）。 */
const BRUSH=(()=>{
  // ---- 筆觸材質：R＝墨（乾筆飛白）、G＝勾邊；u 沿著筆走的方向、v 從內到外 ----
  function brushTex(kind){const W=512,H=128,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,W,H);
    const rnd=Math.random;x.globalCompositeOperation='lighter';
    // 墨：很多條沿 u 方向的乾筆絲，起筆重、收筆散
    const inkBand=kind==='line'?[.12,.88]:kind==='enso'?[.55,.97]:[.18,.97];
    for(let i=0;i<220;i++){const v=inkBand[0]+rnd()*(inkBand[1]-inkBand[0]),y=v*H,th=1+rnd()*3.5,u0=rnd()*.12,u1=.55+rnd()*.45,a=.05+rnd()*.12*(kind==='enso'?1.3:1);
      x.strokeStyle=`rgba(255,0,0,${a})`;x.lineWidth=th;x.beginPath();x.moveTo(u0*W,y);let px=u0*W;while(px<u1*W){px+=8+rnd()*22;const gap=rnd()<.18;if(gap)x.moveTo(px,y+(rnd()-.5)*2);else x.lineTo(px,y+(rnd()-.5)*2)}x.stroke()}
    // 淡墨底：整片很淡的一層，內側更淡
    const g=x.createLinearGradient(0,kind==='line'?0:H,0,0);
    if(kind==='line'){g.addColorStop(0,'rgba(255,0,0,0)');g.addColorStop(.25,'rgba(255,0,0,.22)');g.addColorStop(.5,'rgba(255,0,0,.3)');g.addColorStop(.75,'rgba(255,0,0,.22)');g.addColorStop(1,'rgba(255,0,0,0)')}
    else{g.addColorStop(0,'rgba(255,0,0,.26)');g.addColorStop(kind==='enso'?.25:.5,'rgba(255,0,0,.16)');g.addColorStop(1,'rgba(255,0,0,0)')}
    x.fillStyle=g;x.fillRect(0,0,W,H);
    // 勾邊：一道不整齊的乾筆邊（扇／圓在外緣，直線在兩側）
    const rim=(v0,v1)=>{for(let i=0;i<26;i++){const y=(v0+rnd()*(v1-v0))*H;x.strokeStyle=`rgba(0,255,0,${.1+rnd()*.3})`;x.lineWidth=.8+rnd()*1.8;x.beginPath();let px=rnd()*.06*W;x.moveTo(px,y);while(px<W*(.94+rnd()*.06)){px+=10+rnd()*30;if(rnd()<.12)x.moveTo(px,y);else x.lineTo(px,y+(rnd()-.5)*1.5)}x.stroke()}};
    if(kind==='line'){rim(.03,.1);rim(.9,.97)}else rim(.93,.99);
    // 起筆、收筆收細
    x.globalCompositeOperation='destination-out';const t0=x.createLinearGradient(0,0,W,0);t0.addColorStop(0,'rgba(0,0,0,.9)');t0.addColorStop(.06,'rgba(0,0,0,0)');t0.addColorStop(.9,'rgba(0,0,0,0)');t0.addColorStop(1,'rgba(0,0,0,.85)');x.fillStyle=t0;x.fillRect(0,0,W,H);
    const t=new THREE.CanvasTexture(c);t.flipY=false;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;return t}// flipY=false：畫布上緣＝內側（v=0）
  const TEX={fan:brushTex('fan'),line:brushTex('line'),enso:brushTex('enso')};
  const VS=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  // 墨色：偏暗的灰米色（月光下的墨痕）；勾邊＝技能色混金再壓暗；mode 1＝瞄準框（只剩淡淡的勾邊＋極淡的墨）
  const FS=`uniform sampler2D tex;uniform float prog,fade,mode;uniform vec3 ink,edge;varying vec2 vUv;
    void main(){vec4 b=texture2D(tex,vUv);float rev=1.-smoothstep(prog-.1,prog,vUv.x);if(mode>.5)rev=1.;
      vec3 e=mix(edge,vec3(.86,.69,.38),.5)*.72;float front=mode>.5?0.:smoothstep(.12,0.,abs(vUv.x-prog+.05))*.35;
      float a=mode>.5?(b.r*.12+b.g*.8):(b.r*.45+b.g*.7+front*b.r);vec3 col=mix(ink,e,clamp(b.g*1.6+front,0.,1.));
      gl_FragColor=vec4(col,clamp(a,0.,1.)*rev*fade);}`;
  const base=new THREE.ShaderMaterial({uniforms:{tex:{value:TEX.fan},prog:{value:1},fade:{value:1},mode:{value:0},ink:{value:new THREE.Color(0x8c8576)},edge:{value:new THREE.Color(0xd8b060)}},
    vertexShader:VS,fragmentShader:FS,transparent:true,depthWrite:false,side:THREE.DoubleSide});
  const mat=(kind,col,mode=0)=>{const m=base.clone();m.uniforms.tex.value=TEX[kind];m.uniforms.edge.value=new THREE.Color(col);m.uniforms.mode.value=mode;return m};
  // ---- 幾何：扇形（u＝角度、v＝半徑）、直線（u＝長度、v＝寬度）----
  const secCache={};
  function sectorGeo(ang,inner=.08){const k=ang.toFixed(3)+'/'+inner;if(secCache[k])return secCache[k];const sa=Math.max(12,Math.round(ang*16)),sr=4,pos=[],uv=[],idx=[];
    for(let i=0;i<=sa;i++){const t=-ang/2+ang*i/sa;for(let j=0;j<=sr;j++){const r=inner+(1-inner)*j/sr;pos.push(Math.sin(t)*r,0,Math.cos(t)*r);uv.push(i/sa,j/sr)}}
    for(let i=0;i<sa;i++)for(let j=0;j<sr;j++){const a=i*(sr+1)+j,b=a+sr+1;idx.push(a,b,a+1,b,b+1,a+1)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return secCache[k]=g}
  const lineGeo=(()=>{const g=new THREE.BufferGeometry(),pos=[],uv=[],idx=[],n=8;for(let i=0;i<=n;i++)for(let j=0;j<=1;j++){pos.push(j-.5,0,i/n);uv.push(i/n,j)}
    for(let i=0;i<n;i++){const a=i*2;idx.push(a,a+2,a+1,a+2,a+3,a+1)}g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return g})();
  // ---- 墨點／點綴（小 sprite，暗色、一般混色）----
  const sprTex={};
  function motifTex(k){if(sprTex[k])return sprTex[k];return sprTex[k]=ctex(64,64,(x,w,h)=>{x.translate(32,32);
    if(k==='dot'){x.fillStyle='rgba(150,142,126,.9)';x.beginPath();x.arc(0,0,11,0,7);x.fill();for(let i=0;i<6;i++){const a=Math.random()*6.28,r=12+Math.random()*10;x.beginPath();x.arc(Math.cos(a)*r,Math.sin(a)*r,1.5+Math.random()*3,0,7);x.fill()}}
    else if(k==='leaf'){x.rotate(.5);x.fillStyle='#3f7a46';x.beginPath();x.ellipse(0,0,7,24,0,0,7);x.fill();x.strokeStyle='rgba(20,40,20,.8)';x.lineWidth=1.5;x.beginPath();x.moveTo(0,-22);x.lineTo(0,22);x.stroke()}
    else if(k==='lotus'){x.fillStyle='#d88aa0';x.beginPath();x.ellipse(0,4,10,22,0,0,7);x.fill();x.fillStyle='rgba(255,220,230,.7)';x.beginPath();x.ellipse(0,0,4,13,0,0,7);x.fill()}
    else if(k==='zap'){x.strokeStyle='#a98ad8';x.lineWidth=2.5;x.beginPath();x.moveTo(-20,-20);x.lineTo(-4,-6);x.lineTo(-10,2);x.lineTo(8,12);x.lineTo(2,16);x.lineTo(20,24);x.stroke()}})}
  function sprinkle(kind,pts,size,life){if(simming)return;const tex=kind==='petal'?(typeof peachBloom==='function'?peachBloom():motifTex('dot')):motifTex(kind);
    for(const [x,z,d] of pts){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,rotation:Math.random()*6.28,opacity:kind==='dot'?.75:.95}));const sc=size*(.7+Math.random()*.6);s.scale.set(sc,sc,1);s.position.set(x,.12,z);scene.add(s);
      const vx=(Math.random()-.5)*.6,vz=(Math.random()-.5)*.6;act(life+(d||0),t=>{const k=Math.max(0,t-(d||0));s.visible=t>=(d||0);s.position.set(x+vx*k,.12+(kind==='dot'?0:k*.25),z+vz*k);s.material.opacity=(kind==='dot'?.75:.95)*Math.max(0,1-Math.max(0,k-life*.45)/(life*.55))},()=>{scene.remove(s);s.material.dispose()})}}
  // ---- 一筆刷過去：mesh＋動畫（刷出、停一下、淡出）----
  function stroke(geo,kind,col,place,T=.3,hold=.15,fadeT=.3){const m=new THREE.Mesh(geo,mat(kind,col));m.renderOrder=3;place(m);scene.add(m);const U=m.material.uniforms;U.prog.value=0;
    act(T+hold+fadeT,t=>{U.prog.value=Math.min(1.1,t/T*1.1);U.fade.value=t<T+hold?1:1-(t-T-hold)/fadeT},()=>{scene.remove(m);m.material.dispose()});return m}
  function fan(x,z,a0,ang,R,col,motif){const full=ang>=6.2;stroke(sectorGeo(Math.min(ang,Math.PI*2)),full?'enso':'fan',col,m=>{m.position.set(x,.05,z);m.rotation.y=a0;m.scale.setScalar(R)},full?.4:.26);
    const pts=[];for(let i=0;i<5;i++){const t=a0+(full?Math.random()*6.28:ang/2*(Math.random()<.5?1:-1)*(.8+Math.random()*.25)),r=R*(.6+Math.random()*.45);pts.push([x+Math.sin(t)*r,z+Math.cos(t)*r,.24])}sprinkle('dot',pts,.35,.5);
    if(motif){const mp=[];for(let i=0;i<7;i++){const t=a0+(Math.random()-.5)*Math.min(ang,6.28),r=R*(.3+Math.random()*.7);mp.push([x+Math.sin(t)*r,z+Math.cos(t)*r,Math.random()*.2])}sprinkle(motif,mp,motif==='zap'?.7:.42,.6)}}
  function line(x,z,a0,L,W,col,motif){stroke(lineGeo,'line',col,m=>{m.position.set(x,.05,z);m.rotation.y=a0;m.scale.set(W,1,L)},.22);
    const pts=[];for(let i=0;i<4;i++){const d=L*(.75+Math.random()*.3),s=(Math.random()-.5)*W*1.4;pts.push([x+Math.sin(a0)*d+Math.cos(a0)*s,z+Math.cos(a0)*d-Math.sin(a0)*s,.2])}sprinkle('dot',pts,.3,.5);
    if(motif){const mp=[];for(let i=0;i<6;i++){const d=L*Math.random(),s=(Math.random()-.5)*W;mp.push([x+Math.sin(a0)*d+Math.cos(a0)*s,z+Math.cos(a0)*d-Math.sin(a0)*s,d/L*.2])}sprinkle(motif,mp,.42,.55)}}
  function circle(x,z,R,col,motif,T=.32){stroke(sectorGeo(Math.PI*2,.05),'enso',col,m=>{m.position.set(x,.05,z);m.rotation.y=Math.random()*6.28;m.scale.setScalar(R)},T,.12,.28);
    const pts=[];for(let i=0;i<4;i++){const t=Math.random()*6.28,r=R*(.95+Math.random()*.25);pts.push([x+Math.sin(t)*r,z+Math.cos(t)*r,T])}sprinkle('dot',pts,.3,.45);
    if(motif){const mp=[];for(let i=0;i<6;i++){const t=Math.random()*6.28,r=R*Math.random();mp.push([x+Math.sin(t)*r,z+Math.cos(t)*r,Math.random()*.2])}sprinkle(motif,mp,motif==='zap'?.7:.42,.55)}}
  // 各招的點綴
  const MOTIF={sweep0:'leaf',peach:'petal',sweep2:'lotus',thunder0:'zap',thunder2:'zap',yinlei:'zap',leiyun:'zap',goldlei:'zap'};
  // 放招時依招式形狀畫出水墨（castSkill 成功後呼叫）
  function cast(k,A){if(simming||k==='ult')return;const S=SK[k];if(!S)return;const hx=HERO.pos.x,hz=HERO.pos.z,col=S.col,mo=MOTIF[S.id];
    const a0=A&&A.dir?Math.atan2(A.dir[0],A.dir[1]):root.rotation.y;
    if(S.shape==='fan')fan(hx,hz,a0,S.full&&S.full()?Math.PI*2:S.ang,S.range(),col,mo);
    else if(S.shape==='line'){const sp=S.spread?S.spread():0;if(sp>=6.2)fan(hx,hz,a0,Math.PI*2,S.range(),col,mo);else if(sp>.3){fan(hx,hz,a0,sp,S.range(),col,mo);line(hx,hz,a0,S.range(),S.w,col)}else line(hx,hz,a0,S.range(),S.w*1.25,col,mo)}
    else if(S.shape==='circle'&&A&&A.pt)circle(A.pt[0],A.pt[1],S.r(),col,mo);
    else if(S.shape==='self')circle(hx,hz,S.range(),col,mo,.36)}
  // ---- 瞄準框：同一套筆觸、只剩淡淡的勾邊（換掉原本發亮的純色框）----
  function aimify(IND){const sw=(m,kind,geo)=>{m.material=mat(kind,0xd8b060,1);m.material.uniforms.fade.value=.9;if(geo)m.geometry=geo};
    sw(IND.fan,'fan',sectorGeo(SK.sweep.ang||1));sw(IND.line,'line',lineGeo);sw(IND.circ,'enso',sectorGeo(Math.PI*2,.05));
    for(const m of [IND.range,IND.edge])m.material=new THREE.MeshBasicMaterial({color:0xb89a5a,transparent:true,opacity:.22,depthWrite:false});IND.edge.material.opacity=.45}
  // 預先編譯著色器、上傳筆觸與點綴貼圖（warm.js 呼叫）
  function warm(g){g.add(new THREE.Mesh(lineGeo,mat('line',0xffffff)));for(const k of ['dot','leaf','lotus','zap'])g.add(new THREE.Sprite(new THREE.SpriteMaterial({map:motifTex(k),transparent:true,depthWrite:false})));g.add(new THREE.Mesh(lineGeo,mat('fan',0xffffff)));g.add(new THREE.Mesh(lineGeo,mat('enso',0xffffff)))}
  return {warm,cast,fan,line,circle,sectorGeo,lineGeo,aimify,setCol:(m,c)=>{if(m.material.uniforms)m.material.uniforms.edge.value.setHex(c);else m.material.color.setHex(c===0x9a9a9a?c:0xb89a5a)}}})();
