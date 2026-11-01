/* ================= 大境界突破動畫（築基、結丹、元嬰）＝ ASC =================
   靜室打坐、戰場雷劫都會播；靜室分頁可以回看。約 4.5 秒，點一下跳過。
   戰場上播的時候整場凍結（G.paused），鏡頭繞著主角拉近；播完一圈衝擊波震開並重傷周圍的妖。
   築基：靈氣龍捲從四周吸進丹田、地面裂出光紋、光柱衝天。
   結丹：身後浮現巨大金丹旋轉、壓縮進體內，金光爆散成金粉雨。
   元嬰：天地變暗、九道天雷劈下，頭頂飛出金色小元嬰盤坐蓮台、背後光輪展開。 */
const ASC=(()=>{let on=null;const T=4.6;
  const KIND={9:'zhuji',12:'jiedan',15:'yuanying'},NAME={zhuji:['築基','根基已成・踏入築基期'],jiedan:['結丹','金丹凝成・踏入結丹期'],yuanying:['元嬰','元嬰出世・踏入元嬰期']};
  const ov=document.createElement('div');ov.id='ascOv';ov.innerHTML='<div class="ascDark"></div><div class="ascT"><b></b><small></small></div><div class="ascSkip">點一下跳過</div>';document.body.appendChild(ov);
  const st=document.createElement('style');st.textContent=`#ascOv{position:fixed;inset:0;z-index:38;display:none;cursor:pointer}#ascOv.on{display:block}
    #ascOv .ascDark{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 20%,rgba(4,2,10,.85) 80%);opacity:0;transition:opacity .6s}
    #ascOv .ascT{position:absolute;left:0;right:0;top:4%;text-align:center;opacity:0;transform:scale(1.4);transition:opacity .5s,transform .7s cubic-bezier(.2,1.4,.4,1)}
    #ascOv .ascT b{display:block;font-family:var(--f-ui);font-weight:700!important;font-weight:400;font-size:min(15vh,72px);color:#fff1c2;letter-spacing:.15em;text-shadow:0 0 24px rgba(242,199,92,.9),0 4px 0 #2a1a04}
    #ascOv .ascT small{display:block;margin-top:4px;font-size:15px;letter-spacing:.4em;color:#f2d79a;text-shadow:0 1px 4px #000}
    #ascOv.show .ascT{opacity:1;transform:none}#ascOv .ascSkip{position:absolute;right:calc(env(safe-area-inset-right,0px) + 16px);bottom:12px;font-size:12px;color:rgba(255,255,255,.55);letter-spacing:.2em}`;document.head.appendChild(st);
  const G_=new THREE.Group();scene.add(G_);
  const add=o=>{G_.add(o);return o};const sp=(col,s,op=1)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:LC(col),transparent:true,opacity:op*.7,blending:THREE.AdditiveBlending,depthWrite:false}));m.scale.set(s,s,1);return add(m)};
  const basic=(col,o={})=>new THREE.MeshBasicMaterial(Object.assign({color:LC(col),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide},o));
  function clear(){for(let i=G_.children.length-1;i>=0;i--){const o=G_.children[i];G_.remove(o);o.traverse(c=>{if(c.material&&c.material!==LOTUS_M[0]&&c.material!==LOTUS_M[1])c.material.dispose();if(c.geometry&&c.userData.own)c.geometry.dispose()})}}
  // 自己畫的閃電（洞府裡沒有 G 也能用）
  function bolt(x,z,col){const pts=[];let px=x,pz=z;for(let y=14;y>=1;y-=1.1){pts.push(new THREE.Vector3(px,y,pz));px=x+(Math.random()-.5)*1.2;pz=z+(Math.random()-.5)*1.2}pts.push(new THREE.Vector3(x,1,z));
    const g=new THREE.BufferGeometry().setFromPoints(pts),l=add(new THREE.Line(g,new THREE.LineBasicMaterial({color:LC(col),transparent:true})));l.userData.own=1;l.userData.life=.35;const s=sp(col,3.5,.9);s.position.set(x,1,z);s.userData.life=.35;SFX.play('thunder');shake=Math.max(shake,.5)}
  function build(kind,x,z){const S={};
    if(kind==='zhuji'){S.qi=[];for(let i=0;i<70;i++){const s=sp(i%3?0x2fb88a:0x7fe8c0,.3+Math.random()*.35,.8);s.userData.a=Math.random()*6.28;s.userData.r=6+Math.random()*4;s.userData.h=Math.random()*5;S.qi.push(s)}
      S.cracks=[];for(let i=0;i<12;i++){const m=add(new THREE.Mesh(new THREE.PlaneGeometry(.07,1).rotateX(-Math.PI/2).translate(0,0,.5),basic(0x3fd8a0,{opacity:.8})));m.userData.own=1;m.position.set(x,.06,z);m.rotation.y=i/12*6.28+Math.random()*.3;m.scale.set(1,1,.01);m.userData.len=3+Math.random()*4;S.cracks.push(m)}
      S.pil=add(new THREE.Mesh(new THREE.CylinderGeometry(1,1.3,1,32,1,true),basic(0x6fe8c0,{map:pillarTex})));S.pil.userData.own=1;S.pil.position.set(x,0,z);S.pil.visible=false}
    if(kind==='jiedan'){S.orb=new THREE.Group();add(S.orb);S.orb.position.set(x,2.5,z-.9);const core=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),new THREE.MeshBasicMaterial({color:LC(0xd89020),transparent:true,opacity:.92}));core.userData.own=1;S.orb.add(core);
      for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.5+i*.35,.04,8,64),basic(0xc89030,{opacity:.7}));r.userData.own=1;r.rotation.set(Math.random()*3,Math.random()*3,0);S.orb.add(r)}
      const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:LC(0xc07010),transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.set(4.5,4.5,1);S.orb.add(gl);S.core=core;S.rain=[]}
    if(kind==='yuanying'){S.bolts=0;S.fig=null;S.halo=null}
    return S}
  function play(realm,opt={},done){const kind=KIND[realm]||realm;if(!NAME[kind]){if(done)done();return}stop(true);
    const battle=!!(G&&!G.over);if(battle){on={prevPaused:G.paused};G.paused=true}else on={};
    Object.assign(on,{kind,t:0,done,battle,x:HERO.pos.x,z:HERO.pos.z,yaw:root.rotation.y,S:build(kind,HERO.pos.x,HERO.pos.z),flash:0});
    ov.classList.add('on');ov.classList.remove('show');ov.querySelector('b').textContent=NAME[kind][0];ov.querySelector('small').textContent=NAME[kind][1];ov.querySelector('.ascDark').style.opacity=kind==='yuanying'?1:.45;
    SFX.play('ult');buzz(60)}
  ov.addEventListener('pointerdown',e=>{e.preventDefault();if(on&&on.t>.4)finish()});
  function step(dt){if(!on)return;const o=on,S=o.S,t=(o.t+=dt),x=o.x,z=o.z;mode='cast';root.rotation.y=o.yaw;
    if(t>3.1&&!ov.classList.contains('show')){ov.classList.add('show');SFX.play('gold')}
    if(o.kind==='zhuji'){for(const s of S.qi){const u=s.userData,k=Math.min(1,t/3);u.a+=dt*(2+k*6);const r=u.r*(1-k*.95);s.position.set(x+Math.sin(u.a)*r,.3+u.h*(1-k)+k*1,z+Math.cos(u.a)*r);s.material.opacity=t<3?.9:Math.max(0,.9-(t-3)*3)}
      S.cracks.forEach((m,i)=>{const k=Math.min(1,Math.max(0,(t-1.2-i*.05)/.8));m.scale.set(1+k,1,m.userData.len*k);m.material.opacity=.9*(t<3.6?1:Math.max(0,1-(t-3.6)/.8))});
      if(t>2.9){S.pil.visible=true;const k=Math.min(1,(t-2.9)/.3);S.pil.scale.set(.35+k*.35,30*k,.35+k*.35);S.pil.position.y=15*k;S.pil.material.opacity=.55*Math.max(0,1-(t-3.3)/1.2);if(!o.boom){o.boom=1;shake=Math.max(shake,.7);sp(0x6fe8c0,7,1).position.set(x,1,z)}}}
    if(o.kind==='jiedan'){const k=Math.min(1,t/2.6),sq=t<2.6?1:Math.max(.05,1-(t-2.6)/.4);S.orb.rotation.y+=dt*(1+k*5);S.orb.children.forEach((c,i)=>{if(i&&i<4){c.rotation.x+=dt*(1+i);c.rotation.z+=dt*.7*i}});
      S.orb.scale.setScalar((.25+k*.95)*sq);S.orb.position.set(x,2.5-(t>2.6?Math.min(1,(t-2.6)/.4)*1.7:0),z-.9*(t>2.6?1-Math.min(1,(t-2.6)/.4):1));
      if(t>3&&!o.boom){o.boom=1;S.orb.visible=false;shake=Math.max(shake,.7);sp(0xd8a030,8,1).position.set(x,1.2,z);for(let i=0;i<90;i++){const s=sp(0xe8b040,.16+Math.random()*.18,1);const a=Math.random()*6.28,r=Math.random()*7;s.position.set(x+Math.sin(a)*r,4+Math.random()*5,z+Math.cos(a)*r);s.userData.v=.8+Math.random()*1.4;S.rain.push(s)}}
      for(const s of S.rain){s.position.y-=s.userData.v*dt;s.material.opacity=Math.max(0,1-(t-3)/1.6)}}
    if(o.kind==='yuanying'){while(S.bolts<9&&t>=.25+S.bolts*.27){const a=Math.random()*6.28,r=S.bolts===8?0:Math.random()*2;bolt(x+Math.sin(a)*r,z+Math.cos(a)*r,S.bolts===8?0xe8e0ff:0xa890f0);S.bolts++}
      if(t>2.7&&!S.fig){S.fig=soulFig(0xffd86a,.85);S.fig.scale.setScalar(.55);add(S.fig);const lot=new THREE.Group();for(let i=0;i<10;i++){const p=new THREE.Group();p.rotation.y=i/10*6.28;const m=new THREE.Mesh(LOTUS_PETAL,LOTUS_M[i%2]);m.scale.set(.35,.5,1);m.rotation.x=-.9;p.add(m);lot.add(p)}S.lot=lot;add(lot);
        S.halo=new THREE.Mesh(new THREE.TorusGeometry(.9,.05,8,48),basic(0xd8a840));S.halo.userData.own=1;add(S.halo);S.hg=sp(0xc89030,3,.7);SFX.play('gold')}
      if(S.fig){const k=Math.min(1,(t-2.7)/.6),y=1.1+k*.75;S.fig.position.set(x,y,z);S.fig.rotation.y=o.yaw+Math.PI;S.lot.position.set(x,y-.05,z);S.lot.scale.setScalar(k*.7);S.halo.position.set(x,y+.5,z-.2);S.halo.scale.setScalar((.3+k*.9)*.6);S.halo.rotation.z+=dt;S.hg.position.set(x,y+.4,z-.25)}}
    for(let i=G_.children.length-1;i>=0;i--){const c=G_.children[i];if(c.userData.life!==undefined){c.userData.life-=dt;if(c.material)c.material.opacity=Math.max(0,c.userData.life/.35);if(c.userData.life<=0){G_.remove(c);if(c.userData.own)c.geometry.dispose();c.material.dispose()}}}
    if(t>=T)finish()}
  // 鏡頭：繞著主角慢慢轉、略低仰望
  function cam(dt){if(!on)return;const o=on,a=o.yaw+Math.PI+.6+o.t*.25,d=o.kind==='yuanying'?5.4:4.8,p=tmp2.set(o.x+Math.sin(a)*d,.9+o.t*.12,o.z+Math.cos(a)*d);
    camera.position.lerp(p,o.t<.05?1:1-Math.exp(-dt*3));if(shake>0){camera.position.x+=(Math.random()-.5)*shake*.4;shake=Math.max(0,shake-dt*1.6)}camera.lookAt(tmp3.set(o.x,o.kind==='zhuji'?1.1:1.6,o.z));camera.updateMatrixWorld();sky.position.copy(camera.position)}
  function finish(){if(!on)return;const o=on;stop();
    if(o.battle&&G&&!G.over){G.paused=o.prevPaused;const R=7,dmg=swordDmg()*30;fx({p:tmp.set(o.x,.5,o.z),col:0xffe08a,add:true,life:.6,s0:1,s1:R*2.2,op:.8,vy:0});shake=Math.max(shake,.6);SFX.play('boom');
      for(const e of enemies){if(e.dead)continue;const dx=e.x-o.x,dz=e.z-o.z,d=Math.hypot(dx,dz);if(d<R+e.r)hurtEnemy(e,dmg,dx/(d||1)*3,dz/(d||1)*3,true,8)}if(boss.alive&&Math.hypot(boss.x-o.x,boss.z-o.z)<R+boss.r)hurtBoss(dmg*.3)}
    if(o.done)o.done()}
  function stop(silent){if(!on)return;on=null;clear();ov.classList.remove('on','show')}
  return {play,step,cam,get on(){return !!on},isMajor:r=>!!KIND[r]}})();
window.__asc=ASC;
