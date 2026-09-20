import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {optimizeModel} from './optimize-model.mjs';
const root=new URL('../public/assets/models/',import.meta.url),cache=new URL('../.asset-cache/',import.meta.url);
await mkdir(root,{recursive:true});await mkdir(cache,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const survivor=await readFile(new URL('survivor.glb',root));if(hash(survivor)!=='eaf04575d77b31591faa401899b9b22c0c1f20eca7d243882a8862c0f90b3595')throw new Error('Survivor integrity check failed');
async function download(file,url,sha){const dest=new URL(file,cache);try{if(hash(await readFile(dest))===sha)return fileURLToPath(dest);}catch{}const res=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!res.ok)throw new Error(`${file}: HTTP ${res.status}`);const b=Buffer.from(await res.arrayBuffer());if(hash(b)!==sha)throw new Error(`${file}: integrity check failed`);await writeFile(dest,b);return fileURLToPath(dest);}
const revision='7300402f96c23bfa2174ffc0da01fb4e277d33da';
const michelle=await download('Michelle.glb',`https://raw.githubusercontent.com/mrdoob/three.js/${revision}/examples/models/gltf/Michelle.glb`,'7a87e15a99ccbc5e5877be66e1e4ecae0a581adcafa0cce1a5569f49909e968e');
const base='https://raw.githubusercontent.com/capdevon/sharefile/5edbe2509b317803156f80612279202713add5f9/Zombiegirl/gltf/';
const zombie=[['Zombiegirl.gltf','ec527325e45188752d1da5e787d3deabec65417cf4eb9fbf424e4afec5a22a98'],['zombie_body_diffuse.png','d89c36942192803f4d19e077bfea8133be983f002bccbc0df53d4be4e0e3e98b'],['zombie_diffuse.png','9adb059267d9dc94e43396bbb0af3fc3cd6cfc9cf5a8ac06dc7f1a790a94de60'],['zombie_normal.png','aea8e7d9ef5c430714829c9e0c127531aafea890f7bfd9e313356ecb45bcd55d']];
await Promise.all(zombie.map(([f,s])=>download(f,base+f,s)));
for(const [name,source]of [['investigator',michelle],['infected',fileURLToPath(new URL('Zombiegirl.gltf',cache))]]){await optimizeModel(source,fileURLToPath(new URL(name+'.glb',root)));console.log(`${name}: ${(await stat(new URL(name+'.glb',root))).size} optimized bytes`);}
