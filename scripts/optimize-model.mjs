import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,resample,textureCompress,meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer';
import sharp from 'sharp';
await MeshoptEncoder.ready;await MeshoptDecoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
export async function optimizeModel(input,output){const doc=await io.read(input);
if(input.includes('Zombiegirl'))for(const m of doc.getRoot().listMaterials()){m.setBaseColorFactor([1,1,1,1]).setMetallicFactor(0).setRoughnessFactor(.87).setAlphaMode('MASK').setAlphaCutoff(.35).setDoubleSided(true);}
await doc.transform(dedup(),prune(),resample(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[1024,1024],quality:85}),meshopt({encoder:MeshoptEncoder,level:'medium'}));
await io.write(output,doc);
console.log('Saved',output);

}
