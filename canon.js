export const CAST=[
 {name:'Bình',role:'QC · Phá Vọng Linh Nhãn',zone:1,male:true,power:'scan',line:'Tớ sẽ tìm điểm yếu. Sơn giữ trận phía sau nhé.'},
 {name:'Sơn',role:'BE Lead · Hệ Thống Đạo',zone:1,male:true,power:'purify',line:'Lười thì lười, nhưng đừng ai động đến Bình. Backend để tớ.'},
 {name:'Sally',role:'PO · Thiên Đạo',zone:3,male:false,rare:true,line:'Ta chỉ can thiệp khi cán cân nhân quả sắp vỡ.'},
 {name:'Huân Haky',role:'FE Lead',zone:1,male:true,line:'Bình, kiểm thử giao diện cùng tôi nhé? Sơn, đừng hiểu lầm: release cần cả FE và BE.'},
 {name:'Luis Bùi',role:'PM · Tiểu kế',zone:3,male:true,minor:true,line:'Deadline không đổi! Nếu lỗi thì chắc là người khác chưa đọc tin nhắn của tôi…'},
 {name:'Sabe Cao',role:'L&D Manager · Huyễn thư',zone:0,male:false,minor:true,line:'AI đã viết tài liệu rồi. Nhưng… nguồn và phiên bản thì tôi chưa kiểm tra.'},
 {name:'Quỳnh Nguyễn',role:'BA',zone:3,male:true,line:'Tôi tưởng “đăng nhập một lần” nghĩa là token không bao giờ hết hạn. Hãy cùng đối chiếu nghiệp vụ.'},
 {name:'Arpham Gà',role:'BE',zone:1,male:true,line:'Log backend có dấu vết audience sai. Đừng sửa mù: tìm bằng chứng trước.'},
 {name:'Tú Hoàng',role:'Fullstack Intern',zone:1,male:true,line:'Em tìm thấy token cũ trong cache. Em muốn được học cách sửa có kiểm chứng.'},
 {name:'Phương Chấm Tô',role:'Operation',zone:0,male:false,line:'Canary và rollback đã sẵn sàng. Chọn một release an toàn, đừng đánh cược production.'},
 {name:'Hiếu Nguyễn',role:'sub PM',zone:3,male:true,line:'Tôi sẽ khóa scope và điều phối lại. Thêm yêu cầu thì phải thương lượng thời gian.'}
];
export const QUESTS=[
 {name:'Ấn môn SSO · Token lạc giới',cause:'SSO',clues:['Log: audience khác client hiện tại','Cache: token đã hết hạn','Huyễn thư AI: bỏ xác minh chữ ký'],npc:6},
 {name:'Scope kiếp · Sprint hỗn loạn',cause:'scope',clues:['Jira: acceptance criteria chưa được chốt','Timeline: ba yêu cầu thêm ngoài sprint','Biên bản: chưa ai duyệt đổi deadline'],npc:10},
 {name:'Huyễn thư · AI dẫn sai đường',cause:'AI',clues:['Tài liệu: API thuộc phiên bản cũ','Nguồn: ví dụ AI không có trích dẫn','CI: kiểm thử âm vẫn đang thất bại'],npc:5},
 {name:'Tâm ma · Nợ kiến trúc',cause:'debt',clues:['Trace: vòng gọi dịch vụ vô hạn','Review: thiếu ranh giới giao dịch','UAT: lỗi chỉ xuất hiện khi đồng thời'],npc:7}
];
export const STAGES=['Giải nghĩa yêu cầu','Thu thập 3 manh mối','Bình: soi lỗ hổng','Sơn: thanh tẩy dị thường','BE–QC: hợp trận kiểm chứng','Deployment: chọn đường vượt kiếp'];
export function ensureStory(s){if(!s.story||!Number.isInteger(s.story.stage)||s.story.stage<0||s.story.stage>5)s.story={stage:0,clues:[],revealed:false,hits:0,seal:[],deadline:0};s.relationship=Object.assign({trust:0,affection:0,protection:0,companionship:0,banter:0,misunderstanding:0,tension:0,fate:0,romance:false,events:[]},s.relationship||{});s.debt=Number.isFinite(s.debt)?s.debt:0;s.dao=Number.isInteger(s.dao)?s.dao:0;s.lunchCycle=Number.isInteger(s.lunchCycle)?s.lunchCycle:-1;return s;}
export function relationshipEvent(s,type){ensureStory(s);const r=s.relationship,changes={clue:{trust:2},protect:{protection:3,trust:2,fate:1},lunch:{companionship:3,affection:2,banter:1},honest:{trust:3,misunderstanding:-2,tension:-2},jealous:{misunderstanding:3,tension:3},romance:{affection:4,fate:2},paired:{trust:3,protection:2,fate:2}};for(const [k,n] of Object.entries(changes[type]||{}))r[k]=Math.max(0,Math.min(100,r[k]+n));r.events.unshift(type);r.events=r.events.slice(0,24);s.bond=Math.min(100,r.fate+r.affection);}
export const incident=s=>QUESTS[s.task%QUESTS.length];
export const requiredHits=s=>Math.max(2,2+Math.floor(s.level/4)-(s.relationship?.trust>=12?1:0));
export function questAction(s,action,role=0,now=Date.now()){
 ensureStory(s);const q=s.story;
 if(action==='clarify'&&q.stage===0){q.stage=1;return true;}
 if(action.startsWith('clue:')&&q.stage===1){const n=Number(action.slice(5));if(![0,1,2].includes(n)||q.clues.includes(n))return false;q.clues.push(n);relationshipEvent(s,'clue');if(q.clues.length===3)q.stage=2;return true;}
 if(action==='scan'&&q.stage===2&&role===0){q.revealed=true;q.stage=3;q.deadline=now+Math.max(12000,45000-s.level*700);return true;}
 if(action==='paired'&&q.stage===3&&!q.pairedUsed&&s.relationship.fate>=2&&s.relationship.trust>=4){q.pairedUsed=true;q.hits+=2;relationshipEvent(s,'protect');if(q.hits>=requiredHits(s)){q.stage=4;q.deadline=0;}return true;}
 if(action==='purify'&&q.stage===3&&role===1){if(now>q.deadline){s.hp=Math.max(0,s.hp-(5+s.level*2));q.hits=0;q.deadline=now+Math.max(12000,45000-s.level*700);return false;}q.hits++;if(q.hits>=requiredHits(s)){q.stage=4;q.deadline=0;relationshipEvent(s,'protect');}return true;}
 if(action==='seal'&&q.stage===4){if(q.deadline&&now>q.deadline)q.seal=[];if(q.seal.includes(role))return false;q.seal.push(role);q.deadline=now+15000;if(q.seal.length===2){q.stage=5;q.deadline=0;relationshipEvent(s,'paired');}return true;}
 return false;
}
export function deploymentOutcome(s,choice){ensureStory(s);if(s.story.stage!==5||!['canary','rush','rollback'].includes(choice))return null;let outcome;
 if(choice==='rush'){s.debt+=2;s.hp=Math.max(0,s.hp-8-s.level);relationshipEvent(s,'jealous');outcome='Release vội: incident production, tâm ma nợ kỹ thuật +2. Luis đổ lỗi, nhưng log giữ bằng chứng.';}
 else if(choice==='rollback'){s.debt=Math.max(0,s.debt-1);relationshipEvent(s,'protect');outcome='Hồi chuyển thuật: rollback giữ an toàn cho người dùng. Phương xác nhận phục hồi; Sơn và Bình bảo vệ nhau.';}
 else {s.debt=Math.max(0,s.debt-1);relationshipEvent(s,'honest');outcome='Canary được kiểm chứng: QA/UAT đạt, CI/CD ổn định. Cả nhóm vượt kiếp deployment.';}
 const intervention=s.debt>=4&&s.dao<s.task+1;if(intervention){s.dao=s.task+1;s.debt=1;outcome+=' Sally hiện thân: Thiên Đạo phơi bày log bị che giấu và khôi phục cân bằng. Đây là can thiệp hiếm, không phải nhiệm vụ thường ngày.';}
 s.story={stage:0,clues:[],revealed:false,hits:0,seal:[],deadline:0};return {outcome,intervention,safe:choice!=='rush'};
}
