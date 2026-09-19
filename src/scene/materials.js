import * as T from 'three';
export function rng(seed=947){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
export function surface(kind,repeat=1){
 const r=rng(kind==='brick'?33:19),size=512,c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
 x.fillStyle=kind==='brick'?'#4b4943':'#444b4d';x.fillRect(0,0,size,size);
 const d=x.getImageData(0,0,size,size);for(let i=0;i<d.data.length;i+=4){const n=(r()-.5)*36;d.data[i]+=n;d.data[i+1]+=n;d.data[i+2]+=n;}x.putImageData(d,0,0);
 if(kind==='brick'){for(let y=0;y<16;y++)for(let col=-1;col<8;col++){const bx=col*80+(y%2)*40,by=y*32;x.fillStyle=`rgb(${66+r()*35},${57+r()*25},${50+r()*23})`;x.fillRect(bx+2,by+2,76,28);x.strokeStyle='#232b2a';x.lineWidth=2;x.strokeRect(bx+2,by+2,76,28);}}
 for(let i=0;i<1500;i++){x.globalAlpha=r()*.16;x.fillStyle=r()>.5?'#090d0d':'#c6c7b7';x.fillRect(r()*size,r()*size,r()*12+1,r()*3+1);}x.globalAlpha=1;
 if(kind==='asphalt'){x.lineWidth=1;x.strokeStyle='#0e1618';for(let i=0;i<25;i++){let px=r()*size,py=r()*size;x.beginPath();x.moveTo(px,py);for(let j=0;j<8;j++){px+=(r()-.5)*60;py+=r()*25;x.lineTo(px,py);}x.stroke();}}
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(repeat,repeat);tex.anisotropy=4;
 const bump=tex.clone();bump.colorSpace=T.NoColorSpace;bump.needsUpdate=true;
 return new T.MeshStandardMaterial({map:tex,bumpMap:bump,bumpScale:kind==='brick'?.075:.025,roughness:kind==='asphalt'?.29:.88,metalness:kind==='asphalt'?.14:0});
}
export const material=(color,roughness=.7,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
export function sign(text,bg='#16201d',fg='#c4c3ad',width=1024){const c=document.createElement('canvas');c.width=width;c.height=256;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,width,256);x.strokeStyle=fg;x.lineWidth=5;x.strokeRect(12,12,width-24,232);x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';x.font=`bold ${Math.min(100,width/text.length*1.6)}px Georgia`;x.fillText(text,width/2,130);const r=rng();for(let i=0;i<700;i++){x.fillStyle=`rgba(0,0,0,${r()*.4})`;x.fillRect(r()*width,r()*256,r()*12,1+r()*4);}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return new T.MeshStandardMaterial({map:t,roughness:.8,emissive:fg,emissiveMap:t,emissiveIntensity:.08});}
export function mesh(g,m,parent,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
export function box(parent,m,x,y,z,w,h,d){return mesh(new T.BoxGeometry(w,h,d),m,parent,x,y,z);}
export function pipe(parent,m,points,r=.025){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),32,r,8,false),m,parent);}
