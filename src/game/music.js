/* ================= 背景音樂：WebAudio 即時合成，不用音檔 =================
   古箏撥弦（三角波＋撥弦雜音）＋低音持續＋木魚／磬，加一點殘響。
   mood: home（洞府，安靜五聲）、night（怪談，小調五聲）、boss（緊張，加鼓）。跟音效同一個「音」開關。 */
const BGM=(()=>{let ac=null,bus=null,verb=null,mood=null,timer=0,nextT=0,step=0,deg=7,drone=[];
  const SC={home:[0,2,4,7,9],night:[0,3,5,7,10],boss:[0,1,5,7,8]},ROOT={home:196,night:174.6,boss:164.8},BPM={home:58,night:70,boss:112};
  function init(){if(bus||!SFX.ctx)return!!bus;ac=SFX.ctx;bus=ac.createGain();bus.gain.value=.32;
    // a cheap hall: convolver with a decaying noise impulse
    verb=ac.createConvolver();const len=ac.sampleRate*2.4,ir=ac.createBuffer(2,len,ac.sampleRate);
    for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}
    verb.buffer=ir;const wet=ac.createGain();wet.gain.value=.35;bus.connect(SFX.out);bus.connect(verb);verb.connect(wet);wet.connect(SFX.out);return true}
  const note=d=>{const sc=SC[mood],o=Math.floor(d/5),i=((d%5)+5)%5;return ROOT[mood]*Math.pow(2,o+sc[i]/12)};
  function pluck(f,t,v=.16,dur=1.6){const o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),lp=ac.createBiquadFilter();
    o.type='triangle';o.frequency.value=f;o2.type='sine';o2.frequency.value=f*2.01;lp.type='lowpass';lp.frequency.setValueAtTime(f*8,t);lp.frequency.exponentialRampToValueAtTime(f*1.5,t+dur);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(bus);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05);
    // slight pitch bend at the start, like a 古箏 press
    o.frequency.setValueAtTime(f*.985,t);o.frequency.linearRampToValueAtTime(f,t+.06)}
  function block(t,v=.12){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(950,t);o.frequency.exponentialRampToValueAtTime(620,t+.07);
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.09);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.12)}
  function bell(f,t,v=.09){[1,2.76,5.4].forEach((m,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f*m;
    g.gain.setValueAtTime(v/(i+1),t);g.gain.exponentialRampToValueAtTime(.001,t+3.2/(i+1));o.connect(g);g.connect(bus);o.start(t);o.stop(t+3.4)})}
  function drum(t,v=.3){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+.25);
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.32)}
  function startDrone(){stopDrone();[1,1.5].forEach((m,i)=>{const o=ac.createOscillator(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();
    o.type='sine';o.frequency.value=ROOT[mood]/2*m*(1+i*.003);g.gain.value=0;g.gain.linearRampToValueAtTime(mood==='boss'?.05:.04,ac.currentTime+2);
    l.frequency.value=.07+i*.05;lg.gain.value=.02;l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(bus);o.start();l.start();drone.push({o,g,l})})}
  function stopDrone(){const t=ac?ac.currentTime:0;drone.forEach(d=>{try{d.g.gain.cancelScheduledValues(t);d.g.gain.setValueAtTime(d.g.gain.value,t);d.g.gain.linearRampToValueAtTime(0,t+1);d.o.stop(t+1.1);d.l.stop(t+1.1)}catch(e){}});drone=[]}
  function sched(){if(!mood||!ac)return;const spb=60/BPM[mood]/2;// eighth notes
    while(nextT<ac.currentTime+.4){const t=nextT,s=step%16;
      if(mood==='boss'){if(s%4===0)drum(t,s===0?.34:.24);else if(s%2===0)block(t,.07)}
      else if(s===0&&Math.random()<.5)block(t,.08);
      if(s===0&&step%32===0)bell(ROOT[mood]*2,t,mood==='night'?.07:.05);
      const p=mood==='boss'?.55:mood==='night'?.32:.28;
      if(Math.random()<p&&!(s%2&&Math.random()<.5)){deg=Math.max(3,Math.min(13,deg+[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)]));pluck(note(deg),t,mood==='boss'?.13:.15,mood==='boss'?.9:1.8);
        if(Math.random()<.15)pluck(note(deg+2),t+spb*.5,.08,1.2)}
      nextT+=spb;step++}}
  function play(m){if(!SFX.on){mood=m;return}if(!init())return;if(m===mood&&timer)return;mood=m;if(!timer){nextT=ac.currentTime+.1;step=0;timer=setInterval(sched,120)}startDrone()}
  function stop(){if(timer){clearInterval(timer);timer=0}if(ac)stopDrone()}
  return {play,stop,resumeIfOn(){if(SFX.on&&mood){const m=mood;mood=null;play(m)}},get mood(){return mood}}})();
