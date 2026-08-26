(()=>{"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const cfg=window.LIVINGHUB_JOIN_CONFIG||{};
const base=(cfg.publicBase||location.origin+location.pathname.replace(/\/[^/]*$/,"")).replace(/\/$/,"");
const KEY="livinghub_join_member_v11";
const ref=new URLSearchParams(location.search).get("ref")||"";

const demos=[
 {name:"Lina",age:31,city:"Los Angeles",intro:"喜欢咖啡、城市散步和周末短途旅行。",interests:["Coffee","Travel","Art"],img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"},
 {name:"Daniel",age:35,city:"Pasadena",intro:"周末喜欢徒步、做饭，也愿意参加小型晚餐。",interests:["Hiking","Dinner","Music"],img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"},
 {name:"Mei",age:29,city:"Irvine",intro:"喜欢旅行、摄影和安静但有趣的聊天。",interests:["Photo","Travel","Coffee"],img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"},
 {name:"Alex",age:37,city:"Santa Monica",intro:"喜欢海边、音乐和新餐厅，比较随和。",interests:["Ocean","Food","Music"],img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"},
 {name:"Sophie",age:33,city:"Arcadia",intro:"喜欢设计、晚餐和周末去没去过的地方。",interests:["Design","Dinner","Weekend"],img:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"},
 {name:"Ryan",age:34,city:"Los Angeles",intro:"喜欢咖啡、运动和轻松自然的见面。",interests:["Fitness","Coffee","City"],img:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"}
];

function makeId(){let a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",s="LH-";for(let i=0;i<6;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function inviteUrl(i){return `${base}/?ref=${encodeURIComponent(i)}`}
function renderMemberDirectory(current){
 const realCard=current?`<article class="member-card real-member-card">
   <span class="real-badge">真实会员 · MY PROFILE</span>
   <div class="real-avatar">${(current.name||"M").slice(0,1).toUpperCase()}</div>
   <div class="content">
     <div class="meta">${current.city||""} · ${current.age||""}</div>
     <h4>${current.name||"LivingHub Member"}</h4>
     <p>${current.intro||"还没有填写个人介绍。可以到“我的资料”里补充。"} </p>
     <div class="tags">${String(current.interests||"").split(",").map(x=>x.trim()).filter(Boolean).map(x=>`<b>${x}</b>`).join("")||"<b>NEW MEMBER</b>"}</div>
     <div class="lock-box real-lock"><span>联系方式仅本人可见</span><button data-tab-jump="profile">编辑我的资料</button></div>
   </div>
 </article>`:"";
 const demoCards=demos.map((d,i)=>`<article class="member-card">
   <span class="demo-badge">案例观察 · DEMO</span>
   <img src="${d.img}" alt="${d.name}">
   <div class="content"><div class="meta">${d.city} · ${d.age}</div><h4>${d.name}</h4><p>${d.intro}</p>
   <div class="tags">${d.interests.map(x=>`<b>${x}</b>`).join("")}</div>
   <div class="lock-box"><span>示例资料 · 无真实联系方式</span><button data-unlock="${i}">了解解锁规则</button></div></div>
 </article>`).join("");
 $("#profileGrid").innerHTML=realCard+demoCards;
 $$("[data-unlock]").forEach(b=>b.onclick=()=>alert("这是案例观察资料，不是真实会员。正式会员会按会员权限和本人隐私设置决定可见范围。"));
 $$("[data-tab-jump]").forEach(b=>b.onclick=()=>showTab(b.dataset.tabJump));
}
function showTab(tab){
 $$("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
 ["discover","profile","invite"].forEach(x=>$("#"+x+"Panel").hidden=x!==tab);
}
$$("[data-tab]").forEach(b=>b.onclick=()=>showTab(b.dataset.tab));

if(ref){$("#refBanner").hidden=false;$("#refBanner").textContent=`你是通过会员 ${ref} 的邀请进入。完成登记后会记录来源。`}
$("#startJoin").onclick=()=>$("#join").scrollIntoView({behavior:"smooth"});
$("#loginOpen").onclick=()=>$("#loginDialog").showModal();
$("#photoInput").onchange=e=>{let f=e.target.files?.[0];if(!f)return;let u=URL.createObjectURL(f);$("#photoPreview").hidden=false;$("#photoPreview").innerHTML=`<img src="${u}">`};

function fillProfile(m){
 const f=$("#profileForm");f.name.value=m.name||"";f.city.value=m.city||"";f.age.value=m.age||"";f.contact.value=m.contact||"";f.intro.value=m.intro||"";f.interests.value=m.interests||"";
}
function render(m){
 $("#result").hidden=false;$("#memberId").textContent=m.id;$("#welcomeName").textContent=m.name||"Member";$("#points").textContent=m.points||100;
 fillProfile(m);renderMemberDirectory(m);
 const u=inviteUrl(m.id);$("#inviteUrl").textContent=u;$("#qrBox").innerHTML="";
 if(window.QRCode)new QRCode($("#qrBox"),{text:u,width:200,height:200,colorDark:"#171313",colorLight:"#ffffff"});
 else $("#qrBox").innerHTML=`<small>${u}</small>`;
 showTab("discover");$("#result").scrollIntoView({behavior:"smooth"});
}
$("#joinForm").onsubmit=e=>{
 e.preventDefault();let f=new FormData(e.currentTarget),old=load();
 let m={id:old?.id||makeId(),name:String(f.get("name")||"").trim(),city:String(f.get("city")||"").trim(),contact:String(f.get("contact")||"").trim(),age:Number(f.get("age")),intro:String(f.get("intro")||"").trim(),interests:old?.interests||"",referred_by:ref||old?.referred_by||"",points:old?.points||100,status:"basic",created_at:old?.created_at||new Date().toISOString()};
 save(m);render(m)
};
$("#profileForm").onsubmit=e=>{
 e.preventDefault();let m=load();if(!m)return;let f=new FormData(e.currentTarget);
 m={...m,name:String(f.get("name")||"").trim(),city:String(f.get("city")||"").trim(),age:Number(f.get("age")),contact:String(f.get("contact")||"").trim(),intro:String(f.get("intro")||"").trim(),interests:String(f.get("interests")||"").trim(),updated_at:new Date().toISOString()};
 save(m);$("#welcomeName").textContent=m.name;$("#profileMsg").textContent="资料已保存。";renderMemberDirectory(m);
};
$("#copyInvite").onclick=async()=>{let m=load();if(!m)return;let t=`我刚加入 LivingHub。一起看看吧。\\n${inviteUrl(m.id)}`;try{await navigator.clipboard.writeText(t);alert("邀请已复制。")}catch{prompt("复制邀请",t)}};
$("#shareInvite").onclick=async()=>{let m=load();if(!m)return;if(navigator.share){try{await navigator.share({title:"LivingHub",text:"一起加入 LivingHub。",url:inviteUrl(m.id)});return}catch{}}$("#copyInvite").click()};
$("#loginBtn").onclick=()=>{let m=load(),i=$("#loginId").value.trim().toUpperCase(),c=$("#loginContact").value.trim();if(m&&m.id.toUpperCase()===i&&m.contact===c){$("#loginDialog").close();render(m);$("#loginMsg").textContent=""}else $("#loginMsg").textContent="当前独立版只能登录本设备已登记会员；接入数据库后可跨设备登录。"};
let m=load();if(m){$("#loginId").value=m.id;$("#loginContact").value=m.contact}
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
})();