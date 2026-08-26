(()=>{"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const C=window.LIVINGHUB_JOIN_CONFIG||{};
const sb=window.supabase.createClient(C.supabaseUrl,C.supabaseAnonKey);
const LOCAL="livinghub_member_credentials_v111";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const split=s=>String(s||"").split(",").map(x=>x.trim()).filter(Boolean);
function shortMemberId(id){return "LH-"+String(id||"").replace(/-/g,"").slice(0,6).toUpperCase()}


const demos=[
 {name:"Lina",age:31,city:"Los Angeles",intro:"喜欢咖啡、城市散步和周末短途旅行。",interests:"Coffee,Travel,Art",img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=82"},
 {name:"Daniel",age:35,city:"Pasadena",intro:"周末喜欢徒步、做饭，也愿意参加小型晚餐。",interests:"Hiking,Dinner,Music",img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=82"},
 {name:"Mei",age:29,city:"Irvine",intro:"喜欢旅行、摄影和安静但有趣的聊天。",interests:"Photo,Travel,Coffee",img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=82"},
 {name:"Alex",age:37,city:"Santa Monica",intro:"喜欢海边、音乐和新餐厅，比较随和。",interests:"Ocean,Food,Music",img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=82"},
 {name:"Sophie",age:33,city:"Arcadia",intro:"喜欢设计、晚餐和周末去没去过的地方。",interests:"Design,Dinner,Weekend",img:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=82"},
 {name:"Ryan",age:34,city:"Los Angeles",intro:"喜欢咖啡、运动和轻松自然的见面。",interests:"Fitness,Coffee,City",img:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=82"},
 {name:"Emma",age:30,city:"Glendale",intro:"周末喜欢展览、甜点店和短途旅行。",interests:"Gallery,Dessert,Travel",img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=82"},
 {name:"Jason",age:36,city:"Culver City",intro:"喜欢电影、徒步和认真做一顿晚饭。",interests:"Film,Hiking,Cooking",img:"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=82"},
 {name:"Nina",age:32,city:"Burbank",intro:"喜欢音乐、花店和城市里的小惊喜。",interests:"Music,Flowers,City",img:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=82"},
 {name:"Chris",age:38,city:"Long Beach",intro:"喜欢海边、咖啡和周末开车去新的地方。",interests:"Ocean,Coffee,Drive",img:"https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=900&q=82"},
 {name:"Ava",age:28,city:"San Gabriel",intro:"喜欢书店、烘焙和轻松的下午茶。",interests:"Books,Baking,Tea",img:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=82"},
 {name:"Michael",age:39,city:"West Hollywood",intro:"喜欢健身、现场音乐和探索新餐厅。",interests:"Fitness,Live Music,Food",img:"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=82"}
];

const loadCred=()=>{try{return JSON.parse(localStorage.getItem(LOCAL)||"null")}catch{return null}};
const saveCred=v=>localStorage.setItem(LOCAL,JSON.stringify(v));
function makeKey(){const a=new Uint8Array(24);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,"0")).join("")}
function show(el,text,ok=false){el.innerHTML=`<div class="status ${ok?"ok":"err"}">${esc(text)}</div>`}

$("#startJoin").onclick=()=>$("#join").scrollIntoView({behavior:"smooth"});
$("#refreshBtn").onclick=()=>loadDirectory();
$("#photoInput").onchange=e=>{const f=e.target.files?.[0];if(!f){$("#photoPreview").hidden=true;return}$("#photoPreview").hidden=false;$("#photoPreview").innerHTML=`<img src="${URL.createObjectURL(f)}" alt="">`};

function pathFor(file){
 const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
 return `${Date.now()}-${crypto.randomUUID()}.${ext}`;
}
async function uploadPhoto(file){
 const path=pathFor(file);
 const {error}=await sb.storage.from("member-photos").upload(path,file,{upsert:false,cacheControl:"3600"});
 if(error)throw error;
 const {data}=sb.storage.from("member-photos").getPublicUrl(path);
 return {url:data.publicUrl,path};
}
function card(p,mine=false){
 const photo=p.photo_url?`<img src="${esc(p.photo_url)}" alt="">`:`<div class="avatar">${esc((p.display_name||"M")[0])}</div>`;
 return `<article class="member-card">
 <span class="badge real">${mine?"真实会员 · MY PROFILE":"真实会员"}</span>${photo}
 <div class="content">
 <div class="meta">${shortMemberId(p.id)} · ${esc(p.city)} · ${esc(p.age)}</div>
 <h4>${esc(p.display_name)}</h4>
 <p>${esc(p.intro||"刚刚加入 LivingHub。")}</p>
 <div class="tags">${split(p.interests).map(x=>`<b>${esc(x)}</b>`).join("")}</div>
 <div class="card-actions"><span>私人联系方式已保护</span>${mine?`<button data-manage>管理资料</button>`:`<button data-contact="${esc(p.display_name)}">联系组织者</button>`}</div>
 </div></article>`;
}
function demo(d){
 return `<article class="member-card">
 <span class="badge">案例观察 · DEMO</span>
 <img src="${d.img}" alt="">
 <div class="content">
 <div class="meta">${d.city} · ${d.age}</div>
 <h4>${d.name}</h4>
 <p>${d.intro}</p>
 <div class="tags">${split(d.interests).map(x=>`<b>${x}</b>`).join("")}</div>
 <div class="card-actions"><span>案例观察 · 非真实可联系会员</span></div>
 </div></article>`;
}
async function loadDirectory(){
 $("#memberGrid").innerHTML="<p>正在加载会员…</p>";
 const {data,error}=await sb.from("profiles")
   .select("id,display_name,age,city,interests,intro,photo_url,status,created_at")
   .eq("status","active")
   .order("created_at",{ascending:false})
   .limit(100);
 if(error){$("#memberGrid").innerHTML=`<p>${esc(error.message)}</p>`;return}
 const cred=loadCred(),out=[];let di=0;
 (data||[]).forEach((p,i)=>{
   out.push(card(p,cred?.profile_id===p.id));
   if(di<demos.length && i<6) out.push(demo(demos[di++]));
 });
 while(di<demos.length) out.push(demo(demos[di++]));
 $("#memberGrid").innerHTML=out.join("");
 $$("[data-contact]").forEach(b=>b.onclick=()=>{
   $("#organizerMail").href=`mailto:${C.organizerEmail}?subject=${encodeURIComponent("LivingHub 认识申请："+b.dataset.contact)}`;
   $("#organizerDialog").showModal();
 });
 $$("[data-manage]").forEach(b=>b.onclick=openManage);
}

$("#joinForm").onsubmit=async e=>{
 e.preventDefault();
 const form=e.currentTarget,fd=new FormData(form),file=fd.get("photo"),btn=$("#submitBtn"),msg=$("#joinMsg");
 btn.disabled=true;
 try{
   if(!file || !file.size) throw new Error("请选择一张公开照片。");
   show(msg,"正在上传照片…",true);
   const photo=await uploadPhoto(file);
   show(msg,"照片上传成功 ✓ 正在创建会员资料…",true);
   const key=makeKey();
   const {data,error}=await sb.rpc("register_livinghub_profile",{
     p_display_name:String(fd.get("display_name")||"").trim(),
     p_age:Number(fd.get("age")),
     p_city:String(fd.get("city")||"").trim(),
     p_interests:String(fd.get("interests")||"").trim(),
     p_intro:String(fd.get("intro")||"").trim(),
     p_photo_url:photo.url,
     p_photo_path:photo.path,
     p_manage_key:key
   });
   if(error)throw error;
   const p=Array.isArray(data)?data[0]:data;
   saveCred({profile_id:p.id,manage_key:key});
   $("#successProfileId").textContent=shortMemberId(p.id);
   $("#successManageKey").textContent=key;
   show(msg,"会员资料创建成功 ✓",true);
   $("#successDialog").showModal();
   form.reset();
   $("#photoPreview").hidden=true;
   await loadDirectory();
   document.querySelector(".member-area")?.scrollIntoView({behavior:"smooth",block:"start"});
 }catch(err){
   show(msg,err.message||"提交失败");
 }finally{
   btn.disabled=false;
 }
};

$("#copyCredentials").onclick=async()=>{
 const c=loadCred();if(!c)return;
 const t=`LivingHub Member ID: ${shortMemberId(c.profile_id)}\nInternal ID: ${c.profile_id}\nPrivate Management Code: ${c.manage_key}`;
 try{await navigator.clipboard.writeText(t);alert("已复制，请保存到自己的安全位置。")}
 catch{prompt("请复制保存",t)}
};

function openManage(){
 const c=loadCred();
 if(c){$("#manageProfileId").value=c.profile_id;$("#manageKey").value=c.manage_key}
 $("#manageEditor").hidden=true;
 $("#manageDialog").showModal();
}
$("#manageBtn").onclick=openManage;
$("#manageClose").onclick=()=>$("#manageDialog").close();

$("#loadManage").onclick=async()=>{
 const id=$("#manageProfileId").value.trim(),key=$("#manageKey").value.trim(),msg=$("#manageMsg");
 try{
   const {data,error}=await sb.rpc("get_livinghub_profile",{p_profile_id:id,p_manage_key:key});
   if(error)throw error;
   const p=Array.isArray(data)?data[0]:data;
   saveCred({profile_id:id,manage_key:key});
   const f=$("#manageForm");
   ["display_name","age","city","interests","intro","status"].forEach(k=>{if(f.elements[k])f.elements[k].value=p[k]??""});
   $("#manageEditor").hidden=false;
   show(msg,"资料已打开。",true);
 }catch(err){
   show(msg,"会员 ID 或管理码不正确。");
 }
};

$("#manageForm").onsubmit=async e=>{
 e.preventDefault();
 if($("#manageEditor").hidden)return;
 const c=loadCred(),fd=new FormData(e.currentTarget),msg=$("#manageMsg");
 try{
   const {error}=await sb.rpc("update_livinghub_profile",{
     p_profile_id:c.profile_id,
     p_manage_key:c.manage_key,
     p_display_name:String(fd.get("display_name")||"").trim(),
     p_age:Number(fd.get("age")),
     p_city:String(fd.get("city")||"").trim(),
     p_interests:String(fd.get("interests")||"").trim(),
     p_intro:String(fd.get("intro")||"").trim(),
     p_status:String(fd.get("status")||"active")
   });
   if(error)throw error;
   show(msg,"资料已保存。",true);
   await loadDirectory();
 }catch(err){
   show(msg,err.message||"保存失败");
 }
};

$("#deleteSelf").onclick=async()=>{
 const c=loadCred();
 if(!c || !confirm("确认永久删除你的公开会员资料？删除后无法恢复。"))return;
 try{
   const {error}=await sb.rpc("delete_livinghub_profile",{p_profile_id:c.profile_id,p_manage_key:c.manage_key});
   if(error)throw error;
   localStorage.removeItem(LOCAL);
   $("#manageDialog").close();
   alert("你的会员资料已从公开会员目录删除。");
   await loadDirectory();
 }catch(err){
   alert(err.message||"删除失败");
 }
};

loadDirectory();
})();