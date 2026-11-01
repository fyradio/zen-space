/* ================= 水墨卷軸過場 =================
   每格＝程式畫的水墨小圖＋一兩行字；點畫面下一格，「跳過」直接結束。也用來做「雞啼」天亮過場。
   場景畫法都在 INK_SCENES，之後的章節加新場景就好。 */
const INK=(()=>{const W=800,H=360;
  const rnd=(a,b)=>a+Math.random()*(b-a);
  function paper(x){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#efe6d2');g.addColorStop(1,'#e2d6bc');x.fillStyle=g;x.fillRect(0,0,W,H);
    for(let i=0;i<500;i++){x.fillStyle=`rgba(90,70,40,${Math.random()*.05})`;x.fillRect(Math.random()*W,Math.random()*H,1+Math.random()*2,1+Math.random()*2)}}
  function vignette(x){const g=x.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(60,40,20,.35)');x.fillStyle=g;x.fillRect(0,0,W,H)}
  function wash(x,base,amp,alpha,seed=1){// a mountain ridge washed down with ink
    x.beginPath();x.moveTo(0,H);let y=base;for(let px=0;px<=W;px+=8){y=base-amp*(.5+.5*Math.sin(px*.011*seed+seed*3))*(.6+.4*Math.sin(px*.003+seed))+rnd(-3,3);x.lineTo(px,y)}
    x.lineTo(W,H);x.closePath();const g=x.createLinearGradient(0,base-amp,0,H);g.addColorStop(0,`rgba(28,28,30,${alpha})`);g.addColorStop(.6,`rgba(28,28,30,${alpha*.35})`);g.addColorStop(1,'rgba(28,28,30,0)');x.fillStyle=g;x.fill()}
  function moon(x,cx,cy,r,col='rgba(255,252,240,.95)'){const g=x.createRadialGradient(cx,cy,r*.6,cx,cy,r*2.2);g.addColorStop(0,'rgba(255,250,235,.55)');g.addColorStop(1,'rgba(255,250,235,0)');x.fillStyle=g;x.fillRect(cx-r*2.2,cy-r*2.2,r*4.4,r*4.4);
    x.fillStyle=col;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.strokeStyle='rgba(60,50,40,.25)';x.lineWidth=1.5;x.stroke()}
  function roofs(x,base,n){for(let i=0;i<n;i++){const cx=60+i*(W-120)/(n-1)+rnd(-20,20),w=rnd(70,110),h=rnd(36,55);x.fillStyle='rgba(22,22,24,.92)';
      x.fillRect(cx-w*.4,base-h,w*.8,h);x.beginPath();x.moveTo(cx-w*.62,base-h+4);x.quadraticCurveTo(cx-w*.3,base-h-2,cx,base-h-22);x.quadraticCurveTo(cx+w*.3,base-h-2,cx+w*.62,base-h+4);x.closePath();x.fill()}}
  function lantern(x,cx,cy,r,lit){if(lit){const g=x.createRadialGradient(cx,cy,0,cx,cy,r*4);g.addColorStop(0,'rgba(255,170,80,.6)');g.addColorStop(1,'rgba(255,170,80,0)');x.fillStyle=g;x.fillRect(cx-r*4,cy-r*4,r*8,r*8)}
    x.fillStyle=lit?'#d8452e':'rgba(60,40,36,.7)';x.beginPath();x.ellipse(cx,cy,r,r*1.2,0,0,7);x.fill();x.fillStyle='rgba(20,20,20,.9)';x.fillRect(cx-r*.5,cy-r*1.35,r,r*.25);x.fillRect(cx-r*.5,cy+r*1.1,r,r*.25)}
  function figure(x,cx,base,s,o={}){x.save();x.translate(cx,base);x.scale(s,s);x.fillStyle=o.col||'rgba(18,18,20,.94)';
    x.beginPath();x.moveTo(-26,0);x.lineTo(-14,-70);x.lineTo(14,-70);x.lineTo(26,0);x.closePath();x.fill();// robe
    x.beginPath();x.moveTo(-14,-66);x.quadraticCurveTo(-40,-50,-44,-26);x.lineTo(-30,-30);x.quadraticCurveTo(-24,-48,-12,-56);x.fill();// sleeve
    x.beginPath();x.moveTo(14,-66);x.quadraticCurveTo(40,-50,44,-26);x.lineTo(30,-30);x.quadraticCurveTo(24,-48,12,-56);x.fill();
    x.beginPath();x.arc(0,-80,11,0,7);x.fill();x.beginPath();x.arc(0,-94,6,0,7);x.fill();// head, bun
    if(o.gourd){x.beginPath();x.arc(30,-18,7,0,7);x.arc(30,-30,5,0,7);x.fill()}
    if(o.sword){x.fillRect(-3,-120,3,60);x.fillRect(-9,-62,15,3)}
    if(o.lantern){x.strokeStyle=x.fillStyle;x.lineWidth=2;x.beginPath();x.moveTo(44,-26);x.lineTo(56,-6);x.stroke();x.restore();lantern(x,cx+56*s,base-0*s,8*s,true);return}
    if(o.small){}x.restore()}
  // 燈燈：水墨筆觸的紙燈籠——暖色暈光、燈身漸層（中心亮黃→邊緣朱紅）、竹骨弧線、枯筆描邊、上下燈蓋＋流蘇、圓眼＋腮紅＋小嘴
  function brushLine(x,pts,w,col,jit=1.2,pass=3){x.save();x.lineCap='round';x.lineJoin='round';for(let k=0;k<pass;k++){x.strokeStyle=col;x.lineWidth=w*(1-k*.22);x.globalAlpha=k?.5:.9;x.beginPath();pts.forEach(([px,py],i)=>{const jx=px+rnd(-jit,jit)*k,jy=py+rnd(-jit,jit)*k;i?x.lineTo(jx,jy):x.moveTo(jx,jy)});x.stroke()}x.restore()}
  function lanternFace(x,cx,cy,r){
    const halo=x.createRadialGradient(cx,cy,r*.4,cx,cy,r*2.6);halo.addColorStop(0,'rgba(255,196,96,.62)');halo.addColorStop(.5,'rgba(255,170,80,.2)');halo.addColorStop(1,'rgba(255,170,80,0)');x.fillStyle=halo;x.fillRect(cx-r*2.7,cy-r*2.7,r*5.4,r*5.4);
    const hw=r*.98,hh=r*1.12;// 燈身：上窄下窄、中間鼓
    const body=()=>{x.beginPath();x.moveTo(cx-hw*.62,cy-hh);x.bezierCurveTo(cx-hw*1.22,cy-hh*.5,cx-hw*1.22,cy+hh*.5,cx-hw*.62,cy+hh);x.lineTo(cx+hw*.62,cy+hh);x.bezierCurveTo(cx+hw*1.22,cy+hh*.5,cx+hw*1.22,cy-hh*.5,cx+hw*.62,cy-hh);x.closePath()};
    body();const g=x.createRadialGradient(cx-hw*.12,cy-hh*.1,r*.1,cx,cy,r*1.25);g.addColorStop(0,'#ffe9a0');g.addColorStop(.45,'#ffb450');g.addColorStop(.8,'#e0562a');g.addColorStop(1,'#a82a18');x.fillStyle=g;x.fill();
    // 紙紋＋墨暈（邊緣一圈淡墨）
    x.save();body();x.clip();const ink=x.createRadialGradient(cx,cy,r*.75,cx,cy,r*1.4);ink.addColorStop(0,'rgba(40,14,8,0)');ink.addColorStop(1,'rgba(40,14,8,.42)');x.fillStyle=ink;x.fillRect(cx-r*1.4,cy-r*1.4,r*2.8,r*2.8);
    for(let i=0;i<160;i++){x.fillStyle=`rgba(120,50,20,${Math.random()*.07})`;x.fillRect(cx+rnd(-hw,hw),cy+rnd(-hh,hh),1+Math.random()*2,1+Math.random()*3)}x.restore();
    // 竹骨：沿燈身弧度的 4 條墨線＋上下兩道橫紋
    for(let k=-2;k<=2;k++){if(!k)continue;const fx=k*hw*.5,pts=[];for(let t=0;t<=12;t++){const u=t/12*2-1,bulge=Math.cos(u*Math.PI/2);pts.push([cx+fx*(.62+.38*bulge),cy+u*hh])}brushLine(x,pts,2.2,'rgba(90,28,14,.55)',.8,2)}
    [-.82,.82].forEach(u=>brushLine(x,[[cx-hw*(.64+.2*Math.cos(u*1.4)),cy+u*hh],[cx,cy+u*hh+hh*.05],[cx+hw*(.64+.2*Math.cos(u*1.4)),cy+u*hh]],2,'rgba(90,28,14,.5)',.6,2));
    // 枯筆輪廓
    const edge=[];for(let t=0;t<=20;t++){const u=t/20*2-1,wd=hw*(.62+.6*Math.cos(u*Math.PI/2)*(.9));edge.push([cx-wd,cy+u*hh])}brushLine(x,edge,3.4,'rgba(34,12,8,.8)',1.6,3);
    const e2=edge.map(([px,py])=>[2*cx-px,py]);brushLine(x,e2,3.4,'rgba(34,12,8,.8)',1.6,3);
    // 上下燈蓋（深漆色、圓角）＋掛繩＋流蘇
    [[-hh,-1],[hh,1]].forEach(([dy,sg])=>{const yy=cy+dy,cw=hw*.66,ch=r*.2;x.fillStyle='#2a1a14';x.beginPath();x.moveTo(cx-cw,yy-sg*ch*.2);x.quadraticCurveTo(cx-cw*1.05,yy+sg*ch,cx-cw*.8,yy+sg*ch);x.lineTo(cx+cw*.8,yy+sg*ch);x.quadraticCurveTo(cx+cw*1.05,yy+sg*ch,cx+cw,yy-sg*ch*.2);x.closePath();x.fill();
      x.fillStyle='rgba(232,190,90,.85)';x.fillRect(cx-cw*.9,yy+(sg>0?-.02:-ch*1.05)*r*.2*0+(sg>0?ch*.55:-ch*.8),cw*1.8,ch*.22)});
    brushLine(x,[[cx,cy-hh-r*.2],[cx+r*.04,cy-hh-r*.65],[cx-r*.03,cy-hh-r*1.05]],3,'rgba(30,18,12,.85)',.8,2);
    for(let i=-2;i<=2;i++)brushLine(x,[[cx+i*r*.07,cy+hh+r*.2],[cx+i*r*.1+Math.sin(i)*r*.03,cy+hh+r*.6],[cx+i*r*.13,cy+hh+r*.9+Math.abs(i)*r*.04]],2.4,i%2?'rgba(200,40,30,.9)':'rgba(230,170,60,.9)',.8,2);
    x.fillStyle='#c8281e';x.beginPath();x.arc(cx,cy+hh+r*.25,r*.07,0,7);x.fill();
    // 臉：腮紅、大圓眼（高光）、眉、小嘴
    x.fillStyle='rgba(255,110,90,.38)';[-1,1].forEach(d=>{x.beginPath();x.ellipse(cx+d*r*.58,cy+r*.18,r*.17,r*.1,0,0,7);x.fill()});
    [-1,1].forEach(d=>{const ex=cx+d*r*.34,ey=cy-r*.1;x.fillStyle='#fff8e8';x.beginPath();x.ellipse(ex,ey,r*.2,r*.25,0,0,7);x.fill();brushLine(x,Array.from({length:14},(_,i)=>[ex+Math.cos(i/13*6.28)*r*.2,ey+Math.sin(i/13*6.28)*r*.25]),1.6,'rgba(40,14,8,.8)',.5,2);
      x.fillStyle='#24100a';x.beginPath();x.ellipse(ex+d*r*.015,ey+r*.03,r*.12,r*.16,0,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex-r*.04,ey-r*.06,r*.045,0,7);x.arc(ex+r*.05,ey+r*.07,r*.022,0,7);x.fill();
      brushLine(x,[[ex-r*.17,ey-r*.36+d*r*.02],[ex,ey-r*.42],[ex+r*.17,ey-r*.36-d*r*.02]],2.2,'rgba(60,22,10,.8)',.6,2)});
    brushLine(x,[[cx-r*.16,cy+r*.3],[cx-r*.08,cy+r*.38],[cx+r*.08,cy+r*.38],[cx+r*.16,cy+r*.3]],2.6,'#2a0e08',.5,2);
    // 飛濺墨點與一縷火星
    for(let i=0;i<9;i++){x.fillStyle=`rgba(30,18,12,${.2+Math.random()*.4})`;x.beginPath();x.arc(cx+rnd(-r*1.8,r*1.8),cy+rnd(-r*1.6,r*1.9),1+Math.random()*2.6,0,7);x.fill()}
    for(let i=0;i<6;i++){x.fillStyle=`rgba(255,${200+Math.random()*40|0},120,${.5+Math.random()*.4})`;x.beginPath();x.arc(cx+rnd(-r*.9,r*.9),cy-hh-r*rnd(.5,1.5),1+Math.random()*2,0,7);x.fill()}}
  function ghosts(x,n){for(let i=0;i<n;i++){const cx=rnd(80,W-80),cy=rnd(H*.45,H*.8),s=rnd(.6,1.1);x.save();x.translate(cx,cy);x.scale(s,s);
      const g=x.createLinearGradient(0,-40,0,40);g.addColorStop(0,'rgba(250,250,245,.85)');g.addColorStop(1,'rgba(250,250,245,0)');x.fillStyle=g;
      x.beginPath();x.moveTo(-18,40);x.quadraticCurveTo(-24,-10,0,-36);x.quadraticCurveTo(24,-10,18,40);x.closePath();x.fill();x.fillStyle='#c22';x.fillRect(-8,-20,5,3);x.fillRect(3,-20,5,3);x.restore()}}
  function seal(x,t){x.save();x.translate(W-70,H-70);x.rotate(-.06);x.fillStyle='rgba(190,40,30,.85)';x.fillRect(0,0,46,46);x.fillStyle='#efe6d2';x.font='bold 32px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,23,25);x.restore()}
  function rooster(x,cx,base,s){x.save();x.translate(cx,base);x.scale(s,s);x.fillStyle='rgba(18,16,14,.95)';
    x.beginPath();x.ellipse(0,-40,34,24,-.2,0,7);x.fill();// body
    x.beginPath();x.moveTo(-30,-48);x.quadraticCurveTo(-70,-90,-62,-30);x.quadraticCurveTo(-58,-40,-30,-34);x.fill();// tail
    x.beginPath();x.moveTo(-34,-52);x.quadraticCurveTo(-80,-70,-74,-20);x.lineTo(-52,-40);x.fill();
    x.beginPath();x.ellipse(22,-70,11,16,.3,0,7);x.fill();x.beginPath();x.arc(26,-84,9,0,7);x.fill();// neck, head
    x.fillStyle='#c8321f';x.beginPath();x.moveTo(20,-92);x.quadraticCurveTo(24,-104,30,-94);x.quadraticCurveTo(36,-104,38,-90);x.closePath();x.fill();x.beginPath();x.ellipse(31,-74,3,6,0,0,7);x.fill();
    x.fillStyle='#d9a12c';x.beginPath();x.moveTo(34,-86);x.lineTo(46,-82);x.lineTo(34,-79);x.fill();
    x.strokeStyle='rgba(18,16,14,.95)';x.lineWidth=3;x.beginPath();x.moveTo(-4,-18);x.lineTo(-6,0);x.moveTo(8,-18);x.lineTo(10,0);x.stroke();x.restore()}
  const HELP={paper:x=>paper(x),wash:(...a)=>wash(...a),moon:(...a)=>moon(...a),roofs:(...a)=>roofs(...a),lantern:(...a)=>lantern(...a),figure:(...a)=>figure(...a),
    lanternFace:(...a)=>lanternFace(...a),ghosts:(...a)=>ghosts(...a),seal:(...a)=>seal(...a),rooster:(...a)=>rooster(...a)};
  const INK_SCENES={
    night_village:x=>{paper(x);moon(x,620,80,36);wash(x,200,70,.35,1.3);wash(x,250,40,.55,2.1);roofs(x,300,6);[120,250,390,520,660].forEach((px,i)=>lantern(x,px,262,8,i===4));wash(x,330,10,.85,3);seal(x,'夜')},
    daoist:x=>{paper(x);moon(x,140,70,30);wash(x,230,60,.4,1.7);ghosts(x,5);figure(x,560,320,1.6,{gourd:1,lantern:1});wash(x,335,8,.85,2.4);seal(x,'救')},
    lantern:x=>{paper(x);wash(x,240,50,.3,2.2);lanternFace(x,W*.62,H*.46,70);figure(x,250,330,1.1,{});seal(x,'燈')},
    dawn:x=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#f3e2b6');g.addColorStop(.55,'#f6c97a');g.addColorStop(1,'#e8a85a');x.fillStyle=g;x.fillRect(0,0,W,H);
      const s=x.createRadialGradient(W*.5,H*.82,10,W*.5,H*.82,260);s.addColorStop(0,'rgba(255,240,190,1)');s.addColorStop(1,'rgba(255,240,190,0)');x.fillStyle=s;x.fillRect(0,0,W,H);
      x.fillStyle='rgba(255,236,170,.95)';x.beginPath();x.arc(W*.5,H*.86,70,Math.PI,0);x.fill();wash(x,300,40,.45,1.9);roofs(x,330,5);rooster(x,W*.5,262,1.5)}};
  // the overlay
  let q=[],i=0,done=null;const ov=$('#cutOv'),cv=$('#cutCv'),tx=$('#cutTx');const ctx=cv.getContext('2d');
  function draw(){const p=q[i];const dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);(INK_SCENES[p.scene]||paper)(ctx,HELP);vignette(ctx);
    tx.textContent=p.t||'';cv.classList.remove('in');void cv.offsetWidth;cv.classList.add('in');$('#cutNext').textContent=i<q.length-1?'下一格':'開始'}
  function play(panels,cb){q=panels;i=0;done=cb;ov.classList.remove('dawn');ov.classList.add('on');draw()}
  function next(){if(!q.length)return;if(i<q.length-1){i++;draw()}else end()}
  function end(){ov.classList.remove('on');q=[];const f=done;done=null;if(f)f()}
  ov.addEventListener('click',e=>{if(e.target.id==='cutSkip')return;next()});$('#cutSkip').onclick=e=>{e.stopPropagation();end()};
  // 雞啼: a short, self-advancing dawn panel
  function dawn(cb,txt){play([{scene:'dawn',t:txt||'喔喔喔——！雞啼了，天亮了！'}],cb);$('#cutNext').textContent='繼續';ov.classList.add('dawn');setTimeout(()=>{ov.classList.remove('dawn');if(q.length&&q[0].scene==='dawn')end()},2600)}
  return {play,dawn,scenes:INK_SCENES,get on(){return ov.classList.contains('on')}}})();
const CUTS={intro:[
  {scene:'night_village',t:'子時一到，白石村的燈籠一盞一盞熄滅了。連公雞都不啼——這一夜，好像不會結束。'},
  {scene:'daoist',t:'妖群湧進村子。一個醉醺醺的道士提著一盞燈籠，擋在打更人家的孩子面前……'},
  {scene:'lantern',t:'「別怕！我叫燈燈。」道士把燈籠塞給你：「撐到雞啼，天就亮了。」'}]};
