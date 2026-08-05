(() => {
"use strict";
const C=window.APP_CONFIG;
const API=String(C.apiBaseUrl||"").replace(/\/+$/,"");
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={lang:localStorage.getItem("club_lang")||C.defaultLanguage||"zh",data:null,step:0,photos:[],selected:""};

const T={
zh:{join:"申请加入",statusShort:"查询",eyebrow:"真实活动 · 共同成长 · 认真连接",title:'遇见一个<span>愿意走进未来</span>的人',subtitle:"一页完成发现、申请与会员选择。附近活动持续闪烁，俱乐部动态自动更新，资料只在授权范围内使用。",applyNow:"查看本周名额",checkStatus:"查询申请状态",events:"近期活动",cities:"附近城市",verified:"人工确认",privacy:"隐私优先",discover:"附近正在发生",live:"最新活动",mapTitle:"点击闪烁城市查看活动",mapSub:"只显示活动区域，不显示会员实时位置。",requestSpot:"申请名额",today:"今天",moving:"持续更新",plans:"会员方案",unlock:"解锁更多",selfProvided:"本人填写",selfProvidedSub:"资料来源清楚",clubConfirmed:"俱乐部确认",clubConfirmedSub:"活动和审核状态明确",merchantOwned:"商家直接收款",merchantOwnedSub:"付款进入商家自己的账户",permission:"授权可见",permissionSub:"不公开出售会员隐私",merchantLogin:"商家登录",application:"会员申请",name:"姓名或昵称",age:"年龄",city:"城市",contact:"电话或邮箱",goal:"关系目标",intro:"一句话介绍",offer:"活动或会员方案",photo:"添加1—3张本人照片",consent:"我确认已满18岁，并同意商家仅为审核、活动联系和本人选择的服务使用资料。",privateDefault:"资料默认不公开，只有本人授权的信息才可用于会员服务。",back:"上一步",next:"下一步",submit:"提交申请",received:"申请已收到",thanks:"谢谢你的认真填写",save:"保存申请编号：",viewStatus:"查看状态",statusHeading:"查询申请状态",applicationCode:"申请编号",check:"查询",popular:"最受欢迎",month:"月",choose:"选择",platform:"俱乐部发布",activity:"活动更新",goalOptions:[["serious","认真寻找长期关系"],["marriage","希望认识结婚对象"],["friends","先从朋友开始"]],status:{submitted:"已提交",under_review:"审核中",approved:"已通过",awaiting_payment:"待付款",payment_pending:"付款待确认",payment_received:"已收款",confirmed:"报名成功",venue_unlocked:"地址已开放",checked_in:"已签到",completed:"已完成",rejected:"未通过",cancelled:"已取消"}},
en:{join:"Apply",statusShort:"Status",eyebrow:"REAL EVENTS · SHARED GROWTH · SERIOUS CONNECTIONS",title:'Meet someone <span>ready to build a future</span>',subtitle:"Discover, apply, and choose membership in one page. Nearby events pulse, club updates keep moving, and information is used only within authorized boundaries.",applyNow:"View this week's spots",checkStatus:"Check application",events:"Upcoming events",cities:"Nearby cities",verified:"Human review",privacy:"Privacy first",discover:"Happening nearby",live:"Latest activity",mapTitle:"Tap a pulsing city to view activity",mapSub:"Only event areas are shown—never member live locations.",requestSpot:"Request a spot",today:"Today",moving:"Always moving",plans:"Membership plans",unlock:"Unlock more",selfProvided:"Member provided",selfProvidedSub:"Clear information source",clubConfirmed:"Club confirmed",clubConfirmedSub:"Clear event and review status",merchantOwned:"Merchant-direct payment",merchantOwnedSub:"Funds go to the merchant's own account",permission:"Permission-based visibility",permissionSub:"Member privacy is not sold",merchantLogin:"Merchant login",application:"Member application",name:"Name or nickname",age:"Age",city:"City",contact:"Phone or email",goal:"Relationship goal",intro:"One-line introduction",offer:"Event or membership",photo:"Add 1–3 real photos",consent:"I confirm I am 18 or older and consent to use of this information only for review, event contact, and services I choose.",privateDefault:"Information is private by default and used only within authorized member services.",back:"Back",next:"Next",submit:"Submit",received:"Application received",thanks:"Thank you for applying",save:"Save application number:",viewStatus:"View status",statusHeading:"Check application status",applicationCode:"Application number",check:"Check",popular:"Most popular",month:"month",choose:"Choose",platform:"Club post",activity:"Event update",goalOptions:[["serious","Seeking a serious long-term relationship"],["marriage","Hoping to meet a future spouse"],["friends","Start as friends"]],status:{submitted:"Submitted",under_review:"Under review",approved:"Approved",awaiting_payment:"Awaiting payment",payment_pending:"Payment pending",payment_received:"Payment received",confirmed:"Confirmed",venue_unlocked:"Venue unlocked",checked_in:"Checked in",completed:"Completed",rejected:"Rejected",cancelled:"Cancelled"}}
};
const tr=k=>{let v=T[state.lang];for(const p of k.split("."))v=v?.[p];return v??k};
const loc=(o,f)=>state.lang==="zh"?(o?.[f+"_zh"]||o?.[f+"_en"]||""):(o?.[f+"_en"]||o?.[f+"_zh"]||"");

async function request(path,opt={}){
  const r=await fetch(API+path,opt);
  let j=null;try{j=await r.json()}catch{}
  if(!r.ok)throw new Error(j?.error||`Request failed (${r.status})`);
  return j;
}
async function load(){
  if(!API)throw new Error("Backend URL is not configured");
  state.data=await request("/api/public");
  render();
}
function applyText(){
  document.documentElement.lang=state.lang==="zh"?"zh-CN":"en";
  $$("[data-i18n]").forEach(x=>{const v=tr(x.dataset.i18n);if(typeof v==="string")x.textContent=v});
  $$("[data-i18n-html]").forEach(x=>{const v=tr(x.dataset.i18nHtml);if(typeof v==="string")x.innerHTML=v});
  $("#langBtn").textContent=state.lang==="zh"?"EN":"中文";
}
function render(){
  applyText();
  const d=state.data,s=d.settings||{},events=d.events||[],posts=d.posts||[],plans=d.plans||[];
  $("#brandName").textContent=s.brand_name||"Singles Club";$("#footerBrand").textContent=s.brand_name||"Singles Club";document.title=s.page_title||s.brand_name||"Singles Club";
  $("#adminLink").href=C.adminUrl||API+"/admin.html";
  $("#eventCount").textContent=events.length;$("#cityCount").textContent=new Set(events.map(e=>e.city).filter(Boolean)).size;
  renderMap(events);renderPosts(posts);renderPlans(plans);renderFeatured(events);renderOffer(events,plans);renderGoals();renderSchema(s,events);
}
function renderMap(events){
  const map=$("#map");map.querySelectorAll(".pin").forEach(x=>x.remove());
  const coords=[[34,67],[58,80],[70,38],[76,67],[45,50]];
  events.slice(0,5).forEach((e,i)=>{const b=document.createElement("button");b.className="pin";b.style.left=coords[i][1]+"%";b.style.top=coords[i][0]+"%";const spots=Math.max(0,Number(e.capacity||0)-Number(e.confirmed_count||0));b.innerHTML=`<b></b><span><strong>${e.city||""}</strong><br>${loc(e,"title")} · ${spots} spots</span>`;b.onclick=()=>choose(`event:${e.id}`);map.appendChild(b)});
}
function renderPosts(posts){
  const list=posts.length?[...posts,...posts]:[];
  $("#feedTrack").innerHTML=list.map(p=>`<article class="post"><div class="post-head"><span class="tag ${p.post_type==="activity"?"activity":""}">${p.post_type==="activity"?tr("activity"):tr("platform")}</span><small>${new Date(p.created_at).toLocaleDateString()}</small></div><p>${loc(p,"content")}</p></article>`).join("");
}
function renderPlans(plans){
  $("#pricing").innerHTML=plans.map((p,i)=>`<article class="plan ${i===1?"popular":""}">${i===1?`<span class="popular-badge">${tr("popular")}</span>`:""}<h3>${p.name}</h3><div class="amount">$${Number(p.price).toFixed(0)}<small> / ${tr("month")}</small></div><p>${loc(p,"summary")}</p><button class="btn ${i===1?"rose":"primary"}" data-plan="${p.id}">${tr("choose")}</button></article>`).join("");
  $$("[data-plan]").forEach(b=>b.onclick=()=>choose("plan:"+b.dataset.plan));
}
function renderFeatured(events){
  const e=events[0];
  if(!e){$("#featuredTitle").textContent="—";$("#featuredMeta").textContent="—";return}
  $("#featuredTitle").textContent=loc(e,"title");
  $("#featuredMeta").textContent=`${new Date(e.start_at).toLocaleString(state.lang==="zh"?"zh-CN":"en-US",{dateStyle:"medium",timeStyle:"short"})} · ${e.city||""} · $${Number(e.price||0).toFixed(0)}`;
  $("#featuredBtn").onclick=()=>choose(`event:${e.id}`);
}
function renderOffer(events,plans){
  $("#offerSelect").innerHTML=[...events.map(e=>`<option value="event:${e.id}">${loc(e,"title")} · $${Number(e.price||0).toFixed(0)}</option>`),...plans.map(p=>`<option value="plan:${p.id}">${p.name} · $${Number(p.price).toFixed(0)}</option>`)].join("");
  if(state.selected)$("#offerSelect").value=state.selected;
}
function renderGoals(){
  $("#goalSelect").innerHTML=`<option value="">—</option>`+tr("goalOptions").map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
}
function choose(v){state.selected=v;renderOffer(state.data.events||[],state.data.plans||[]);openApply()}
function openApply(){state.step=0;$("#applyForm").reset();state.photos=[];$("#preview").innerHTML="";$("#applyError").textContent="";$("#applyForm").style.display="block";$("#success").classList.remove("show");renderStep();$("#applyDialog").showModal()}
function openStatus(){$("#statusResult").innerHTML="";$("#statusDialog").showModal()}
function renderStep(){
  $$(".step").forEach((x,i)=>x.classList.toggle("active",i===state.step));$$(".dot").forEach((x,i)=>x.classList.toggle("active",i<=state.step));$("#backBtn").style.visibility=state.step?"visible":"hidden";$("#nextBtn").textContent=state.step===2?tr("submit"):tr("next");
}
function validatePhotos(files){
  if(files.length>C.maxPhotos)throw new Error(`Maximum ${C.maxPhotos} photos`);
  files.forEach(f=>{if(!C.allowedPhotoTypes.includes(f.type))throw new Error("Unsupported image type");if(f.size>C.maxPhotoBytes)throw new Error("Image exceeds 5MB")});
}
function renderPreview(){
  $("#preview").innerHTML=state.photos.map((f,i)=>`<div class="preview-item"><img src="${URL.createObjectURL(f)}"><button type="button" data-rm="${i}">×</button></div>`).join("");
  $$("[data-rm]").forEach(b=>b.onclick=()=>{state.photos.splice(Number(b.dataset.rm),1);renderPreview()});
}
async function submitApplication(){
  const fd=new FormData($("#applyForm"));state.photos.forEach(f=>fd.append("photos",f));
  const j=await request("/api/applications",{method:"POST",body:fd});
  $("#applyForm").style.display="none";$("#success").classList.add("show");$("#code").textContent=j.application_code;
}
function timeline(status){
  return C.statusOrder.map(s=>`<div class="${C.statusOrder.indexOf(s)<=C.statusOrder.indexOf(status)?"done":""}">● ${tr("status."+s)}</div>`).join("");
}
function renderStatus(j){
  let payment="";
  if(["approved","awaiting_payment","payment_pending"].includes(j.status)&&j.payment){
    if(j.payment.stripe_url)payment+=`<div class="paymentbox"><strong>Stripe</strong><p><a class="btn primary" target="_blank" rel="noopener" href="${j.payment.stripe_url}">Pay securely</a></p></div>`;
    if(j.payment.zelle_contact)payment+=`<div class="paymentbox"><strong>Zelle</strong><p>${j.payment.zelle_name||""}<br>${j.payment.zelle_contact}</p></div>`;
    if(j.payment.has_qr)payment+=`<div class="paymentbox"><strong>${j.payment.qr_label||"Payment QR"}</strong><img class="qr" src="${API}/api/payment-qr"></div>`;
  }
  return `<div class="statusbox"><h3>${tr("status."+j.status)}</h3><p>${j.event_title||j.plan_name||""}</p><div class="timeline">${timeline(j.status)}</div>${payment}${j.private_venue?`<div class="paymentbox"><strong>Venue</strong><p>${j.private_venue}</p></div>`:""}</div>`;
}
function renderSchema(s,events){
  const graph=[{"@type":"Organization","name":s.brand_name||"Singles Club","url":C.siteUrl,"email":s.contact_email||"","areaServed":s.city||""},{"@type":"WebSite","name":s.brand_name||"Singles Club","url":C.siteUrl}];
  events.forEach(e=>graph.push({"@type":"Event","name":e.title_en||e.title_zh,"startDate":e.start_at,"eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode","eventStatus":"https://schema.org/EventScheduled","location":{"@type":"Place","name":e.public_venue||e.city||"","address":{"@type":"PostalAddress","addressLocality":e.city||"","addressRegion":e.region||"","addressCountry":e.country||"US"}},"offers":{"@type":"Offer","price":String(e.price||0),"priceCurrency":e.currency||"USD","url":C.siteUrl,"availability":"https://schema.org/LimitedAvailability"}}));
  $("#structuredData").textContent=JSON.stringify({"@context":"https://schema.org","@graph":graph});
}

$("#langBtn").onclick=()=>{state.lang=state.lang==="zh"?"en":"zh";localStorage.setItem("club_lang",state.lang);render()};
["#applyTopBtn","#applyHeroBtn"].forEach(s=>$(s).onclick=openApply);
["#statusTopBtn","#statusHeroBtn","#statusFooterBtn"].forEach(s=>$(s).onclick=openStatus);
$("#closeApply").onclick=()=>$("#applyDialog").close();$("#closeStatus").onclick=()=>$("#statusDialog").close();
$("#photos").onchange=e=>{try{validatePhotos([...e.target.files]);state.photos=[...e.target.files];renderPreview();$("#applyError").textContent=""}catch(err){$("#applyError").textContent=err.message;e.target.value=""}};
$("#backBtn").onclick=()=>{if(state.step){state.step--;renderStep()}};
$("#nextBtn").onclick=async()=>{const active=$$(".step")[state.step],bad=[...active.querySelectorAll("input,select,textarea")].find(x=>!x.checkValidity());if(bad)return bad.reportValidity();if(state.step<2){state.step++;return renderStep()}try{$("#nextBtn").disabled=true;await submitApplication()}catch(e){$("#applyError").textContent=e.message}finally{$("#nextBtn").disabled=false}};
$("#statusForm").onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);$("#statusResult").innerHTML="Loading…";try{const j=await request("/api/status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(fd))});$("#statusResult").innerHTML=renderStatus(j)}catch(err){$("#statusResult").innerHTML=`<div class="error">${err.message}</div>`}};
$("#successStatusBtn").onclick=()=>{$("#applyDialog").close();openStatus()};

load().catch(e=>{document.body.insertAdjacentHTML("afterbegin",`<div style="padding:12px;text-align:center;background:#fff3cd;color:#6b5200;font-family:sans-serif">后端连接失败：${e.message}</div>`)});
})();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js'));}
