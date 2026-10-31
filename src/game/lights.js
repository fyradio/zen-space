/* ================= 特效燈光池 =================
   場上點光源的「數量」一變，three.js 就要把所有受光材質的著色器重編一次（魔王出場、放大絕時會卡一下）。
   所以魔王、元嬰、法相這些要發光的東西不直接 new PointLight，而是用 FxLight（只是一個位置＋亮度的記號），
   每幀把最靠近主角、正在亮的兩個指派給固定 2 盞真的燈；燈的數量永遠不變。 */
const LIGHT_POOL=[0,1].map(()=>{const l=new THREE.PointLight(0xffffff,0,10,1.4);scene.add(l);return l});
const FX_LIGHTS=new Set();
class FxLight extends THREE.Object3D{constructor(col=0xffffff,intensity=1,distance=10,decay=1.4){super();this.color=new THREE.Color(col);this._i=intensity;this.distance=distance;this.decay=decay;FX_LIGHTS.add(this)}
  get intensity(){return this._i}set intensity(v){this._i=v}}
const _lw=new THREE.Vector3();
function inScene(o){let v=true;while(o){if(!o.visible)return false;if(o===scene)return v;o=o.parent}return false}
function syncLights(){const act=[];for(const L of FX_LIGHTS){if(L._i<=0.01||!inScene(L)){if(!L.parent&&L._dead)FX_LIGHTS.delete(L);continue}L.getWorldPosition(_lw);act.push([L,_lw.distanceToSquared(HERO.pos),_lw.clone()])}
  act.sort((a,b)=>a[1]-b[1]);LIGHT_POOL.forEach((P,i)=>{const a=act[i];if(!a){P.intensity=0;return}const [L,,w]=a;P.position.copy(w);P.color.copy(L.color);P.intensity=L._i;P.distance=L.distance;P.decay=L.decay})}
// 用完的 FxLight 從場景拿掉後要丟出集合：在 parent 被移除時看不到，所以每 5 秒清一次沒掛在場景上的
setInterval(()=>{for(const L of FX_LIGHTS)if(!inScene(L)&&!(L.parent&&L.parent.parent))FX_LIGHTS.delete(L)},5000);
