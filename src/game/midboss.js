/* ================= 第十章中魔王（自創角色）=================
   渡劫那夜：一邊挨九重雷劫一邊打；沈寒、血河老祖兩夜：大魔王出場前先打三隻。
   地面：銅鈴屍將、黑幡魔僧、鐵筆判官、赤袍護法；天上：雷翅蝠妖、墨雲鵬、紙鳶將。
   每隻都有自己的預警招式（紅圈／扇形／直線），打法不同。 */
const MID_SETS=[['bellgen','banmonk','judge'],['guard','judge','banmonk'],['thbat','inkroc','kitegen']];
const MID_TINT={};
// 天上的中魔王跟著你一起往前飛（像魔王一樣被帶著走），落後太遠就閃到前方
function midCarry(e,dt,d){if(!G.sky)return;e.x+=G.vx*dt;e.z+=G.vz*dt;if(d>14){const f=G.head+(Math.random()-.5)*1.2;e.x=HERO.pos.x+Math.sin(f)*8;e.z=HERO.pos.z+Math.cos(f)*8}}
const aimE=e=>Math.atan2(HERO.pos.x-e.x,HERO.pos.z-e.z);
// 銅鈴屍將：殭屍將軍，背一口大銅鈴，跳著逼近，搖鈴震出一大圈
const bellgenGeo=(()=>{const A='#4a3e2a',P='#8a6a2a',F='#9aa48a',K='#1a1a1e',Y='#e8d25a',G='#b08a3a';
  return merged([{g:C0,c:K,p:[-.13,.25,0],s:[.08,.5,.08]},{g:C0,c:K,p:[.13,.25,0],s:[.08,.5,.08]},{g:B0,c:A,p:[0,.82,0],s:[.5,.62,.32]},{g:B0,c:P,p:[0,.86,.17],s:[.42,.42,.02]},{g:B0,c:G,p:[0,.55,0],s:[.54,.08,.36]},
    {g:S0,c:F,p:[0,1.3,0],s:[.16,.18,.16]},{g:cone(.17,.1,.14,10),c:K,p:[0,1.47,0]},{g:S0,c:'#c22',p:[0,1.56,0],s:[.04,.04,.04]},{g:B0,c:Y,p:[0,1.3,.165],s:[.09,.18,.01]},{g:B0,c:'#c22',p:[0,1.3,.172],s:[.02,.13,.005]},
    {g:C0,c:A,p:[-.22,1.02,.25],s:[.065,.45,.065],r:[1.5,0,0]},{g:C0,c:A,p:[.22,1.02,.25],s:[.065,.45,.065],r:[1.5,0,0]},{g:S0,c:F,p:[-.22,1.03,.5],s:[.05,.05,.07]},{g:S0,c:F,p:[.22,1.03,.5],s:[.05,.05,.07]},
    {g:lathe([[0,0],[.26,0],[.22,.1],[.17,.36],[.1,.46],[0,.48]],14),c:G,p:[0,.62,-.34],r:[-.25,0,0]},{g:S0,c:'#6a4a1a',p:[0,.64,-.36],s:[.06,.06,.06]}])})();
addMob('bellgen',{n:'銅鈴屍將',geo:bellgenGeo,cap:4,hp:60,spd:1.6,r:.4,dmg:12,soul:3,sc:1,glow:.3,mat:{},
  ai:(e,dt,d,ux,uz)=>{const h=Math.abs(Math.sin(e.ph*3));e.y=h*.35;
    if((e.cd2=(e.cd2??2.5)-dt)<=0&&d<7){e.cd2=4.2;warn(e.x,e.z,3.8,1.15,e.dmg*1.4,null,0xe0b040);act(1.15,null,()=>{if(!e.dead&&!simming){SFX.play('gong');fx({p:tmp.set(e.x,.5,e.z),col:0xffd27a,add:true,life:.5,s0:1,s1:8,op:.8,vy:0})}})}
    return {v:e.t.spd*(h>.2?1.5:.25),x:ux,z:uz}}});
