import * as T from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
export function createCast(scene,assets){const actors=[],objects=[];
 function actor(asset,x,z,height,rotation,infected=false,index=0){if(!asset)return null;const model=clone(asset.scene),pivot=new T.Group();pivot.add(model);model.updateMatrixWorld(true);const b=new T.Box3().setFromObject(model),size=b.getSize(new T.Vector3()),scale=height/size.y;model.scale.multiplyScalar(scale);model.position.set(-(b.max.x+b.min.x)/2*scale,-b.min.y*scale,-(b.max.z+b.min.z)/2*scale);pivot.position.set(x,0,z);pivot.rotation.y=rotation;scene.add(pivot);
  model.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;o.frustumCulled=false;if(infected){o.material=o.material.clone();o.material.color.multiply(new T.Color(index%2?'#6e7772':'#777167'));o.material.roughness=.95;}});
  const mixer=new T.AnimationMixer(model);let clip=asset.animations.find(a=>infected?/walk/i.test(a.name):/^idle$/i.test(a.name))||asset.animations[0];if(clip){clip=clip.clone();if(infected)clip.tracks=clip.tracks.filter(t=>!/(hips|root).*position/i.test(t.name));const action=mixer.clipAction(clip);action.play();action.time=index*.71;action.timeScale=infected?.28+index*.067:1;}
  const spine=[];model.traverse(o=>{if(o.isBone&&/spine|neck|head/i.test(o.name))spine.push(o);});actors.push({pivot,model,mixer,spine,infected,index,x,z});return pivot;
 }
 const leon=actor(assets.survivor,-2.8,-1.7,1.85,.32);if(leon){leon.userData.info={title:'Leon S. Kennedy',type:'FAN-ART ROLE / SURVIVOR',copy:'A veteran steps back into the silence. Depicted by an independent tactical character substitute.'};objects.push(leon);}
 const grace=actor(assets.investigator,2.1,-5.4,1.7,-.6);if(grace){grace.userData.info={title:'Grace Ashcroft',type:'FAN-ART ROLE / INVESTIGATOR',copy:'Every abandoned room holds an answer. Depicted by an independent character substitute.'};objects.push(grace);
  const lamp=new T.SpotLight('#d7e5dc',38,19,.23,.5,1.5);lamp.position.set(2,1.2,-5.2);lamp.target.position.set(-2,.3,-14);scene.add(lamp,lamp.target);
 }
 [[-2,-17,.4],[2.5,-24,-.7],[-3.3,-31,.8],[.5,-38,2]].forEach(([x,z,rot],i)=>{const a=actor(i%2?assets.investigator:assets.survivor,x,z,1.72+(i%2)*.05,rot,true,i+1);if(a){a.userData.info={title:'The infected',type:'DO NOT APPROACH',copy:'A body moving on instinct. Keep your distance.'};objects.push(a);}});
 return {objects,actors,update(dt,t){for(const a of actors){a.mixer.update(dt);if(a.infected){a.pivot.position.z=a.z+Math.sin(t*.14+a.index)*1.1;a.pivot.rotation.z=Math.sin(t*1.3+a.index)*.028;for(const b of a.spine)b.rotation.x+=.055; if(a.spine.length)a.spine.at(-1).rotation.z+=Math.sin(t*2.1+a.index)*.045;}else a.pivot.position.y=Math.sin(t*1.8)*.004;}}};
}
