
(()=>{"use strict";
const C=window.APP_CONFIG,API=C.apiBaseUrl.replace(/\/+$/,""),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={lang:localStorage.getItem("sc_lang")||C.defaultLanguage,data:null,mapIndex:0,mapTimer:null,lastMember:null,lastBooking:null,currentEvent:null};
const images=["./assets/coffee-gathering.jpg","./assets/city-walk.jpg","./assets/dinner-gathering.jpg","./assets/music-night.jpg"];
const coords=[
  {city:"Los Angeles",x:17,y:51},{city:"New York",x:27,y:43},{city:"London",x:48,y:36},
  {city:"Paris",x:50,y:42},{city:"Dubai",x:61,y:55},{city:"Singapore",x:73,y:69},
  {city:"Shanghai",x:78,y:48},{city:"Tokyo",x:86,y:44},{city:"Sydney",x:88,y:79}
];
const T={
zh:{
 brandLine:"Members-only social experiences",experiences:"活动体验",membership:"会员资格",status:"查询状态",join:"成为会员",
 headline:'先成为会员，<br>再走进每一次<span>真实的相遇</span>',
 headlineSub:"不是滑动屏幕认识一个人，而是在咖啡、散步、晚餐与音乐中，给真实交流留出空间。",
 joinMembership:"开通会员资格",explore:"查看近期活动",adultOnly:"仅限18岁及以上成年人",privateVenue:"具体地址仅向符合条件的报名会员开放",noGuarantee:"不承诺配对或关系结果",
 worldTitle:"真实的城市，正在发生真实的交流",worldSub:"平台不依赖第三方地图或外部图片站点。活动可由不同地区的运营方设置城市、货币、时区和语言。",
 upcoming:"下一次相遇，也许就在这座城市",upcomingSub:"有效会员可报名符合等级的活动。会员费与每次活动费用分别显示。",
 momentsTitle:"让平台一直有真实生活在发生",momentsSub:"活动动态只展示运营方选择公开的内容，不公开会员联系方式、照片或具体地点。",
 membershipTitle:"不是购买一个结果，而是获得进入俱乐部的资格",membershipSub:"不同等级对应不同活动范围、规模和人工协调程度。是否产生进一步关系，由参与者自行决定。",
 privacyTitle:"隐私优先",privacyText:"个人资料、联系方式和照片不会出现在公开活动页面。具体地址仅对满足条件的相关会员开放。",
 consentTitle:"双方自愿",consentText:"平台提供会员与活动组织工具，不替任何参与者决定是否见面、继续交流或建立关系。",
 operatorTitle:"运营责任清晰",operatorText:"活动安排、收款、退款、地点、安全措施和当地服务由当前运营方管理，并应遵守所在地规则。",
 globalTitle:"全球结构",globalText:"日期、时区、城市、语言和货币由活动数据决定；代码不依赖外部地图、字体或图片服务。",
 footerLine:"A members-only platform for real-world social experiences.",privacy:"隐私说明",terms:"会员与付款条款",safety:"活动安全边界",operatorConsole:"Club Console",
 joinDialogTitle:"开通会员资格",joinDialogSub:"填写最少资料，选择会员等级，并获得会员编号和商家设置的付款方式。",
 name:"姓名或昵称",age:"年龄",city:"城市",contact:"电话或邮箱",intro:"简单介绍",preferences:"希望参加的活动或交流方式",tier:"会员等级",photo:"本人照片（可选，仅后台查看）",
 joinConsent:"我确认已满18岁，资料由当前运营方用于会员管理、付款确认和活动联系；平台不保证配对或关系结果。",
 createMember:"生成会员编号",memberCreated:"会员编号已生成",paymentMethod:"付款方式",paymentRef:"付款备注（可选）",reportMembershipPayment:"我已支付会员费",
 bookingTitle:"会员活动报名",memberNumber:"会员编号",bookingBoundary:"系统将核验会员状态和等级。精确地点只在活动费确认后开放。",createBooking:"生成活动报名编号",
 bookingCreated:"活动报名编号已生成",reportEventPayment:"我已支付活动费",statusDialogTitle:"查询会员资格或活动报名",membershipStatus:"会员资格",eventStatus:"活动报名",bookingNumber:"活动报名编号",lookup:"查询",
 tierCopy:{community:"适合第一次进入俱乐部，参加公开会员活动。",select:"更小规模、更深入的主题活动与优先参与。",private:"更个性化的沟通与经双方同意的线下协调。"},
 statusLabels:{awaiting_payment:"待付款",payment_pending:"付款待确认",active:"有效会员",expired:"已到期",suspended:"已暂停",cancelled:"已取消",refunded:"已退款",payment_received:"已确认收款",confirmed:"名额已确认",venue_unlocked:"地址已开放",checked_in:"已签到",completed:"已完成"}
},
en:{
 brandLine:"Members-only social experiences",experiences:"Experiences",membership:"Membership",status:"Status",join:"Become a member",
 headline:'Become a member,<br>then step into every <span>real connection</span>',
 headlineSub:"Not another screen to swipe. Make room for real conversation through coffee, walks, dinners, and music.",
 joinMembership:"Activate membership",explore:"Explore experiences",adultOnly:"Adults 18+ only",privateVenue:"Exact venues are released only to eligible booked members",noGuarantee:"No matching or relationship outcome is promised",
 worldTitle:"Real cities. Real conversations are happening.",worldSub:"The platform does not depend on third-party maps or image services. Operators can configure cities, currencies, time zones, and languages.",
 upcoming:"Your next real-world experience may be in this city",upcomingSub:"Active members may book eligible events. Membership and individual event fees are shown separately.",
 momentsTitle:"A platform where real life keeps happening",momentsSub:"Only operator-selected public activity updates are shown. Member contacts, photos, and exact venues remain private.",
 membershipTitle:"You are not buying an outcome. You are gaining club access.",membershipSub:"Tiers define activity access, group size, and coordination level. Participants decide whether any relationship continues.",
 privacyTitle:"Privacy first",privacyText:"Profiles, contact details, and photos are not shown on public event pages. Exact venues are limited to relevant eligible members.",
 consentTitle:"Mutual choice",consentText:"The platform supports membership and event operations. It does not decide whether people meet, continue communicating, or form a relationship.",
 operatorTitle:"Clear responsibility",operatorText:"The current operator manages events, payment, refunds, venues, safety measures, and local service obligations.",
 globalTitle:"Global structure",globalText:"Dates, time zones, cities, languages, and currencies come from event data. The code uses no external maps, fonts, or image services.",
 footerLine:"A members-only platform for real-world social experiences.",privacy:"Privacy",terms:"Membership & payment terms",safety:"Event safety boundaries",operatorConsole:"Club Console",
 joinDialogTitle:"Activate membership",joinDialogSub:"Provide minimum details, choose a tier, and receive a member number and operator payment options.",
 name:"Name or nickname",age:"Age",city:"City",contact:"Phone or email",intro:"Brief introduction",preferences:"Preferred activities or interaction style",tier:"Membership tier",photo:"Photo (optional, admin-only)",
 joinConsent:"I am 18 or older. The current operator may use my data for membership administration, payment confirmation, and activity contact. No matching or relationship outcome is guaranteed.",
 createMember:"Create member number",memberCreated:"Member number created",paymentMethod:"Payment method",paymentRef:"Payment reference (optional)",reportMembershipPayment:"I paid the membership fee",
 bookingTitle:"Member event booking",memberNumber:"Member number",bookingBoundary:"The system checks membership status and tier. Exact venues unlock only after the event payment is confirmed.",createBooking:"Create booking number",
 bookingCreated:"Event booking number created",reportEventPayment:"I paid the event fee",statusDialogTitle:"Check membership or event booking",membershipStatus:"Membership",eventStatus:"Event booking",bookingNumber:"Event booking number",lookup:"Look up",
 tierCopy:{community:"A first step into the club and public member experiences.",select:"Smaller, deeper themed experiences with priority access.",private:"More personalized conversation and consent-based offline coordination."},
 statusLabels:{awaiting_payment:"Awaiting payment",payment_pending:"Payment pending",active:"Active member",expired:"Expired",suspended:"Suspended",cancelled:"Cancelled",refunded:"Refunded",payment_received:"Payment confirmed",confirmed:"Spot confirmed",venue_unlocked:"Venue unlocked",checked_in:"Checked in",completed:"Completed"}
}};
const tr=k=>{let v=T[state.lang];for(const p of k.split("."))v=v?.[p];return v??k};
const loc=(o,f)=>state.lang==="zh"?(o?.[f+"_zh"]||o?.[f+"_en"]||""):(o?.[f+"_en"]||o?.[f+"_zh"]||"");
const locale=()=>state.lang==="zh"?"zh-CN":"en-US";
const money=(value,currency="USD")=>new Intl.NumberFormat(locale(),{style:"currency",currency:currency||C.defaultCurrency,maximumFractionDigits:0}).format(Number(value||0));
const date=(value)=>value?new Intl.DateTimeFormat(locale(),{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"";
async function request(path,opt={}){const r=await fetch(API+path,{...opt,headers:{"Accept":"application/json",...(opt.headers||{})}});let j=null;try{j=await r.json()}catch{}if(!r.ok)throw new Error(j?.error||`Request failed (${r.status})`);return j}
function applyLanguage(){
 document.documentElement.lang=state.lang==="zh"?"zh-CN":"en";
 $$("[data-i18n]").forEach(el=>el.textContent=tr(el.dataset.i18n));
 $$("[data-i18n-html]").forEach(el=>el.innerHTML=tr(el.dataset.i18nHtml));
 $("#langBtn").textContent=state.lang==="zh"?"EN":"中文";
}
function paymentMarkup(payment,code){
 if(!payment)return "";
 let html='<div class="payment-box">';
 if(payment.stripe_url){const sep=payment.stripe_url.includes("?")?"&":"?";html+=`<a class="payment-link" href="${payment.stripe_url}${sep}client_reference_id=${encodeURIComponent(code)}" target="_blank" rel="noopener">Stripe</a>`}
 if(payment.zelle_contact)html+=`<p><strong>Zelle</strong><br>${payment.zelle_name||""}<br>${payment.zelle_contact}</p>`;
 if(payment.has_qr)html+=`<p><strong>${payment.qr_label||"QR"}</strong></p><img class="payment-qr" src="${API}/api/payment-qr" alt="Payment QR">`;
 if(!payment.stripe_url&&!payment.zelle_contact&&!payment.has_qr)html+=`<p>${state.lang==="zh"?"运营方尚未设置在线付款方式，请使用联系信息确认。":"The operator has not configured an online payment method."}</p>`;
 return html+"</div>";
}
async function load(){state.data=await request("/api/public");render()}
function render(){
 applyLanguage();
 const d=state.data||{},s=d.settings||{};
 $("#brandName").textContent=s.brand_name||"Singles Club";
 $("#adminLink").href=C.adminUrl;
 $("#tierSelect").innerHTML=(d.plans||[]).map(p=>`<option value="${p.tier}">${loc(p,"name")} · ${money(p.price)}</option>`).join("");
 renderExperiences();
 renderMoments();
 renderMemberships();
 renderMap();
}
function renderExperiences(){
 const grid=$("#experienceGrid"),events=state.data.events||[];
 if(!events.length){grid.innerHTML=`<div class="empty-state">${state.lang==="zh"?"当前运营方尚未发布公开活动。":"No public experiences are available yet."}</div>`;return}
 grid.innerHTML=events.slice(0,5).map((e,i)=>`
  <article class="experience-card">
   <img src="${images[i%images.length]}" alt="${loc(e,"title")}">
   <div class="experience-content">
    <div class="experience-topline"><span class="tier-pill">${e.required_tier}</span><span class="seat-pill">${e.available_spots??0} ${state.lang==="zh"?"个席位":"seats"}</span></div>
    <h3>${loc(e,"title")}</h3>
    <div class="experience-meta"><span>${e.city} · ${date(e.start_at)}</span><strong>${money(e.price,e.currency)}</strong></div>
    <button class="book-button" data-event="${e.id}">${state.lang==="zh"?"会员报名":"Member booking"}</button>
   </div>
  </article>`).join("");
 $$("[data-event]").forEach(b=>b.onclick=()=>openBooking(events.find(e=>String(e.id)===b.dataset.event)));
}
function renderMoments(){
 const posts=state.data.posts||[];
 const fallback=[
  {theme:"coffee",title_zh:"本周咖啡交流",title_en:"Coffee this week",content_zh:"小型咖啡交流正在确认席位。",content_en:"Seats are being confirmed for a small coffee gathering."},
  {theme:"walk",title_zh:"城市散步",title_en:"City walk",content_zh:"一次不赶时间的散步，让交流自然发生。",content_en:"A slow city walk where conversation can happen naturally."},
  {theme:"music",title_zh:"音乐之夜",title_en:"Music night",content_zh:"音乐、轻松的空间和真实的人。",content_en:"Music, a relaxed space, and real people."}
 ];
 const source=posts.length?posts:fallback;
 $("#momentsRail").innerHTML=source.slice(0,6).map((p,i)=>`
  <article class="moment-card animate">
   <img src="${images[(i+1)%images.length]}" alt="${loc(p,"title")}">
   <div class="moment-copy"><small>${p.theme||"club"}</small><h3>${loc(p,"title")||loc(p,"content").slice(0,22)}</h3><p>${loc(p,"content")}</p></div>
  </article>`).join("");
}
function renderMemberships(){
 const plans=state.data.plans||[];
 $("#membershipGrid").innerHTML=plans.map((p,i)=>{
  const features=loc(p,"features").split(/\n+/).filter(Boolean);
  return `<article class="membership-card ${i===1?"featured":""}">
   <span class="tier-name">${p.tier}</span><h3>${loc(p,"name")}</h3>
   <div class="membership-price">${money(p.price)} <small>/ ${p.duration_days} ${state.lang==="zh"?"天":"days"}</small></div>
   <p>${tr("tierCopy."+p.tier)||loc(p,"summary")}</p>
   <ul>${features.map(f=>`<li>${f}</li>`).join("")}</ul>
   <button data-tier="${p.tier}">${state.lang==="zh"?"选择此等级":"Choose this tier"}</button>
  </article>`;
 }).join("");
 $$("[data-tier]").forEach(b=>b.onclick=()=>openJoin(b.dataset.tier));
}
function renderMap(){
 const events=state.data.events||[];
 const pinContainer=$("#mapPins");
 pinContainer.innerHTML=coords.map((c,i)=>`<button class="world-pin" style="left:${c.x}%;top:${c.y}%" data-pin="${i}" aria-label="${c.city}"></button>`).join("");
 function show(i){
  state.mapIndex=i%coords.length;
  $$("[data-pin]").forEach((p,j)=>p.classList.toggle("active",j===state.mapIndex));
  const city=coords[state.mapIndex],event=events[state.mapIndex%Math.max(1,events.length)];
  $("#mapTier").textContent=event?.required_tier||"Community";
  $("#mapTitle").textContent=event?loc(event,"title"):(state.lang==="zh"?"会员活动":"Member experience");
  $("#mapMeta").textContent=event?`${event.city} · ${event.available_spots??0} ${state.lang==="zh"?"个席位":"seats"}`:city.city;
  $("#heroCity").textContent=event?.city||city.city;
  $("#heroExperience").textContent=event?loc(event,"title"):"Coffee & Conversation";
 }
 $$("[data-pin]").forEach(p=>p.onclick=()=>{clearInterval(state.mapTimer);show(Number(p.dataset.pin));state.mapTimer=setInterval(()=>show(state.mapIndex+1),C.rotationSeconds*1000)});
 show(0);clearInterval(state.mapTimer);state.mapTimer=setInterval(()=>show(state.mapIndex+1),C.rotationSeconds*1000);
}
function openJoin(tier="community"){
 $("#memberForm").reset();$("#memberForm").hidden=false;$("#memberCompletion").hidden=true;$("#memberError").innerHTML="";$("#tierSelect").value=tier;$("#joinDialog").showModal();
}
function openBooking(event){
 state.currentEvent=event;$("#bookingForm").reset();$("#bookingForm").hidden=false;$("#bookingCompletion").hidden=true;$("#bookingError").innerHTML="";
 $("#bookingForm").event_id.value=event.id;
 $("#selectedExperience").innerHTML=`<strong>${loc(event,"title")}</strong><p>${event.city} · ${date(event.start_at)} · ${event.required_tier} · ${money(event.price,event.currency)}</p>`;
 $("#bookingDialog").showModal();
}
$("#openJoin").onclick=()=>openJoin();$("#heroJoin").onclick=()=>openJoin();$("#openStatus").onclick=()=>$("#statusDialog").showModal();
$("#langBtn").onclick=()=>{state.lang=state.lang==="zh"?"en":"zh";localStorage.setItem("sc_lang",state.lang);render()};
$$("[data-close]").forEach(b=>b.onclick=()=>$("#"+b.dataset.close).close());
$("#memberForm").onsubmit=async e=>{
 e.preventDefault();$("#memberError").innerHTML="";
 try{
  const fd=new FormData(e.target),j=await request("/api/memberships",{method:"POST",body:fd});
  state.lastMember={...j,contact:fd.get("contact")};e.target.hidden=true;$("#memberCompletion").hidden=false;
  $("#memberNumber").textContent=j.member_number;
  $("#memberPayment").innerHTML=`<div class="status-box"><strong>${j.plan.name_zh||j.plan.name_en}</strong><p>${money(j.plan.price)} · ${j.plan.duration_days} ${state.lang==="zh"?"天":"days"}</p></div>${paymentMarkup(j.payment,j.member_number)}`;
 }catch(err){$("#memberError").innerHTML=`<div class="error-message">${err.message}</div>`}
};
$("#memberPaidForm").onsubmit=async e=>{
 e.preventDefault();const values=Object.fromEntries(new FormData(e.target));
 try{
  await request("/api/membership-payment-submitted",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,member_number:state.lastMember.member_number,contact:state.lastMember.contact})});
  $("#memberPaymentMessage").innerHTML=`<div class="success-message">${state.lang==="zh"?"付款提交已记录。运营方确认后，会员资格将生效。":"Payment submission recorded. Membership activates after operator confirmation."}</div>`;
 }catch(err){$("#memberPaymentMessage").innerHTML=`<div class="error-message">${err.message}</div>`}
};
$("#bookingForm").onsubmit=async e=>{
 e.preventDefault();$("#bookingError").innerHTML="";const values=Object.fromEntries(new FormData(e.target));
 try{
  const j=await request("/api/event-bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(values)});
  state.lastBooking={...j,...values};e.target.hidden=true;$("#bookingCompletion").hidden=false;$("#bookingNumber").textContent=j.booking_number;
  $("#bookingPayment").innerHTML=`<div class="status-box"><strong>${j.event_title}</strong><p>${money(j.amount_due,j.currency)}</p></div>${Number(j.amount_due)>0?paymentMarkup(j.payment,j.booking_number):`<div class="success-message">${state.lang==="zh"?"该活动不收取额外活动费。等待运营方确认并开放地址。":"No additional event fee. Wait for venue release."}</div>`}`;
 }catch(err){$("#bookingError").innerHTML=`<div class="error-message">${err.message}</div>`}
};
$("#eventPaidForm").onsubmit=async e=>{
 e.preventDefault();const values=Object.fromEntries(new FormData(e.target));
 try{
  await request("/api/event-payment-submitted",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,booking_number:state.lastBooking.booking_number,member_number:state.lastBooking.member_number,contact:state.lastBooking.contact})});
  $("#eventPaymentMessage").innerHTML=`<div class="success-message">${state.lang==="zh"?"活动付款提交已记录。确认后，运营方可开放具体地点。":"Event payment submission recorded. The operator may release the venue after confirmation."}</div>`;
 }catch(err){$("#eventPaymentMessage").innerHTML=`<div class="error-message">${err.message}</div>`}
};
$$("[data-status-tab]").forEach(b=>b.onclick=()=>{
 $$("[data-status-tab]").forEach(x=>x.classList.toggle("active",x===b));
 $("#memberStatusForm").hidden=b.dataset.statusTab!=="member";$("#eventStatusForm").hidden=b.dataset.statusTab!=="event";$("#statusResult").innerHTML="";
});
$("#memberStatusForm").onsubmit=async e=>{
 e.preventDefault();
 try{
  const j=await request("/api/membership-status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});
  $("#statusResult").innerHTML=`<div class="status-box"><h3>${tr("statusLabels."+j.status)}</h3><p>${j.member_number} · ${j.name_zh||j.name_en}</p><p>${j.expires_at?date(j.expires_at):""}</p>${["awaiting_payment","payment_pending"].includes(j.status)?paymentMarkup(j.payment,j.member_number):""}</div>`;
 }catch(err){$("#statusResult").innerHTML=`<div class="error-message">${err.message}</div>`}
};
$("#eventStatusForm").onsubmit=async e=>{
 e.preventDefault();
 try{
  const j=await request("/api/event-booking-status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});
  $("#statusResult").innerHTML=`<div class="status-box"><h3>${tr("statusLabels."+j.status)}</h3><p>${j.title_zh||j.title_en} · ${money(j.amount_due,j.currency)}</p>${["awaiting_payment","payment_pending"].includes(j.status)?paymentMarkup(j.payment,j.booking_number):""}${j.private_venue?`<div class="success-message"><strong>${state.lang==="zh"?"具体活动安排":"Venue details"}</strong><br>${j.private_venue}</div>`:""}</div>`;
 }catch(err){$("#statusResult").innerHTML=`<div class="error-message">${err.message}</div>`}
};
load().catch(err=>document.body.insertAdjacentHTML("afterbegin",`<div class="error-message" style="position:fixed;z-index:999;left:12px;right:12px;top:12px;background:#fff;padding:12px;border-radius:12px">${err.message}</div>`));
})();