// 黑幡魔僧：黑袍僧人扛黑幡，揮幡在你四周落下三團墨咒
const banmonkGeo=(()=>{const R='#1a1a24',S='#7a2a2a',F='#c8b8a0',W='#3a2a1a',K='#101014',Y='#c8a040';
  return merged([{g:lathe([[0,0],[.34,0],[.28,.5],[.2,.95],[0,1.05]],14),c:R},{g:B0,c:S,p:[0,.7,.13],s:[.07,.75,.02],r:[0,0,.6]},{g:S0,c:F,p:[0,1.18,0],s:[.15,.16,.15]},
    {g:S0,c:'#e22',p:[-.05,1.2,.13],s:[.025,.015,.01]},{g:S0,c:'#e22',p:[.05,1.2,.13],s:[.025,.015,.01]},...Array.from({length:9},(_,i)=>{const a=i/9*Math.PI*2;return {g:S0,c:Y,p:[Math.sin(a)*.17,1.0+Math.cos(a)*.03,Math.cos(a)*.15],s:[.03,.03,.03]}}),
    {g:C0,c:W,p:[.34,1.0,0],s:[.025,2,.025]},{g:B0,c:K,p:[.5,1.5,0],s:[.3,.85,.02]},{g:B0,c:Y,p:[.5,1.94,0],s:[.34,.05,.03]},{g:B0,c:'#7a2a2a',p:[.5,1.5,.012],s:[.06,.5,.005]}])})();
addMob('banmonk',{n:'黑幡魔僧',geo:banmonkGeo,cap:4,hp:55,spd:1.4,r:.38,dmg:12,soul:3,sc:1,glow:.3,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d,ux,uz)=>{if((e.cd2=(e.cd2??2)-dt)<=0&&d<10){e.cd2=4.5;for(let i=0;i<3;i++){const a=Math.random()*6.28,r=i?1.6+Math.random()*1.6:0;warn(HERO.pos.x+Math.sin(a)*r,HERO.pos.z+Math.cos(a)*r,1.5,1.2+i*.2,e.dmg*1.2,null,0x8a5aff)}}
    return {v:e.t.spd*(d<4?.3:1),x:ux,z:uz}}});
// 鐵筆判官：官帽長鬚、一手生死簿一手巨筆，一筆劃出長長的直線
const judgeGeo=(()=>{const R='#3a1a1a',F='#d8c8a8',K='#111',J='#5ad8a0',W='#5a3a1a',P='#e8dcb8';
  return merged([{g:lathe([[0,0],[.32,0],[.27,.6],[.22,1.0],[0,1.05]],14),c:R},{g:B0,c:J,p:[0,.62,0],s:[.58,.06,.58]},{g:S0,c:F,p:[0,1.2,0],s:[.15,.17,.15]},{g:cone(.08,.01,.28,6),c:K,p:[0,1.0,.12],r:[3.0,0,0]},
    {g:S0,c:K,p:[-.05,1.23,.14],s:[.025,.012,.01]},{g:S0,c:K,p:[.05,1.23,.14],s:[.025,.012,.01]},{g:B0,c:K,p:[0,1.4,0],s:[.26,.16,.22]},{g:B0,c:K,p:[-.27,1.43,-.05],s:[.3,.03,.06]},{g:B0,c:K,p:[.27,1.43,-.05],s:[.3,.03,.06]},
    {g:C0,c:W,p:[.36,.95,.15],s:[.035,.95,.035],r:[.3,0,-.2]},{g:cone(.08,.035,.2,8),c:K,p:[.27,.5,.02],r:[.3,0,-.2]},{g:B0,c:P,p:[-.32,.88,.2],s:[.2,.26,.05]},{g:B0,c:'#7a2a2a',p:[-.32,.88,.226],s:[.16,.03,.005]}])})();
addMob('judge',{n:'鐵筆判官',geo:judgeGeo,cap:4,hp:55,spd:1.7,r:.38,dmg:13,soul:3,sc:1,glow:.3,mat:{},
  ai:(e,dt,d,ux,uz)=>{if((e.cd2=(e.cd2??2)-dt)<=0&&d<11){e.cd2=3.6;const a=aimE(e);warnLine(e.x,e.z,a,11,1.5,1.0,e.dmg*1.5,0xff5a3a);if(Math.random()<.5)act(.5,null,()=>{if(!e.dead)warnLine(e.x,e.z,a+(Math.random()<.5?.5:-.5),11,1.5,1.0,e.dmg*1.5,0xff5a3a)})}
    return {v:e.t.spd*(d<5?-.4:1),x:ux,z:uz}}});
