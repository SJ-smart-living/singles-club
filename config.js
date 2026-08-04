const CONFIG = {
  brandName: "Singles Club",
  pageTitle: "Singles Club — Real Events, Shared Learning, Serious Connections",
  siteUrl: "https://example.com/",
  city: "Los Angeles, California",
  contactEmail: "hello@example.com",
  formEndpoint: "",
  stripeUrl: "",
  zelle: { enabled: true, name: "Club Name", contact: "zelle@example.com" },
  qr: { enabled: false, label: "Scan to pay", imageUrl: "" },
  onsitePayment: true,

  events: [
    {id:"coffee",titleZh:"咖啡与认真交流",titleEn:"Coffee & Conversation",date:"Saturday · 6:30 PM",startDate:"2026-09-05T18:30:00-07:00",city:"Pasadena",region:"CA",country:"US",venue:"Shared after confirmation",price:"$49",priceNumber:"49.00",currency:"USD"},
    {id:"walk",titleZh:"周日城市散步",titleEn:"Sunday City Walk",date:"Sunday · 10:00 AM",startDate:"2026-09-13T10:00:00-07:00",city:"Los Angeles",region:"CA",country:"US",venue:"Shared after confirmation",price:"$39",priceNumber:"39.00",currency:"USD"},
    {id:"dinner",titleZh:"小型主题晚餐",titleEn:"Small Group Dinner",date:"Friday · 7:00 PM",startDate:"2026-09-18T19:00:00-07:00",city:"Arcadia",region:"CA",country:"US",venue:"Shared after confirmation",price:"$69",priceNumber:"69.00",currency:"USD"}
  ],

  mapPoints: [
    {city:"Pasadena",x:67,y:34,zh:"咖啡交流 · 剩余4个名额",en:"Coffee meetup · 4 spots left"},
    {city:"Arcadia",x:79,y:58,zh:"小型晚餐 · 周五截止",en:"Small dinner · Closes Friday"},
    {city:"Los Angeles",x:37,y:66,zh:"城市散步 · 本周日",en:"City walk · This Sunday"},
    {city:"Rosemead",x:70,y:76,zh:"英语交流小组开放",en:"English exchange open"}
  ],

  posts: [
    {type:"platform",time:"Now",zh:"本周活动申请周五截止。",en:"Applications close Friday."},
    {type:"activity",time:"12m",zh:"Pasadena 咖啡交流剩余4个确认名额。",en:"Four confirmed spots remain in Pasadena."},
    {type:"member",time:"24m",zh:"最近开始学做意大利菜，想认识也喜欢一起做饭的人。",en:"I started learning Italian cooking and would like to meet someone who enjoys cooking together."},
    {type:"platform",time:"1h",zh:"新一期英语交流小组已经开放。",en:"A new English exchange group is open."}
  ],

  plans: [
    {id:"club",name:"Club",price:99},
    {id:"connection",name:"Connection",price:299},
    {id:"private",name:"Private",price:599}
  ]
};