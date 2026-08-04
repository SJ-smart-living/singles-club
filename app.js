(() => {
"use strict";

const C = APP_CONFIG;
const state = {
  lang: localStorage.getItem("club_lang") || C.defaultLanguage || "zh",
  tenant: null,
  events: [],
  posts: [],
  plans: [],
  learning: [],
  payments: [],
  applicationStep: 0,
  applicationPhotos: [],
  selectedOffer: "",
  adminToken: sessionStorage.getItem("admin_token") || "",
  adminUser: null,
  adminTab: "dashboard"
};

const T = {
zh: {
myStatus:"我的申请",apply:"申请加入",eyebrow:"真实活动 · 共同成长 · 认真连接",heroTitle:'遇见一个<span>愿意走进未来</span>的人',heroText:"不是无限刷人。通过真实活动、共同学习和经过授权的会员资料，慢慢认识一个值得认真了解的人。",viewSpots:"查看本周名额",checkStatus:"查询申请状态",humanReview:"人工确认",privateByDefault:"默认不公开",merchantPayment:"商家直接收款",nearby:"附近正在发生",liveUpdates:"实时活动",mapTitle:"点击闪烁城市查看活动",mapPrivacy:"只显示活动区域，不显示会员实时位置。",latestUpdates:"最新动态",membership:"会员方案",events:"近期活动",eventHeading:"先一起做一件真实的小事",venuePrivacy:"具体地点在报名和付款确认后提供。",learning:"共同学习",learningHeading:"在一起完成事情时，真正了解彼此",fullPlans:"完整会员方案",plansHeading:"解锁参与，不是购买他人的隐私",trustTitle:"可信状态",trustHeading:"真实，但不过度暴露",sourceSelf:"本人填写",sourceSelfSub:"资料来源清楚",sourceClub:"俱乐部确认",sourceClubSub:"真人与活动状态",sourceUpdated:"最近更新",sourcePermission:"授权可见",sourcePermissionSub:"本人控制公开范围",clearRules:"清楚的规则，真实的边界",clearRulesText:"活动由当前商家独立运营并收款。平台提供软件，不保证任何关系结果，也不公开出售会员隐私。",privacyPolicy:"隐私政策",terms:"服务条款",guidelines:"社区规范",refund:"退款与取消",backHome:"返回首页",application:"会员申请",applyHeading:"一分钟完成申请",applySub:"资料默认不公开。审核通过后，俱乐部再确认付款和活动安排。",name:"姓名或昵称",age:"年龄",city:"城市",contact:"电话或邮箱",goal:"关系目标",intro:"一句话介绍自己",chooseOffer:"选择活动或会员方案",photos:"添加1—3张本人照片",photoRules:"每张不超过5MB，仅支持 JPG、PNG、WEBP。",consentText:"我确认已满18岁，并同意当前商家仅为审核、活动联系和本人选择的服务使用本次资料。",policyConsent:"我同意隐私政策、服务条款、社区规范和退款规则。",back:"上一步",next:"下一步",submit:"提交申请",received:"申请已收到",saveCode:"请保存你的申请编号：",statusHint:"你可以使用申请编号和联系方式查询审核、付款和地址状态。",viewStatus:"查看申请状态",statusTitle:"申请状态",statusHeading:"查看审核、付款和活动地址",applicationCodeLabel:"申请编号",check:"查询",dashboard:"概览",manageEvents:"活动管理",managePosts:"动态管理",applications:"会员申请",paymentSettings:"收款设置",planSettings:"套餐设置",clubSettings:"俱乐部设置",logout:"退出",merchantLogin:"商家登录",email:"邮箱",password:"密码",login:"登录",platformPost:"俱乐部发布",activityPost:"活动更新",memberPost:"会员动态",requestSpot:"申请名额",choosePlan:"选择方案",month:"月",mostPopular:"最受欢迎",statusLabels:{submitted:"已提交",under_review:"审核中",approved:"已通过",awaiting_payment:"待付款",payment_pending:"付款待确认",payment_received:"已收款",confirmed:"报名成功",venue_unlocked:"地址已开放",checked_in:"已签到",completed:"已完成",rejected:"未通过",cancelled:"已取消"},goalOptions:[["serious","认真寻找长期关系"],["marriage","希望认识结婚对象"],["friends","先从朋友开始"]],legal:{privacy:["隐私政策","当前商家仅收集完成会员审核、活动联系、付款确认和用户选择服务所必要的信息。证件原件、付款凭证、联系电话和精确地址默认不公开。用户可请求访问、更正、导出或删除其资料。平台软件提供方不直接出售会员资料。"],terms:["服务条款","当前商家独立提供活动与会员服务并直接收款。平台不保证建立恋爱关系、婚姻或任何特定结果。用户必须年满18岁，提供真实信息，并遵守活动规则。"],guidelines:["社区规范","禁止骚扰、冒充、诈骗、索要金钱、诱导投资、未经同意传播照片或联系方式。用户可举报、拒绝、暂停或退出。"],refund:["退款与取消","退款与取消由当前商家按页面公布的规则处理。活动取消、迟到、未到场、会员取消和不可退项目应在付款前清楚显示。"]}},
en: {
myStatus:"My application",apply:"Apply",eyebrow:"REAL EVENTS · SHARED GROWTH · SERIOUS CONNECTIONS",heroTitle:'Meet someone <span>ready to build a future</span>',heroText:"No endless swiping. Meet through real events, shared learning, and profiles displayed only with permission.",viewSpots:"View this week's spots",checkStatus:"Check application",humanReview:"Human review",privateByDefault:"Private by default",merchantPayment:"Merchant-direct payment",nearby:"Happening nearby",liveUpdates:"Live events",mapTitle:"Tap a pulsing city to view activity",mapPrivacy:"Only event areas are shown—never member live locations.",latestUpdates:"Latest updates",membership:"Membership",events:"Upcoming events",eventHeading:"Begin by doing one real thing together",venuePrivacy:"Exact venues appear after registration and payment confirmation.",learning:"Shared learning",learningHeading:"You understand someone by doing things together",fullPlans:"Membership plans",plansHeading:"Unlock participation—not other people's private data",trustTitle:"Trust status",trustHeading:"Real, without overexposure",sourceSelf:"Member provided",sourceSelfSub:"Source is clearly labeled",sourceClub:"Club confirmed",sourceClubSub:"Real-person and event status",sourceUpdated:"Last updated",sourcePermission:"Permission-based visibility",sourcePermissionSub:"Members control what is shared",clearRules:"Clear rules and real boundaries",clearRulesText:"The current merchant independently operates events and receives payments. The software platform does not guarantee relationship outcomes or sell member privacy.",privacyPolicy:"Privacy Policy",terms:"Terms of Service",guidelines:"Community Guidelines",refund:"Refund & Cancellation",backHome:"Back home",application:"Member application",applyHeading:"Apply in one minute",applySub:"Private by default. The club confirms payment and event arrangements after review.",name:"Name or nickname",age:"Age",city:"City",contact:"Phone or email",goal:"Relationship goal",intro:"One-line introduction",chooseOffer:"Choose an event or membership",photos:"Add 1–3 real photos",photoRules:"Maximum 5MB each. JPG, PNG, and WEBP only.",consentText:"I confirm I am 18 or older and consent to use of this information only for review, event contact, and services I choose.",policyConsent:"I agree to the privacy policy, terms, community guidelines, and refund rules.",back:"Back",next:"Next",submit:"Submit",received:"Application received",saveCode:"Save your application number:",statusHint:"Use your application number and contact to check review, payment, and venue status.",viewStatus:"View status",statusTitle:"Application status",statusHeading:"Check review, payment, and venue access",applicationCodeLabel:"Application number",check:"Check",dashboard:"Dashboard",manageEvents:"Events",managePosts:"Posts",applications:"Applications",paymentSettings:"Payments",planSettings:"Plans",clubSettings:"Club settings",logout:"Log out",merchantLogin:"Merchant login",email:"Email",password:"Password",login:"Log in",platformPost:"Club post",activityPost:"Event update",memberPost:"Member post",requestSpot:"Request a spot",choosePlan:"Choose plan",month:"month",mostPopular:"Most popular",statusLabels:{submitted:"Submitted",under_review:"Under review",approved:"Approved",awaiting_payment:"Awaiting payment",payment_pending:"Payment pending",payment_received:"Payment received",confirmed:"Confirmed",venue_unlocked:"Venue unlocked",checked_in:"Checked in",completed:"Completed",rejected:"Rejected",cancelled:"Cancelled"},goalOptions:[["serious","Seeking a serious long-term relationship"],["marriage","Hoping to meet a future spouse"],["friends","Start as friends"]],legal:{privacy:["Privacy Policy","The current merchant collects only the information necessary for member review, event contact, payment confirmation, and services selected by the user. Identity documents, payment receipts, contact details, and exact addresses are private by default. Users may request access, correction, export, or deletion. The software provider does not directly sell member data."],terms:["Terms of Service","The current merchant independently provides events and membership services and receives payments directly. The platform does not guarantee a relationship, marriage, or any specific outcome. Users must be at least 18, provide truthful information, and follow event rules."],guidelines:["Community Guidelines","Harassment, impersonation, fraud, requests for money, investment solicitation, and unauthorized sharing of photos or contact details are prohibited. Users may report, decline, pause, or leave."],refund:["Refund & Cancellation","Refunds and cancellations are handled by the current merchant under the rules displayed before payment. Event cancellation, late arrival, no-shows, membership cancellation, and non-refundable items must be clearly disclosed."]}}
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const tr = (key) => {
  const parts = key.split(".");
  let value = T[state.lang];
  for (const p of parts) value = value?.[p];
  return value ?? key;
};

function api(path, options={}) {
  const headers = {
    "apikey": C.supabaseAnonKey,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (state.adminToken) headers.Authorization = `Bearer ${state.adminToken}`;
  return fetch(`${C.supabaseUrl}${path}`, {...options, headers});
}
function tenantFilter() {
  if (!state.tenant?.id) throw new Error("Tenant not loaded");
  return `tenant_id=eq.${state.tenant.id}`;
}
function isConfigured() {
  return !C.supabaseUrl.includes("YOUR_PROJECT") && !C.supabaseAnonKey.includes("YOUR_SUPABASE");
}
function showConfigError() {
  document.body.innerHTML = `<div style="max-width:760px;margin:80px auto;padding:25px;font-family:sans-serif"><h1>Setup required</h1><p>Open <code>config.js</code> and add the Supabase project URL and anon key, then run the SQL files in the <code>supabase</code> folder.</p></div>`;
}

async function loadPublicData() {
  const tenantRes = await api(`/rest/v1/tenants?slug=eq.${encodeURIComponent(C.tenantSlug)}&select=*&limit=1`);
  if (!tenantRes.ok) throw new Error(await tenantRes.text());
  state.tenant = (await tenantRes.json())[0];
  if (!state.tenant) throw new Error("Tenant not found");

  const [events, posts, plans, learning, payments] = await Promise.all([
    api(`/rest/v1/events?${tenantFilter()}&is_public=eq.true&order=start_at.asc&select=*`),
    api(`/rest/v1/posts?${tenantFilter()}&is_public=eq.true&expires_at=is.null,expires_at=gt.${encodeURIComponent(new Date().toISOString())}&order=created_at.desc&limit=10&select=*`),
    api(`/rest/v1/plans?${tenantFilter()}&is_active=eq.true&order=sort_order.asc&select=*`),
    api(`/rest/v1/learning_groups?${tenantFilter()}&is_public=eq.true&order=sort_order.asc&select=*`),
    api(`/rest/v1/payment_methods?${tenantFilter()}&is_active=eq.true&order=sort_order.asc&select=*`)
  ]);
  state.events = events.ok ? await events.json() : [];
  state.posts = posts.ok ? await posts.json() : [];
  state.plans = plans.ok ? await plans.json() : [];
  state.learning = learning.ok ? await learning.json() : [];
  state.payments = payments.ok ? await payments.json() : [];
}

function localize(obj, field) {
  return state.lang === "zh" ? (obj[`${field}_zh`] || obj[`${field}_en`] || "") : (obj[`${field}_en`] || obj[`${field}_zh`] || "");
}

function applyLanguage() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  $$("[data-i18n]").forEach(el => {
    const value = tr(el.dataset.i18n);
    if (typeof value === "string") el.textContent = value;
  });
  $$("[data-i18n-html]").forEach(el => {
    const value = tr(el.dataset.i18nHtml);
    if (typeof value === "string") el.innerHTML = value;
  });
  $("#langBtn").textContent = state.lang === "zh" ? "EN" : "中文";
  renderAll();
}

function renderAll() {
  if (!state.tenant) return;
  const brand = state.tenant.name || C.brandFallback;
  $("#brandName").textContent = brand;
  $("#footerBrand").textContent = brand;
  $("#adminBrand").textContent = brand;
  document.title = state.tenant.page_title || brand;
  $("#canonicalLink").href = state.tenant.site_url || C.siteUrl;
  $("#updatedDate").textContent = new Date(state.tenant.updated_at || Date.now()).toLocaleDateString(state.lang==="zh"?"zh-CN":"en-US",{year:"numeric",month:"long"});
  renderMap();
  renderFeed();
  renderPlans();
  renderEvents();
  renderLearning();
  renderOfferSelect();
  renderGoalSelect();
  renderSchema();
}

function renderMap() {
  const map = $("#activityMap");
  map.querySelectorAll(".map-pin").forEach(x => x.remove());
  const coords = [[34,67],[58,80],[70,38],[76,67],[44,48]];
  state.events.slice(0,5).forEach((e,i) => {
    const b = document.createElement("button");
    b.className = "map-pin";
    b.style.left = coords[i][1]+"%";
    b.style.top = coords[i][0]+"%";
    b.innerHTML = `<i></i><span><strong>${e.city}</strong><br>${localize(e,"title")} · ${Math.max(0,(e.capacity||0)-(e.confirmed_count||0))} spots</span>`;
    b.onclick = () => { state.selectedOffer = `event:${e.id}`; route("apply"); };
    map.appendChild(b);
  });
}
function renderFeed() {
  const items = [...state.posts,...state.posts];
  $("#feedTrack").innerHTML = items.map(p => `<article class="feed-card"><div class="feed-meta"><span class="tag ${p.post_type==="activity"?"activity":""}">${p.post_type==="activity"?tr("activityPost"):p.post_type==="member"?tr("memberPost"):tr("platformPost")}</span><span>${new Date(p.created_at).toLocaleDateString()}</span></div><p>${localize(p,"content")}</p></article>`).join("");
}
function renderPlans() {
  $("#planMiniList").innerHTML = state.plans.map((p,i)=>`<div class="mini-plan ${i===1?"popular":""}"><strong><span>${p.name}</span><span>$${Number(p.price).toFixed(0)}</span></strong><p>${localize(p,"summary")}</p><button class="btn ${i===1?"rose":"primary"}" onclick="chooseOffer('plan:${p.id}')">${tr("choosePlan")}</button></div>`).join("");
  $("#planList").innerHTML = state.plans.map((p,i)=>`<article class="plan-card ${i===1?"popular":""}">${i===1?`<span class="tag">${tr("mostPopular")}</span>`:""}<div class="eyebrow">${p.name}</div><div class="plan-price">$${Number(p.price).toFixed(0)} <small>/ ${tr("month")}</small></div><p>${localize(p,"summary")}</p><ul>${(localize(p,"features")||"").split("\n").filter(Boolean).map(x=>`<li>${x}</li>`).join("")}</ul><button class="btn ${i===1?"rose":"primary"}" onclick="chooseOffer('plan:${p.id}')">${tr("choosePlan")}</button></article>`).join("");
}
function renderEvents() {
  $("#eventList").innerHTML = state.events.map(e=>`<article class="event-card"><div class="event-image" style="${e.image_url?`background-image:url('${e.image_url}');background-size:cover;background-position:center`:''}"></div><div class="event-body"><h3>${localize(e,"title")}</h3><p>${new Date(e.start_at).toLocaleString(state.lang==="zh"?"zh-CN":"en-US",{dateStyle:"medium",timeStyle:"short"})}<br>${e.city} · ${Math.max(0,(e.capacity||0)-(e.confirmed_count||0))} spots</p><div class="plan-price">$${Number(e.price||0).toFixed(0)}</div><button class="btn primary" onclick="chooseOffer('event:${e.id}')">${tr("requestSpot")}</button></div></article>`).join("");
}
function renderLearning() {
  $("#learningList").innerHTML = state.learning.map(g=>`<article class="learning-card"><span class="tag activity">${g.city||""}</span><h3>${localize(g,"title")}</h3><p>${localize(g,"description")}</p><button class="btn ghost" onclick="route('apply')">${tr("apply")}</button></article>`).join("");
}
function renderGoalSelect() {
  $("#goalSelect").innerHTML = `<option value="">—</option>` + tr("goalOptions").map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
}
function renderOfferSelect() {
  const s = $("#offerSelect");
  if (!s) return;
  s.innerHTML = [
    ...state.events.map(e=>`<option value="event:${e.id}">${localize(e,"title")} · $${Number(e.price||0).toFixed(0)}</option>`),
    ...state.plans.map(p=>`<option value="plan:${p.id}">${p.name} · $${Number(p.price).toFixed(0)}</option>`)
  ].join("");
  if (state.selectedOffer) s.value = state.selectedOffer;
}
function renderSchema() {
  const site = state.tenant.site_url || C.siteUrl;
  const graph = [
    {"@type":"Organization","@id":site+"#organization","name":state.tenant.name,"url":site,"email":state.tenant.contact_email,"areaServed":state.tenant.city},
    {"@type":"WebSite","@id":site+"#website","url":site,"name":state.tenant.name,"publisher":{"@id":site+"#organization"}}
  ];
  state.events.forEach(e=>graph.push({"@type":"Event","name":e.title_en||e.title_zh,"startDate":e.start_at,"eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode","eventStatus":"https://schema.org/EventScheduled","location":{"@type":"Place","name":e.venue_public||e.city,"address":{"@type":"PostalAddress","addressLocality":e.city,"addressRegion":e.region,"addressCountry":e.country}},"offers":{"@type":"Offer","price":String(e.price||0),"priceCurrency":e.currency||"USD","url":site+"#apply","availability":"https://schema.org/LimitedAvailability"},"organizer":{"@id":site+"#organization"}}));
  $("#structuredData").textContent = JSON.stringify({"@context":"https://schema.org","@graph":graph});
}

function route(name) {
  $$(".route").forEach(x=>x.classList.remove("active"));
  if (["privacy","terms","guidelines","refund"].includes(name)) {
    $("#legalApp").classList.add("active");
    renderLegal(name);
  } else {
    const map = {home:"publicApp",apply:"applyApp",status:"statusApp",admin:"adminApp"};
    $("#"+(map[name]||"publicApp")).classList.add("active");
  }
  history.replaceState(null,"","#"+name);
  scrollTo(0,0);
  if (name==="admin") renderAdmin();
}
function renderLegal(type) {
  const [title,body] = tr(`legal.${type}`);
  $("#legalContent").innerHTML = `<h1>${title}</h1><p>${body}</p><h2>${state.tenant.name||""}</h2><p>${state.tenant.contact_email||""}<br>${state.tenant.business_address||""}</p>`;
}

function validatePhotos(files) {
  if (files.length > C.maxPhotos) throw new Error(`Maximum ${C.maxPhotos} photos`);
  files.forEach(f=>{
    if (!C.allowedPhotoTypes.includes(f.type)) throw new Error("Unsupported image type");
    if (f.size > C.maxPhotoBytes) throw new Error("Image exceeds size limit");
  });
}
function renderPhotoPreview() {
  $("#photoPreview").innerHTML = state.applicationPhotos.map((f,i)=>`<div class="photo-item"><img src="${URL.createObjectURL(f)}"><button type="button" data-remove-photo="${i}">×</button></div>`).join("");
  $$("[data-remove-photo]").forEach(b=>b.onclick=()=>{state.applicationPhotos.splice(Number(b.dataset.removePhoto),1);renderPhotoPreview();});
}
async function uploadPhoto(file, applicationId, index) {
  const ext = file.name.split(".").pop().toLowerCase();
  const path = `${state.tenant.id}/${applicationId}/${index}-${crypto.randomUUID()}.${ext}`;
  const r = await fetch(`${C.supabaseUrl}/storage/v1/object/member-photos/${path}`,{
    method:"POST",
    headers:{"apikey":C.supabaseAnonKey,"Authorization":`Bearer ${C.supabaseAnonKey}`,"Content-Type":file.type,"x-upsert":"false"},
    body:file
  });
  if (!r.ok) throw new Error(await r.text());
  return path;
}
async function submitApplication() {
  const form = $("#applicationForm");
  const fd = new FormData(form);
  const offer = String(fd.get("offer_key")||"");
  const [offerType,offerId] = offer.split(":");
  const code = "SC-"+new Date().toISOString().slice(2,10).replaceAll("-","")+"-"+Math.random().toString(36).slice(2,7).toUpperCase();
  const payload = {
    tenant_id:state.tenant.id,
    application_code:code,
    display_name:fd.get("display_name"),
    age:Number(fd.get("age")),
    city:fd.get("city"),
    contact:fd.get("contact"),
    relationship_goal:fd.get("relationship_goal"),
    intro:fd.get("intro"),
    offer_type:offerType,
    event_id:offerType==="event"?offerId:null,
    plan_id:offerType==="plan"?offerId:null,
    status:"submitted",
    consent_at:new Date().toISOString(),
    source_version:"v1.0.0"
  };
  const r = await api("/rest/v1/applications?select=id,application_code",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(payload)});
  if (!r.ok) throw new Error(await r.text());
  const app = (await r.json())[0];
  for (let i=0;i<state.applicationPhotos.length;i++) {
    const storagePath = await uploadPhoto(state.applicationPhotos[i],app.id,i);
    const pr = await api("/rest/v1/application_photos",{method:"POST",body:JSON.stringify({tenant_id:state.tenant.id,application_id:app.id,storage_path:storagePath,sort_order:i})});
    if (!pr.ok) throw new Error(await pr.text());
  }
  $("#applicationForm").classList.add("hidden");
  $("#applicationSuccess").classList.remove("hidden");
  $("#applicationCode").textContent = app.application_code;
}

async function checkStatus(code, contact) {
  const r = await api(`/rest/v1/rpc/public_application_status`,{method:"POST",body:JSON.stringify({p_tenant_slug:C.tenantSlug,p_application_code:code,p_contact:contact})});
  if (!r.ok) throw new Error(await r.text());
  return await r.json();
}
function statusTimeline(current) {
  return C.statusOrder.map(s=>`<div class="status-step ${C.statusOrder.indexOf(s)<=C.statusOrder.indexOf(current)?"done":""}">● ${tr("statusLabels."+s)}</div>`).join("");
}
function renderStatus(result) {
  if (!result || !result.length) return `<div class="error">No matching application found.</div>`;
  const a = result[0];
  let payment = "";
  if (["approved","awaiting_payment","payment_pending"].includes(a.status)) {
    const methods = state.payments.filter(p=>!p.offer_type || p.offer_type===a.offer_type);
    payment = methods.map(p=>`<div class="payment-box"><strong>${p.method_name}</strong><p>${localize(p,"instructions")}</p>${p.payment_url?`<a class="btn primary" target="_blank" rel="noopener" href="${p.payment_url}">Pay</a>`:""}${p.qr_image_url?`<img class="payment-qr" src="${p.qr_image_url}" alt="Payment QR">`:""}</div>`).join("");
  }
  const venue = a.status==="venue_unlocked"||a.status==="checked_in"||a.status==="completed" ? `<div class="payment-box"><strong>Venue</strong><p>${a.private_venue||""}</p></div>` : "";
  return `<div class="status-card"><h3>${tr("statusLabels."+a.status)}</h3><div class="status-timeline">${statusTimeline(a.status)}</div>${payment}${venue}</div>`;
}

async function signIn(email,password) {
  const r = await fetch(`${C.supabaseUrl}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"apikey":C.supabaseAnonKey,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
  if (!r.ok) throw new Error(await r.text());
  const data = await r.json();
  state.adminToken = data.access_token;
  state.adminUser = data.user;
  sessionStorage.setItem("admin_token",state.adminToken);
}
async function adminFetch(table, query="") {
  const r = await api(`/rest/v1/${table}?${tenantFilter()}${query?`&${query}`:""}`);
  if (!r.ok) throw new Error(await r.text());
  return await r.json();
}
async function adminSave(table, payload, id=null) {
  const url = id ? `/rest/v1/${table}?id=eq.${id}` : `/rest/v1/${table}`;
  const r = await api(url,{method:id?"PATCH":"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify({...payload,tenant_id:state.tenant.id})});
  if (!r.ok) throw new Error(await r.text());
  return await r.json();
}
async function renderAdmin() {
  if (!state.adminToken) {
    $("#adminLogin").classList.remove("hidden");
    $("#adminWorkspace").classList.add("hidden");
    return;
  }
  $("#adminLogin").classList.add("hidden");
  $("#adminWorkspace").classList.remove("hidden");
  await renderAdminTab();
}
async function renderAdminTab() {
  const panel = $("#adminPanel");
  panel.innerHTML = `<p>Loading…</p>`;
  try {
    if (state.adminTab==="dashboard") {
      const apps = await adminFetch("applications","select=id,status,created_at");
      const counts = Object.fromEntries(["submitted","under_review","awaiting_payment","payment_pending","confirmed"].map(s=>[s,apps.filter(a=>a.status===s).length]));
      panel.innerHTML = `<div class="admin-toolbar"><h1>${tr("dashboard")}</h1></div><div class="admin-grid">${Object.entries(counts).map(([k,v])=>`<div class="admin-card"><span>${tr("statusLabels."+k)}</span><strong>${v}</strong></div>`).join("")}</div>`;
    } else if (state.adminTab==="events") {
      const rows = await adminFetch("events","order=start_at.asc&select=*");
      panel.innerHTML = `<div class="admin-toolbar"><h1>${tr("manageEvents")}</h1><button class="btn primary" id="newEventBtn">+ Event</button></div>${eventAdminForm()}<table class="admin-table"><thead><tr><th>Title</th><th>Date</th><th>City</th><th>Price</th><th>Status</th></tr></thead><tbody>${rows.map(e=>`<tr data-edit-event='${JSON.stringify(e).replaceAll("'","&#39;")}'><td>${e.title_en||e.title_zh}</td><td>${new Date(e.start_at).toLocaleString()}</td><td>${e.city}</td><td>$${e.price}</td><td>${e.is_public?"Public":"Hidden"}</td></tr>`).join("")}</tbody></table>`;
      bindEventAdmin();
    } else if (state.adminTab==="posts") {
      const rows = await adminFetch("posts","order=created_at.desc&select=*");
      panel.innerHTML = `<div class="admin-toolbar"><h1>${tr("managePosts")}</h1></div>${postAdminForm()}<table class="admin-table"><tbody>${rows.map(p=>`<tr><td>${p.post_type}</td><td>${p.content_en||p.content_zh}</td><td>${new Date(p.created_at).toLocaleDateString()}</td></tr>`).join("")}</tbody></table>`;
      bindPostAdmin();
    } else if (state.adminTab==="applications") {
      const rows = await adminFetch("applications","order=created_at.desc&select=*");
      panel.innerHTML = `<div class="admin-toolbar"><h1>${tr("applications")}</h1></div><table class="admin-table"><thead><tr><th>Code</th><th>Name</th><th>Contact</th><th>Offer</th><th>Status</th><th>Update</th></tr></thead><tbody>${rows.map(a=>`<tr><td>${a.application_code}</td><td>${a.display_name}</td><td>${a.contact}</td><td>${a.offer_type}</td><td><span class="status-pill">${tr("statusLabels."+a.status)}</span></td><td><select data-app-status="${a.id}">${[...C.statusOrder,"rejected","cancelled"].map(s=>`<option value="${s}" ${s===a.status?"selected":""}>${tr("statusLabels."+s)}</option>`).join("")}</select><input data-app-venue="${a.id}" placeholder="Private venue" value="${a.private_venue||""}"></td></tr>`).join("")}</tbody></table>`;
      $$("[data-app-status]").forEach(sel=>sel.onchange=async()=>{const id=sel.dataset.appStatus;const venue=$(`[data-app-venue="${id}"]`).value;await adminSave("applications",{status:sel.value,private_venue:venue},id);});
    } else if (state.adminTab==="payments") {
      const rows = await adminFetch("payment_methods","order=sort_order.asc&select=*");
      panel.innerHTML = `<div class="admin-toolbar"><h1>${tr("paymentSettings")}</h1></div>${paymentAdminForm()}<table class="admin-table"><tbody>${rows.map(p=>`<tr><td>${p.method_name}</td><td>${p.payment_url||""}</td><td>${p.is_active?"Active":"Off"}</td></tr>`).join("")}</tbody></table>`;
      bindPaymentAdmin();
    } else if (state.adminTab==="plans") {
      const rows = await adminFetch("plans","order=sort_order.asc&select=*");
      panel.innerHTML = `<div class="admin-toolbar"><h1>${tr("planSettings")}</h1></div>${planAdminForm()}<table class="admin-table"><tbody>${rows.map(p=>`<tr><td>${p.name}</td><td>$${p.price}</td><td>${p.is_active?"Active":"Off"}</td></tr>`).join("")}</tbody></table>`;
      bindPlanAdmin();
    } else if (state.adminTab==="club") {
      panel.innerHTML = clubAdminForm();
      bindClubAdmin();
    }
  } catch (e) { panel.innerHTML = `<div class="error">${e.message}</div>`; }
}
function eventAdminForm(){return `<form id="eventAdminForm" class="admin-form"><input type="hidden" name="id"><input name="title_zh" placeholder="中文名称"><input name="title_en" placeholder="English title" required><input type="datetime-local" name="start_at" required><input name="city" placeholder="City" required><input name="region" placeholder="State/Region"><input name="country" value="US"><input name="venue_public" placeholder="Public venue description"><input name="private_venue" placeholder="Private venue after confirmation"><input type="number" name="capacity" placeholder="Capacity"><input type="number" step="0.01" name="price" placeholder="Price"><input name="currency" value="USD"><input name="image_url" placeholder="Image URL"><label><input type="checkbox" name="is_public" checked> Public</label><button class="btn primary">Save event</button></form>`}
function postAdminForm(){return `<form id="postAdminForm" class="admin-form"><select name="post_type"><option value="platform">Platform</option><option value="activity">Activity</option></select><textarea name="content_zh" placeholder="中文动态"></textarea><textarea name="content_en" placeholder="English post" required></textarea><input type="datetime-local" name="expires_at"><label><input type="checkbox" name="is_public" checked> Public</label><button class="btn primary">Publish</button></form>`}
function paymentAdminForm(){return `<form id="paymentAdminForm" class="admin-form"><input name="method_name" placeholder="Stripe / Zelle / QR" required><select name="method_type"><option value="stripe">Stripe</option><option value="zelle">Zelle</option><option value="qr">QR</option><option value="cash">On-site</option></select><input name="payment_url" placeholder="Payment link"><input name="qr_image_url" placeholder="QR image URL"><textarea name="instructions_zh" placeholder="中文付款说明"></textarea><textarea name="instructions_en" placeholder="English instructions"></textarea><label><input type="checkbox" name="is_active" checked> Active</label><button class="btn primary">Save payment method</button></form>`}
function planAdminForm(){return `<form id="planAdminForm" class="admin-form"><input name="name" placeholder="Plan name" required><input type="number" step="0.01" name="price" placeholder="Price" required><textarea name="summary_zh" placeholder="中文摘要"></textarea><textarea name="summary_en" placeholder="English summary"></textarea><textarea name="features_zh" placeholder="中文权益，每行一项"></textarea><textarea name="features_en" placeholder="English features, one per line"></textarea><input type="number" name="sort_order" value="0"><label><input type="checkbox" name="is_active" checked> Active</label><button class="btn primary">Save plan</button></form>`}
function clubAdminForm(){return `<div class="admin-toolbar"><h1>${tr("clubSettings")}</h1></div><form id="clubAdminForm" class="admin-form"><input name="name" value="${state.tenant.name||""}" placeholder="Brand name"><input name="site_url" value="${state.tenant.site_url||""}" placeholder="Official URL"><input name="city" value="${state.tenant.city||""}" placeholder="City"><input name="contact_email" value="${state.tenant.contact_email||""}" placeholder="Contact email"><input name="business_address" value="${state.tenant.business_address||""}" placeholder="Business address"><input name="page_title" value="${state.tenant.page_title||""}" placeholder="Page title"><button class="btn primary">Save club settings</button></form>`}
function formDataObject(form){const fd=new FormData(form),o={};for(const [k,v] of fd)o[k]=v;form.querySelectorAll('input[type="checkbox"]').forEach(x=>o[x.name]=x.checked);return o}
function bindEventAdmin(){const f=$("#eventAdminForm");f.onsubmit=async e=>{e.preventDefault();const o=formDataObject(f);const id=o.id||null;delete o.id;o.capacity=Number(o.capacity||0);o.price=Number(o.price||0);o.start_at=new Date(o.start_at).toISOString();await adminSave("events",o,id);await loadPublicData();renderAll();renderAdminTab();};$$("[data-edit-event]").forEach(r=>r.onclick=()=>{const e=JSON.parse(r.dataset.editEvent);Object.entries(e).forEach(([k,v])=>{const x=f.elements[k];if(x){if(x.type==="checkbox")x.checked=!!v;else if(k==="start_at")x.value=new Date(v).toISOString().slice(0,16);else x.value=v??""}});});}
function bindPostAdmin(){const f=$("#postAdminForm");f.onsubmit=async e=>{e.preventDefault();const o=formDataObject(f);if(o.expires_at)o.expires_at=new Date(o.expires_at).toISOString();else o.expires_at=null;await adminSave("posts",o);await loadPublicData();renderAll();renderAdminTab();};}
function bindPaymentAdmin(){const f=$("#paymentAdminForm");f.onsubmit=async e=>{e.preventDefault();await adminSave("payment_methods",formDataObject(f));await loadPublicData();renderAll();renderAdminTab();};}
function bindPlanAdmin(){const f=$("#planAdminForm");f.onsubmit=async e=>{e.preventDefault();const o=formDataObject(f);o.price=Number(o.price);o.sort_order=Number(o.sort_order);await adminSave("plans",o);await loadPublicData();renderAll();renderAdminTab();};}
function bindClubAdmin(){const f=$("#clubAdminForm");f.onsubmit=async e=>{e.preventDefault();const o=formDataObject(f);const r=await api(`/rest/v1/tenants?id=eq.${state.tenant.id}`,{method:"PATCH",headers:{"Prefer":"return=representation"},body:JSON.stringify(o)});if(!r.ok)throw new Error(await r.text());state.tenant=(await r.json())[0];renderAll();alert("Saved");};}

function bind() {
  $("#langBtn").onclick = ()=>{state.lang=state.lang==="zh"?"en":"zh";localStorage.setItem("club_lang",state.lang);applyLanguage();};
  $$("[data-route]").forEach(b=>b.onclick=()=>route(b.dataset.route));
  $("#photoInput").onchange = e=>{
    try{const files=[...e.target.files];validatePhotos(files);state.applicationPhotos=files;renderPhotoPreview();$("#formError").textContent="";}catch(err){$("#formError").textContent=err.message;e.target.value="";}
  };
  $("#prevStep").onclick=()=>{if(state.applicationStep>0){state.applicationStep--;renderStep();}};
  $("#nextStep").onclick=async()=>{
    const stepEl=$$(".form-step")[state.applicationStep];
    const invalid=[...stepEl.querySelectorAll("input,select,textarea")].find(x=>!x.checkValidity());
    if(invalid){invalid.reportValidity();return}
    if(state.applicationStep<2){state.applicationStep++;renderStep();return}
    try{$("#nextStep").disabled=true;$("#formError").textContent="";await submitApplication();}catch(e){$("#formError").textContent=e.message;}finally{$("#nextStep").disabled=false;}
  };
  $("#statusForm").onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);$("#statusResult").innerHTML="Loading…";try{$("#statusResult").innerHTML=renderStatus(await checkStatus(fd.get("code"),fd.get("contact")));}catch(err){$("#statusResult").innerHTML=`<div class="error">${err.message}</div>`}};
  $("#adminLoginForm").onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);try{await signIn(fd.get("email"),fd.get("password"));$("#adminLoginError").textContent="";renderAdmin();}catch(err){$("#adminLoginError").textContent=err.message;}};
  $("#adminLogout").onclick=()=>{state.adminToken="";sessionStorage.removeItem("admin_token");renderAdmin();};
  $$("[data-admin-tab]").forEach(b=>b.onclick=()=>{$$("[data-admin-tab]").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.adminTab=b.dataset.adminTab;renderAdminTab();});
}
function renderStep() {
  $$(".form-step").forEach((x,i)=>x.classList.toggle("active",i===state.applicationStep));
  $$(".progress span").forEach((x,i)=>x.classList.toggle("active",i<=state.applicationStep));
  $("#prevStep").style.visibility=state.applicationStep?"visible":"hidden";
  $("#nextStep").textContent=state.applicationStep===2?tr("submit"):tr("next");
}
window.route=route;
window.chooseOffer=(offer)=>{state.selectedOffer=offer;renderOfferSelect();route("apply");};

async function init() {
  if (!isConfigured()) return showConfigError();
  bind();
  try {
    await loadPublicData();
    applyLanguage();
    route(location.hash.replace("#","")||"home");
  } catch (e) {
    document.body.innerHTML = `<div style="max-width:760px;margin:80px auto;padding:25px;font-family:sans-serif"><h1>Unable to load platform</h1><pre>${e.message}</pre><p>Confirm config.js, SQL setup, tenant slug, and RLS policies.</p></div>`;
  }
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
}
init();
})();