// 赤袍護法：紅袍白面具，扛月牙大刀，近身就是一記大扇形橫劈，再往前衝
const guardGeo=(()=>{const R='#8a1a1a',G='#c8a040',H='#2a2a2a',M='#e8e0d0',W='#3a2a1a',S='#d8e0e8';
  return merged([{g:lathe([[0,0],[.34,0],[.27,.55],[.24,1.0],[0,1.05]],14),c:R},{g:S0,c:G,p:[-.26,1.0,0],s:[.13,.08,.13]},{g:S0,c:G,p:[.26,1.0,0],s:[.13,.08,.13]},{g:B0,c:G,p:[0,.6,0],s:[.6,.07,.6]},
    {g:S0,c:H,p:[0,1.22,0],s:[.17,.19,.17]},{g:S0,c:M,p:[0,1.21,.07],s:[.13,.15,.11]},{g:B0,c:'#101010',p:[-.05,1.25,.175],s:[.05,.014,.01]},{g:B0,c:'#101010',p:[.05,1.25,.175],s:[.05,.014,.01]},{g:B0,c:'#c22',p:[0,1.12,.17],s:[.05,.012,.01]},
    {g:C0,c:W,p:[-.36,.95,.1],s:[.028,1.9,.028]},{g:cone(.16,.01,.5,3),c:S,p:[-.36,2.0,.16],s:[1,1,.25]},{g:B0,c:G,p:[-.36,1.74,.1],s:[.1,.06,.1]}])})();
addMob('guard',{n:'赤袍護法',geo:guardGeo,cap:4,hp:60,spd:2,r:.4,dmg:13,soul:3,sc:1,glow:.3,mat:{},
  ai:(e,dt,d,ux,uz)=>{if(e.dashT>0){e.dashT-=dt;return {v:e.t.spd*4,x:e.dx,z:e.dz}}
    if((e.cd2=(e.cd2??2)-dt)<=0&&d<5.5){e.cd2=3.8;const a=aimE(e);warnFan(e.x,e.z,a,1.7,4.8,.9,e.dmg*1.5,0xff4a2a);e.hold=.9;act(.9,null,()=>{if(!e.dead){e.dashT=.45;e.dx=Math.sin(a);e.dz=Math.cos(a)}})}
    if(e.hold>0){e.hold-=dt;return {v:0,x:ux,z:uz}}return {v:e.t.spd,x:ux,z:uz}}});
// ---- 天上 ----
// 雷翅蝠妖：紫黑大蝙蝠，翅上帶雷，在你身邊連落四道雷圈
const thbatGeo=(()=>{const B='#2a1a3a',W='#4a2a7a',Y='#ffe04a',L='#c8b8ff';
  return merged([{g:S0,c:B,p:[0,1.1,0],s:[.22,.28,.2]},{g:S0,c:B,p:[0,1.4,.03],s:[.15,.14,.14]},{g:cone(.06,.01,.2,4),c:B,p:[-.09,1.58,0]},{g:cone(.06,.01,.2,4),c:B,p:[.09,1.58,0]},
    {g:S0,c:Y,p:[-.05,1.42,.13],s:[.03,.025,.01]},{g:S0,c:Y,p:[.05,1.42,.13],s:[.03,.025,.01]},{g:B0,c:W,p:[-.55,1.15,0],s:[.8,.04,.42],r:[0,0,.25]},{g:B0,c:W,p:[.55,1.15,0],s:[.8,.04,.42],r:[0,0,-.25]},
    {g:B0,c:L,p:[-.6,1.2,.22],s:[.7,.02,.02],r:[0,0,.25]},{g:B0,c:L,p:[.6,1.2,.22],s:[.7,.02,.02],r:[0,0,-.25]}])})();
addFly('thbat',{n:'雷翅蝠妖',geo:thbatGeo,cap:4,hp:50,spd:2.6,r:.4,dmg:12,soul:3,sc:1,glow:.4,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d,ux,uz)=>{midCarry(e,dt,d);e.y=.6+Math.sin(e.ph*3)*.25;if((e.cd2=(e.cd2??2)-dt)<=0&&d<10){e.cd2=4;for(let i=0;i<4;i++)act(i*.35,null,()=>{const a=Math.random()*6.28,r=Math.random()*2.2;warn(HERO.pos.x+Math.sin(a)*r,HERO.pos.z+Math.cos(a)*r,1.2,.95,e.dmg*1.1,null,0xc8b8ff)})}
    const w=Math.sin(e.ph*1.8)*.9,c=Math.cos(w),s=Math.sin(w);return {v:e.t.spd*(d<3?.4:1),x:ux*c-uz*s,z:ux*s+uz*c}}});
