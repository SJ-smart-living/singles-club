(()=>{"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const cfg=window.LIVINGHUB_JOIN_CONFIG||{};
const base=(cfg.publicBase||location.origin+location.pathname.replace(/\/[^/]*$/,"")).replace(/\/$/,"");
const KEY="livinghub_join_member_v11";
const ref=new URLSearchParams(location.search).get("ref")||"";
const organizerEmail=cfg.organizerEmail||"hello.singlesclub@outlook.com";

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
function save(v){
  try{localStorage.setItem(KEY,JSON.stringify(v))}
  catch(err){
    throw new Error("照片文件仍然太大，无法保存到本设备。请换一张较小的照片后再试。");
  }
}
function inviteUrl(id){return `${base}/?ref=${encodeURIComponent(id)}`}
function splitTags(v){return String(v||"").split(",").map(x=>x.trim()).filter(Boolean)}

if(ref){
  $("#refBanner").hidden=false;
  $("#refBanner").textContent=`你是通过会员 ${ref} 的邀请进入。`;
}

$("#startJoin").onclick=()=>$("#join").scrollIntoView({behavior:"smooth"});
$("#loginOpen").onclick=()=>$("#loginDialog").showModal();

$("#organizerEmailText").textContent=organizerEmail;
$("#organizerMail").href=`mailto:${organizerEmail}?subject=${encodeURIComponent("LivingHub 认识申请")}`;

function fileToDataURL(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=reject;
    reader.onload=()=>{
      const img=new Image();
      img.onerror=reject;
      img.onload=()=>{
        const max=900;
        let w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
        const scale=Math.min(1,max/Math.max(w,h));
        w=Math.max(1,Math.round(w*scale));h=Math.max(1,Math.round(h*scale));
        const canvas=document.createElement("canvas");
        canvas.width=w;canvas.height=h;
        const ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL("image/jpeg",0.78));
      };
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}

$("#photoInput").onchange=async e=>{
  const f=e.target.files?.[0];if(!f)return;
  const data=await fileToDataURL(f);
  $("#photoPreview").hidden=false;
  $("#photoPreview").innerHTML=`<img src="${data}" alt="preview">`;
};

function showTab(tab){
  $$("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  ["discover","profile","invite"].forEach(x=>$("#"+x+"Panel").hidden=x!==tab);
}
$$("[data-tab]").forEach(b=>b.onclick=()=>showTab(b.dataset.tab));

function realCard(m){
  const photo=m.photo_data
    ?`<img src="${m.photo_data}" alt="">`
    :`<div class="real-avatar">${(m.name||"M").slice(0,1).toUpperCase()}</div>`;
  const tags=splitTags(m.interests);
  return `<article class="member-card real-member-card">
   <span class="real-badge">真实会员 · MY PROFILE</span>
   ${photo}
   <div class="content">
     <div class="meta">${m.city||""} · ${m.age||""}</div>
     <h4>${m.name||"LivingHub Member"}</h4>
     <p>${m.intro||"还没有填写个人介绍。可以到“我的资料”里补充。"} </p>
     <div class="tags">${tags.length?tags.map(x=>`<b>${x}</b>`).join(""):"<b>NEW MEMBER</b>"}</div>
     <div class="lock-box real-lock"><span>私人联系方式已保护</span><button data-tab-jump="profile">管理我的资料</button></div>
   </div>
 </article>`;
}
function demoCard(d,i){
  return `<article class="member-card">
   <span class="demo-badge">案例观察 · DEMO</span>
   <img src="${d.img}" alt="${d.name}">
   <div class="content"><div class="meta">${d.city} · ${d.age}</div><h4>${d.name}</h4><p>${d.intro}</p>
   <div class="tags">${d.interests.map(x=>`<b>${x}</b>`).join("")}</div>
   <div class="lock-box"><span>示例资料 · 无真实联系方式</span><button data-demo="${i}">联系组织者</button></div></div>
 </article>`;
}
function renderDirectory(m){
  const cards=[];
  // Natural mixed order: demo, real self, demos...
  cards.push(demoCard(demos[0],0));
  if(m) cards.push(realCard(m));
  demos.slice(1).forEach((d,i)=>cards.push(demoCard(d,i+1)));
  $("#profileGrid").innerHTML=cards.join("");
  $$("[data-tab-jump]").forEach(b=>b.onclick=()=>showTab(b.dataset.tabJump));
  $$("[data-demo]").forEach(b=>b.onclick=()=>{
    $("#organizerDialog").showModal();
  });
}

function fillProfile(m){
  if(!m)return;
  const f=$("#profileForm");
  f.name.value=m.name||"";
  f.city.value=m.city||"";
  f.age.value=m.age||"";
  f.contact.value=m.contact||"";
  f.intro.value=m.intro||"";
  f.interests.value=m.interests||"";
}
function renderMember(m){
  $("#result").hidden=false;
  $("#memberId").textContent=m.id;
  $("#welcomeName").textContent=m.name||"Member";
  $("#points").textContent=m.points||100;
  fillProfile(m);
  renderDirectory(m);
  const u=inviteUrl(m.id);
  $("#inviteUrl").textContent=u;
  $("#qrBox").innerHTML="";
  if(window.QRCode)new QRCode($("#qrBox"),{text:u,width:200,height:200,colorDark:"#171313",colorLight:"#ffffff"});
  else $("#qrBox").innerHTML=`<small>${u}</small>`;
  showTab("discover");
  $("#result").scrollIntoView({behavior:"smooth"});
}

$("#joinForm").onsubmit=async e=>{
  e.preventDefault();
  $("#joinMsg").innerHTML="";
  const fd=new FormData(e.currentTarget),old=load();
  let photo=old?.photo_data||"";
  const file=fd.get("photo");
  if(file&&file.size) photo=await fileToDataURL(file);
  const m={
    id:old?.id||makeId(),
    name:String(fd.get("name")||"").trim(),
    age:Number(fd.get("age")),
    city:String(fd.get("city")||"").trim(),
    interests:String(fd.get("interests")||"").trim(),
    intro:String(fd.get("intro")||"").trim(),
    contact:String(fd.get("contact")||"").trim(),
    photo_data:photo,
    referred_by:ref||old?.referred_by||"",
    points:old?.points||100,
    status:"basic",
    created_at:old?.created_at||new Date().toISOString()
  };
  try{
    save(m);
    renderMember(m);
  }catch(err){
    $("#joinMsg").innerHTML=`<div class="status err">${err.message}</div>`;
  }
};

$("#profileForm").onsubmit=e=>{
  e.preventDefault();
  let m=load();if(!m)return;
  const fd=new FormData(e.currentTarget);
  m={...m,
    name:String(fd.get("name")||"").trim(),
    age:Number(fd.get("age")),
    city:String(fd.get("city")||"").trim(),
    interests:String(fd.get("interests")||"").trim(),
    intro:String(fd.get("intro")||"").trim(),
    contact:String(fd.get("contact")||"").trim(),
    updated_at:new Date().toISOString()
  };
  save(m);
  $("#welcomeName").textContent=m.name;
  $("#profileMsg").textContent="资料已保存。";
  renderDirectory(m);
};

$("#deleteProfile").onclick=()=>{
  if(!confirm("确认删除本设备上的会员资料？删除后无法从本设备恢复。"))return;
  localStorage.removeItem(KEY);
  location.reload();
};

$("#copyInvite").onclick=async()=>{
  const m=load();if(!m)return;
  const text=`我刚加入 LivingHub。一起看看吧。\n${inviteUrl(m.id)}`;
  try{await navigator.clipboard.writeText(text);alert("邀请已复制。")}
  catch{prompt("复制邀请",text)}
};
$("#shareInvite").onclick=async()=>{
  const m=load();if(!m)return;
  if(navigator.share){
    try{await navigator.share({title:"LivingHub",text:"一起加入 LivingHub。",url:inviteUrl(m.id)});return}catch{}
  }
  $("#copyInvite").click();
};

$("#loginBtn").onclick=()=>{
  const m=load();
  const id=$("#loginId").value.trim().toUpperCase();
  const contact=$("#loginContact").value.trim();
  if(m&&m.id.toUpperCase()===id&&(!m.contact||m.contact===contact)){
    $("#loginDialog").close();
    renderMember(m);
    $("#loginMsg").textContent="";
  }else{
    $("#loginMsg").textContent="当前独立版只能登录本设备已经登记的会员资料。";
  }
};

const m=load();
if(m){
  $("#loginId").value=m.id||"";
  $("#loginContact").value=m.contact||"";
}
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
})();