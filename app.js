(() => {
"use strict";

const C = window.APP_CONFIG;
const API = String(C.apiBaseUrl || "").replace(/\/+$/, "");

const state = {
  lang: localStorage.getItem("club_lang") || C.defaultLanguage || "zh",
  settings: null,
  events: [],
  posts: [],
  plans: [],
  applicationStep: 0,
  applicationPhotos: [],
  selectedOffer: ""
};

const T = {
zh: {
myStatus:"我的申请",apply:"申请加入",eyebrow:"真实活动 · 共同成长 · 认真连接",
heroTitle:'遇见一个<span>愿意走进未来</span>的人',
heroText:"不是无限刷人。通过真实活动、共同交流和经过授权的资料，慢慢认识一个值得认真了解的人。",
viewSpots:"查看本周名额",checkStatus:"查询申请状态",humanReview:"人工确认",
privateByDefault:"默认不公开",merchantPayment:"商家直接收款",nearby:"附近正在发生",
liveUpdates:"最新活动",mapTitle:"点击闪烁城市查看活动",
mapPrivacy:"只显示活动区域，不显示会员实时位置。",latestUpdates:"最新动态",
membership:"会员方案",events:"近期活动",eventHeading:"先一起做一件真实的小事",
venuePrivacy:"具体地点在报名和付款确认后提供。",learning:"共同体验",
learningHeading:"在一起完成事情时，真正了解彼此",fullPlans:"完整会员方案",
plansHeading:"解锁参与，不是购买他人的隐私",trustTitle:"可信状态",
trustHeading:"真实，但不过度暴露",sourceSelf:"本人填写",sourceSelfSub:"资料来源清楚",
sourceClub:"俱乐部确认",sourceClubSub:"真人与活动状态",sourceUpdated:"最近更新",
sourcePermission:"授权可见",sourcePermissionSub:"本人控制公开范围",
clearRules:"清楚的规则，真实的边界",
clearRulesText:"活动由当前商家独立运营并直接收款。平台不保证任何关系结果，也不公开出售会员隐私。",
privacyPolicy:"隐私政策",terms:"服务条款",guidelines:"社区规范",refund:"退款与取消",
backHome:"返回首页",application:"会员申请",applyHeading:"一分钟完成申请",
applySub:"资料默认不公开。审核通过后，俱乐部再确认付款和活动安排。",
name:"姓名或昵称",age:"年龄",city:"城市",contact:"电话或邮箱",goal:"关系目标",
intro:"一句话介绍自己",chooseOffer:"选择活动或会员方案",photos:"添加1—3张本人照片",
photoRules:"每张不超过5MB，仅支持 JPG、PNG、WEBP。",
consentText:"我确认已满18岁，并同意当前商家仅为审核、活动联系和本人选择的服务使用本次资料。",
policyConsent:"我同意隐私政策、服务条款、社区规范和退款规则。",
back:"上一步",next:"下一步",submit:"提交申请",received:"申请已收到",
saveCode:"请保存你的申请编号：",statusHint:"使用申请编号和联系方式查询审核、付款和地址状态。",
viewStatus:"查看申请状态",statusTitle:"申请状态",statusHeading:"查看审核、付款和活动地址",
applicationCodeLabel:"申请编号",check:"查询",merchantLogin:"商家登录",
platformPost:"俱乐部发布",activityPost:"活动更新",memberPost:"会员动态",
requestSpot:"申请名额",choosePlan:"选择方案",month:"月",mostPopular:"最受欢迎",
statusLabels:{submitted:"已提交",under_review:"审核中",approved:"已通过",awaiting_payment:"待付款",
payment_pending:"付款待确认",payment_received:"已收款",confirmed:"报名成功",
venue_unlocked:"地址已开放",checked_in:"已签到",completed:"已完成",rejected:"未通过",cancelled:"已取消"},
goalOptions:[["serious","认真寻找长期关系"],["marriage","希望认识结婚对象"],["friends","先从朋友开始"]],
legal:{
privacy:["隐私政策","当前商家仅收集完成会员审核、活动联系、付款确认和用户所选服务所必要的信息。联系电话、照片、付款记录和精确地址默认不公开。用户可联系商家请求访问、更正或删除资料。"],
terms:["服务条款","当前商家独立提供活动与会员服务并直接收款。平台不保证建立恋爱关系、婚姻或任何特定结果。用户必须年满18岁、提供真实信息并遵守活动规则。"],
guidelines:["社区规范","禁止骚扰、冒充、诈骗、索要金钱、诱导投资，以及未经同意传播照片或联系方式。用户可以拒绝、举报、暂停或退出。"],
refund:["退款与取消","退款与取消由当前商家按付款前公布的规则处理。活动取消、迟到、未到场、会员取消和不可退项目应在付款前确认。"]
}},
en: {
myStatus:"My application",apply:"Apply",eyebrow:"REAL EVENTS · SHARED GROWTH · SERIOUS CONNECTIONS",
heroTitle:'Meet someone <span>ready to build a future</span>',
heroText:"No endless swiping. Meet through real events, shared experiences, and information displayed only with permission.",
viewSpots:"View this week's spots",checkStatus:"Check application",humanReview:"Human review",
privateByDefault:"Private by default",merchantPayment:"Merchant-direct payment",nearby:"Happening nearby",
liveUpdates:"Latest activity",mapTitle:"Tap a pulsing city to view activity",
mapPrivacy:"Only event areas are shown—never member live locations.",latestUpdates:"Latest updates",
membership:"Membership",events:"Upcoming events",eventHeading:"Begin by doing one real thing together",
venuePrivacy:"Exact venues appear after registration and payment confirmation.",learning:"Shared experiences",
learningHeading:"You understand someone by doing things together",fullPlans:"Membership plans",
plansHeading:"Unlock participation—not other people's private data",trustTitle:"Trust status",
trustHeading:"Real, without overexposure",sourceSelf:"Member provided",sourceSelfSub:"Source is clearly labeled",
sourceClub:"Club confirmed",sourceClubSub:"Real-person and event status",sourceUpdated:"Last updated",
sourcePermission:"Permission-based visibility",sourcePermissionSub:"Members control what is shared",
clearRules:"Clear rules and real boundaries",
clearRulesText:"The current merchant independently operates events and receives payments. The platform does not guarantee relationship outcomes or sell member privacy.",
privacyPolicy:"Privacy Policy",terms:"Terms of Service",guidelines:"Community Guidelines",refund:"Refund & Cancellation",
backHome:"Back home",application:"Member application",applyHeading:"Apply in one minute",
applySub:"Private by default. The club confirms payment and event arrangements after review.",
name:"Name or nickname",age:"Age",city:"City",contact:"Phone or email",goal:"Relationship goal",
intro:"One-line introduction",chooseOffer:"Choose an event or membership",photos:"Add 1–3 real photos",
photoRules:"Maximum 5MB each. JPG, PNG, and WEBP only.",
consentText:"I confirm I am 18 or older and consent to use of this information only for review, event contact, and services I choose.",
policyConsent:"I agree to the privacy policy, terms, community guidelines, and refund rules.",
back:"Back",next:"Next",submit:"Submit",received:"Application received",
saveCode:"Save your application number:",statusHint:"Use your application number and contact to check review, payment, and venue status.",
viewStatus:"View status",statusTitle:"Application status",statusHeading:"Check review, payment, and venue access",
applicationCodeLabel:"Application number",check:"Check",merchantLogin:"Merchant login",
platformPost:"Club post",activityPost:"Event update",memberPost:"Member post",
requestSpot:"Request a spot",choosePlan:"Choose plan",month:"month",mostPopular:"Most popular",
statusLabels:{submitted:"Submitted",under_review:"Under review",approved:"Approved",awaiting_payment:"Awaiting payment",
payment_pending:"Payment pending",payment_received:"Payment received",confirmed:"Confirmed",
venue_unlocked:"Venue unlocked",checked_in:"Checked in",completed:"Completed",rejected:"Rejected",cancelled:"Cancelled"},
goalOptions:[["serious","Seeking a serious long-term relationship"],["marriage","Hoping to meet a future spouse"],["friends","Start as friends"]],
legal:{
privacy:["Privacy Policy","The current merchant collects only information necessary for member review, event contact, payment confirmation, and selected services. Contact details, photos, payment records, and exact addresses are private by default. Users may contact the merchant to request access, correction, or deletion."],
terms:["Terms of Service","The current merchant independently provides events and membership services and receives payments directly. The platform does not guarantee a relationship, marriage, or any specific outcome. Users must be at least 18, provide truthful information, and follow event rules."],
guidelines:["Community Guidelines","Harassment, impersonation, fraud, requests for money, investment solicitation, and unauthorized sharing of photos or contact details are prohibited. Users may decline, report, pause, or leave."],
refund:["Refund & Cancellation","Refunds and cancellations are handled by the current merchant under rules shown before payment. Event cancellation, late arrival, no-shows, membership cancellation, and non-refundable items should be confirmed before payment."]
}}
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const tr = key => {
  let value = T[state.lang];
  for (const part of key.split(".")) value = value?.[part];
  return value ?? key;
};
const localize = (obj, field) =>
  state.lang === "zh"
    ? (obj?.[`${field}_zh`] || obj?.[`${field}_en`] || "")
    : (obj?.[`${field}_en`] || obj?.[`${field}_zh`] || "");

async function request(path, options={}) {
  const response = await fetch(API + path, options);
  let data = null;
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data?.error || `Request failed (${response.status})`);
  return data;
}

async function loadPublicData() {
  if (!API || API.includes("YOUR-")) throw new Error("Backend URL is not configured");
  const data = await request("/api/public");
  state.settings = data.settings || {};
  state.events = data.events || [];
  state.posts = data.posts || [];
  state.plans = data.plans || [];
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
  const s = state.settings || {};
  const brand = s.brand_name || "Singles Club";
  $("#brandName").textContent = brand;
  $("#footerBrand").textContent = brand;
  document.title = s.page_title || brand;
  $("#canonicalLink").href = C.siteUrl;
  $("#updatedDate").textContent = new Date(s.updated_at || Date.now()).toLocaleDateString(
    state.lang === "zh" ? "zh-CN" : "en-US",
    {year:"numeric", month:"long"}
  );
  const admin = $("#merchantAdminLink");
  if (admin) admin.href = API + "/admin.html";
  renderMap();
  renderFeed();
  renderPlans();
  renderEvents();
  renderExperiences();
  renderOfferSelect();
  renderGoalSelect();
  renderSchema();
}

function renderMap() {
  const map = $("#activityMap");
  map.querySelectorAll(".map-pin").forEach(x => x.remove());
  const coords = [[34,67],[58,80],[70,38],[76,67],[44,48]];
  state.events.slice(0,5).forEach((e,i) => {
    const button = document.createElement("button");
    button.className = "map-pin";
    button.style.left = coords[i][1] + "%";
    button.style.top = coords[i][0] + "%";
    const spots = Math.max(0, Number(e.capacity||0)-Number(e.confirmed_count||0));
    button.innerHTML = `<i></i><span><strong>${e.city||""}</strong><br>${localize(e,"title")} · ${spots} spots</span>`;
    button.onclick = () => chooseOffer(`event:${e.id}`);
    map.appendChild(button);
  });
}

function renderFeed() {
  const items = state.posts.length ? [...state.posts, ...state.posts] : [];
  $("#feedTrack").innerHTML = items.map(p => `
    <article class="feed-card">
      <div class="feed-meta">
        <span class="tag ${p.post_type==="activity"?"activity":""}">
          ${p.post_type==="activity" ? tr("activityPost") : tr("platformPost")}
        </span>
        <span>${new Date(p.created_at).toLocaleDateString()}</span>
      </div>
      <p>${localize(p,"content")}</p>
    </article>`).join("");
}

function renderPlans() {
  $("#planMiniList").innerHTML = state.plans.map((p,i)=>`
    <div class="mini-plan ${i===1?"popular":""}">
      <strong><span>${p.name}</span><span>$${Number(p.price).toFixed(0)}</span></strong>
      <p>${localize(p,"summary")}</p>
      <button class="btn ${i===1?"rose":"primary"}" onclick="chooseOffer('plan:${p.id}')">${tr("choosePlan")}</button>
    </div>`).join("");

  $("#planList").innerHTML = state.plans.map((p,i)=>`
    <article class="plan-card ${i===1?"popular":""}">
      ${i===1?`<span class="tag">${tr("mostPopular")}</span>`:""}
      <div class="eyebrow">${p.name}</div>
      <div class="plan-price">$${Number(p.price).toFixed(0)} <small>/ ${tr("month")}</small></div>
      <p>${localize(p,"summary")}</p>
      <ul>${localize(p,"features").split("\n").filter(Boolean).map(x=>`<li>${x}</li>`).join("")}</ul>
      <button class="btn ${i===1?"rose":"primary"}" onclick="chooseOffer('plan:${p.id}')">${tr("choosePlan")}</button>
    </article>`).join("");
}

function renderEvents() {
  $("#eventList").innerHTML = state.events.map(e => {
    const spots = Math.max(0, Number(e.capacity||0)-Number(e.confirmed_count||0));
    const image = e.has_image ? `${API}/api/events/${e.id}/image` : "./assets/event-coffee.jpg";
    return `<article class="event-card">
      <div class="event-image" style="background-image:url('${image}');background-size:cover;background-position:center"></div>
      <div class="event-body">
        <h3>${localize(e,"title")}</h3>
        <p>${new Date(e.start_at).toLocaleString(state.lang==="zh"?"zh-CN":"en-US",{dateStyle:"medium",timeStyle:"short"})}<br>${e.city||""} · ${spots} spots</p>
        <div class="plan-price">$${Number(e.price||0).toFixed(0)}</div>
        <button class="btn primary" onclick="chooseOffer('event:${e.id}')">${tr("requestSpot")}</button>
      </div>
    </article>`;
  }).join("");
}

function renderExperiences() {
  const box = $("#learningList");
  if (!box) return;
  const cards = state.events.slice(0,3);
  box.innerHTML = cards.map((e,i)=>`
    <article class="learning-card">
      <span class="tag activity">${e.city||""}</span>
      <h3>${localize(e,"title")}</h3>
      <p>${localize(e,"description") || (state.lang==="zh" ? "在小型真实活动中自然交流，双方自愿决定是否继续了解。" : "Connect naturally in a small real-world event and decide freely whether to continue.")}</p>
      <button class="btn ghost" onclick="chooseOffer('event:${e.id}')">${tr("apply")}</button>
    </article>`).join("");
}

function renderGoalSelect() {
  $("#goalSelect").innerHTML = `<option value="">—</option>` +
    tr("goalOptions").map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
}

function renderOfferSelect() {
  const select = $("#offerSelect");
  select.innerHTML = [
    ...state.events.map(e=>`<option value="event:${e.id}">${localize(e,"title")} · $${Number(e.price||0).toFixed(0)}</option>`),
    ...state.plans.map(p=>`<option value="plan:${p.id}">${p.name} · $${Number(p.price).toFixed(0)}</option>`)
  ].join("");
  if (state.selectedOffer) select.value = state.selectedOffer;
}

function renderSchema() {
  const site = C.siteUrl;
  const s = state.settings || {};
  const graph = [
    {"@type":"Organization","@id":site+"#organization","name":s.brand_name||"Singles Club","url":site,"email":s.contact_email||"","areaServed":s.city||""},
    {"@type":"WebSite","@id":site+"#website","url":site,"name":s.brand_name||"Singles Club","publisher":{"@id":site+"#organization"}}
  ];
  state.events.forEach(e => graph.push({
    "@type":"Event",
    "name":e.title_en||e.title_zh,
    "startDate":e.start_at,
    "eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode",
    "eventStatus":"https://schema.org/EventScheduled",
    "location":{"@type":"Place","name":e.public_venue||e.city||"","address":{"@type":"PostalAddress","addressLocality":e.city||"","addressRegion":e.region||"","addressCountry":e.country||"US"}},
    "offers":{"@type":"Offer","price":String(e.price||0),"priceCurrency":e.currency||"USD","url":site+"#apply","availability":"https://schema.org/LimitedAvailability"},
    "organizer":{"@id":site+"#organization"}
  }));
  $("#structuredData").textContent = JSON.stringify({"@context":"https://schema.org","@graph":graph});
}

function route(name) {
  $$(".route").forEach(x=>x.classList.remove("active"));
  if (["privacy","terms","guidelines","refund"].includes(name)) {
    $("#legalApp").classList.add("active");
    renderLegal(name);
  } else {
    const map = {home:"publicApp",apply:"applyApp",status:"statusApp"};
    $("#"+(map[name]||"publicApp")).classList.add("active");
  }
  history.replaceState(null,"","#"+name);
  scrollTo(0,0);
}

function renderLegal(type) {
  const [title,body] = tr(`legal.${type}`);
  const s = state.settings || {};
  $("#legalContent").innerHTML = `<h1>${title}</h1><p>${body}</p><h2>${s.brand_name||"Singles Club"}</h2><p>${s.contact_email||""}<br>${s.business_address||""}</p>`;
}

function validatePhotos(files) {
  if (files.length > C.maxPhotos) throw new Error(`Maximum ${C.maxPhotos} photos`);
  files.forEach(file => {
    if (!C.allowedPhotoTypes.includes(file.type)) throw new Error("Unsupported image type");
    if (file.size > C.maxPhotoBytes) throw new Error("Image exceeds size limit");
  });
}

function renderPhotoPreview() {
  $("#photoPreview").innerHTML = state.applicationPhotos.map((file,i)=>`
    <div class="photo-item"><img src="${URL.createObjectURL(file)}"><button type="button" data-remove-photo="${i}">×</button></div>`).join("");
  $$("[data-remove-photo]").forEach(button => button.onclick = () => {
    state.applicationPhotos.splice(Number(button.dataset.removePhoto),1);
    renderPhotoPreview();
  });
}

async function submitApplication() {
  const formData = new FormData($("#applicationForm"));
  state.applicationPhotos.forEach(file => formData.append("photos", file));
  const result = await request("/api/applications", {method:"POST", body:formData});
  $("#applicationForm").classList.add("hidden");
  $("#applicationSuccess").classList.remove("hidden");
  $("#applicationCode").textContent = result.application_code;
}

async function checkStatus(applicationCode, contact) {
  return request("/api/status", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({application_code:applicationCode, contact})
  });
}

function statusTimeline(current) {
  return C.statusOrder.map(s=>`
    <div class="status-step ${C.statusOrder.indexOf(s)<=C.statusOrder.indexOf(current)?"done":""}">
      ● ${tr("statusLabels."+s)}
    </div>`).join("");
}

function renderStatus(a) {
  let payment = "";
  if (["approved","awaiting_payment","payment_pending"].includes(a.status) && a.payment) {
    if (a.payment.stripe_url) payment += `<div class="payment-box"><strong>Stripe</strong><p><a class="btn primary" target="_blank" rel="noopener" href="${a.payment.stripe_url}">Pay securely</a></p></div>`;
    if (a.payment.zelle_contact) payment += `<div class="payment-box"><strong>Zelle</strong><p>${a.payment.zelle_name||""}<br>${a.payment.zelle_contact}</p></div>`;
    if (a.payment.has_qr) payment += `<div class="payment-box"><strong>${a.payment.qr_label||"Payment QR"}</strong><img class="payment-qr" src="${API}/api/payment-qr" alt="Payment QR"></div>`;
  }
  const venue = a.private_venue ? `<div class="payment-box"><strong>Venue</strong><p>${a.private_venue}</p></div>` : "";
  return `<div class="status-card"><h3>${tr("statusLabels."+a.status)}</h3><p>${a.event_title||a.plan_name||""}</p><div class="status-timeline">${statusTimeline(a.status)}</div>${payment}${venue}</div>`;
}

function renderStep() {
  $$(".form-step").forEach((x,i)=>x.classList.toggle("active",i===state.applicationStep));
  $$(".progress span").forEach((x,i)=>x.classList.toggle("active",i<=state.applicationStep));
  $("#prevStep").style.visibility = state.applicationStep ? "visible" : "hidden";
  $("#nextStep").textContent = state.applicationStep===2 ? tr("submit") : tr("next");
}

function bind() {
  $("#langBtn").onclick = () => {
    state.lang = state.lang==="zh" ? "en" : "zh";
    localStorage.setItem("club_lang", state.lang);
    applyLanguage();
  };
  $$("[data-route]").forEach(button => button.onclick = () => route(button.dataset.route));
  $("#photoInput").onchange = event => {
    try {
      const files = [...event.target.files];
      validatePhotos(files);
      state.applicationPhotos = files;
      renderPhotoPreview();
      $("#formError").textContent = "";
    } catch (error) {
      $("#formError").textContent = error.message;
      event.target.value = "";
    }
  };
  $("#prevStep").onclick = () => {
    if (state.applicationStep>0) {
      state.applicationStep--;
      renderStep();
    }
  };
  $("#nextStep").onclick = async () => {
    const stepElement = $$(".form-step")[state.applicationStep];
    const invalid = [...stepElement.querySelectorAll("input,select,textarea")].find(x=>!x.checkValidity());
    if (invalid) return invalid.reportValidity();
    if (state.applicationStep<2) {
      state.applicationStep++;
      return renderStep();
    }
    try {
      $("#nextStep").disabled = true;
      $("#formError").textContent = "";
      await submitApplication();
    } catch (error) {
      $("#formError").textContent = error.message;
    } finally {
      $("#nextStep").disabled = false;
    }
  };
  $("#statusForm").onsubmit = async event => {
    event.preventDefault();
    const fd = new FormData(event.target);
    $("#statusResult").innerHTML = "Loading…";
    try {
      $("#statusResult").innerHTML = renderStatus(await checkStatus(fd.get("code"), fd.get("contact")));
    } catch (error) {
      $("#statusResult").innerHTML = `<div class="error">${error.message}</div>`;
    }
  };
}

window.route = route;
window.chooseOffer = offer => {
  state.selectedOffer = offer;
  renderOfferSelect();
  route("apply");
};

async function init() {
  bind();
  try {
    await loadPublicData();
    applyLanguage();
    route(location.hash.replace("#","") || "home");
  } catch (error) {
    document.body.innerHTML = `<div style="max-width:760px;margin:80px auto;padding:25px;font-family:sans-serif">
      <h1>Unable to load platform</h1>
      <p>${error.message}</p>
      <p>Backend: <code>${API}</code></p>
    </div>`;
  }
}
init();
})();