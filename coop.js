// Manual signaling keeps the static site independent of a signaling account.
export function createCoop(onMessage,onStatus){
 let pc=null,channel=null,role=null;const report=t=>onStatus(t),encode=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
 function decode(code){if(code.length>40000)throw Error('Mã quá dài');const d=JSON.parse(decodeURIComponent(escape(atob(code.trim()))));if(!['offer','answer'].includes(d.type)||typeof d.sdp!=='string')throw Error('Mã kết nối không hợp lệ');return d;}
 function bind(c){channel=c;c.onopen=()=>report('Đã kết nối · '+(role==='host'?'Sơn':'Bình'));c.onclose=()=>report('Đã ngắt · trở về chơi đơn');c.onmessage=e=>{if(typeof e.data!=='string'||e.data.length>30000)return;try{onMessage(JSON.parse(e.data));}catch{}};}
 function init(r){close();role=r;pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});pc.onconnectionstatechange=()=>{if(['failed','disconnected'].includes(pc.connectionState))report('Kết nối gián đoạn. Thử cùng Wi-Fi; mạng này có thể cần TURN.');};if(r==='host')bind(pc.createDataChannel('son-binh'));else pc.ondatachannel=e=>bind(e.channel);}
 async function gather(){if(pc.iceGatheringState==='complete')return;await new Promise(resolve=>{const timer=setTimeout(resolve,6000);pc.addEventListener('icegatheringstatechange',()=>{if(pc.iceGatheringState==='complete'){clearTimeout(timer);resolve();}});});}
 function checkCandidates(){if(!pc.localDescription?.sdp.includes('a=candidate:'))throw Error('Trình duyệt/mạng không cung cấp đường truyền WebRTC. Thử Safari/Chrome khác hoặc cùng Wi-Fi.');}
 function close(){channel?.close();pc?.close();channel=null;pc=null;role=null;}
 return {get connected(){return channel?.readyState==='open';},get role(){return role;},send(data){if(channel?.readyState==='open')channel.send(JSON.stringify(data));},close,
 async offer(){init('host');await pc.setLocalDescription(await pc.createOffer());await gather();checkCandidates();report('Gửi mã mời cho Bình');return encode(pc.localDescription);},
 async answer(code){const d=decode(code);if(d.type!=='offer')throw Error('Cần mã mời của Sơn');init('guest');await pc.setRemoteDescription(d);await pc.setLocalDescription(await pc.createAnswer());await gather();checkCandidates();report('Gửi mã trả lời cho Sơn');return encode(pc.localDescription);},
 async accept(code){if(!pc||role!=='host')throw Error('Hãy tạo phòng trước');const d=decode(code);if(d.type!=='answer')throw Error('Cần mã trả lời của Bình');await pc.setRemoteDescription(d);report('Đang kết nối…');}
 };
}
