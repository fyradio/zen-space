/* ================= 省電模式（防過熱） =================
   自動：手機上前 3 秒平均低於 40 fps 就降解析度、減少特效；也可以在暫停選單切「開／關」。 */
const POWER=(()=>{let mode='auto',low=false,acc=0,frames=0;try{mode=localStorage.getItem('zk-power')||'auto'}catch(e){}
  if(mode==='on')low=true;
  const hi=()=>Math.min(window.devicePixelRatio||1,isTouch?1.5:2);
  function apply(){renderer.setPixelRatio(low?Math.min(1,hi()):hi());const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false)}
  function tick(dt){if(mode!=='auto'||low||!isTouch)return;acc+=dt;frames++;if(acc>=3){if(frames/acc<40){low=true;apply()}acc=0;frames=0}}
  function cycle(){mode={auto:'on',on:'off',off:'auto'}[mode];low=mode==='on';try{localStorage.setItem('zk-power',mode)}catch(e){}apply();return mode}
  if(low)apply();
  return {tick,cycle,get low(){return low},get label(){return {auto:'自動',on:'開',off:'關'}[mode]}}})();
