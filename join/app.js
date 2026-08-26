(()=>{"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const C=window.LIVINGHUB_JOIN_CONFIG||{};
const sb=window.supabase.createClient(C.supabaseUrl,C.supabaseAnonKey);
const LOCAL="livinghub_public_member_v111";
const demos=[
 {name:"Lina",age:31,city:"Los Angeles",intro:"喜欢咖啡、城市散步和周末短途旅行。",interests:"Coffee,Travel,Art",img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"},
 {name:"Daniel",age:35,city:"Pasadena",intro:"周末喜欢徒步、做饭，也愿意参加小型晚餐。",interests:"Hiking,Dinner,Music",img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"},
 {name:"Mei",age:29,city:"Irvine",intro:"喜欢旅行、摄影和安静但有趣的聊天。",interests:"Photo,Travel,Coffee",img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const split=s=>String(s||"").split(",").map(x=>x.trim()).filter(Boolean);
const localLoad=()=>{try{return JSON.parse(localStorage.getItem(LOCAL)||"null")}catch{return null}};
const localSave=v=>localStorage.setItem(LOCAL,JSON.stringify(v));

$("#startJoin").onclick=()=>$("#join").scrollIntoView({behavior:"smooth"});
$("#refreshBtn").onclick=()=>loadDirectory();
$("#photoInput").onchange=e=>{
 const f=e.target.files?.[0]; if(!f){$("#photoPreview").hidden=true;return}
 const u=URL.createObjectURL(f);$("#photoPreview").hidden=false;$("#photoPreview").innerHTML=`<img src="${u}" alt="">`;
};
function status(text,ok=false){$("#joinMsg").innerHTML=`<div class="status ${ok?"ok":"err"}">${esc(text)}</div>`}
function photoPath(file){
 const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
 return `${Date.now()}-${crypto.randomUUID()}.${ext}`;
}
async function uploadPhoto(file){
 const path=photoPath(file);
 const {error}=await sb.storage.from("member-photos").upload(path,file,{cacheControl:"3600",upsert:false});
 if(error)throw error;
 const {data}=sb.storage.from("member-photos").getPublicUrl(path);
 return data.publicUrl;
}
function realCard(p,isMine=false){
 const photo=p.photo_url?`<img src="${esc(p.photo_url)}" alt="">`:`<div class="avatar">${esc((p.display_name||"M").slice(0,1).toUpperCase())}</div>`;
 return `<article class="member-card">
 <span class="badge real">${isMine?"真实会员 · MY PROFILE":"真实会员"}</span>${photo}
 <div class="content"><div class="meta">${esc(p.city)} · ${esc(p.age)}</div><h4>${esc(p.display_name)}</h4>
 <p>${esc(p.intro||"刚刚加入 LivingHub。")}</p>
 <div class="tags">${split(p.interests).map(x=>`<b>${esc(x)}</b>`).join("")}</div>
 <div class="card-actions"><span>私人联系方式已保护</span><button data-contact="${esc(p.display_name)}">联系组织者</button></div></div></article>`;
}
function demoCard(d){
 return `<article class="member-card"><span class="badge">案例观察 · DEMO</span><img src="${d.img}" alt="">
 <div class="content"><div class="meta">${d.city} · ${d.age}</div><h4>${d.name}</h4><p>${d.intro}</p>
 <div class="tags">${split(d.interests).map(x=>`<b>${x}</b>`).join("")}</div>
 <div class="card-actions"><span>案例观察 · 非真实可联系会员</span><button data-demo>了解说明</button></div></div></article>`;
}
async function loadDirectory(){
 $("#memberGrid").innerHTML="<p>正在加载会员…</p>";
 const {data,error}=await sb.from("profiles").select("id,display_name,age,city,interests,intro,photo_url,created_at").order("created_at",{ascending:false}).limit(100);
 if(error){$("#memberGrid").innerHTML=`<p>会员加载失败：${esc(error.message)}</p>`;return}
 const mine=localLoad();
 const cards=[]; let di=0;
 (data||[]).forEach((p,i)=>{
   cards.push(realCard(p,mine?.id===p.id));
   if(di<demos.length && i<3)cards.push(demoCard(demos[di++]));
 });
 while(di<demos.length)cards.push(demoCard(demos[di++]));
 $("#memberGrid").innerHTML=cards.join("");
 $$("[data-contact]").forEach(b=>b.onclick=()=>{
   const name=b.dataset.contact||"会员";
   $("#organizerMail").href=`mailto:${C.organizerEmail}?subject=${encodeURIComponent("LivingHub 认识申请："+name)}`;
   $("#organizerDialog").showModal();
 });
 $$("[data-demo]").forEach(b=>b.onclick=()=>alert("这是案例观察资料，只用于展示页面体验，不代表真实可联系会员。"));
}
$("#joinForm").onsubmit=async e=>{
 e.preventDefault();
 const form=e.currentTarget;
 status("正在提交…",true);
 const btn=$("#submitBtn");btn.disabled=true;
 try{
   const fd=new FormData(form),file=fd.get("photo");
   if(!file||!file.size)throw new Error("请选择一张公开照片。");
   const photo_url=await uploadPhoto(file);
   const row={
     display_name:String(fd.get("display_name")||"").trim(),
     age:Number(fd.get("age")),
     city:String(fd.get("city")||"").trim(),
     interests:String(fd.get("interests")||"").trim()||null,
     intro:String(fd.get("intro")||"").trim()||null,
     photo_url
   };
   const {data,error}=await sb.from("profiles").insert(row).select("id,display_name,age,city,interests,intro,photo_url,created_at").single();
   if(error)throw error;
   localSave(data);
   status("会员资料已生成，并已进入公开会员发现页。",true);
   form.reset();$("#photoPreview").hidden=true;
   await loadDirectory();
   $("#memberArea").scrollIntoView({behavior:"smooth"});
 }catch(err){status(err.message||"提交失败")}
 finally{btn.disabled=false}
};
$("#myCardBtn").onclick=()=>{
 const m=localLoad();
 if(!m){$("#myCardContent").innerHTML="<p>这台设备还没有保存你的会员卡记录。</p>"}
 else{
   const photo=m.photo_url?`<img src="${esc(m.photo_url)}" alt="">`:`<div class="avatar">${esc((m.display_name||"M")[0])}</div>`;
   $("#myCardContent").innerHTML=`<div class="my-mini-card">${photo}<div><b>${esc(m.display_name)}</b><p>${esc(m.city)} · ${esc(m.age)}</p><small>会员记录：${esc(m.id)}</small></div></div>`;
 }
 $("#myCardDialog").showModal();
};
$("#deleteLocal").onclick=()=>{if(confirm("只清除这台设备保存的“我的会员卡”记录？公开会员目录中的资料不会被删除。")){localStorage.removeItem(LOCAL);$("#myCardDialog").close()}};
loadDirectory();
})();