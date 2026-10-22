
  (function(){
    'use strict';
    const root=document.getElementById('bridge-tv-v1');if(!root)return;
    const P=Object.freeze({width:2400,depth:800,height:1880,tvWidth:1890,tvHeight:1101,tvDepth:53,tvBottom:770,tvTop:1871,tvCenter:1320.5,tvCenterZ:10,tvWeight:39,towerX:1080,towerZ:-100,profile:40,caster:160,casterUnitHeight:150,casterDiameter:125,casterOffset:38,casterSweep:115,casterX:1080,casterZ:280,baseBottom:160,baseTop:240,baseCenter:200,baseHeight:80,pegWidth:1800,pegHeight:900,pegBottom:850,pegTop:1750,pegFront:-175.5,pegRear:-177,trayWidth:1440,trayDepth:600,trayTop:250,trayZ:0,consoleX:-350,reserveWidth:500,reserveDepth:300,reserveHeight:150,upperFrameY:520,upperBeamBottom:500,displayTop:540,displayBottom:534,displayDepth:360,displayCenterZ:30,toyHeight:180,fanPylonX:760,fanTop:740,fanCableY:728,fanCableZ:-180,fanAnchorY:552,sideHoleWidth:14,sideHoleDepth:18,gateHingeY:254,gateZ:-260,grossPlanningMass:250});
    const displayOutline=[[-720,-150],[-80,-150],[-20,30],[-80,210],[-720,210]];
    const state={yaw:.36,pitch:.16,zoom:1,tv:true,board:true,dims:false,gateOpen:false,view:'perspective',detail:false};
    const canvas=root.querySelector('#tv-canvas'),ctx=canvas.getContext('2d'),stage=root.querySelector('.tv-stage');
    let faces=[],cableRuns=[],sideHoles=[],palette,width=0,height=0,scheduled=false,lastSVG=0,buildingTV=false,buildingBoard=false,buildingConsoleTop=false,buildingShelf=false,buildingPad=false;
    const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,s)=>a.map(v=>v*s);
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const norm=a=>mul(a,1/(Math.hypot(...a)||1));
    const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
    const rgb=a=>'rgb('+a.map(v=>Math.round(Math.max(0,Math.min(255,v)))).join(',')+')';
    function readColor(token){
      const el=document.createElement('span');el.style.color='var('+token+')';el.hidden=true;root.appendChild(el);
      const c=getComputedStyle(el).color;el.remove();
      const v=document.createElement('canvas');v.width=v.height=1;const x=v.getContext('2d');x.fillStyle=c;x.fillRect(0,0,1,1);return Array.from(x.getImageData(0,0,1,1).data).slice(0,3);
    }
    function colors(){
      const fg=readColor('--foreground'),bg=readColor('--background'),metal=readColor('--tv-metal'),pink=readColor('--tv-pink'),screen=readColor('--tv-screen');
      palette={fg,bg,frame:metal,pink,slot:mix(metal,screen,.63),hardware:mix(metal,screen,.28),rubber:mix(screen,metal,.10),screen,case:mix(screen,metal,.08),basket:mix(pink,metal,.1),toyPink:mix(pink,bg,.18),toyMint:mix(readColor('--green'),bg,.5),toyCream:mix(readColor('--orange'),bg,.65),toyFace:mix(pink,bg,.60)};
      palette.pegboard=mix(metal,bg,.56);palette.pegEdge=mix(palette.pegboard,screen,.14);palette.hole=mix(palette.pegboard,screen,.57);
      palette.controllerWhite=mix(metal,[247,248,250],.80);palette.joyBlue=mix(readColor('--blue'),bg,.33);
      palette.shelf=mix(palette.pegboard,metal,.18);
      palette.acrylic=mix(pink,bg,.76);palette.acrylicEdge=mix(pink,bg,.12);
      palette.acrylicPink=mix(pink,bg,.26);palette.acrylicPinkEdge=mix(pink,metal,.12);palette.stay=mix(metal,pink,.36);
      requestDraw();
    }
    function face(p,n,mat,o){const f={p,n,mat,tv:buildingTV,board:buildingBoard,consoleTop:buildingConsoleTop,shelfSurface:buildingShelf,padSurface:buildingPad,edge:!o||o.edge!==false};if(o&&o.groove)f.groove=o.groove;faces.push(f);}
    function box(x,y,z,w,h,d,mat,o){
      const c=[x,y,z],ds=[w,h,d],opts=o||{};
      for(let ax=0;ax<3;ax++)for(const sign of [-1,1]){
        const a=(ax+1)%3,b=(ax+2)%3,n=[0,0,0];n[ax]=sign;
        const pts=[[-1,-1],[1,-1],[1,1],[-1,1]].map(v=>{const p=c.slice();p[ax]+=sign*ds[ax]/2;p[a]+=v[0]*ds[a]/2;p[b]+=v[1]*ds[b]/2;return p;});
        const opt={edge:opts.edge};
        if(opts.axis!==undefined&&ax!==opts.axis){
          const long=opts.axis,short=[0,1,2].find(i=>i!==ax&&i!==long);
          opt.groove=[[-1,-1],[1,-1],[1,1],[-1,1]].map(v=>{const p=c.slice();p[ax]+=sign*ds[ax]/2;p[long]+=v[0]*(ds[long]/2-4);p[short]+=v[1]*3;return p;});
        }
        face(pts,n,typeof mat==='object'?(mat[ax+':'+sign]||mat.base):mat,opt);
      }
    }
    function beam(x,y,z,w,h,d){const v=[w,h,d];box(x,y,z,w,h,d,'frame',{axis:v.indexOf(Math.max(...v))});}
    function strut(a,b,w,d,mat){
      const dir=norm(b.map((v,i)=>v-a[i])),u=norm(cross(dir,Math.abs(dir[2])>.95?[1,0,0]:[0,0,1])),v=norm(cross(dir,u)),verts=[];
      for(const p of [a,b])for(const side of [[-1,-1],[1,-1],[1,1],[-1,1]])verts.push(add(add(p,mul(u,side[0]*w/2)),mul(v,side[1]*d/2)));
      face(verts.slice(0,4),mul(dir,-1),mat,{edge:false});face(verts.slice(4),dir,mat,{edge:false});
      for(let i=0;i<4;i++){const j=(i+1)%4,n=norm(add(mul(u,[0,1,0,-1][i]),mul(v,[-1,0,1,0][i])));face([verts[i],verts[j],verts[j+4],verts[i+4]],n,mat,{edge:w>10});}
    }
    function cylinder(x,y,z,r,length,axis,mat){
      const c=[x,y,z],a=axis,b=(a+1)%3,k=(a+2)%3,N=12,rings=[];
      for(const s of [-1,1]){const ring=[];for(let i=0;i<N;i++){const p=c.slice(),t=i*2*Math.PI/N;p[a]+=s*length/2;p[b]+=Math.cos(t)*r;p[k]+=Math.sin(t)*r;ring.push(p);}rings.push(ring);const n=[0,0,0];n[a]=s;face(ring,n,mat,{edge:false});}
      for(let i=0;i<N;i++){const j=(i+1)%N,t=(i+.5)*2*Math.PI/N,n=[0,0,0];n[b]=Math.cos(t);n[k]=Math.sin(t);face([rings[0][i],rings[0][j],rings[1][j],rings[1][i]],n,mat,{edge:false});}
    }
    function ball(x,y,z,rx,ry,rz,mat){
      const N=10,L=5,pt=(i,j)=>{const t=i*Math.PI/L,a=j*2*Math.PI/N;return[x+Math.sin(t)*Math.cos(a)*rx,y+Math.cos(t)*ry,z+Math.sin(t)*Math.sin(a)*rz];};
      for(let i=0;i<L;i++)for(let j=0;j<N;j++){const pts=[pt(i,j),pt(i+1,j),pt(i+1,j+1),pt(i,j+1)],c=pts.reduce((s,p)=>add(s,mul(p,.25)),[0,0,0]);face(pts,norm([(c[0]-x)/rx,(c[1]-y)/ry,(c[2]-z)/rz]),mat,{edge:false});}
    }
    function eyelet(c,axis,r1,r2,mat){
      const a=(axis+1)%3,b=(axis+2)%3,point=t=>{const p=c.slice();p[a]+=Math.cos(t)*r1;p[b]+=Math.sin(t)*r2;return p;};
      for(let i=0;i<10;i++)strut(point(i*Math.PI/5),point((i+1)*Math.PI/5),1.4,1.4,mat||'hardware');
    }
    function outerStay(x,z){const s=x<0?-1:1;return{a:[x+s*30,1780,-100],b:[x+s*80,252,z]};}
    function stayAtY(run,y){const t=(run.a[1]-y)/(run.a[1]-run.b[1]);return mix(run.a,run.b,t);}
    function tensionStay(a,b,size,kind){
      const first=faces.length,delta=b.map((v,i)=>v-a[i]),length=Math.hypot(...delta),at=d=>add(a,mul(delta,d/length));
      const core=faces.length;strut(a,b,size,size,'stay');for(let i=core;i<faces.length;i++)faces[i].stayWire=true;
      const lo=kind==='outer'?length-90:length-38,hi=kind==='outer'?length-35:length-16;
      strut(at(lo),at(hi),kind==='outer'?7:5,kind==='outer'?7:5,'hardware');
      for(const p of [a,b])eyelet(p,2,4,5,'hardware');
      for(let i=first;i<faces.length;i++)faces[i].decorativeStay=kind;
      cableRuns.push({a:a.slice(),b:b.slice(),size,kind});
    }
    function sideAcrylic(x,y){
      const first=faces.length,run=outerStay(x,350),p=stayAtY(run,y),x0=x-120,x1=x+120,z0=0,z1=200,hx=P.sideHoleWidth/2,hz=P.sideHoleDepth/2;
      const xs=[x0,p[0]-hx,p[0]+hx,x1],zs=[z0,p[2]-hz,p[2]+hz,z1];
      for(let i=0;i<3;i++)for(let j=0;j<3;j++)if(i!==1||j!==1){
        const ring=[[xs[i],zs[j]],[xs[i+1],zs[j]],[xs[i+1],zs[j+1]],[xs[i],zs[j+1]]];
        for(const sign of [-1,1])face(ring.map(v=>[v[0],y+sign*3,v[1]]),[0,sign,0],'acrylicPink',{edge:false});
      }
      for(const ring of [[[x0,z0],[x1,z0],[x1,z1],[x0,z1]],[[p[0]-hx,p[2]-hz],[p[0]-hx,p[2]+hz],[p[0]+hx,p[2]+hz],[p[0]+hx,p[2]-hz]]]){
        for(let i=0;i<4;i++){const a=ring[i],b=ring[(i+1)%4];face([[a[0],y-3,a[1]],[b[0],y-3,b[1]],[b[0],y+3,b[1]],[a[0],y+3,a[1]]],norm([b[1]-a[1],0,a[0]-b[0]]),'acrylicPinkEdge',{edge:false});}
      }
      eyelet([p[0],y+3.6,p[2]],1,hz,hx,'acrylicPinkEdge');
      for(let i=first;i<faces.length;i++)faces[i].sideAcrylic=true;
      sideHoles.push({x:p[0],y,z:p[2],width:P.sideHoleWidth,depth:P.sideHoleDepth,thickness:6,run});
    }
    function bridgeStays(){
      for(const x of [-P.fanPylonX,P.fanPylonX]){
        const s=x<0?-1:1,first=faces.length;
        beam(x,(P.displayTop+P.fanTop-12)/2,P.fanCableZ,40,P.fanTop-12-P.displayTop,40);
        box(x,P.fanTop-6,P.fanCableZ,46,12,46,'pink');
        box(x-s*23,P.fanCableY,P.fanCableZ,6,16,22,'hardware');
        for(let i=first;i<faces.length;i++)faces[i].fanPylon=true;
        for(const target of [620,485,350,215,80]){
          const end=[s*target,P.fanAnchorY,P.fanCableZ];
          cylinder(end[0],543,end[2],4,6,1,'hardware');
          tensionStay([x-s*26,P.fanCableY,P.fanCableZ],end,2.2,'fan');
        }
      }
      for(const x of [-1080,1080])for(const z of [-350,350]){
        const run=outerStay(x,z),s=x<0?-1:1;
        box(x+s*24,1780,-100,12,24,26,'hardware');
        box(run.b[0],243,z,24,6,24,'hardware');
        cylinder(run.b[0],248,z,4,8,1,'hardware');
        tensionStay(run.a,run.b,3,'outer');
      }
    }
    function toy(x,y,z,scale,mat){
      const s=scale;
      for(const dx of [-20,20])box(x+dx*s,y+18*s,z,24*s,36*s,37*s,mat,{edge:false});
      cylinder(x,y+62*s,z,35*s,56*s,1,mat);
      ball(x,y+123*s,z,39*s,41*s,34*s,'toyFace');
      cylinder(x,y+157*s,z-2*s,44*s,12*s,1,mat);
      ball(x,y+174*s,z-7*s,31*s,21*s,28*s,mat);
      for(const side of [-1,1])box(x+side*43*s,y+69*s,z,15*s,46*s,20*s,'toyFace',{edge:false});
      for(const side of [-1,1])box(x+side*13*s,y+127*s,z+33*s,5*s,6*s,2*s,'screen',{edge:false});
    }
    function wheel(x,z,angle){
      const start=faces.length;
      box(x,148,z,100,4,85,'hardware');cylinder(x,136,z,27,20,1,'frame');
      for(const s of [-1,1])box(x+s*23,88,z+25,5,88,48,'hardware');
      cylinder(x,62.5,z+P.casterOffset,62.5,32,0,'rubber');cylinder(x,62.5,z+P.casterOffset,24,34,0,'frame');cylinder(x,62.5,z+P.casterOffset,5,54,0,'hardware');
      box(x,123,z-56,28,6,52,'pink');
      const c=Math.cos(angle),s=Math.sin(angle);
      for(let i=start;i<faces.length;i++){const f=faces[i];f.casterAssembly=x+','+z;f.p=f.p.map(p=>{const a=p[0]-x,b=p[2]-z;return[x+a*c+b*s,p[1],z-a*s+b*c];});f.n=[f.n[0]*c+f.n[2]*s,f.n[1],-f.n[0]*s+f.n[2]*c];}
    }
    function triangularPlate(points,axis,thickness){
      const n=[0,0,0];n[axis]=1;
      const a=points.map(p=>p.map((v,i)=>v+(i===axis?thickness/2:0))),b=points.map(p=>p.map((v,i)=>v-(i===axis?thickness/2:0)));
      face(a,n,'hardware');face(b,mul(n,-1),'hardware');
      for(let i=0;i<3;i++){const j=(i+1)%3;face([a[i],a[j],b[j],b[i]],norm(cross(a[j].map((v,k)=>v-a[i][k]),n)),'hardware');}
    }
    function structuralDetails(){
      const first=faces.length;
      for(const x of [-1080,1080]){
        const side=x<0?-1:1;
        for(const px of [x-23,x+23]){
          triangularPlate([[px,200,-140],[px,380,-140],[px,200,80]],0,6);
          for(const [y,z] of [[275,-100],[330,-100],[200,0],[200,55]])cylinder(px+(px>x?4:-4),y,z,6,4,0,'frame');
        }
        for(const y of [1090,1510,1730]){
          const edge=x-side*38;
          const joint=faces.length;box(edge,y,-144,116,76,6,'hardware');for(let i=joint;i<faces.length;i++)faces[i].tvJointPlate=true;
          for(const dx of [-38,0,38])for(const dy of [-20,20]){
            cylinder(edge+dx,y+dy,-149,5,4,2,'frame');
            if(Math.abs(edge+dx)<1060)cylinder(edge+dx,y+dy,-130.5,7,21,2,'hardware');
          }
        }
        const hx=x+side*55;
        cylinder(hx,780,-35,9,180,1,'rubber');
        for(const y of [690,870])strut([x,y,-60],[hx,y,-35],16,16,'hardware');
      }
      for(const [a,b,z] of [[[-1080,900],[1080,1780],-150],[[1080,900],[-1080,1780],-154]]){
        const begin=faces.length;strut([a[0],a[1],z],[b[0],b[1],z],30,3,'hardware');for(let i=begin;i<faces.length;i++)faces[i].tvCrossBrace=true;
        for(const p of [a,b]){box(p[0],p[1],z,48,p[1]>1700?36:55,6,'hardware');for(const dy of p[1]>1700?[-10,10]:[-16,16]){cylinder(p[0],p[1]+dy,z-5,5,4,2,'frame');const gap=-140-z-3;cylinder(p[0],p[1]+dy,-140-gap/2,7,gap,2,'hardware');}}
      }
      for(const x of [-900,900])for(const z of [-340,340]){
        box(x,194,z,68,12,68,'hardware');cylinder(x,118,z,6,164,1,'frame');cylinder(x,32,z,25,8,1,'rubber');cylinder(x,174,z,12,10,1,'hardware');
      }
      for(let i=first;i<faces.length;i++)faces[i].structuralDetail=true;
    }
    function controller(x,y){
      ball(x,y,-226,84,44,31,'controllerWhite');
      for(const s of [-1,1]){
        strut([x+s*59,y-14,-224],[x+s*72,y-73,-237],37,37,'controllerWhite');
        box(x+s*55,y+41,-220,23,10,24,'screen');
        box(x+s*59,y-75,-220,15,6,84,'pink');
        box(x+s*59,y-68,-262,15,18,6,'pink');
      }
      box(x,y-6,-258,70,58,3,'screen');box(x,y+17,-260,67,29,3,'controllerWhite');
      for(const dx of [-25,25])cylinder(x+dx,y-29,-265,9,9,2,'rubber');
      box(x-56,y+1,-258,23,7,5,'screen');box(x-56,y+1,-258,7,23,5,'screen');
      for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5])cylinder(x+56+Math.cos(a)*12,y+1+Math.sin(a)*12,-258,3.6,5,2,'hardware');
    }
    function storageBasket(cx,bottom,w,deep){
      const rear=-177,front=rear-deep;
      box(cx,bottom+4,(front+rear)/2,w,8,deep,'pegEdge');
      for(const y of [bottom+8,bottom+140])for(const z of [rear,front])strut([cx-w/2,y,z],[cx+w/2,y,z],4,4,'basket');
      for(let x=cx-w/2;x<=cx+w/2;x+=40)for(const z of [rear,front])strut([x,bottom+8,z],[x,bottom+140,z],3,3,'basket');
      for(const x of [cx-w/2,cx+w/2]){for(const y of [bottom+8,bottom+140])strut([x,y,rear],[x,y,front],4,4,'basket');for(const z of [rear,front])strut([x,bottom+8,z],[x,bottom+140,z],4,4,'basket');}
    }
    function storage(){
      const first=faces.length;
      buildingBoard=true;
      for(const x of [-600,0,600]){
        box(x,1210,-176.25,600,P.pegHeight,1.5,{base:'pegEdge','2:-1':'pegboard','2:1':'pegboard'});
        const fold=faces.length;for(const y of [760.75,1659.25])box(x,y,-166.5,600,1.5,18,'pegEdge');for(let i=fold;i<faces.length;i++)faces[i].boardFold=true;
      }
      const fold=faces.length;for(const x of [-899.25,-300,300,899.25])box(x,1210,-166.5,1.5,900,18,'pegEdge');for(let i=fold;i<faces.length;i++)faces[i].boardFold=true;
      buildingBoard=false;
      for(const x of [-850,-350,-250,250,350,850])for(const y of [1000,1420]){
        cylinder(x,y,-147.75,11,55.5,2,'hardware');
        cylinder(x,y,-181,8,8,2,'pink');
      }
      controller(430,1410);controller(740,1410);
      box(0,1410,-235,235,134,22,{base:'hardware','2:-1':'screen'});
      for(const s of [-1,1]){
        box(s*136,1410,-235,35,134,28,s<0?'pink':'joyBlue');
        cylinder(s*136,1410+s*26,-253,8,8,2,'screen');
        for(const dx of [-7,7])cylinder(s*136+dx,1410-s*24,-251,2.5,5,2,'screen');
        box(s*96,1335,-220,14,8,86,'pink');box(s*96,1341,-263,14,18,6,'pink');
      }
      storageBasket(0,900,460,140);
      box(0,967,-245,230,110,60,'case');
      storageBasket(-600,1320,430,130);
      box(-680,1383,-245,85,110,32,'controllerWhite');
      box(-560,1369,-245,94,82,42,'joyBlue');
      for(const x of [-760,-580,-400]){
        box(x,1135,-185,18,26,16,'pink');strut([x,1135,-190],[x,1121,-254],8,8,'pink');
        for(let i=0;i<18;i++){
          const a=i*2*Math.PI/18,b=(i+1)*2*Math.PI/18;
          strut([x+46*Math.cos(a),1070+46*Math.sin(a),-265],[x+46*Math.cos(b),1070+46*Math.sin(b),-265],7,7,'rubber');
        }
        box(x-7,1095,-275,14,24,6,'hardware');
      }
      for(const x of [430,740]){box(x,1080,-185,20,24,16,'pink');strut([x,1080,-190],[x,1068,-240],7,7,'pink');}
      for(let i=first;i<faces.length;i++)faces[i].p=faces[i].p.map(p=>[p[0],p[1]+P.pegBottom-760,p[2]]);
    }
    function consoleShelf(){
      const first=faces.length,lift=P.trayTop-150;
      function rounded(w,h,r){
        const points=[];
        for(const [cx,cy,start] of [[w/2-r,h/2-r,0],[-w/2+r,h/2-r,90],[-w/2+r,-h/2+r,180],[w/2-r,-h/2+r,270]]){
          for(let i=0;i<=5;i++){const a=(start+i*18)*Math.PI/180;points.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
        }
        return points;
      }
      function prismXY(x,y,z,w,h,d,r,mat){
        const outline=rounded(w,h,r),front=outline.map(p=>[x+p[0],y+p[1],z-d/2]),back=outline.map(p=>[x+p[0],y+p[1],z+d/2]);
        face(front,[0,0,-1],mat,{edge:false});face(back,[0,0,1],mat,{edge:false});
        for(let i=0;i<outline.length;i++){
          const j=(i+1)%outline.length,a=outline[i],b=outline[j];
          face([front[i],front[j],back[j],back[i]],norm([b[1]-a[1],a[0]-b[0],0]),mat,{edge:false});
        }
      }
      function planPrism(x,y,z,w,d,h,r,mat){
        const ring=rounded(w,d,r),top=ring.map(p=>[x+p[0],y+h/2,z+p[1]]),bottom=ring.map(p=>[x+p[0],y-h/2,z+p[1]]);
        face(top,[0,1,0],mat,{edge:false});face(bottom,[0,-1,0],mat,{edge:false});
        for(let i=0;i<ring.length;i++){const j=(i+1)%ring.length,a=ring[i],b=ring[j];face([top[i],top[j],bottom[j],bottom[i]],norm([b[1]-a[1],0,a[0]-b[0]]),mat,{edge:false});}
      }
      function segments(lo,hi,cuts){let a=[[lo,hi]];for(const [l,r] of cuts)a=a.flatMap(([x,y])=>r<=x||l>=y?[[x,y]]:[[x,Math.min(l,y)],[Math.max(r,x),y]].filter(p=>p[1]>p[0]));return a;}
      for(let x=-700;x<=700;x+=100){const cuts=[];if(x>=-610&&x<=-90)cuts.push([-180,180]);if(x>=270&&x<=450)cuts.push([-30,150]);for(const [a,b] of segments(-300,300,cuts))box(x,145,(a+b)/2,3,6,b-a,'frame',{edge:false});}
      for(let z=-280;z<=280;z+=70){const cuts=[];if(z>=-180&&z<=180)cuts.push([-610,-90]);if(z>=-30&&z<=150)cuts.push([270,450]);for(const [a,b] of segments(-720,720,cuts))box((a+b)/2,145,z,b-a,6,3,'frame',{edge:false});}
      const supportStart=faces.length;
      for(const z of [-280,280])beam(0,120,z,1480,40,40);
      for(const x of [-700,-600,-350,-100,300,420,700])beam(x,120,0,40,40,520);
      for(const x of [-600,-350,-100])for(const z of [-120,120])box(x,142.5,z,36,5,28,'rubber',{edge:false});
      for(const x of [300,420])for(const z of [20,100])box(x,142.5,z,36,5,28,'rubber',{edge:false});
      for(let i=supportStart;i<faces.length;i++)faces[i].lowerLoadSupport=true;
      for(const x of [-717,717])box(x,145,0,6,8,600,'pink',{edge:false});
      for(const z of [-297,297])box(0,145,z,1440,8,6,'pink',{edge:false});
      for(const y of [154,288])strut([-700,y,260],[700,y,260],4,4,'basket');
      for(let x=-700;x<=700;x+=70)strut([x,154,260],[x,288,260],3,3,'basket');
      for(const x of [-700,700]){
        for(const y of [154,288])strut([x,y,-260],[x,y,260],4,4,'basket');
        for(let z=-260;z<=260;z+=65)strut([x,154,z],[x,288,z],3,3,'basket');
      }
      for(const x of [-700,0,700])strut([x,154,-260],[x,288,-260],4,4,'basket');
      for(const cx of [-350,350]){
        const first=faces.length,lo=cx-344,hi=cx+344;
        for(const y of [154,288])strut([lo,y,-260],[hi,y,-260],4,4,'basket');
        for(let x=lo;x<=hi;x+=68.8)strut([x,154,-260],[x,288,-260],3,3,'basket');
        box(cx+(cx<0?329:-329),284,-264,10,12,6,'pink');
        for(let i=first;i<faces.length;i++){
          const f=faces[i];f.gatePanel=true;
          if(state.gateOpen){f.p=f.p.map(p=>[p[0],154+(p[2]+260),-260-(p[1]-154)]);f.n=[f.n[0],f.n[2],-f.n[1]];}
        }
        for(const dx of [-260,260])cylinder(cx+dx,154,-260,6,12,0,'hardware');
      }
      buildingPad=true;
      planPrism(P.consoleX,147.5,0,520,360,5,12,'shelf');
      planPrism(360,147.5,60,180,180,5,12,'shelf');
      buildingPad=false;
      box(0,142,-220,1320,10,20,'hardware',{edge:false});
      const deviceStart=faces.length;
      cylinder(-80,238,-155,58,34,1,'rubber');
      cylinder(120,227,-85,34,12,1,'rubber');
      const consoleStart=faces.length;
      prismXY(0,288,-150,350,48,232,14,'case');
      prismXY(110,248,-153.5,144,30,227,8,'controllerWhite');
      function shell(upper){
        buildingConsoleTop=upper;
        const y=u=>upper?319+18*Math.pow(u,4):254-21*Math.exp(-Math.pow((u-.6)/.38,4))+3*Math.pow(Math.abs(u),1.5);
        const edge=Array.from({length:17},(_,i)=>-1+i/8),delta=upper?-4:4;
        const front=u=>[u*195,y(u),-280+10*(1-u*u)],rear=u=>[u*195,y(u),-20-12*(1-u*u)];
        const perimeter=edge.map(front).concat(edge.slice().reverse().map(rear));
        face(perimeter,[0,upper?1:-1,0],'controllerWhite',{edge:false});
        face(perimeter.map(p=>[p[0],p[1]+delta,p[2]]),[0,upper?-1:1,0],'controllerWhite',{edge:false});
        for(let i=0;i<16;i++){
          const u=edge[i],v=edge[i+1],outer=[front(u),front(v),rear(v),rear(u)],inner=outer.map(p=>[p[0],p[1]+delta,p[2]]);
          face([outer[0],outer[1],inner[1],inner[0]],[0,0,-1],'controllerWhite',{edge:false});
          face([outer[2],outer[3],inner[3],inner[2]],[0,0,1],'controllerWhite',{edge:false});
          if(i===0)face([outer[0],inner[0],inner[3],outer[3]],[-1,0,0],'controllerWhite',{edge:false});
          if(i===15)face([outer[1],outer[2],inner[2],inner[1]],[1,0,0],'controllerWhite',{edge:false});
        }
        buildingConsoleTop=false;
      }
      shell(true);shell(false);
      box(110,247,-267.7,108,2.4,1.4,'rubber',{edge:false});
      for(const x of [-120,-82])box(x,286,-267.2,12,5,2,'hardware',{edge:false});
      for(const x of [-158,-148])box(x,276,-267.2,3,7,2,'hardware',{edge:false});
      for(const x of [-92,92])box(x,314,-267,92,1.4,1.5,'joyBlue',{edge:false});
      for(let i=consoleStart;i<faces.length;i++)faces[i].consoleBody=true;
      const move=p=>[P.consoleX-p[0],p[1]+150-221,-(p[2]+150)];
      for(let i=deviceStart;i<faces.length;i++){const f=faces[i];f.ps5Assembly=true;f.p=f.p.map(move);f.n=[-f.n[0],f.n[1],-f.n[2]];}
      const appleStart=faces.length;
      planPrism(360,165.5,60,93,93,31,12,'case');
      for(let i=appleStart;i<faces.length;i++)faces[i].appleTV=true;
      box(388,161,107,2.2,2.2,1,'controllerWhite',{edge:false});
      const cable=[[-490,215,-117],[-510,205,-160],[-560,162,-205],[-660,145,-210]];
      const cableStart=faces.length;
      for(let i=0;i<cable.length-1;i++)strut(cable[i],cable[i+1],5,5,'rubber');
      for(let i=cableStart;i<faces.length;i++)faces[i].ps5Wire=true;
      for(const x of [-650,-350,-130,130,350,650]){
        beam(x,422,30,20,20,380);
        box(x,433,30,20,2,340,'rubber',{edge:false});
        for(const z of [-150,210])box(x,411.5,z,36,3,24,'hardware',{edge:false});
        for(const z of [-158.5,218.5])box(x,423,z,36,24,3,'hardware',{edge:false});
      }
      for(const sign of [-1,1]){
        const ring=displayOutline.map(p=>[sign<0?p[0]:-p[0],p[1]]);
        const top=ring.map(p=>[p[0],P.displayTop-lift,p[1]]),bottom=ring.map(p=>[p[0],P.displayBottom-lift,p[1]]);
        buildingShelf=true;
        face(top,[0,1,0],'acrylic',{edge:false});face(bottom,[0,-1,0],'acrylic',{edge:false});
        for(let i=0;i<ring.length;i++){const j=(i+1)%ring.length,a=ring[i],b=ring[j];face([top[i],top[j],bottom[j],bottom[i]],mul(norm([b[1]-a[1],0,a[0]-b[0]]),sign<0?1:-1),'acrylicEdge',{edge:false});}
        buildingShelf=false;
      }
      for(const x of [-650,-130,130,650])for(const [edge,side] of [[-150,-1],[210,1]]){
        box(x,441,edge-side*3,18,2,12,'hardware',{edge:false});box(x,436,edge+side*3,18,10,3,'hardware',{edge:false});
      }
      const dollStart=faces.length;
      for(let i=0;i<4;i++)toy(-540+i*360,P.displayTop-lift,P.displayCenterZ,180/195,['toyPink','toyCream','toyMint','toyPink'][i]);
      for(let i=dollStart;i<faces.length;i++)faces[i].displayToy=true;
      for(let i=first;i<faces.length;i++)faces[i].p=faces[i].p.map(p=>[p[0],p[1]+lift,p[2]]);
    }
    function build(){
      faces=[];cableRuns=[];sideHoles=[];buildingTV=false;buildingBoard=false;buildingConsoleTop=false;buildingShelf=false;buildingPad=false;
      for(const x of [-1175,1175]){beam(x,P.baseCenter,0,40,80,780);for(const z of [-395,395])box(x,P.baseCenter,z,50,84,10,'pink');}
      for(const z of [-340,340])beam(0,P.baseCenter,z,2310,80,40);
      for(const x of [-1080,-760,760,1080])beam(x,P.baseCenter,0,40,80,640);
      for(const x of [-1080,1080]){
        beam(x,1020,-100,40,1560,80);box(x,1806,-100,50,12,90,'pink');
        box(x,1017,-56,28,1540,4,'acrylicPink',{edge:false});
        for(const y of [360,720,1120,1570,1760])cylinder(x,y,-51,4,6,2,'hardware');
        for(const dx of [-12,0,12])cylinder(x+dx,1840,-100,1.8,80,1,'pink');
        for(const z of [-350,350]){const start=z>0?-42:-158;strut([x,920,start],[x,260,z],30,30,'frame');box(x,920,z>0?-50:-150,40,42,20,'hardware');box(x,250,z,40,20,40,'hardware');}
        for(const yy of [520,1090,1510,1730]){
          box(x,yy,-56,32,26,6,'hardware');
          cylinder(x,yy,-51,4,4,2,'frame');
        }
        for(const y of [830,1050]){
          box(x,y-9,0,20,12,200,'hardware');sideAcrylic(x,y);
          const toyStart=faces.length;
          toy(x+(x<0?-15:15),y+3,110,.62,y===830?'toyPink':'toyCream');
          for(let i=toyStart;i<faces.length;i++)faces[i].sideToy=true;
        }
      }
      for(const y of [1090,1510,1730])beam(0,y,-100,2120,80,40);
      for(const x of [-300,300]){
        box(x,P.tvCenter,-24.5,60,560,16,'hardware');
        for(const y of [1090,1510]){box(x,y,-56.25,60,32,47.5,'hardware');for(const dx of [-16,16])cylinder(x+dx,y,-31,5,4,2,'frame');}
        box(x,P.tvCenter-267,-27,42,12,10,'pink');
      }
      for(const z of [-180,240]){const start=faces.length;beam(0,P.upperFrameY,z,2120,40,40);for(let i=start;i<faces.length;i++)faces[i].upperRail=z<0?'rear':'front';}
      for(const x of [-1080,1080]){beam(x,P.upperFrameY,-170,40,40,60);beam(x,P.upperFrameY,100,40,40,320);}
      for(const x of [-760,760]){
        for(const z of [-180,240]){beam(x,370,z,40,260,40);if(z>0)box(x,543,z,44,6,44,'pink');}
      }
      consoleShelf();
      bridgeStays();
      for(const x of [-1080,1080])for(const z of [-280,280]){
        box(x,155,z,160,10,160,'hardware');
        wheel(x,z,z<0?-.25:.25);
      }
      structuralDetails();
      if(state.board)storage();
      if(state.tv){
        buildingTV=true;
        box(0,P.tvCenter,P.tvCenterZ,P.tvWidth,P.tvHeight,P.tvDepth,{base:'case','2:1':'screen'});
        for(let i=-8;i<=8;i++)box(i*24,P.tvCenter-220,P.tvCenterZ-26.6,9,70,.2,'rubber',{edge:false});
        buildingTV=false;
      }
      return faces;
    }
    function project(p){
      const x=p[0],y=p[1]-(state.detail?480:925),z=p[2],cy=Math.cos(state.yaw),sy=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch);
      const xx=cy*x-sy*z,yy=-sy*sp*x+cp*y-cy*sp*z,depth=sy*cp*x+sp*y+cy*cp*z;
      const f=8000/(8000-depth),scale=Math.min((width-62)/2700,(height-65)/2170)*state.zoom*(state.detail?1.8:1);
      return[width/2+xx*scale*f,height*.51-yy*scale*f,depth];
    }
    function path(ps){ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();}
    function paint(f){
      const ps=f.p.map(project);path(ps);
      const base=palette[f.mat]||palette.frame,light=Math.max(0,dot(f.n,[-.40,.78,.48])),l=f.mat==='controllerWhite'?.91+light*.12:.72+light*.39;
      if(f.mat==='pegboard'){
        ctx.fillStyle=rgb(mul(base,l));ctx.fill();ctx.save();path(ps);ctx.clip();
        const zz=f.p[0][2];ctx.fillStyle=rgb(palette.hole);
        for(let x=-870;x<=870;x+=40)for(let y=790;y<=1630;y+=40){
          path([[x-4,y-8,zz],[x+4,y-8,zz],[x+4,y+8,zz],[x-4,y+8,zz]].map(project));ctx.fill();
        }
        if(f.n[2]<0){
          ctx.font='400 11px '+getComputedStyle(root).fontFamily;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=rgb(palette.fg);
          for(const [x,name]of [[600,width<450?'手柄':'PS5 手柄'],[0,width<450?'Switch':'Switch 配件'],[-600,width<450?'理线':'小件 / 理线']]){
            const q=project([x,1597,zz]);ctx.fillText(name,q[0],q[1]);
          }
        }
        ctx.restore();
      }else if(['acrylic','acrylicEdge','acrylicPink','acrylicPinkEdge'].includes(f.mat)){
        ctx.save();ctx.globalAlpha=f.mat.endsWith('Edge')?.82:(f.mat==='acrylicPink'?.28:(f.n[1]<0?.04:.16));ctx.fillStyle=rgb(mul(base,l));ctx.fill();ctx.restore();
      }else if(f.mat==='screen'){
        const xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]),g=ctx.createLinearGradient(Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys));
        g.addColorStop(0,rgb(mix(palette.screen,palette.frame,.06)));g.addColorStop(.44,rgb(palette.screen));g.addColorStop(1,rgb(mix(palette.screen,palette.frame,.11)));
        ctx.fillStyle=g;ctx.fill();ctx.save();path(ps);ctx.clip();
        const q=project([0,P.tvBottom+17,P.tvCenterZ+26.5]);ctx.font='400 '+Math.max(7,Math.min(10,width*.013))+'px sans-serif';ctx.fillStyle=rgb(mix(palette.screen,palette.frame,.6));ctx.textAlign='center';ctx.fillText('Hisense',q[0],q[1]);ctx.restore();
      }else{ctx.fillStyle=rgb(mul(base,l));ctx.fill();}
      if(f.edge){path(ps);ctx.strokeStyle=rgb(mix(base,palette.screen,.4));ctx.lineWidth=f.mat==='screen'?1:.55;ctx.stroke();}
      if(f.groove){path(f.groove.map(project));ctx.fillStyle=rgb(palette.slot);ctx.fill();}
    }
    function label(text,x,y){
      ctx.save();ctx.font='400 12px '+getComputedStyle(root).fontFamily;const tw=ctx.measureText(text).width;
      x=Math.max(tw/2+6,Math.min(width-tw/2-6,x));y=Math.max(14,Math.min(height-14,y));
      ctx.globalAlpha=.90;ctx.fillStyle=rgb(palette.bg);ctx.fillRect(x-tw/2-5,y-9,tw+10,18);ctx.globalAlpha=1;ctx.fillStyle=rgb(palette.fg);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y);ctx.restore();
    }
    function dim(a,b,text,off){
      const p=project(a),q=project(b);if(Math.hypot(p[0]-q[0],p[1]-q[1])<20)return;
      ctx.strokeStyle=rgb(mix(palette.bg,palette.fg,.65));ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
      const angle=Math.atan2(q[1]-p[1],q[0]-p[0])+.8;
      for(const t of [p,q]){ctx.beginPath();ctx.moveTo(t[0]-Math.cos(angle)*4,t[1]-Math.sin(angle)*4);ctx.lineTo(t[0]+Math.cos(angle)*4,t[1]+Math.sin(angle)*4);ctx.stroke();}
      label(text,(p[0]+q[0])/2+(off?off[0]:0),(p[1]+q[1])/2+(off?off[1]:0));
    }
    function splitAtScreen(points,z,sign,near,axis){
      const ax=axis===undefined?2:axis;
      const out=[];
      for(let i=0;i<points.length;i++){
        const a=points[i],b=points[(i+1)%points.length],da=(a[ax]-z)*sign,db=(b[ax]-z)*sign;
        const ia=near?da>0:da<=0,ib=near?db>0:db<=0;
        if(ia)out.push(a);
        if(ia!==ib){const t=(z-a[ax])/(b[ax]-a[ax]);out.push(a.map((v,j)=>v+(b[j]-v)*t));}
      }
      return out;
    }
    function paintSorted(list){
      list.forEach(f=>f.depth=f.p.reduce((s,p)=>s+project(p)[2],0)/f.p.length);
      list.sort((a,b)=>a.depth-b.depth).forEach(paint);
    }
    function paintScene(list,layers){
      if(!layers.length){paintSorted(list);return;}
      const layer=layers[0],rest=layers.slice(1),own=list.filter(f=>f[layer.key]);
      if(!own.length){paintScene(list,rest);return;}
      const near=[],far=[];
      for(const f of list.filter(f=>!f[layer.key]))for(const isNear of [false,true]){
        const p=splitAtScreen(f.p,layer.z,layer.sign,isNear,layer.axis);
        if(p.length>=3){const copy={...f,p};if(f.groove){const g=splitAtScreen(f.groove,layer.z,layer.sign,isNear,layer.axis);copy.groove=g.length>=3?g:null;}(isNear?near:far).push(copy);}
      }
      paintScene(far,rest);paintSorted(own);paintScene(near,rest);
    }
    function draw(){
      scheduled=false;if(!palette||!width||!height)return;ctx.clearRect(0,0,width,height);
      path([[-1270,0,-440],[1270,0,-440],[1270,0,440],[-1270,0,440]].map(project));ctx.fillStyle=rgb(palette.fg);ctx.globalAlpha=.035;ctx.fill();ctx.globalAlpha=1;
      const camera=[Math.sin(state.yaw)*Math.cos(state.pitch)*8000,Math.sin(state.pitch)*8000+(state.detail?480:925),Math.cos(state.yaw)*Math.cos(state.pitch)*8000];
      const visible=faces.filter(f=>{const c=f.p.reduce((s,p)=>add(s,mul(p,1/f.p.length)),[0,0,0]);return dot(f.n,camera.map((v,i)=>v-c[i]))>0;});
      const layers=[];
      if(state.tv){const sign=camera[2]>P.tvCenterZ?1:-1;layers.push({key:'tv',sign,z:P.tvCenterZ+sign*P.tvDepth/2});}
      if(state.board){const sign=camera[2]>-172?1:-1;layers.push({key:'board',sign,z:sign>0?P.pegFront:P.pegRear});}
      const shellY=313.5+P.trayTop-221;
      layers.push({key:'consoleTop',sign:camera[1]>shellY?1:-1,z:shellY,axis:1});
      const shelfAbove=camera[1]>(P.displayTop+P.displayBottom)/2;
      layers.push({key:'shelfSurface',sign:shelfAbove?1:-1,z:shelfAbove?P.displayTop:P.displayBottom,axis:1});
      layers.push({key:'padSurface',sign:camera[1]>P.trayTop-2.5?1:-1,z:camera[1]>P.trayTop-2.5?P.trayTop:P.trayTop-5,axis:1});
      layers.sort((a,b)=>Math.abs(camera[a.axis===undefined?2:a.axis]-a.z)-Math.abs(camera[b.axis===undefined?2:b.axis]-b.z));paintScene(visible,layers);
      if(state.dims&&state.detail){
        dim([-720,210,330],[720,210,330],'设备篮 1440',[0,18]);
        dim([850,P.trayTop,0],[850,P.upperBeamBottom,0],'净高 250',[28,0]);
      }else if(state.dims){
        const c=Math.cos(state.yaw),s=Math.sin(state.yaw),z=c>=0?220:-180;
        if(Math.abs(c)>.30)dim([-1200,1970,z],[1200,1970,z],'2400');
        if(Math.abs(c)>=Math.abs(s)){const x=c>=0?-1320:1320;dim([x,0,z],[x,1880,z],'1880',[-10,0]);}
        else{const x=s>=0?1170:-1170,zz=s>=0?485:-485;dim([x,0,zz],[x,1880,zz],'1880',[-10,0]);}
        if(Math.abs(s)>.25){const x=s>=0?1260:-1260;dim([x,0,-400],[x,0,400],'800',[6,12]);}
      }
    }
    function requestDraw(){if(!scheduled){scheduled=true;requestAnimationFrame(draw);}}
    function resize(){const r=stage.getBoundingClientRect();if(r.width<1)return;width=r.width;height=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*d);canvas.height=Math.round(height*d);ctx.setTransform(d,0,0,d,0,0);requestDraw();}
    function status(){
      const names={perspective:'透视',front:'正面',rear:'背面',side:'侧面',console:'下部两层',free:'自由视角'};root.querySelector('#tv-status').textContent=names[state.view]+' · '+(state.detail?(state.gateOpen?'后网门已翻下':'后网门关闭'):(state.board?'背面收纳':'隐藏收纳'))+(state.tv?'':' · 隐藏电视');
      root.querySelectorAll('[data-tv-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tvView===state.view)));
      root.querySelector('#tv-visible').checked=state.tv;root.querySelector('#tv-storage').checked=state.board;root.querySelector('#tv-dims').checked=state.dims;root.querySelector('#tv-gate').checked=state.gateOpen;root.querySelector('#tv-zoom').value=state.zoom;
    }
    function save(){if(window.openai&&window.openai.setWidgetState)window.openai.setWidgetState({modelContent:{design:'bridge-tv-v9',television:'海信85E7S-PRO',overall:[2400,800,1880],tvBody:[1890,1101,53],tvBottom:P.tvBottom,pegboard:[1800,900],lowerBasket:[1440,600],lowerFloor:P.trayTop,lowerClearHeight:250,upperDisplay:[700,360,6],upperDisplayHeight:P.displayTop,upperBeamClearDepth:380,panelEndGap:10,toyLimit:180,toyHeadroom:50,fanPylonsTop:P.fanTop,fanToTVGap:P.tvBottom-P.fanTop,fanCablePlane:P.fanCableZ,decorativeStays:{outer:4,fan:10},sideAcrylicHoles:[14,18],consoleReserve:[500,300,150],casters:{count:4,diameter:125,assemblyHeight:160,sweptRadiusLimit:115},floor:'柔光砖与约13mm地毯，毯边需缓坡过渡',status:'外观与结构布局方案，装饰拉线不计入承载，未完成实物承载与推行验证',gateOpen:state.gateOpen,view:state.view,showTV:state.tv,showStorage:state.board},privateContent:{design:'bridge-tv-v9',...state}}).catch(()=>{});}
    function restore(saved){const s=saved&&saved.privateContent;if(!s||!['bridge-tv-v8','bridge-tv-v9'].includes(s.design))return;for(const k of ['yaw','pitch','zoom'])if(Number.isFinite(s[k]))state[k]=s[k];state.pitch=Math.max(-.35,Math.min(.85,state.pitch));state.zoom=Math.max(.65,Math.min(1.7,state.zoom));state.tv=s.tv!==false;state.board=s.board!==false;state.dims=s.dims===true;state.gateOpen=s.gateOpen===true;state.detail=s.detail===true;if(['perspective','front','rear','side','console','free'].includes(s.view))state.view=s.view;build();status();requestDraw();}
    root.querySelectorAll('[data-tv-view]').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.tvView,a={perspective:[.36,.16],front:[0,0],rear:[Math.PI+.20,.15],side:[Math.PI/2,0],console:[.20,.60]}[v];state.yaw=a[0];state.pitch=a[1];state.view=v;state.detail=v==='console';state.zoom=1;status();requestDraw();save();}));
    root.querySelector('#tv-visible').addEventListener('change',e=>{state.tv=e.target.checked;build();status();requestDraw();save();});
    root.querySelector('#tv-storage').addEventListener('change',e=>{state.board=e.target.checked;build();status();requestDraw();save();});
    root.querySelector('#tv-gate').addEventListener('change',e=>{state.gateOpen=e.target.checked;if(state.gateOpen){state.view='console';state.detail=true;state.yaw=Math.PI+.28;state.pitch=.22;state.zoom=1;}build();status();requestDraw();save();});
    root.querySelector('#tv-dims').addEventListener('change',e=>{state.dims=e.target.checked;requestDraw();save();});
    root.querySelector('#tv-zoom').addEventListener('input',e=>{state.zoom=+e.target.value;requestDraw();});root.querySelector('#tv-zoom').addEventListener('change',save);
    const points=new Map();let pinch=0;
    canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);points.set(e.pointerId,{x:e.clientX,y:e.clientY});pinch=0;});
    canvas.addEventListener('pointermove',e=>{const p=points.get(e.pointerId);if(!p)return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===2){const a=Array.from(points.values()),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch)state.zoom=Math.max(.65,Math.min(1.7,state.zoom*d/pinch));pinch=d;}else{state.yaw-=(e.clientX-p.x)*.007;state.pitch=Math.max(-.35,Math.min(.85,state.pitch+(e.clientY-p.y)*.005));state.view='free';}status();requestDraw();});
    for(const ev of ['pointerup','pointercancel'])canvas.addEventListener(ev,e=>{points.delete(e.pointerId);pinch=0;save();});
    canvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=Math.max(.65,Math.min(1.7,state.zoom*Math.exp(-e.deltaY*.001)));status();requestDraw();},{passive:false});
    function drawing(kind,w){
      const s=Math.min((w-98)/2400,.16),left=(w-2400*s)/2,top=64,ground=top+1880*s,X=x=>left+(x+1200)*s,Y=y=>ground-y*s;
      let out='';const n=v=>Number(v.toFixed(2));
      function line(a,b,c,d,cl){out+='<line class="'+(cl||'outline')+'" x1="'+n(a)+'" y1="'+n(b)+'" x2="'+n(c)+'" y2="'+n(d)+'"/>';}
      function rect(a,b,c,d,cl,radius){out+='<rect class="'+cl+'" x="'+n(a)+'" y="'+n(b)+'" width="'+n(c)+'" height="'+n(d)+'"'+(radius?' rx="'+n(radius)+'"':'')+'/>';}
      function polygon(points,cl){out+='<polygon class="'+cl+'" points="'+points.map(p=>n(p[0])+','+n(p[1])).join(' ')+'"/>';}
      function wr(x,y,ww,hh,cl){rect(X(x),Y(y+hh),ww*s,hh*s,cl);}
      function text(x,y,t,rot){out+='<text x="'+n(x)+'" y="'+n(y)+'" text-anchor="middle"'+(rot?' transform="rotate('+rot+' '+n(x)+' '+n(y)+')"':'')+'>'+t+'</text>';}
      function arrow(x,y,a){for(const o of [-.4,.4])line(x,y,x+Math.cos(a+o)*4,y+Math.sin(a+o)*4,'dim');}
      function hd(a,b,y,ey,t){line(a,ey,a,y-4,'extension');line(b,ey,b,y-4,'extension');line(a,y,b,y,'dim');arrow(a,y,0);arrow(b,y,Math.PI);text((a+b)/2,y-6,t);}
      function vd(a,b,x,ex,t){line(ex,a,x+4,a,'extension');line(ex,b,x+4,b,'extension');line(x,a,x,b,'dim');arrow(x,a,Math.PI/2);arrow(x,b,-Math.PI/2);text(x-6,(a+b)/2,t,-90);}
      if(kind==='consoleTop'||kind==='consoleSide'){
        if(kind==='consoleTop'){
          const ds=(w-110)/1440,A=x=>w/2+x*ds,B=z=>62+(z+300)*ds;
          rect(A(-720),B(-300),1440*ds,600*ds,'outline');
          for(let x=-700;x<=700;x+=100)line(A(x),B(-260),A(x),B(260),'wire');
          for(let z=-260;z<=260;z+=65)line(A(-700),B(z),A(700),B(z),'wire');
          rect(A(-600),B(-150),500*ds,300*ds,'hidden-line');
          rect(A(-545),B(-130),390*ds,260*ds,'screen',10*ds);
          text(A(-350),B(0)+4,'PS5');
          rect(A(300),B(0),120*ds,120*ds,'hidden-line');
          rect(A(313.5),B(13.5),93*ds,93*ds,'accessory',10*ds);
          line(A(360),B(13.5),A(360),B(-100),'extension');text(A(360),B(-140),'Apple TV');
          line(A(-700),B(-260),A(-6),B(-260),'pink');line(A(6),B(-260),A(700),B(-260),'pink');
          hd(A(-720),A(720),27,B(-300),'设备篮 1440');
          vd(B(-300),B(300),A(-720)-26,A(-720),'600');
          text(w/2,B(300)+32,'PS5 连底座预留 500 × 300');
          text(w/2,B(300)+51,'两片后网门 · 从后侧取放设备');
          return '<svg class="tv-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+n(w)+' '+n(B(300)+68)+'" role="img" aria-label="下层设备篮俯视详图，1440乘600，PS5连底座预留500乘300，Apple TV预留120乘120。后侧两片网门可打开，单位毫米。"><title>下层设备篮俯视详图，单位毫米</title>'+out+'</svg>';
        }
        const ds=(w-110)/800,A=z=>w/2+z*ds,B=y=>66+(820-y)*ds;
        rect(A(-400),B(240),800*ds,80*ds,'profile');
        rect(A(-300),B(250),600*ds,8*ds,'pink');
        rect(A(-260),B(390),520*ds,136*ds,'outline');
        rect(A(-150),B(400),300*ds,150*ds,'hidden-line');
        rect(A(-130),B(366),260*ds,104*ds,'screen',8*ds);
        for(const z of [-180,240])rect(A(z-20),B(P.displayTop),40*ds,40*ds,'profile');
        rect(A(-150),B(P.displayTop),P.displayDepth*ds,6*ds,'acrylic');
        rect(A(P.fanCableZ-20),B(P.fanTop-12),40*ds,(P.fanTop-12-P.displayTop)*ds,'profile');
        rect(A(P.fanCableZ-23),B(P.fanTop),46*ds,12*ds,'pink');
        line(A(P.fanCableZ),B(P.fanCableY),A(P.fanCableZ),B(P.fanAnchorY),'stay');
        rect(A(-20),B(720),100*ds,180*ds,'hidden-line');
        rect(A(-160),B(532),380*ds,20*ds,'profile');
        rect(A(P.tvCenterZ-26.5),B(810),53*ds,40*ds,'screen');
        line(A(-260),B(254),A(-394),B(254),'hidden-line');
        hd(A(-300),A(300),27,B(820),'篮深 600');
        vd(B(P.upperBeamBottom),B(P.trayTop),A(-400)-26,A(-260),'250');
        vd(B(P.tvBottom),B(P.displayTop),A(400)+27,A(P.tvCenterZ+26.5),'230');
        vd(B(500),B(400),A(-40),A(-160),'100');
        text(A(0),B(314)+4,'PS5');
        text(w/2,B(0)+32,'下层面高 250 · 上层齐平高 540');
        text(w/2,B(0)+51,'板深 360 · 前后各留 10');
        text(w/2,B(0)+70,'180 手办 · 电视下方再余 50');
        text(w/2,B(0)+89,'拉线塔顶 740 · 距电视下沿 30');
        return '<svg class="tv-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+n(w)+' '+n(B(0)+106)+'" role="img" aria-label="双层净空侧视详图，下层面250到横梁下缘500净高250；亚克力板深360，梁内净深380，前后各留10，面高540；到电视下沿770净高230，可放180高手办并留50。后侧拉线塔顶740，与电视下沿相距30，扇形拉线位于手办后方。后网门可翻下，单位毫米。"><title>双层净空与拉线侧视详图，单位毫米</title>'+out+'</svg>';
      }
      function frontFrame(){
        wr(-1195,P.baseBottom,2390,80,'profile');
        for(const x of [-1080,1080]){wr(x-20,240,40,1560,'profile');wr(x-25,1800,50,12,'pink');for(const dx of [-12,0,12])line(X(x+dx),Y(1800),X(x+dx),Y(1880),'wire');}
        for(const x of [-1080,1080]){const s=x<0?-1:1;wr(x-14,247,28,1540,'acrylic-pink');const run=outerStay(x,350);line(X(run.a[0]),Y(run.a[1]),X(run.b[0]),Y(run.b[1]),'stay');}
        for(const x of [-760,760]){wr(x-20,240,40,260,'profile');wr(x-22,540,44,6,'pink');}
        wr(-1060,P.upperBeamBottom,2120,40,'profile');wr(-720,242,1440,8,'pink');
        const flip=kind==='rear'?-1:1,cx=flip*P.consoleX;
        wr(cx-195,262,390,104,'screen');wr(flip*360-46.5,250,93,31,'accessory');
        for(const yy of [254,388])line(X(-700),Y(yy),X(700),Y(yy),'wire');for(let xx=-700;xx<=700;xx+=70)line(X(xx),Y(254),X(xx),Y(388),'wire');
        wr(-720,P.displayBottom,700,6,'acrylic');wr(20,P.displayBottom,700,6,'acrylic');
        for(const x of [-540,-180,180,540])wr(x-45,P.displayTop,90,180,'hidden-line');
        for(const x of [-P.fanPylonX,P.fanPylonX]){
          const s=x<0?-1:1;wr(x-20,P.displayTop,40,P.fanTop-12-P.displayTop,'profile');wr(x-23,P.fanTop-12,46,12,'pink');
          for(const target of [620,485,350,215,80])line(X(x-s*26),Y(P.fanCableY),X(s*target),Y(P.fanAnchorY),'stay');
        }
        for(const x of [-1080,1080]){wr(x-80,150,160,10,'profile');wr(x-18,0,36,125,'profile');}
        for(const x of [-900,900]){wr(x-6,36,12,164,'profile');wr(x-25,28,50,8,'profile');}
        for(const x of [-1080,1080])for(const y of [830,1050])wr(x-120,y-3,240,6,'acrylic-pink');
      }
      if(kind==='front'||kind==='rear'){
        if(kind==='rear')wr(-P.tvWidth/2,P.tvBottom,P.tvWidth,P.tvHeight,'screen');
        frontFrame();
        if(kind==='front'){
          wr(-P.tvWidth/2,P.tvBottom,P.tvWidth,P.tvHeight,'screen');
          text(w/2,Y(1300),'海信 85E7S-PRO');text(w/2,Y(1110),'1890 × 1101');
          hd(X(-945),X(945),Y(1840),Y(P.tvTop),'1890');
          vd(Y(P.tvCenter),Y(0),X(1200)+30,X(1200),'中心高 '+P.tvCenter);
        }else{
          for(const y of [1090,1510,1730])wr(-1060,y-40,2120,80,'profile');
          for(const x of [-300,300])wr(x-19,P.tvCenter-280,38,560,'profile');
          line(X(-1080),Y(900),X(1080),Y(1780),'wire');line(X(1080),Y(900),X(-1080),Y(1780),'wire');
          wr(-900,P.pegBottom,P.pegWidth,P.pegHeight,'peg');
          for(const x of [-300,300])line(X(x),Y(P.pegBottom),X(x),Y(P.pegTop),'outline');
          for(let x=-870;x<=870;x+=40)for(let y=880;y<=1720;y+=40)wr(x-4,y-8,8,16,'peg-hole');
          const B=(x,y,ww,hh,cl)=>wr(x,y+90,ww,hh,cl);
          for(const cx of [430,740]){
            const px=-cx;
            B(px-83,1375,166,70,'screen');
            for(const side of [-1,1])B(px+side*59-18,1337,36,62,'screen');
            B(px-31,1380,62,45,'accessory');
          }
          B(-117.5,1343,235,134,'accessory');for(const x of [-153.5,118.5])B(x,1343,35,134,'pink');
          B(-230,900,460,140,'pink');B(-115,912,230,110,'accessory');
          B(385,1320,430,140,'pink');B(637.5,1328,85,110,'screen');B(513,1328,94,82,'accessory');
          for(const x of [-760,-580,-400]){
            out+='<circle class="outline" cx="'+n(X(-x))+'" cy="'+n(Y(1160))+'" r="'+n(46*s)+'"/>';
            B(-x-9,1122,18,26,'pink');
          }
          for(const [x,label] of [[-600,'手柄'],[0,'Switch'],[600,'理线']])text(X(x),Y(1687),label);
          hd(X(-900),X(900),Y(1835),Y(P.pegTop),'1800 洞洞板');
          vd(Y(P.pegTop),Y(P.pegBottom),X(1200)+30,X(900),'900');
        }
        hd(X(-1200),X(1200),24,top,'2400');
        vd(Y(1880),Y(0),left-25,left,'1880');
        text(w/2,ground+31,kind==='front'?'电视下沿 770 · 上层齐平高 540':'洞洞板 1800 × 900 · 下沿离地 850');
        text(w/2,ground+49,kind==='front'?'手办 ≤180 · 顶部再余 50':'下层格栅篮 · 双片可翻后网门');
        text(w/2,ground+67,kind==='front'?'拉线塔顶 740 · 距电视下沿 30':'装饰拉线 · 主体保留刚性斜撑');
      }else if(kind==='side'){
        const A=z=>w/2+z*s;
        function sr(z,y,d,h,cl){rect(A(z),Y(y+h),d*s,h*s,cl);}
        sr(-390,P.baseBottom,780,80,'profile');sr(-140,240,80,1560,'profile');
        sr(-145,1800,90,12,'pink');line(A(-100),Y(1800),A(-100),Y(1880),'wire');
        for(const z of [-350,350])line(A(z>0?-42:-158),Y(920),A(z),Y(260),'outline');
        for(const z of [-350,350]){const r=outerStay(1080,z);line(A(r.a[2]),Y(r.a[1]),A(r.b[2]),Y(r.b[1]),'stay');}
        for(const z of [-180,240])sr(z-20,240,40,260,'profile');
        sr(-200,500,460,40,'profile');sr(-150,P.displayBottom,P.displayDepth,6,'acrylic');
        for(const y of [830,1050])sr(0,y-3,200,6,'acrylic-pink');
        sr(P.fanCableZ-20,P.displayTop,40,P.fanTop-12-P.displayTop,'profile');sr(P.fanCableZ-23,P.fanTop-12,46,12,'pink');
        sr(P.tvCenterZ-26.5,P.tvBottom,53,1101,'screen');for(const y of [1090,1510])sr(-80,y-16,63.5,32,'profile');
        sr(P.pegRear,P.pegBottom,21.5,P.pegHeight,'peg');
        sr(-317,990,140,620,'hidden-line');
        sr(-300,242,600,8,'pink');sr(-260,254,520,136,'outline');
        sr(-150,250,300,150,'hidden-line');sr(-130,262,260,104,'screen');
        sr(-20,P.displayTop,100,180,'hidden-line');
        for(const z of [-280,280]){sr(z-80,150,160,10,'profile');sr(z-30,115,60,35,'profile');out+='<circle class="profile" cx="'+n(A(z+38))+'" cy="'+n(Y(62.5))+'" r="'+n(62.5*s)+'"/>';}
        for(const z of [-340,340]){sr(z-6,36,12,164,'profile');sr(z-25,28,50,8,'profile');}
        hd(A(-400),A(400),24,top,'800');vd(Y(1880),Y(0),A(-400)-25,A(-400),'1880');
        vd(Y(P.tvBottom),Y(0),A(400)+30,A(400),'下沿 770');
        text(w/2,ground+31,'柜后 ←       → 电视正面');text(w/2,ground+49,'Ø125 脚轮 · 含安装板高 160');text(w/2,ground+67,'侧托板穿线孔 14 × 18');
      }else{
        const g=70,A=z=>g+(z+400)*s;
        rect(X(-1200),A(-400),2400*s,800*s,'outline');
        for(const z of [-340,340])rect(X(-1155),A(z-20),2310*s,40*s,'profile');
        for(const x of [-1175,1175])rect(X(x-20),A(-390),40*s,780*s,'profile');
        for(const x of [-1080,-760,760,1080])rect(X(x-20),A(-320),40*s,640*s,'profile');
        for(const x of [-1080,1080])for(const z of [-280,280])out+='<circle class="hidden-line" cx="'+n(X(x))+'" cy="'+n(A(z))+'" r="'+n(115*s)+'"/>';
        rect(X(-720),A(-300),1440*s,600*s,'outline');
        rect(X(-600),A(-150),500*s,300*s,'hidden-line');
        rect(X(-545),A(-130),390*s,260*s,'screen',10*s);
        rect(X(313.5),A(13.5),93*s,93*s,'accessory');
        for(const z of [-180,240])rect(X(-1060),A(z-20),2120*s,40*s,'profile');
        for(const sign of [-1,1])polygon(displayOutline.map(p=>[X(p[0]*sign),A(p[1])]),'acrylic');
        rect(X(-945),A(P.tvCenterZ-26.5),1890*s,53*s,'screen');
        rect(X(-900),A(P.pegRear),1800*s,10*s,'peg');
        rect(X(-900),A(-317),1800*s,140*s,'hidden-line');
        for(const x of [-1080,1080]){
          rect(X(x-120),A(0),240*s,200*s,'acrylic-pink');
          const p=stayAtY(outerStay(x,350),1050);rect(X(p[0]-7),A(p[2]-9),14*s,18*s,'outline');
        }
        for(const x of [-P.fanPylonX,P.fanPylonX]){
          const sign=x<0?-1:1;rect(X(x-23),A(P.fanCableZ-23),46*s,46*s,'pink');
          for(const target of [620,485,350,215,80])line(X(x-sign*26),A(P.fanCableZ),X(sign*target),A(P.fanCableZ),'stay');
        }
        hd(X(-1200),X(1200),27,g,'2400');vd(g,g+800*s,left-25,left,'800');
        text(w/2,g+800*s+28,'亚克力每片 700 × 360 × 6');text(w/2,g+800*s+48,'梁内净深 380 · 前后各留 10');
        return '<svg class="tv-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+n(w)+' '+n(g+800*s+70)+'" role="img" aria-label="俯视图：整体宽2400深800毫米，包含两侧托盘；两片700乘360乘6亚克力板嵌入前后横梁内，梁内净深380，前后各留10毫米"><title>俯视图，单位毫米</title>'+out+'</svg>';
      }
      return '<svg class="tv-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+n(w)+' '+n(ground+84)+'" role="img" aria-label="'+({front:'正视图，整体宽2400高1880，电视下沿770，上层面540，可放180高手办并余50，拉线塔顶740与电视相距30，四只125脚轮',side:'侧视图，整体深800高1880，下层设备面250，上层亚克力面540，板深360嵌入横梁，脚轮含安装板高160，驻车脚收起离地28，侧托板穿线孔14乘18',rear:'背视图，洞洞板1800乘900分三片折边板，下层格栅设备篮，后网门分左右两片可翻下，背面交叉拉撑隐藏在洞洞板前方，保留刚性斜撑'}[kind])+'，单位毫米"><title>'+({front:'正视图',side:'侧视图',rear:'背视图'}[kind])+'</title>'+out+'</svg>';
    }
    function renderSVG(force){
      const c=root.querySelector('#tv-front-svg'),w=c.getBoundingClientRect().width;if(w<1||(!force&&Math.abs(w-lastSVG)<1))return;lastSVG=w;
      for(const k of ['front','side','rear','top','consoleTop','consoleSide'])root.querySelector('#tv-'+k+'-svg').innerHTML=drawing(k,w);
    }
    new ResizeObserver(resize).observe(stage);new ResizeObserver(()=>renderSVG(false)).observe(root.querySelector('.tv-grid'));
    new MutationObserver(()=>{resize();renderSVG(false);}).observe(root.querySelector('#tv-panel-draw'),{attributes:true,attributeFilter:['hidden']});
    window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',colors);
    new MutationObserver(colors).observe(document.documentElement,{attributes:true,attributeFilter:['style','class','data-theme']});
    window.addEventListener('openai:set_globals',e=>{if(e.detail&&e.detail.globals&&e.detail.globals.widgetState)restore(e.detail.globals.widgetState);});
    build();colors();resize();status();renderSVG(true);if(window.openai&&window.openai.widgetState)restore(window.openai.widgetState);
    root._tvStand={parameters:P,state,build,faces:()=>faces.map(f=>({points:f.p,material:f.mat})),stays:()=>cableRuns.map(r=>({...r,a:r.a.slice(),b:r.b.slice()})),draw,project};
  })();
  