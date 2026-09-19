import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
export async function loadAssets(onProgress){
 const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder),names=['survivor','investigator'],results={},errors=[];let completed=0;
 await Promise.allSettled(names.map(async name=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),18000);
  try{const response=await fetch(`${import.meta.env.BASE_URL}assets/models/${name}.glb`,{signal:controller.signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);const bytes=await response.arrayBuffer();const gltf=await Promise.race([loader.parseAsync(bytes,''),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Model decode timeout')),18000))]);results[name]=gltf;}
  catch(e){errors.push(name);console.warn(`Asset ${name} unavailable: ${e.message}`);}finally{clearTimeout(timer);onProgress(++completed/names.length,`${completed} / ${names.length} character assets checked`);}
 }));return {results,errors};
}
