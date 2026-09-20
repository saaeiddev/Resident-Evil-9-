import './style.css';
import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {environment} from './scene/environment.js';
import {weather} from './scene/weather.js';
import {loadAssets} from './loaders/assets.js';
import {createCast} from './characters/cast.js';
import {controls} from './ui/controls.js';
import {Ambience} from './audio/ambience.js';
const $=id=>document.getElementById(id);
function fail(message){clearTimeout(window.__bootTimer);$('error').hidden=false;$('error-message').textContent=message;}
try{await start();}catch(e){console.error(e);fail(`Unable to start the 3D scene: ${e.message}. Try enabling hardware acceleration or using a current browser.`);}
async function start(){
 const canvas=$('world'),renderer=new T.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});renderer.setClearColor('#121b20');renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('Your device paused the 3D renderer. Close other demanding tabs, then reload.');});
 const scene=new T.Scene();scene.background=new T.Color('#111c20');scene.fog=new T.FogExp2('#1c2b2d',.027);
 const camera=new T.PerspectiveCamera(52,innerWidth/innerHeight,.12,150);camera.position.set(5.8,2.4,9);camera.lookAt(-1,1,-6);
 const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),envMap=pmrem.fromScene(room,.06);scene.environment=envMap.texture;scene.environmentIntensity=.24;room.dispose();pmrem.dispose();
 scene.add(new T.HemisphereLight('#94b8c9','#34322c',1.35));const moon=new T.DirectionalLight('#c0d2df',2.1);moon.position.set(-12,24,8);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);Object.assign(moon.shadow.camera,{left:-17,right:17,top:20,bottom:-23,near:1,far:70});moon.shadow.bias=-.0005;moon.shadow.normalBias=.06;moon.target.position.set(0,0,-8);scene.add(moon,moon.target);
 const key=new T.SpotLight('#ece7d3',90,22,.8,.85,1.4);key.position.set(-1,5,4);key.target.position.set(-2,1,-2);scene.add(key,key.target);
 const rim=new T.SpotLight('#b1c6d0',95,20,.7,.85,1.4);rim.position.set(4,5,-10);rim.target.position.set(1,1,-4);scene.add(rim,rim.target);
 const city=environment(scene),weatherFx=weather(scene),audio=new Ambience(),input=controls(camera,canvas,city.colliders,audio);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.16,.35,1.35);composer.addPass(bloom);composer.addPass(new OutputPass());
 let quality='Medium',post=true,auto=true,frameCount=0,frameTime=0,fps=0,adaptAt=0,started=false,introStart=null;
 function setQuality(q){quality=q;$('quality').value=q;const dpr={Ultra:1.65,High:1.3,Medium:1,Low:.75}[q];renderer.setPixelRatio(Math.min(devicePixelRatio,dpr));renderer.setSize(innerWidth,innerHeight);composer.setPixelRatio(Math.min(devicePixelRatio,dpr));composer.setSize(innerWidth,innerHeight);post=q==='Ultra'||q==='High';renderer.shadowMap.enabled=q!=='Low';moon.shadow.mapSize.set(q==='Ultra'?2048:1024,q==='Ultra'?2048:1024);if(moon.shadow.map){moon.shadow.map.dispose();moon.shadow.map=null;}city.puddle.visible=q==='Ultra'||q==='High';weatherFx.quality(q);scene.fog.density=q==='Low'?.035:.027;}
 setQuality(quality);$('quality').onchange=e=>{auto=false;$('adaptive').checked=false;setQuality(e.target.value);};$('adaptive').onchange=e=>auto=e.target.checked;
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);}addEventListener('resize',resize);
 let cast={objects:[],actors:[],update(){}};
 // Start rendering the environment while the local character files load.
 let last=performance.now(),time=0;renderer.setAnimationLoop(now=>{if(document.hidden){last=now;return;}const wallDt=Math.max(0,(now-last)/1000),dt=Math.min(wallDt,.06);last=now;time+=wallDt;weatherFx.update(dt,time);city.update(time);cast.update(dt,time);
  if(introStart!==null){const f=Math.min((time-introStart)/12,1),s=f*f*(3-2*f);camera.position.set(T.MathUtils.lerp(5.8,.8,s),T.MathUtils.lerp(2.4,1.68,s),T.MathUtils.lerp(9,4.7,s));camera.lookAt(T.MathUtils.lerp(-1,-.7,s),1.05,T.MathUtils.lerp(-10,-4.5,s));if(f===1)finishIntro();}else if(!started){camera.position.x=5.8+Math.sin(time*.08)*.18;camera.lookAt(-1,1,-6);}else input.update(dt,time);
  if(post)composer.render();else renderer.render(scene,camera);
  canvas.dataset.camera=camera.position.toArray().map(v=>v.toFixed(3)).join(',');frameCount++;frameTime+=wallDt;if(frameTime>=2){fps=Math.round(frameCount/frameTime);$('stats').textContent=`${quality} · ${fps} FPS · ${renderer.info.render.calls} draw calls · ${Math.round(renderer.info.render.triangles/1000)}k triangles`;canvas.dataset.fps=String(fps);canvas.dataset.quality=quality;frameTime=frameCount=0;if(auto&&time-adaptAt>4&&fps<25&&quality!=='Low'){setQuality(fps<12?'Low':quality==='Ultra'?'High':quality==='High'?'Medium':'Low');adaptAt=time;}}
 });
 const {results,errors}=await loadAssets((value,text)=>{$('progress').value=value;$('load-status').textContent=text;});cast=createCast(scene,results);
 canvas.dataset.actors=String(cast.actors.length);canvas.dataset.animated=String(cast.actors.filter(a=>a.mixer).length);
 $('load-status').textContent=errors.length?`City ready · ${errors.length} character asset(s) unavailable`:'THE CITY IS WAITING';$('enter').disabled=false;window.__sceneReady=true;clearTimeout(window.__bootTimer);
 function finishIntro(){introStart=null;document.body.classList.remove('intro');$('skip').hidden=true;input.setEnabled(true);}
 function beginIntro(){started=true;input.setEnabled(false);$('label').hidden=true;document.body.classList.add('entered');$('hud').hidden=false;if(matchMedia('(prefers-reduced-motion:reduce)').matches){reset();return;}introStart=time;document.body.classList.add('intro');$('skip').hidden=false;}
 function reset(){camera.position.set(.8,1.68,4.7);camera.lookAt(-.7,1.05,-4.5);finishIntro();}
 $('enter').onclick=beginIntro;$('cinema').onclick=beginIntro;$('skip').onclick=reset;$('reset').onclick=()=>{reset();$('graphics').close();};
 $('sound').onclick=async()=>{try{const on=await audio.toggle();$('sound').textContent=on?'SOUND ON':'SOUND OFF';$('sound').setAttribute('aria-pressed',String(on));}catch(e){$('sound').textContent='SOUND UNAVAILABLE';console.warn('Audio unavailable',e.message);}};
 for(const [button,panel]of [['about','credits'],['settings','graphics']]){$(button).onclick=()=>{document.exitPointerLock?.();$(panel).showModal();};$(panel).querySelector('.close').onclick=()=>$(panel).close();$(panel).addEventListener('click',e=>{if(e.target===$(panel)){const b=$(panel).getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)$(panel).close();}});}
 $('attributions').innerHTML='Survivor: codersan (CC BY 4.0), converted and optimized.<br>Michelle & Zombie Girl: Adobe / Mixamo (royalty-free use in this interactive experience).<br>Idle animation: Mixamo via codersan, retargeted for this scene.<br>City, motorcycle, surface textures & synthesized audio: original project assets.<br>Three.js: three.js authors (MIT).';
 const ray=new T.Raycaster(),pointer=new T.Vector2();let down=null;canvas.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});canvas.addEventListener('pointerup',e=>{if(!started||introStart!==null||!down||Math.hypot(down.x-e.clientX,down.y-e.clientY)>8)return;pointer.set(document.pointerLockElement?0:e.clientX/innerWidth*2-1,document.pointerLockElement?0:1-e.clientY/innerHeight*2);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects([...cast.objects,...city.objects],true)[0];if(!hit||hit.distance>25)return;let o=hit.object;while(o&&!o.userData.info)o=o.parent;if(o){const {title,type,copy}=o.userData.info;$('label-type').textContent=type;$('label-title').textContent=title;$('label-copy').textContent=copy;$('label').hidden=false;}});$('label-close').onclick=()=>$('label').hidden=true;
}
