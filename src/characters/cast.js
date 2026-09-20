import * as T from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
export function createCast(scene,assets){const actors=[],objects=[];
 function idleFor(model){
 const donor=assets.survivor,source=donor?.animations.find(c=>/^idle$/i.test(c.name));if(!source)return null;
 const tracks=[];for(const track of source.tracks){if(!track.name.endsWith('.quaternion'))continue;const name=track.name.split('.')[0],target=model.getObjectByName(name),from=donor.scene.getObjectByName(name);if(!target||!from)continue;const t=track.clone();
 if(/Hips$/.test(name)){const correction=target.quaternion.clone().multiply(from.quaternion.clone().invert()),q=new T.Quaternion();for(let i=0;i<t.values.length;i+=4){q.fromArray(t.values,i).premultiply(correction).toArray(t.values,i);}}
 tracks.push(t);}return new T.AnimationClip('Idle',source.duration,tracks);
 }
 function actor(asset,x,z,height,rotation,infected=false,index=0){if(!asset)return null;const model=clone(asset.scene),pivot=new T.Group();pivot.add(model);model.updateMatrixWorld(true);const b=new T.Box3().setFromObject(model),size=b.getSize(new T.Vector3()),scale=height/size.y;model.scale.multiplyScalar(scale);model.position.set(-(b.max.x+b.min.x)/2*scale,-b.min.y*scale,-(b.max.z+b.min.z)/2*scale);pivot.position.set(x,0,z);pivot.rotation.y=rotation;scene.add(pivot);
  model.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;o.frustumCulled=false;
  if(asset===assets.investigator){o.material=o.material.clone();o.material.roughness=.9;o.material.metalness=0;o.material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float clothingMask=smoothstep(0.65,0.85,diffuseColor.g/max(diffuseColor.r,0.001))*smoothstep(0.06,0.18,diffuseColor.g-diffuseColor.b);
   float clothLuma=dot(diffuseColor.rgb,vec3(0.2126,0.7152,0.0722));
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(clothLuma*0.09,clothLuma*0.105,clothLuma*0.11),clothingMask);
   diffuseColor.rgb=mix(vec3(dot(diffuseColor.rgb,vec3(0.2126,0.7152,0.0722))),diffuseColor.rgb,0.6);`);};o.material.customProgramCacheKey=()=> 'investigator-clothing';}
  if(infected){o.material=o.material.clone();o.material.color.multiply(new T.Color(index%2?'#6e7772':'#777167'));o.material.roughness=.95;}});
  const mixer=new T.AnimationMixer(model);let clip=asset.animations.find(a=>/^idle$/i.test(a.name))||idleFor(model)||asset.animations[0];if(clip){clip=clip.clone();if(infected)clip.tracks=clip.tracks.filter(t=>!/(hips|root).*position/i.test(t.name));const action=mixer.clipAction(clip);action.play();action.time=index*.71;action.timeScale=infected?.28+index*.067:1;}
  mixer.update(.01);const spine=[];model.traverse(o=>{if(o.isBone&&/spine|neck|head/i.test(o.name))spine.push(o);});actors.push({pivot,model,mixer,spine,infected,index,x,z});return pivot;
 }
 const leon=actor(assets.survivor,-2.8,-1.7,1.85,.32);if(leon){leon.userData.info={title:'Leon S. Kennedy',type:'FAN-ART ROLE / SURVIVOR',copy:'A veteran steps back into the silence. Depicted by an independent tactical character substitute.'};objects.push(leon);}
 const grace=actor(assets.investigator,2.1,-5.4,1.7,-.6);if(grace){grace.userData.info={title:'Grace Ashcroft',type:'FAN-ART ROLE / INVESTIGATOR',copy:'Every abandoned room holds an answer. Depicted by an independent character substitute.'};objects.push(grace);
  const lamp=new T.SpotLight('#d7e5dc',38,19,.23,.5,1.5);lamp.position.set(2,1.2,-5.2);lamp.target.position.set(-2,.3,-14);scene.add(lamp,lamp.target);
 }
 [[-2,-17,.4],[2.5,-24,-.7],[-3.3,-31,.8],[.5,-38,2]].forEach(([x,z,rot],i)=>{const a=actor(i===2?assets.survivor:assets.infected,x,z,1.72+(i%2)*.05,rot,true,i+1);if(a){a.userData.info={title:'The infected',type:'DO NOT APPROACH',copy:'A body moving on instinct. Keep your distance.'};objects.push(a);}});
 return {objects,actors,update(dt,t){for(const a of actors){a.mixer.update(dt);if(a.infected){a.pivot.position.z=a.z+Math.sin(t*.14+a.index)*1.1;a.pivot.rotation.z=Math.sin(t*1.3+a.index)*.028;for(const b of a.spine)b.rotation.x+=.055; if(a.spine.length)a.spine.at(-1).rotation.z+=Math.sin(t*2.1+a.index)*.045;}else a.pivot.position.y=Math.sin(t*1.8)*.004;}}};
}
