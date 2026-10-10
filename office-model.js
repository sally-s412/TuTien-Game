export const scenes=[
{title:'Sảnh lễ tân',task:0,point:{x:.25,y:.80},object:'Quầy lễ tân',hint:'Đến quầy lễ tân để check-in.'},
{title:'Khu làm việc',task:2,point:{x:.62,y:.79},object:'Bàn làm việc',hint:'Kiểm tra tài liệu cho buổi họp.'},
{title:'Pantry',task:1,point:{x:.77,y:.80},object:'Quầy cà phê',hint:'Ghé quầy pantry lấy cà phê.'},
{title:'Phòng họp',task:3,point:{x:.86,y:.90},object:'Bàn họp',hint:'Chuẩn bị phòng họp trước 10 giờ.'}
];
export const missions=['Check-in tại sảnh lễ tân','Lấy cà phê tại pantry','Chuẩn bị tài liệu ở khu làm việc','Kiểm tra phòng họp','Trò chuyện cùng đồng nghiệp'];
export const freshOffice=()=>({scene:0,character:0,done:[false,false,false,false,false],logs:[],positions:[{x:.34,y:.86},{x:.48,y:.85}]});
export function restoreOffice(raw){try{const s=JSON.parse(raw);if(!s||!Number.isInteger(s.scene)||s.scene<0||s.scene>3||!Number.isInteger(s.character)||s.character<0||s.character>1||!Array.isArray(s.done)||s.done.length!==5||s.done.some(x=>typeof x!=='boolean')||!Array.isArray(s.positions)||s.positions.length!==2||s.positions.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<.08||p.x>.92||p.y<.70||p.y>.91)||!Array.isArray(s.logs)||s.logs.some(x=>typeof x!=='string'))return freshOffice();s.logs=s.logs.slice(0,10);return s;}catch{return freshOffice();}}
export function completeMission(s,id){if(!Number.isInteger(id)||id<0||id>=missions.length||s.done[id])return false;s.done[id]=true;s.logs.unshift(missions[id]+' — hoàn thành.');s.logs=s.logs.slice(0,10);return true;}
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function movePosition(p,dx,dy,dt,bounds={minX:.08,maxX:.92,minY:.70,maxY:.91}){const len=Math.hypot(dx,dy);if(len){p.x=Math.max(bounds.minX,Math.min(bounds.maxX,p.x+dx/len*.22*dt));p.y=Math.max(bounds.minY,Math.min(bounds.maxY,p.y+dy/len*.22*dt));}return p;}

export const walkBounds=scene=>scene===3?{minX:.82,maxX:.92,minY:.89,maxY:.91}:{minX:.08,maxX:.92,minY:.70,maxY:.91};