// 墨雲鵬：墨黑大鵬，金喙白翼尖，盤旋後俯衝一條直線
const inkrocGeo=(()=>{const K='#1a1e2a',W='#22283a',T='#c8d0e0',G='#c8a040';
  return merged([{g:S0,c:K,p:[0,1,0],s:[.3,.25,.6]},{g:S0,c:K,p:[0,1.15,.55],s:[.15,.15,.18]},{g:cone(.06,.005,.22,6),c:G,p:[0,1.13,.78],r:[1.57,0,0]},{g:S0,c:G,p:[-.08,1.2,.65],s:[.025,.025,.02]},{g:S0,c:G,p:[.08,1.2,.65],s:[.025,.025,.02]},
    {g:B0,c:W,p:[-.75,1.05,0],s:[1.2,.04,.5],r:[0,0,.15]},{g:B0,c:W,p:[.75,1.05,0],s:[1.2,.04,.5],r:[0,0,-.15]},{g:B0,c:T,p:[-1.3,.97,-.08],s:[.35,.03,.38],r:[0,0,.15]},{g:B0,c:T,p:[1.3,.97,-.08],s:[.35,.03,.38],r:[0,0,-.15]},{g:B0,c:W,p:[0,1,-.7],s:[.4,.03,.4]}])})();
addFly('inkroc',{n:'墨雲鵬',geo:inkrocGeo,cap:4,hp:60,spd:2.8,r:.5,dmg:13,soul:3,sc:1,glow:.3,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d,ux,uz)=>{midCarry(e,dt,d);e.y=.7+Math.sin(e.ph*2)*.3;if(e.dashT>0){e.dashT-=dt;return {v:e.t.spd*4.2,x:e.dx,z:e.dz}}
    if((e.cd2=(e.cd2??2.5)-dt)<=0&&d<10){e.cd2=4;const a=aimE(e);warnLine(e.x,e.z,a,12,1.8,1.0,e.dmg*1.5,0x6a8aff);e.hold=1;act(1,null,()=>{if(!e.dead){e.dashT=.6;e.dx=Math.sin(a);e.dz=Math.cos(a)}})}
    if(e.hold>0){e.hold-=dt;return {v:0,x:ux,z:uz}}const w=1.1,c=Math.cos(w),s=Math.sin(w);return {v:e.t.spd*(d<5?1:.6),x:d<5?ux*c-uz*s:ux,z:d<5?ux*s+uz*c:uz}}});
// 紙鳶將：一張大紙鳶畫著怪臉，拖著長尾，撒下一串符紙圈
const kitegenGeo=(()=>{const P='#e8dcc0',R='#b8322a',K='#1a1a1a',B='#5a3a22';
  return merged([{g:B0,c:P,p:[0,1.2,0],s:[1,1.2,.03],r:[0,0,Math.PI/4]},{g:B0,c:B,p:[0,1.2,.02],s:[.03,1.6,.02]},{g:B0,c:B,p:[0,1.2,.02],s:[1.4,.03,.02]},
    {g:S0,c:R,p:[0,1.25,.04],s:[.38,.32,.02]},{g:S0,c:'#fff',p:[-.13,1.32,.06],s:[.1,.08,.01]},{g:S0,c:'#fff',p:[.13,1.32,.06],s:[.1,.08,.01]},{g:S0,c:K,p:[-.13,1.32,.07],s:[.04,.05,.01]},{g:S0,c:K,p:[.13,1.32,.07],s:[.04,.05,.01]},
    {g:B0,c:K,p:[0,1.12,.06],s:[.22,.04,.01]},...Array.from({length:5},(_,i)=>({g:B0,c:i%2?R:P,p:[0,.45-i*.2,-.05-i*.12],s:[.16,.12,.01],r:[.3,0,i*.4]}))])})();
addFly('kitegen',{n:'紙鳶將',geo:kitegenGeo,cap:4,hp:55,spd:2.4,r:.5,dmg:12,soul:3,sc:1,glow:.35,mat:{side:THREE.DoubleSide},
  ai:(e,dt,d,ux,uz)=>{midCarry(e,dt,d);e.y=.9+Math.sin(e.ph*2.6)*.35;e.spin=Math.sin(e.ph*1.5)*.4;if((e.cd2=(e.cd2??2)-dt)<=0&&d<11){e.cd2=4.2;const a=aimE(e);for(let i=0;i<5;i++)act(i*.18,null,()=>{const r=1.5+i*1.6;warn(e.x+Math.sin(a)*r,e.z+Math.cos(a)*r,1.3,.9,e.dmg*1.1,null,0xff7a4a)})}
    const w=Math.sin(e.ph*1.3)*.8,c=Math.cos(w),s=Math.sin(w);return {v:e.t.spd*(d<4?.5:1),x:ux*c-uz*s,z:ux*s+uz*c}}});
