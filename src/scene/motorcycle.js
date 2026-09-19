import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {mesh,material,pipe} from './materials.js';
export function motorcycle(){
 const g=new T.Group(),rubber=material('#0c0e0e',.86),steel=material('#5e6461',.25,.92),dark=material('#232b29',.34,.8),paint=material('#232c28',.22,.65),leather=material('#151715',.93),glass=material('#e5dcc4',.2,.1);
 const ell=(m,p,s)=>{const o=mesh(new T.SphereGeometry(1,32,20),m,g,...p);o.scale.set(...s);return o;};
 for(const z of [-.84,.84]){let o=mesh(new T.TorusGeometry(.32,.098,14,48),rubber,g,0,.42,z);o.rotation.y=Math.PI/2;
  for(const side of [-1,1]){o=mesh(new T.TorusGeometry(.24,.023,8,40),steel,g,side*.07,.42,z);o.rotation.y=Math.PI/2;
   o=mesh(new T.CylinderGeometry(.19,.19,.014,40),dark,g,side*.093,.42,z);o.rotation.z=Math.PI/2;
   for(let i=0;i<18;i++){const a=i/18*Math.PI*2;pipe(g,steel,[[side*.08,.42,z],[side*.08,.42+Math.cos(a)*.24,z+Math.sin(a)*.24]],.007);}
  }
  for(let i=0;i<40;i++){const a=i/40*Math.PI*2;const t=mesh(new T.BoxGeometry(.12,.008,.045),dark,g,0,.42+Math.sin(a)*.417,z+Math.cos(a)*.417);t.rotation.x=-a;}
 }
 for(const s of [-1,1]){
  pipe(g,dark,[[s*.14,.45,-.8],[s*.2,.43,-.25],[s*.18,.65,.35],[s*.13,1,.48]],.038);
  pipe(g,steel,[[s*.12,.42,.84],[s*.12,1.04,.49]],.038);
  pipe(g,steel,[[s*.16,.48,-.81],[s*.19,.82,-.36]],.025);
  for(let j=0;j<12;j++){const o=mesh(new T.TorusGeometry(.052,.009,5,12),steel,g,s*.17,.51+j*.021,-.75+j*.025);o.rotation.x=-.82;}
  pipe(g,steel,[[s*.14,.56,.15],[s*.29,.4,.06],[s*.3,.3,-.34],[s*.3,.34,-.86]],.038);
  const ex=mesh(new T.CylinderGeometry(.065,.08,.54,24),dark,g,s*.29,.33,-.68);ex.rotation.x=Math.PI/2;
  pipe(g,dark,[[s*.12,1.08,.48],[s*.28,1.13,.5],[s*.4,1.09,.35]],.021);
  pipe(g,steel,[[s*.31,1.1,.4],[s*.36,1.37,.4]],.008);ell(dark,[s*.37,1.38,.4],[.092,.056,.018]);
  pipe(g,steel,[[s*.14,.43,-.2],[s*.34,.43,-.2]],.025);
 }
 ell(paint,[0,.92,.05],[.24,.19,.36]);ell(leather,[0,.86,-.43],[.22,.065,.31]);ell(dark,[0,.47,-.12],[.19,.19,.25]);
 for(let z of [-.15,.17])for(let i=0;i<10;i++){const o=mesh(new T.CylinderGeometry(.125,.13,.016,18),i%2?steel:dark,g,0,.51+i*.021,z);o.rotation.x=z>0?.35:-.35;}
 for(let z of [-.84,.84]){const o=mesh(new T.TorusGeometry(.44,.036,6,36,Math.PI*.75),paint,g,0,.42,z);o.rotation.set(0,Math.PI/2,-Math.PI*.12);o.scale.z=3;}
 const lamp=mesh(new T.CylinderGeometry(.105,.12,.14,32),steel,g,0,1.06,.57);lamp.rotation.x=Math.PI/2;
 const lens=mesh(new T.CircleGeometry(.092,32),glass,g,0,1.06,.649);lens.material=glass.clone();lens.material.emissive.set('#fff0b9');lens.material.emissiveIntensity=2;
 const light=new T.SpotLight('#ffefc5',32,22,.38,.7,1.5);light.position.set(0,1.06,.72);light.target.position.set(0,.1,13);g.add(light,light.target);
 g.updateMatrixWorld(true);const batches=new Map(),remove=[];g.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry.clone().applyMatrix4(o.matrixWorld);const a=batches.get(o.material)||[];a.push(geo.index?geo.toNonIndexed():geo);batches.set(o.material,a);remove.push(o);});remove.forEach(o=>{g.remove(o);o.geometry.dispose();});for(const [m,geos]of batches){mesh(mergeGeometries(geos),m,g);geos.forEach(geo=>geo.dispose());}
 g.rotation.set(0,-.8,-.07);g.position.set(-1.4,.02,-.9);g.userData.info={title:"Leon’s Motorcycle",type:'ESCAPE ROUTE',copy:'An original, hand-built road bike. One last way out of the quarantine zone.'};return g;
}
