export const REALMS=['Phàm Nhân','Luyện Khí','Trúc Cơ','Kim Đan','Nguyên Anh','Hóa Thần','Đại Thừa','Độ Kiếp','Chân Tiên'];
export const JOBS=[{id:'report',name:'Báo cáo cho quản lý',zone:0,npc:'Quản lý',steps:['Điểm danh','Báo cáo','Xác nhận']},{id:'debug',name:'Giải trận pháp lỗi hệ thống',zone:1,npc:'Đồng nghiệp',steps:['Kiểm tra','Sửa lỗi','Chạy thử']},{id:'coffee',name:'Điều chế linh trà tại pantry',zone:2,npc:'Người hướng dẫn',steps:['Đun nước','Pha trà','Ổn định']},{id:'meeting',name:'Chuẩn bị trận pháp phòng họp',zone:3,npc:'Đồng nghiệp',steps:['Tài liệu','Màn hình','Kết giới']}];
export const freshCultivation=()=>({version:1,level:1,qi:0,stones:30,hp:100,artifact:0,bond:0,completed:0,task:0,zone:0,character:0,logs:['Bình và Sơn thức tỉnh linh căn giữa văn phòng SotaTek. Hệ thống đã kết nối.'],updated:Date.now()});
export const realm=s=>REALMS[Math.min(8,Math.floor((s.level-1)/4))];
export const qiRequired=s=>80+s.level*40;
export const breakthroughCost=s=>15+s.level*5;
export const artifactCost=s=>30+s.artifact*35;
export const maxHealth=s=>100+s.level*3;
export const job=s=>JOBS[s.task%JOBS.length];
export const difficulty=s=>({length:Math.min(9,2+Math.floor((s.level-1)/3)),seconds:Math.max(10,28-(s.level-1)*.5),qi:35+s.level*10+s.artifact*5,stones:12+s.level*3,damage:5+s.level*2});
export function log(s,t){s.logs.unshift(t);s.logs=s.logs.slice(0,12);}
export function finishTask(s,success){const d=difficulty(s);if(success){s.qi+=d.qi;s.stones+=d.stones;s.completed++;s.task++;s.bond=Math.min(100,s.bond+3);log(s,`${job({...s,task:s.task-1}).name}: +${d.qi} tu vi, +${d.stones} linh thạch.`);}else{s.hp=Math.max(0,s.hp-d.damage);log(s,`Thử thách thất bại: mất ${d.damage} sinh lực. Có thể thử lại hoặc nghỉ tại pantry.`);}return d;}
export function breakthrough(s){if(s.level>=36||s.qi<qiRequired(s)||s.stones<breakthroughCost(s))return false;s.qi-=qiRequired(s);s.stones-=breakthroughCost(s);s.level++;s.hp=maxHealth(s);log(s,`Đột phá! Level ${s.level} · ${realm(s)}. Nhiệm vụ hệ thống khó hơn.`);return true;}
export function upgradeArtifact(s){if(s.stones<artifactCost(s))return false;s.stones-=artifactCost(s);s.artifact++;log(s,`Pháp khí đạt cấp ${s.artifact}. Phần thưởng tu vi tăng.`);return true;}
export function meditate(s){if(s.hp<=0)return false;s.qi+=2+s.level+s.artifact;return true;}
export function offlineCultivation(s,now=Date.now()){const seconds=Math.min(28800,Math.max(0,Math.floor((now-s.updated)/1000)));s.qi+=Math.floor(seconds/5)*(1+s.artifact);s.updated=now;return seconds;}
export function restoreCultivation(raw){try{const s=JSON.parse(raw),base=freshCultivation();if(!s||s.version!==1||Object.keys(base).some(k=>k!=='logs'&&(!Number.isFinite(s[k])||s[k]<0))||!Number.isInteger(s.level)||s.level<1||s.level>36||!Number.isInteger(s.task)||!Number.isInteger(s.character)||s.character>1||!Number.isInteger(s.zone)||s.zone>3||!Array.isArray(s.logs)||s.logs.some(t=>typeof t!=='string'))return base;s.hp=Math.min(s.hp,maxHealth(s));s.bond=Math.min(s.bond,100);s.logs=s.logs.slice(0,12);return s;}catch{return freshCultivation();}}
