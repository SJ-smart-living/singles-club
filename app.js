(() => {
"use strict";
const C=window.APP_CONFIG;
const API=String(C.apiBaseUrl||"").replace(/\/+$/,"");
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={lang:localStorage.getItem("club_lang")||C.defaultLanguage||"zh",data:null,step:0,photos:[],selected:"",activeEventIndex:0,rotationTimer:null};
const MAP_COORDS=[[28,72],[48,82],[69,34],[75,67],[45,48]];
function dailyStartIndex(length){
  if(!length)return 0;
  const now=new Date();
  const seed=Number(`${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`);
  return seed%length;
}
const T={
zh:{
brandSub:"从真实活动开始认识",discover:"发现",apply:"申请",status:"状态",
signalTitle:"附近活动正在更新",signalText:"查看公开活动区域，具体安排由活动组织方确认。",
privacyChip:"资料默认不公开",merchantAdmin:"商家后台",eyebrow:"LOCAL SOCIAL EXPERIENCES",
headline:'今天，也许会遇见<span>新的可能</span>',headlineSub:"从一杯咖啡、一次散步或一场共同体验开始。",
join:"查看本周活动",mapTitle:"附近有哪些真实活动",updating:"近期更新",
mapCenter:"从一个小活动开始",mapNote:"仅展示活动区域，不展示个人实时位置。",
nextActivity:"下一场公开活动",requestSpot:"申请名额",updates:"正在发生",
moving:"持续流动",plans:"选择参与方式",flexible:"按需选择",
smallEvents:"小型真实活动",smallEventsSub:"先参加活动，再决定是否继续了解。",
permissionFirst:"授权优先",permissionFirstSub:"资料只用于本人选择的活动与服务。",
organizerManaged:"组织方独立运营",organizerManagedSub:"活动安排与收款由当前组织方管理。",
application:"活动参与申请",applicationSub:"填写基本信息，组织方将根据活动安排与你联系。",
name:"姓名或昵称",age:"年龄",city:"所在城市",contact:"联系方式",
goal:"希望认识怎样的人",intro:"简单介绍自己",offer:"选择活动或参与方案",
photos:"本人照片（可选，最多3张）",
consent:"我已满18岁，并同意当前活动组织方为处理本次申请和活动联系使用我提交的信息。",
formNote:"提交申请不代表活动名额已经确认，最终安排以组织方回复为准。",
back:"上一步",next:"下一步",submit:"提交申请",received:"申请已提交",
thanks:"等待组织方与你联系",saveCode:"请保存申请编号",viewStatus:"查看状态",
statusHeading:"查询申请进度",statusSub:"使用申请编号和原联系方式查询。",
applicationCode:"申请编号",check:"查询",popular:"推荐",month:"方案",choose:"选择",
platform:"俱乐部动态",activity:"活动更新",
goalOptions:[["serious","希望认真了解彼此"],["marriage","期待长期稳定关系"],["friends","先从朋友开始"]],
statusLabels:{submitted:"已提交",under_review:"处理中",approved:"可继续",awaiting_payment:"待付款",payment_pending:"付款待确认",payment_received:"付款已记录",confirmed:"活动已确认",venue_unlocked:"活动安排已开放",checked_in:"已参加",completed:"已完成",rejected:"本次未安排",cancelled:"已取消"}
},
en:{
brandSub:"Meet through real experiences",discover:"Discover",apply:"Apply",status:"Status",
signalTitle:"Nearby activities are updating",signalText:"View public activity areas. Details are confirmed by the organizer.",
privacyChip:"Private by default",merchantAdmin:"Merchant admin",eyebrow:"LOCAL SOCIAL EXPERIENCES",
headline:'Today may open <span>a new possibility</span>',headlineSub:"Start with coffee, a walk, or one shared experience.",
join:"View this week's activities",mapTitle:"Explore nearby real-world activities",updating:"Recently updated",
mapCenter:"Start with one small activity",mapNote:"Only activity areas are shown. Personal live locations are never displayed.",
nextActivity:"Next public activity",requestSpot:"Request a spot",updates:"What's happening",
moving:"Always moving",plans:"Choose how to participate",flexible:"Choose as needed",
smallEvents:"Small real-world activities",smallEventsSub:"Join an activity, then decide whether to continue.",
permissionFirst:"Permission first",permissionFirstSub:"Information is used only for activities and services you choose.",
organizerManaged:"Organizer-managed",organizerManagedSub:"The current organizer manages scheduling and payment.",
application:"Activity application",applicationSub:"Share basic information and the organizer will contact you according to availability.",
name:"Name or nickname",age:"Age",city:"City",contact:"Contact",
goal:"Who would you like to meet",intro:"Brief introduction",offer:"Choose an activity or participation option",
photos:"Real photos (optional, up to 3)",
consent:"I am 18 or older and agree that the current organizer may use the information I submit to process this application and contact me about the activity.",
formNote:"Submitting an application does not confirm a spot. Final arrangements depend on the organizer's response.",
back:"Back",next:"Next",submit:"Submit",received:"Application submitted",
thanks:"The organizer will contact you",saveCode:"Save your application number",viewStatus:"View status",
statusHeading:"Check application progress",statusSub:"Use your application number and original contact information.",
applicationCode:"Application number",check:"Check",popular:"Recommended",month:"option",choose:"Choose",
platform:"Club update",activity:"Activity update",
goalOptions:[["serious","Get to know someone seriously"],["marriage","Open to a long-term relationship"],["friends","Start as friends"]],
statusLabels:{submitted:"Submitted",under_review:"In progress",approved:"Ready to continue",awaiting_payment:"Awaiting payment",payment_pending:"Payment pending",payment_received:"Payment recorded",confirmed:"Activity confirmed",venue_unlocked:"Activity details available",checked_in:"Attended",completed:"Completed",rejected:"Not scheduled this time",cancelled:"Cancelled"}
}
}
const tr=k=>{let v=T[state.lang];for(const p of k.split("."))v=v?.[p];return v??k};
const loc=(o,f)=>state.lang==="zh"?(o?.[f+"_zh"]||o?.[f+"_en"]||""):(o?.[f+"_en"]||o?.[f+"_zh"]||"");
async function request(path,opt={},attempt=0){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),20000);
  try{
    const r=await fetch(API+path,{...opt,signal:controller.signal,headers:{...(opt.headers||{}),"Accept":"application/json"}});
    let j=null;
    try{j=await r.json()}catch{}
    if(!r.ok)throw new Error(j?.error||`Request failed (${r.status})`);
    return j;
  }catch(error){
    const retryable=(!opt.method||opt.method==="GET")&&attempt<2;
    if(retryable){
      await new Promise(resolve=>setTimeout(resolve,1800*(attempt+1)));
      return request(path,opt,attempt+1);
    }
    if(error.name==="AbortError")throw new Error(state.lang==="zh"?"服务启动较慢，请稍后重试。":"The service is taking longer to start. Please try again.");
    throw error;
  }finally{clearTimeout(timer)}
}
async function load(){if(!API)throw new Error("Backend URL is not configured");state.data=await request("/api/public");render()}
function applyText(){document.documentElement.lang=state.lang==="zh"?"zh-CN":"en";$$("[data-i18n]").forEach(x=>{const v=tr(x.dataset.i18n);if(typeof v==="string")x.textContent=v});$$("[data-i18n-html]").forEach(x=>{const v=tr(x.dataset.i18nHtml);if(typeof v==="string")x.innerHTML=v});$("#langBtn").textContent=state.lang==="zh"?"EN":"中文"}
function render(){
  applyText();
  const d=state.data,s=d.settings||{},events=d.events||[],posts=d.posts||[],plans=d.plans||[];
  $("#brandName").textContent=s.brand_name||"Singles Club";
  document.title=s.page_title||s.brand_name||"Singles Club";
  const admin=$("#adminLink");
  if(admin)admin.href=C.adminUrl||API+"/admin.html";
  state.activeEventIndex=dailyStartIndex(events.length);
  renderMap(events);
  renderPosts(posts);
  renderPlans(plans);
  renderFeatured(events,state.activeEventIndex);
  renderOffer(events,plans);
  renderGoals();
  renderSchema(s,events);
  startActivityRotation(events);
}
function renderMap(events){
  const map=$("#map");
  map.querySelectorAll(".pin").forEach(x=>x.remove());
  events.slice(0,5).forEach((e,i)=>{
    const c=MAP_COORDS[i]||[50,50];
    const b=document.createElement("button");
    b.className="pin";
    b.dataset.eventIndex=String(i);
    b.style.left=c[1]+"%";
    b.style.top=c[0]+"%";
    const spots=Math.max(0,Number(e.capacity||0)-Number(e.confirmed_count||0));
    b.innerHTML=`<b></b><span><strong>${e.city||""}</strong><br>${loc(e,"title")} · ${spots} spots</span>`;
    b.onclick=()=>{setActiveEvent(i,events,true);choose(`event:${e.id}`)};
    map.appendChild(b);
  });
  setActiveEvent(state.activeEventIndex,events,false);
}
function renderPosts(posts){const list=posts.length?[...posts,...posts]:[];$("#feedTrack").innerHTML=list.map(p=>`<article class="post"><div class="post-head"><span class="tag ${p.post_type==="activity"?"activity":""}">${p.post_type==="activity"?tr("activity"):tr("platform")}</span><small>${new Date(p.created_at).toLocaleDateString()}</small></div><p>${loc(p,"content")}</p></article>`).join("")}
function renderPlans(plans){$("#pricing").innerHTML=plans.map((p,i)=>`<article class="plan ${i===1?"popular":""}">${i===1?`<span class="popular-badge">${tr("popular")}</span>`:""}<h3>${p.name}</h3><div class="amount">$${Number(p.price).toFixed(0)}<small> / ${tr("month")}</small></div><p>${loc(p,"summary")}</p><button class="${i===1?"primary-btn":"secondary-btn"}" data-plan="${p.id}">${tr("choose")}</button></article>`).join("");$$("[data-plan]").forEach(b=>b.onclick=()=>choose("plan:"+b.dataset.plan))}
function renderFeatured(events,index=0){
  const e=events[index]||events[0];
  if(!e){
    $("#featuredTitle").textContent="—";
    $("#featuredMeta").textContent="—";
    return;
  }
  $("#featuredTitle").textContent=loc(e,"title");
  $("#featuredMeta").textContent=`${new Date(e.start_at).toLocaleString(state.lang==="zh"?"zh-CN":"en-US",{dateStyle:"medium",timeStyle:"short"})} · ${e.city||""} · $${Number(e.price||0).toFixed(0)}`;
  $("#featuredBtn").onclick=()=>choose(`event:${e.id}`);
}
function setActiveEvent(index,events,flash=true){
  if(!events.length)return;
  state.activeEventIndex=((index%events.length)+events.length)%events.length;
  const pins=$$(".pin");
  pins.forEach((pin,i)=>{
    pin.classList.toggle("active",i===state.activeEventIndex);
    pin.classList.toggle("dimmed",i!==state.activeEventIndex);
  });
  const c=MAP_COORDS[state.activeEventIndex]||[50,50];
  const map=$("#map");
  map.style.setProperty("--focus-x",c[1]+"%");
  map.style.setProperty("--focus-y",c[0]+"%");
  renderFeatured(events,state.activeEventIndex);
  $$(".route-line").forEach((line,i)=>line.classList.toggle("active",i===state.activeEventIndex%2));
  if(flash){
    const featured=$(".featured");
    featured.classList.add("flash");
    setTimeout(()=>featured.classList.remove("flash"),650);
  }
}
function startActivityRotation(events){
  if(state.rotationTimer)clearInterval(state.rotationTimer);
  if(events.length<2)return;
  state.rotationTimer=setInterval(()=>{
    setActiveEvent(state.activeEventIndex+1,events,true);
  },Math.max(4,Number(C.rotationSeconds||7))*1000);
}
function renderOffer(events,plans){$("#offerSelect").innerHTML=[...events.map(e=>`<option value="event:${e.id}">${loc(e,"title")} · $${Number(e.price||0).toFixed(0)}</option>`),...plans.map(p=>`<option value="plan:${p.id}">${p.name} · $${Number(p.price).toFixed(0)}</option>`)].join("");if(state.selected)$("#offerSelect").value=state.selected}
function renderGoals(){$("#goalSelect").innerHTML=`<option value="">—</option>`+tr("goalOptions").map(([v,l])=>`<option value="${v}">${l}</option>`).join("")}
function choose(v){state.selected=v;renderOffer(state.data.events||[],state.data.plans||[]);openApply()}
function openApply(){state.step=0;$("#applyForm").reset();state.photos=[];$("#preview").innerHTML="";$("#applyError").textContent="";$("#applyForm").style.display="block";$("#success").classList.remove("show");renderStep();$("#applyDialog").showModal()}
function openStatus(){$("#statusResult").innerHTML="";$("#statusDialog").showModal()}
function renderStep(){$$(".step").forEach((x,i)=>x.classList.toggle("active",i===state.step));$$(".progress i").forEach((x,i)=>x.classList.toggle("active",i<=state.step));$("#backBtn").style.visibility=state.step?"visible":"hidden";$("#nextBtn").textContent=state.step===2?tr("submit"):tr("next")}
function validatePhotos(files){if(files.length>C.maxPhotos)throw new Error(`Maximum ${C.maxPhotos} photos`);files.forEach(f=>{if(!C.allowedPhotoTypes.includes(f.type))throw new Error("Unsupported image type");if(f.size>C.maxPhotoBytes)throw new Error("Image exceeds 5MB")})}
function renderPreview(){$("#preview").innerHTML=state.photos.map((f,i)=>`<div class="preview-item"><img src="${URL.createObjectURL(f)}"><button type="button" data-rm="${i}">×</button></div>`).join("");$$("[data-rm]").forEach(b=>b.onclick=()=>{state.photos.splice(Number(b.dataset.rm),1);renderPreview()})}
async function submitApplication(){const fd=new FormData($("#applyForm"));state.photos.forEach(f=>fd.append("photos",f));const j=await request("/api/applications",{method:"POST",body:fd});$("#applyForm").style.display="none";$("#success").classList.add("show");$("#code").textContent=j.application_code}
function timeline(status){return C.statusOrder.map(s=>`<div class="${C.statusOrder.indexOf(s)<=C.statusOrder.indexOf(status)?"done":""}">● ${tr("statusLabels."+s)}</div>`).join("")}
function renderStatus(j){let payment="";if(["approved","awaiting_payment","payment_pending"].includes(j.status)&&j.payment){if(j.payment.stripe_url)payment+=`<div class="paymentbox"><strong>Stripe</strong><p><a class="primary-btn" target="_blank" rel="noopener" href="${j.payment.stripe_url}">Pay securely</a></p></div>`;if(j.payment.zelle_contact)payment+=`<div class="paymentbox"><strong>Zelle</strong><p>${j.payment.zelle_name||""}<br>${j.payment.zelle_contact}</p></div>`;if(j.payment.has_qr)payment+=`<div class="paymentbox"><strong>${j.payment.qr_label||"Payment QR"}</strong><img class="qr" src="${API}/api/payment-qr"></div>`}return `<div class="statusbox"><h3>${tr("statusLabels."+j.status)}</h3><p>${j.event_title||j.plan_name||""}</p><div class="timeline">${timeline(j.status)}</div>${payment}${j.private_venue?`<div class="paymentbox"><strong>Venue</strong><p>${j.private_venue}</p></div>`:""}</div>`}
function renderSchema(s,events){const g=[{"@type":"Organization","name":s.brand_name||"Singles Club","url":C.siteUrl,"email":s.contact_email||"","areaServed":s.city||""},{"@type":"WebSite","name":s.brand_name||"Singles Club","url":C.siteUrl}];events.forEach(e=>g.push({"@type":"Event","name":e.title_en||e.title_zh,"startDate":e.start_at,"eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode","eventStatus":"https://schema.org/EventScheduled","location":{"@type":"Place","name":e.public_venue||e.city||"","address":{"@type":"PostalAddress","addressLocality":e.city||"","addressRegion":e.region||"","addressCountry":e.country||"US"}},"offers":{"@type":"Offer","price":String(e.price||0),"priceCurrency":e.currency||"USD","url":C.siteUrl,"availability":"https://schema.org/LimitedAvailability"}}));$("#structuredData").textContent=JSON.stringify({"@context":"https://schema.org","@graph":g})}
$("#langBtn").onclick=()=>{state.lang=state.lang==="zh"?"en":"zh";localStorage.setItem("club_lang",state.lang);render()};
["#openApplySide","#openApplyTop","#openApplyMobile"].forEach(s=>{const el=$(s);if(el)el.onclick=openApply});
["#openStatusSide","#openStatusTop","#openStatusMobile"].forEach(s=>{const el=$(s);if(el)el.onclick=openStatus});
$("#closeApply").onclick=()=>$("#applyDialog").close();$("#closeStatus").onclick=()=>$("#statusDialog").close();
$("#photos").onchange=e=>{try{validatePhotos([...e.target.files]);state.photos=[...e.target.files];renderPreview();$("#applyError").textContent=""}catch(err){$("#applyError").textContent=err.message;e.target.value=""}};
$("#backBtn").onclick=()=>{if(state.step){state.step--;renderStep()}};
$("#nextBtn").onclick=async()=>{const active=$$(".step")[state.step],bad=[...active.querySelectorAll("input,select,textarea")].find(x=>!x.checkValidity());if(bad)return bad.reportValidity();if(state.step<2){state.step++;return renderStep()}try{$("#nextBtn").disabled=true;await submitApplication()}catch(e){$("#applyError").textContent=e.message}finally{$("#nextBtn").disabled=false}};
$("#statusForm").onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);$("#statusResult").innerHTML="Loading…";try{const j=await request("/api/status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(fd))});$("#statusResult").innerHTML=renderStatus(j)}catch(err){$("#statusResult").innerHTML=`<div class="error">${err.message}</div>`}};
$("#successStatusBtn").onclick=()=>{$("#applyDialog").close();openStatus()};
load().catch(e=>{
  const box=document.createElement("div");
  box.className="connection-alert";
  box.innerHTML=`<span>${state.lang==="zh"?"服务正在启动或暂时不可用：":"The service is starting or temporarily unavailable: "}${e.message}</span><button type="button">${state.lang==="zh"?"重新连接":"Retry"}</button>`;
  box.querySelector("button").onclick=()=>location.reload();
  document.body.prepend(box);
});
})();