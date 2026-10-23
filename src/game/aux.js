/* ================= 雷火符＆燈燈火球（自動技能）=================
   雷火符：每 2.6 秒往最近的幾隻妖丟符，落地大爆炸＋燃燒（範圍大、會連鎖震開）；每升一級多丟一張。
   燈燈火球：燈籠每 1 秒吐一顆追蹤火球，碰到就爆（小範圍＋燃燒），升級連發更多顆、會穿過第一隻繼續飛。 */
function stepAux(dt){const g=G,s=g.s;if(!s.talis&&!s.lamp)return;
  if(s.talis){g.talisCd-=dt*s.rate;if(g.talisCd<=0){const used=new Set(),tg=[];for(let i=0;i<s.talisN;i++){const t=(i===0&&boss.alive&&bossOnScreen())?boss:pickNear(HERO.pos.x,HERO.pos.z,10,used);if(!t)break;used.add(t);tg.push(t)}
    if(tg.length){g.talisCd=2.6;tg.forEach((t,i)=>talisThrow(t,i*.12))}else g.talisCd=.4}}
  if(s.lamp){g.lampCd-=dt*s.rate;if(g.lampCd<=0){const n=s.lamp>=3?3:s.lamp>=1.8?2:1,used=new Set(),tg=[];for(let i=0;i<n;i++){const t=(i===0&&boss.alive&&bossOnScreen()&&Math.random()<.5)?boss:pickNear(HERO.pos.x,HERO.pos.z,11,used);if(!t)break;used.add(t);tg.push(t)}
    if(tg.length){g.lampCd=Math.max(.55,1.1/(1+s.lamp*.12));tg.forEach((t,i)=>lampShot(t,i*.14))}else g.lampCd=.3}}}
function talisThrow(t,delay){const g=G,dmg=swordDmg()*4.2*g.s.talis,R=2.3+.25*g.s.talisN;let x=HERO.pos.x,z=HERO.pos.z;const sx=x,sz=z;SFX.play('sweep');
  act(delay+.5,(tt,dt)=>{if(tt<delay)return;const k=Math.min(1,(tt-delay)/.4),tx=t.x,tz=t.z;x=sx+(tx-sx)*k;z=sz+(tz-sz)*k;if(!simming)fx({p:tmp.set(x,1.6+Math.sin(k*3.14)*1.4,z),col:0xffd84a,add:true,life:.25,s0:.7,s1:.2,op:.9,vy:0})},
    ()=>{if(!G||G.over)return;const bx=t.x,bz=t.z;SFX.play('thunder');shake=Math.max(shake,.22);fx({p:tmp.set(bx,.5,bz),col:0xff9a2a,add:true,life:.5,s0:1,s1:R*2.4,op:.95,vy:0});fx({p:tmp.set(bx,.9,bz),col:0xffe9a0,add:true,life:.3,s0:1,s1:R*1.4,op:.9,vy:0});
      for(const e of enemies){if(e.dead)continue;const dx=e.x-bx,dz=e.z-bz,d=Math.hypot(dx,dz);if(d<R+e.r){e.burn=3.5;e.burnD=dmg*.1;hurtEnemy(e,dmg*(1-.4*d/(R+e.r)),dx/(d||1)*1.2,dz/(d||1)*1.2,false,5)}}
      if(boss.alive&&Math.hypot(boss.x-bx,boss.z-bz)<R+boss.r)hurtBoss(dmg)})}
function lampShot(t,delay){const g=G,dmg=swordDmg()*1.7*g.s.lamp,R=1.5,pierce=g.s.lamp>=2.5;let x=HERO.pos.x,z=HERO.pos.z-.2,tg=t,hits=0;const seen=new Set();
  act(delay+2.2,(tt,dt)=>{if(tt<delay||!G||G.over)return;if(!tg||tg.dead||(tg!==boss&&tg.hp<=0)){let bd=1e9,b=null;for(const e of enemies){if(e.dead||seen.has(e))continue;const d=(e.x-x)**2+(e.z-z)**2;if(d<bd){bd=d;b=e}}tg=b;if(!tg){return}}
      const dx=tg.x-x,dz=tg.z-z,d=Math.hypot(dx,dz)||1,v=Math.min(d,13*dt);x+=dx/d*v;z+=dz/d*v;if(!simming)fx({p:tmp.set(x,1+Math.sin(tt*20)*.1,z),col:0xff7a2a,add:true,life:.3,s0:.7,s1:.15,op:.9,vy:0});
      if(d<tg.r+.5){seen.add(tg);SFX.play('hit');fx({p:tmp.set(x,.6,z),col:0xffa040,add:true,life:.35,s0:1,s1:R*2.2,op:.9,vy:0});
        for(const e of enemies){if(e.dead)continue;const ex=e.x-x,ez=e.z-z,ed=Math.hypot(ex,ez);if(ed<R+e.r){e.burn=2.5;e.burnD=dmg*.12;hurtEnemy(e,dmg,ex/(ed||1)*.6,ez/(ed||1)*.6,false,3)}}
        if(boss.alive&&Math.hypot(boss.x-x,boss.z-z)<R+boss.r)hurtBoss(dmg);
        hits++;if(!pierce||hits>=3)tt=99;else tg=null}})}
