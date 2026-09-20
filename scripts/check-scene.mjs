import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import * as THREE from 'three';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {environment} from '../src/scene/environment.js';
import {weather} from '../src/scene/weather.js';
import {createCast} from '../src/characters/cast.js';
globalThis.document={createElement:tag=>{assert.equal(tag,'canvas');return createCanvas(512,512);}};
globalThis.self=globalThis;
globalThis.createImageBitmap=async blob=>loadImage(Buffer.from(await blob.arrayBuffer()));
const scene=new THREE.Scene(),assets={};
for(const name of ['survivor','investigator','infected']){const bytes=await readFile(new URL(`../public/assets/models/${name}.glb`,import.meta.url));assets[name]=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');assert(assets[name].animations.length>0);}
const city=environment(scene),effects=weather(scene),cast=createCast(scene,assets);
assert.equal(cast.actors.length,6);assert.equal(city.objects.length,2);
for(let i=0;i<120;i++){const t=i/30;cast.update(1/30,t);effects.update(1/30,t);city.update(t);scene.updateMatrixWorld(true);}
let meshes=0,triangles=0;scene.traverse(o=>{assert(o.matrixWorld.elements.every(Number.isFinite),`Invalid transform: ${o.name}`);if(o.isMesh){meshes++;const p=o.geometry.attributes.position;assert(p&&p.array.every(Number.isFinite));triangles+=(o.geometry.index?.count||p.count)/3;}});
assert(cast.actors.every(a=>a.mixer.time>3.9));
const empty=new THREE.Scene();assert.equal(createCast(empty,{}).actors.length,0);
console.log(JSON.stringify({models:Object.keys(assets),actors:cast.actors.length,animatedSeconds:4,meshObjects:meshes,triangles:Math.round(triangles),missingModelRecovery:'passed',finiteTransforms:'passed',note:'CPU scene validation only; not a WebGL visual or FPS test.'},null,2));
