import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {material,surface,mesh,box,pipe,sign,rng} from './materials.js';
import {motorcycle} from './motorcycle.js';
export function environment(scene){
 const r=rng(333),staticGroup=new T.Group();scene.add(staticGroup);const objects=[],lights=[],colliders=[];
 const concrete=surface('concrete',2),brick=surface('brick',1),asphalt=surface('asphalt',12),metal=material('#303b38',.5,.7),rust=material('#4e382b',.85,.5),black=material('#090e10',.5),stone=material('#555951'),glass=material('#182525',.2,.7),line=material('#a29560',.9);
 const road=mesh(new T.PlaneGeometry(110,150),asphalt,staticGroup,0,-.045,-35);road.rotation.x=-Math.PI/2;
 const puddle=new Reflector(new T.PlaneGeometry(13,73),{clipBias:.005,textureWidth:512,textureHeight:512,color:0x505c60});puddle.rotation.x=-Math.PI/2;puddle.position.set(0,-.025,-21);scene.add(puddle);
 // A translucent reflection layer lets the asphalt grain remain visible.
 puddle.material.transparent=true;puddle.material.depthWrite=false;
 puddle.material.fragmentShader=puddle.material.fragmentShader.replace('1.0 );', '0.20 );');
 for(let z=-62;z<15;z+=6){box(staticGroup,line,-.12,.004,z,.055,.008,2.6);box(staticGroup,line,.12,.004,z,.055,.008,2.6);}
 for(let side of [-1,1]){
  box(staticGroup,concrete,side*8,-.05,-29,3,.38,100);
  for(let z=-77;z<21;z+=1.4)box(staticGroup,stone,side*6.58,.13,z,.19,.32,1.36);
  for(let block=0;block<8;block++){
   const z=8-block*11,h=8+r()*11,w=7+r()*4,x=side*(9.5+w/2),face=side*9.35;
   box(staticGroup,brick,x,h/2,z,w,h,9.9);colliders.push({minX:x-w/2-.5,maxX:x+w/2+.5,minZ:z-5.5,maxZ:z+5.5});
   for(let level=0;level<h;level+=3.1){box(staticGroup,concrete,x,level+.22,z,w+.2,.22,10.2);
    if(level>0){for(let q=-1;q<=1;q++){
     const wz=z+q*2.7;box(staticGroup,black,face-side*.04,level+1.65,wz,.12,1.94,1.35);
     for(let off of [-.73,.73])box(staticGroup,stone,face-side*.12,level+1.65,wz+off,.16,2.1,.085);
     box(staticGroup,stone,face-side*.15,level+.68,wz,.27,.14,1.65);box(staticGroup,metal,face-side*.15,level+1.66,wz,.08,1.8,.05);
     if(r()>.45){const shard=box(staticGroup,glass,face-side*.16,level+1.94,wz+.28,.04,.93,.55);shard.rotation.x=r()*.18;}
     if(r()>.84){const warm=new T.MeshStandardMaterial({color:'#796b50',emissive:'#cc9a53',emissiveIntensity:.4});box(staticGroup,warm,face+side*.025,level+1.65,wz,.03,1.8,1.2);}
    }}
   }
   box(staticGroup,black,face-side*.05,1.45,z,.15,2.35,6.7);
   for(let q=-3;q<=3;q+=1.5)box(staticGroup,metal,face-side*.2,1.4,z+q,.15,2.5,.07);
   const names=side<0?['ST. MICHAEL PHARMACY','HOLLOWAY & SONS','PARKSIDE HOTEL','ARCHIVE','LIQUOR','CINEMA','MERCER','MOTEL']:['KENWOOD DINER','LAST STOP','CITY RECORDS','LAUNDRY','AUTO REPAIR','BOOKS','MARKET','GARAGE'];
   const board=mesh(new T.PlaneGeometry(7.4,.88),sign(names[block]),staticGroup,face-side*.22,3.08,z);board.rotation.y=-side*Math.PI/2;
   for(let i=0;i<5;i++){const plank=box(staticGroup,rust,face-side*.3,.6+i*.38,z+(r()-.5),.09,.13,5);plank.rotation.x=(r()-.5)*.3;}
   // Damaged corner, rubble silhouette and exposed floor slabs.
   for(let j=0;j<9;j++){const o=mesh(new T.DodecahedronGeometry(.25+r()*.65,0),concrete,staticGroup,side*(7.3+r()*2),.12+r()*.28,z+(r()-.5)*8);o.rotation.set(r()*3,r()*3,r()*3);o.scale.y=.5;}
   if(block===2){for(let a=0;a<3;a++){const b=box(staticGroup,concrete,side*8.7,1+a*.6,z+a*.7,2,.25,4);b.rotation.z=side*.38;}}
  }
  for(let z=5;z>-60;z-=15){pipe(staticGroup,metal,[[side*6.9,0,z],[side*6.9,5.6,z],[side*6.5,6.2,z],[side*5.2,6.2,z]],.055);
   const bulb=new T.MeshStandardMaterial({color:'#ccd8cd',emissive:'#c5dab9',emissiveIntensity:2});box(staticGroup,bulb,side*5.3,6.12,z,.6,.05,.3);
   if(z<0)continue;const l=new T.SpotLight('#b9d2c4',55,17,.8,.7,1.5);l.position.set(side*5.3,6,z);l.target.position.set(side*3,0,z-1);scene.add(l,l.target);lights.push(l);
  }
 }
 // Power lines and ruined skyline.
 for(let z of [-9,-32,-55])for(let j=0;j<3;j++)pipe(staticGroup,black,[[-10,9+j*.25,z],[-3,7.6+j*.25,z+.3],[4,7.4+j*.25,z+.7],[10,10+j*.25,z]],.017);
 for(let i=0;i<20;i++){const h=8+r()*28;box(staticGroup,brick,(r()-.5)*100,h/2,-85-r()*40,5+r()*8,h,8);}
 // Shattered masonry and paper scattered across the pavement, instanced.
 const rubble=new T.InstancedMesh(new T.DodecahedronGeometry(1,0),concrete,290),dummy=new T.Object3D();for(let i=0;i<290;i++){dummy.position.set((r()-.5)*17,.05,r()*88-65);dummy.scale.set(.03+r()*.3,.03+r()*.15,.06+r()*.3);dummy.rotation.set(r()*6,r()*6,r()*6);dummy.updateMatrix();rubble.setMatrixAt(i,dummy.matrix);}rubble.castShadow=true;scene.add(rubble);
 const paper=new T.InstancedMesh(new T.PlaneGeometry(.17,.23),material('#858677'),65);for(let i=0;i<65;i++){dummy.position.set((r()-.5)*15,.015,r()*65-48);dummy.scale.setScalar(1);dummy.rotation.set(-Math.PI/2,0,r()*6);dummy.updateMatrix();paper.setMatrixAt(i,dummy.matrix);}scene.add(paper);
 function car(x,z,rot,police=false,flip=false){const g=new T.Group();const paint=material(police?'#bac1b8':'#343d39',.42,.65);box(g,paint,0,.68,0,1.9,.52,4.3);box(g,black,0,.43,0,1.72,.24,4.1);const roof=box(g,paint,0,1.36,-.23,1.67,.15,1.8);roof.rotation.z=.018;box(g,glass,0,1.13,.67,1.61,.46,.07).rotation.x=.4;box(g,glass,0,1.15,-1.17,1.62,.42,.06).rotation.x=-.3;
  for(let s of [-1,1]){for(let zz of [-1.4,1.35]){const t=mesh(new T.TorusGeometry(.3,.115,10,22),black,g,s*.88,.39,zz);t.rotation.y=Math.PI/2;const hub=mesh(new T.CylinderGeometry(.19,.19,.03,16),metal,g,s*1.005,.39,zz);hub.rotation.z=Math.PI/2;}for(let zz of [-1.12,.64])box(g,metal,s*.77,1.08,zz,.065,.58,.055);box(g,paint,s*.79,.91,-.22,.08,.11,1.8);box(g,metal,s*.56,.75,2.17,.47,.12,.04);}
  box(g,metal,0,.44,2.19,1.85,.1,.08);for(let i=0;i<10;i++)box(g,black,(i-4.5)*.12,.62,2.16,.06,.15,.015);
  if(police){box(g,black,0,1.51,-.23,1.1,.1,.24);for(let s of [-1,1]){const mat=new T.MeshStandardMaterial({color:s<0?'#902523':'#243e77',emissive:s<0?'#ff281a':'#2255ff',emissiveIntensity:2});box(g,mat,s*.38,1.62,-.23,.34,.15,.23);}const door=mesh(new T.PlaneGeometry(1.2,.28),sign('POLICE','#a3aaa0','#171d1b'),g,1.003,.74,-.1);door.rotation.y=Math.PI/2;}
  g.position.set(x,flip?1.55:0,z);g.rotation.y=rot;if(flip)g.rotation.z=2.8;staticGroup.add(g);colliders.push({minX:x-2,maxX:x+2,minZ:z-2.6,maxZ:z+2.6});return g;
 }
 car(4.1,-9,.28,true);car(-4.8,-22,-.42);car(3.4,-36,1.3,false,true);car(-5.5,9,.2);
 const red=new T.PointLight('#e53423',14,15,1.5),blue=new T.PointLight('#285fdb',12,15,1.5);red.position.set(3.7,1.9,-9);blue.position.set(4.5,1.9,-9);scene.add(red,blue);
 for(let z of [-44,-45.5])for(let x=-5;x<=5;x+=2.5){const b=box(staticGroup,concrete,x,.55,z,2.2,1,.55);b.rotation.y=.15;const p=mesh(new T.PlaneGeometry(2,.25),sign('QUARANTINE','#756a3e','#1b201d'),staticGroup,x,.76,z+.3);}
 const notice=mesh(new T.PlaneGeometry(1.4,1.8),sign('BIOHAZARD','#bab19a','#691c1c',512),staticGroup,-5.9,1.6,-12);notice.rotation.z=-.1;notice.userData.info={title:'Containment failed',type:'FIELD NOTE / 01',copy:'The evacuation buses never arrived. The last radio transmission was at 02:17.'};objects.push(notice);
 const bike=motorcycle();scene.add(bike);objects.push(bike);
 // Merge static meshes by material. Architecture remains detailed without thousands of draw calls.
 staticGroup.updateMatrixWorld(true);const byMat=new Map();staticGroup.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;const g=o.geometry.clone().applyMatrix4(o.matrixWorld);if(o.material===brick){const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(Math.abs(n.getX(i))>.5?p.getZ(i):p.getX(i))/1.8,p.getY(i)/1.6);}const a=byMat.get(o.material)||[];a.push(g);byMat.set(o.material,a);});scene.remove(staticGroup);for(const [m,gs]of byMat){const merged=mergeGeometries(gs.map(g=>g.index?g.toNonIndexed():g),false);if(merged){const o=new T.Mesh(merged,m);o.castShadow=o.receiveShadow=true;scene.add(o);}gs.forEach(g=>g.dispose());}
 return {objects,colliders,puddle,lights,update(t){red.intensity=7+Math.pow(Math.max(0,Math.sin(t*5)),8)*32;blue.intensity=7+Math.pow(Math.max(0,Math.sin(t*5+Math.PI)),8)*32;lights[0].intensity=45+(Math.sin(t*19)*Math.sin(t*7)> .65?-38:0);}};
}
