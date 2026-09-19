import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const assets=[
 {name:'survivor',url:'https://raw.githubusercontent.com/mrdoob/three.js/7300402f96c23bfa2174ffc0da01fb4e277d33da/examples/models/gltf/Soldier.glb',sha:'dfb230fc1f942f259dd00281a1186953ad602fc5d69067ce63e24b2aa439736b'},
 {name:'investigator',url:'https://raw.githubusercontent.com/BabylonJS/Assets/f9da5dbee104dad8679643086b6f375a7fcd5f7a/meshes/HVGirl.glb',sha:'ca7840ac8726d771ea75ad49df05e3d404a0654c5a8bf96edf2018802c37f5d7'}
];
const root=new URL('../public/assets/models/',import.meta.url);await mkdir(root,{recursive:true});
for(const asset of assets){const file=new URL(`${asset.name}.glb`,root),hash=b=>createHash('sha256').update(b).digest('hex');try{if(hash(await readFile(file))===asset.sha){console.log(`${asset.name}: verified`);continue;}}catch{}
 const res=await fetch(asset.url,{signal:AbortSignal.timeout(45000)});if(!res.ok)throw new Error(`${asset.name}: HTTP ${res.status}`);const bytes=Buffer.from(await res.arrayBuffer());if(hash(bytes)!==asset.sha)throw new Error(`${asset.name}: integrity check failed`);await writeFile(file,bytes);console.log(`${asset.name}: downloaded and verified`);
}
