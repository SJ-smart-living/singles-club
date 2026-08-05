
(()=>{"use strict";
const C=window.APP_CONFIG,API=C.apiBaseUrl.replace(/\/+$/,""),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={lang:localStorage.getItem("sc_lang")||C.defaultLanguage,data:null,mapIndex:0,mapTimer:null,lastMember:null,lastBooking:null,currentEvent:null};
const images=["./assets/coffee-gathering.jpg","./assets/city-walk.jpg","./assets/dinner-gathering.jpg","./assets/music-night.jpg"];

const STARTER_EVENTS=[
  {id:"seed-coffee",title_zh:"Pasadena 咖啡交流",title_en:"Pasadena Coffee & Conversation",description_zh:"轻松、小型的会员咖啡交流。当前为平台筹备内容，正式开放时间以运营方发布为准。",description_en:"A relaxed small-group coffee experience. This is platform starter content; official opening depends on the operator.",city:"Pasadena",country:"US",required_tier:"community",price:29,currency:"USD",available_spots:null,start_at:null,display_status:"planned",cover_key:"coffee"},
  {id:"seed-walk",title_zh:"Los Angeles 落日散步",title_en:"Los Angeles Sunset Walk",description_zh:"在公开区域进行的轻松城市散步。当前接受活动兴趣，不代表已确认举办。",description_en:"A relaxed city walk in a public area. Interest may be collected, but the event is not yet confirmed.",city:"Los Angeles",country:"US",required_tier:"community",price:39,currency:"USD",available_spots:null,start_at:null,display_status:"interest_open",cover_key:"walk"},
  {id:"seed-dinner",title_zh:"Arcadia 小型晚餐",title_en:"Arcadia Small Group Dinner",description_zh:"更小规模的主题晚餐体验。运营方确认场地和时间后开放报名。",description_en:"A smaller themed dinner experience. Booking opens after the operator confirms the venue and schedule.",city:"Arcadia",country:"US",required_tier:"select",price:79,currency:"USD",available_spots:null,start_at:null,display_status:"planned",cover_key:"dinner"},
  {id:"seed-music",title_zh:"Long Beach 音乐之夜",title_en:"Long Beach Music Evening",description_zh:"音乐、轻松氛围和真实交流。当前为活动灵感展示。",description_en:"Music, a relaxed atmosphere, and real conversation. Currently shown as an experience concept.",city:"Long Beach",country:"US",required_tier:"select",price:49,currency:"USD",available_spots:null,start_at:null,display_status:"concept",cover_key:"music"},
  {id:"seed-shanghai",title_zh:"上海城市咖啡",title_en:"Shanghai City Coffee",description_zh:"全球城市活动筹备示例。正在寻找本地活动组织者。",description_en:"A global city starter experience. Local organizers are being invited.",city:"Shanghai",country:"CN",required_tier:"community",price:0,currency:"CNY",available_spots:null,start_at:null,display_status:"organizer_search",cover_key:"coffee"},
  {id:"seed-tokyo",title_zh:"东京美术馆散步",title_en:"Tokyo Museum Walk",description_zh:"安静的小型文化交流活动构想，正式信息由当地运营方确认。",description_en:"A small cultural social experience concept. Final details depend on a local operator.",city:"Tokyo",country:"JP",required_tier:"select",price:0,currency:"JPY",available_spots:null,start_at:null,display_status:"concept",cover_key:"walk"}
];

const STARTER_POSTS=[
  {theme:"welcome",title_zh:"欢迎进入 Singles Club",title_en:"Welcome to Singles Club",content_zh:"这里是付费会员制线下活动平台。只有有效会员可以报名活动。",content_en:"A paid-membership platform for real-world social experiences. Active membership is required for event booking."},
  {theme:"privacy",title_zh:"具体地址不会公开",title_en:"Exact venues stay private",content_zh:"活动公开页面只显示城市和公开区域，具体地址在符合条件后开放。",content_en:"Public pages show only the city and general area. Exact venues unlock only after eligibility and confirmation."},
  {theme:"community",title_zh:"Community 适合第一次加入",title_en:"Community is the first step",content_zh:"适合参加公开会员咖啡、散步和轻松小组活动。",content_en:"Designed for public member coffee, walks, and relaxed small-group experiences."},
  {theme:"select",title_zh:"Select 更小规模",title_en:"Select is more focused",content_zh:"适合人数更少、主题更明确和交流更深入的活动。",content_en:"For smaller, more focused, and deeper themed experiences."},
  {theme:"private",title_zh:"Private 不保证关系结果",title_en:"Private does not guarantee outcomes",content_zh:"Private 提供更个性化的沟通与协调，但不承诺配对或关系结果。",content_en:"Private offers more personalized coordination, without promising a match or relationship outcome."},
  {theme:"organizer",title_zh:"全球城市活动正在征集",title_en:"Global city organizers wanted",content_zh:"任何成年人可以提交活动提案，运营方审核后才进入公开地图。",content_en:"Any adult may submit an event proposal. It appears publicly only after operator review."},
  {theme:"safety",title_zh:"真实交流始终以双方自愿为前提",title_en:"Real interaction requires mutual choice",content_zh:"任何参与者都可以拒绝见面、退出活动或停止后续联系。",content_en:"Any participant may decline, leave an event, or stop further communication."},
  {theme:"payment",title_zh:"会员费与活动费分开",title_en:"Membership and event fees are separate",content_zh:"会员费取得俱乐部资格；单次活动费用以活动页面为准。",content_en:"Membership grants club access. Individual event fees are shown per experience."}
];

function displayStatus(event){
  const map={
    planned:state.lang==="zh"?"筹备中":"Planned",
    interest_open:state.lang==="zh"?"接受兴趣登记":"Interest open",
    concept:state.lang==="zh"?"活动灵感":"Experience concept",
    organizer_search:state.lang==="zh"?"寻找本地组织者":"Seeking local organizer",
    registration_open:state.lang==="zh"?"开放报名":"Registration open"
  };
  return map[event.display_status]||"";
}
function isSeedEvent(event){return String(event.id||"").startsWith("seed-")}

const coords=[
 {city:"Los Angeles",x:18,y:44},{city:"Pasadena",x:34,y:28},{city:"Arcadia",x:54,y:31},
 {city:"Irvine",x:65,y:62},{city:"Long Beach",x:43,y:71},{city:"San Diego",x:78,y:74},
 {city:"Shanghai",x:82,y:35},{city:"Tokyo",x:89,y:47},{city:"Singapore",x:74,y:82}
];
const T={
zh:{
 brandLine:"Singles Club · Los Angeles",experiences:"活动体验",membership:"会员资格",status:"查询状态",join:"成为会员",
 headline:'先成为会员，<br>再走进每一次<span>真实的相遇</span>',
 headlineSub:"真实交流不由算法承诺结果，而由成年人在清楚规则、双方自愿和真实活动中自行决定。",
 joinMembership:"开通会员资格",explore:"查看近期活动",adultOnly:"仅限18岁及以上成年人",privateVenue:"具体地址仅向符合条件的报名会员开放",noGuarantee:"不承诺配对或关系结果",
 worldTitle:"真实的城市，正在发生真实的交流",live:"持续更新",mapCenterTitle:"城市活动网络",mapCenterSub:"地点按活动轮换",featured:"当前推荐活动",book:"会员报名",privacyShort:"照片、联系方式和具体地址不公开。",partnerPathTitle:"合作会员可以发布并经营活动",partnerPathText:"支付年度合作资格后，使用同一会员编号提交活动；平台审核通过后进入地图。活动费用仍按每场单独设置和收取。",techCase:"产品技术案例，不代表 BB369TECH 组织或提供具体活动。",partnerRequired:"仅限有效 Partner Member 提交",partnerRequiredText:"请使用已激活的合作会员编号和注册联系方式。活动不会自动公开。",submitExperience:"发布活动",submitDialogTitle:"提交一个线下活动",submitDialogSub:"任何成年人都可以提交活动。运营方审核通过后，活动才会进入公开地图。",organizerName:"组织者名称",organizerContact:"组织者联系方式",eventTitle:"活动名称",countryRegion:"国家或地区",eventTime:"活动时间",publicArea:"公开区域",expectedPrice:"预计活动费",eventDescription:"活动说明",minimumTier:"建议最低会员等级",submissionConsent:"我确认活动信息真实，不公开私人地址，并同意运营方审核、修改或拒绝发布。",submitForReview:"提交审核",boundariesTitle:"安全边界直接放进产品流程",worldSub:"平台不依赖第三方地图或外部图片站点。活动可由不同地区的运营方设置城市、货币、时区和语言。",
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
 tierCopy:{community:"年度普通会员资格。可浏览、报名符合条件的活动；每场活动费用另付。",select:"历史兼容方案，前台默认不再开放。",private:"年度合作会员资格。包含普通会员权益，并可提交活动和合作商家信息；发布仍需审核。"},
 statusLabels:{awaiting_payment:"待付款",payment_pending:"付款待确认",active:"有效会员",expired:"已到期",suspended:"已暂停",cancelled:"已取消",refunded:"已退款",payment_received:"已确认收款",confirmed:"名额已确认",venue_unlocked:"地址已开放",checked_in:"已签到",completed:"已完成"}
},
en:{
 brandLine:"Singles Club · Los Angeles",experiences:"Experiences",membership:"Membership",status:"Status",join:"Become a member",
 headline:'Become a member,<br>then step into every <span>real connection</span>',
 headlineSub:"The platform does not promise outcomes. Adults choose whether to meet and continue through clearly described real-world experiences.",
 joinMembership:"Activate membership",explore:"Explore experiences",adultOnly:"Adults 18+ only",privateVenue:"Exact venues are released only to eligible booked members",noGuarantee:"No matching or relationship outcome is promised",
 worldTitle:"Real cities. Real conversations are happening.",live:"Live updates",mapCenterTitle:"City activity network",mapCenterSub:"Locations rotate by event",featured:"Featured activity",book:"Member booking",privacyShort:"Photos, contacts, and exact venues remain private.",partnerPathTitle:"Partner members can publish and operate experiences",partnerPathText:"After annual partner access is activated, use the same member number to submit an experience. It appears on the map only after review. Each experience may still charge a separate fee.",techCase:"A product technology case; BB369TECH does not organize or provide individual experiences.",partnerRequired:"Active Partner Membership required",partnerRequiredText:"Use the active partner member number and registered contact. Submissions are never published automatically.",submitExperience:"Submit event",submitDialogTitle:"Submit an offline experience",submitDialogSub:"Any adult may submit an event. It appears on the public map only after operator approval.",organizerName:"Organizer name",organizerContact:"Organizer contact",eventTitle:"Event title",countryRegion:"Country or region",eventTime:"Event time",publicArea:"Public area",expectedPrice:"Expected event fee",eventDescription:"Event description",minimumTier:"Suggested minimum tier",submissionConsent:"I confirm the information is accurate, no private address is publicly disclosed, and the operator may review, edit, or reject it.",submitForReview:"Submit for review",boundariesTitle:"Safety boundaries inside the product flow",worldSub:"The platform does not depend on third-party maps or image services. Operators can configure cities, currencies, time zones, and languages.",
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
 tierCopy:{community:"Annual member access. Browse and book eligible experiences; each experience may charge separately.",select:"Legacy-compatible plan, not normally offered publicly.",private:"Annual partner access. Includes member benefits and the right to submit experiences and partner listings, subject to review."},
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
async function load(){
  try{
    const live=await request("/api/public");
    const realEvents=Array.isArray(live.events)?live.events:[];
    const realPosts=Array.isArray(live.posts)?live.posts:[];
    state.data={
      ...live,
      events:realEvents.length?realEvents:[...STARTER_EVENTS],
      posts:realPosts.length?realPosts:[...STARTER_POSTS]
    };
    render();
  }catch(error){
    state.data={
      settings:{brand_name:"LivingHub"},
      plans:[
        {tier:"community",name_zh:"年度会员",name_en:"Annual Member",price:299,duration_days:365,summary_zh:"取得年度会员资格；每场活动费用另付。",summary_en:"Annual member access; individual event fees are separate.",features_zh:"浏览公开活动\n报名符合资格的活动\n付款确认后查看具体地点",features_en:"Browse public experiences\nBook eligible activities\nView venue after confirmation"},
        {tier:"private",name_zh:"年度合作会员",name_en:"Annual Partner Member",price:2990,duration_days:365,summary_zh:"包含会员权益和经审核的发布资格。",summary_en:"Includes member access and moderated publishing rights.",features_zh:"普通会员全部权益\n提交活动与合作信息\n审核后进入地图与活动列表",features_en:"All member benefits\nSubmit events and partner information\nAppear publicly after review"}
      ],
      events:[...STARTER_EVENTS],
      posts:[...STARTER_POSTS]
    };
    render();
    const banner=document.createElement("div");
    banner.className="connection-banner";
    banner.innerHTML=`<strong>${state.lang==="zh"?"正在使用平台启动内容":"Showing platform starter content"}</strong><span>${state.lang==="zh"?"后端暂时未连接。会员、付款、报名和发布操作需要网络恢复后使用。":"The backend is temporarily unavailable. Membership, payment, booking, and publishing require reconnection."}</span><button type="button">${state.lang==="zh"?"重新连接":"Retry"}</button>`;
    banner.querySelector("button").onclick=()=>location.reload();
    document.body.appendChild(banner);
    console.error("LivingHub API connection failed",error);
  }
}
function render(){
 applyLanguage();
 const d=state.data||{},s=d.settings||{};
 $("#brandName").textContent=s.brand_name||"LivingHub";
 $("#adminLink").href=C.adminUrl;
 $("#tierSelect").innerHTML=(d.plans||[]).map(p=>`<option value="${p.tier}">${loc(p,"name")} · ${money(p.price)}</option>`).join("");
 renderExperiences();
 renderMoments();
 renderMemberships();
 renderMap();
}
function renderExperiences(){
 const grid=$("#experienceGrid"),events=state.data.events||[];
 if(!events.length){grid.innerHTML=`<div class="empty-state">${state.lang==="zh"?"当前没有公开活动。":"No public experiences are available."}</div>`;return}
 grid.innerHTML=events.slice(0,6).map((e,i)=>{
  const seeded=isSeedEvent(e),status=displayStatus(e);
  const price=Number(e.price||0)>0?money(e.price,e.currency):(state.lang==="zh"?"待公布":"TBA");
  const seats=e.available_spots!==null&&e.available_spots!==undefined
    ?`${e.available_spots} ${state.lang==="zh"?"席":"seats"}`
    :status;
  return `<article class="experience-card ${seeded?"starter-card":""}">
   <img src="${images[i%images.length]}" alt="${loc(e,"title")}">
   <div class="experience-content">
    <div class="experience-topline"><span class="tier-pill">${e.required_tier}</span><span class="seat-pill">${seats}</span></div>
    <h3>${loc(e,"title")}</h3>
    <div class="experience-meta">
      <span>${e.city} · ${e.start_at?date(e.start_at):status}</span>
      ${seeded
        ?`<button class="book-button" data-starter="${e.id}">${e.display_status==="organizer_search"?(state.lang==="zh"?"提交活动":"Submit event"):(state.lang==="zh"?"查看状态":"View status")}</button>`
        :`<button class="book-button" data-event="${e.id}">${tr("book")}</button>`}
    </div>
    <small class="starter-note">${seeded?(state.lang==="zh"?"平台启动内容，不代表真实报名人数或已确认举办。":"Platform starter content; it does not represent confirmed attendance or a confirmed event."):""}</small>
   </div>
  </article>`;
 }).join("");
 const first=events[0];
 $("#featuredTitle").textContent=loc(first,"title");
 $("#featuredMeta").textContent=`${first.city} · ${first.start_at?date(first.start_at):displayStatus(first)} · ${Number(first.price||0)>0?money(first.price,first.currency):(state.lang==="zh"?"待公布":"TBA")}`;
 $("#featuredBook").textContent=isSeedEvent(first)?(state.lang==="zh"?"查看筹备状态":"View planning status"):tr("book");
 $("#featuredBook").onclick=()=>isSeedEvent(first)?$("#statusDialog").showModal():openBooking(first);
 $$("[data-event]").forEach(b=>b.onclick=()=>openBooking(events.find(e=>String(e.id)===b.dataset.event)));
 $$("[data-starter]").forEach(b=>b.onclick=()=>{
   const e=events.find(x=>String(x.id)===b.dataset.starter);
   if(e?.display_status==="organizer_search")openSubmit();
   else $("#statusDialog").showModal();
 });
}
function renderMoments(){
 const posts=state.data.posts||STARTER_POSTS;
 $("#momentsRail").innerHTML=posts.slice(0,10).map((p,i)=>`
  <article class="moment-card animate">
   <img src="${images[(i+1)%images.length]}" alt="${loc(p,"title")}">
   <div class="moment-copy">
    <small>${p.theme||"club"} · ${state.lang==="zh"?"平台内容":"Platform content"}</small>
    <h3>${loc(p,"title")||loc(p,"content").slice(0,22)}</h3>
    <p>${loc(p,"content")}</p>
   </div>
  </article>`).join("");
}
function renderMemberships(){
 const plans=state.data.plans||[];
 $("#membershipGrid").innerHTML=plans.map((p,i)=>{
  const features=loc(p,"features").split(/\n+/).filter(Boolean);
  return `<article class="membership-card ${p.tier==="private"?"featured":""}">
   <span class="tier-name">${p.tier==="private"?"PARTNER":p.tier==="community"?"MEMBER":p.tier}</span><h3>${loc(p,"name")}</h3>
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
  $("#mapMeta").textContent=event
      ?`${event.city} · ${isSeedEvent(event)?displayStatus(event):`${event.available_spots??0} ${state.lang==="zh"?"个席位":"seats"}`}`
      :city.city;
  if($("#heroCity"))$("#heroCity").textContent=event?.city||city.city;
  if($("#heroExperience"))$("#heroExperience").textContent=event?loc(event,"title"):"Coffee & Conversation";
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
$("#openJoinTop").onclick=()=>openJoin();$("#openJoinMobile").onclick=()=>openJoin();$("#openStatusTop").onclick=()=>$("#statusDialog").showModal();$("#openStatusSide").onclick=()=>$("#statusDialog").showModal();$("#openStatusMobile").onclick=()=>$("#statusDialog").showModal();
$("#langBtn").onclick=()=>{state.lang=state.lang==="zh"?"en":"zh";localStorage.setItem("sc_lang",state.lang);$("#preferredLanguage").value=state.lang;render()};
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
$$("[data-scroll]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"}));
$("#preferredLanguage").value=state.lang;

function openSubmit(){
  $("#publicEventForm").reset();
  $("#submitEventMessage").innerHTML="";
  $("#submitDialog").showModal();
}
$("#openSubmitSide").onclick=openSubmit;
$("#openSubmitTop").onclick=openSubmit;
$("#openSubmitMobile").onclick=openSubmit;

$("#publicEventForm").onsubmit=async e=>{
  e.preventDefault();
  $("#submitEventMessage").innerHTML="";
  const values=Object.fromEntries(new FormData(e.target));
  try{
    const result=await request("/api/public-event-submissions",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(values)
    });
    $("#submitEventMessage").innerHTML=`<div class="success-message">${
      state.lang==="zh"
        ? `提交成功。合作活动审核编号：${result.submission_number}`
        : `Submitted. Review number: ${result.submission_number}`
    }</div>`;
    e.target.reset();
  }catch(err){
    $("#submitEventMessage").innerHTML=`<div class="error-message">${err.message}</div>`;
  }
};

let deferredInstallPrompt=null;
window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  deferredInstallPrompt=event;
  if(document.querySelector(".install-banner"))return;
  const banner=document.createElement("div");
  banner.className="install-banner";
  banner.innerHTML=`<span>${state.lang==="zh"?"安装 Singles Club 应用":"Install Singles Club"}</span><button>${state.lang==="zh"?"安装":"Install"}</button>`;
  banner.querySelector("button").onclick=async()=>{
    if(!deferredInstallPrompt)return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt=null;
    banner.remove();
  };
  document.body.appendChild(banner);
});

if("serviceWorker" in navigator){
  window.addEventListener("load",async()=>{
    try{
      const registration=await navigator.serviceWorker.register("./service-worker.js",{scope:"./"});
      registration.addEventListener("updatefound",()=>{
        const worker=registration.installing;
        worker?.addEventListener("statechange",()=>{
          if(worker.state==="installed"&&navigator.serviceWorker.controller){
            const toast=document.createElement("button");
            toast.className="update-toast";
            toast.textContent=state.lang==="zh"?"发现新版本，点击更新":"New version available — update";
            toast.onclick=()=>{worker.postMessage({type:"SKIP_WAITING"});location.reload()};
            document.body.appendChild(toast);
          }
        });
      });
    }catch(error){console.warn("Service worker registration failed",error)}
  });
  navigator.serviceWorker.addEventListener("controllerchange",()=>location.reload());
}

load();
})();
