import assert from 'node:assert/strict';
const base=process.argv[2]||'https://saaeiddev.github.io/Resident-Evil-9-/';
async function get(path){const url=new URL(path,base),r=await fetch(url,{signal:AbortSignal.timeout(45000)});assert(r.ok,`${url}: HTTP ${r.status}`);return r;}
const html=await (await get('./')).text();assert(html.includes('Created by Amir Saeid Dehghan'));
const urls=[...html.matchAll(/(?:src|href)="(\.\/assets\/[^" ]+)"/g)].map(x=>x[1]);assert(urls.some(u=>u.endsWith('.js')),'Production JavaScript bundle missing');
await Promise.all(urls.map(async u=>{assert((await (await get(u)).arrayBuffer()).byteLength>0);console.log('OK',u);}));
for(const name of ['survivor','investigator','infected']){const b=await (await get(`assets/models/${name}.glb`)).arrayBuffer(),d=new DataView(b);assert.equal(d.getUint32(0,true),0x46546c67,`${name}: not a GLB`);assert.equal(d.getUint32(4,true),2);assert.equal(d.getUint32(8,true),b.byteLength);console.log('OK',name,b.byteLength,'bytes');}
const credits=await (await get('CREDITS.md')).text();assert(credits.includes('codersan'));assert(credits.includes('not affiliated with or endorsed by Capcom'));
console.log('Production HTML, bundles, three GLBs and credits verified:',base);
