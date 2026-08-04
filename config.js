const CONFIG = {
  brandName: "Singles Club",
  pageTitle: "Singles Club — Real Events, Shared Growth, Serious Connections",
  siteUrl: "https://example.com/",
  city: "Los Angeles, California",
  contactEmail: "hello@example.com",

  // Minimal local merchant settings PIN. Change before deployment.
  adminPin: "3699",

  // Formspree, FormSubmit, or your own endpoint. Leave empty to generate an application number only.
  formEndpoint: "",

  // Merchant-owned payment methods
  stripeUrl: "",
  zelle: { enabled: true, name: "Club Name", contact: "zelle@example.com" },
  qr: { enabled: false, label: "Scan to pay", imageUrl: "" },
  onsitePayment: true,

  liveNotices: [
    { zh: "本周活动申请周五截止", en: "Applications close Friday" },
    { zh: "Pasadena 咖啡交流剩余 4 个确认名额", en: "4 confirmed spots remain for Pasadena coffee" },
    { zh: "新一期英语交流小组正在报名", en: "A new English exchange group is open" }
  ],

  events: [
    {
      id: "coffee-conversation",
      titleZh: "咖啡与认真交流",
      titleEn: "Coffee & Conversation",
      date: "Saturday · 6:30 PM",
      startDate: "2026-09-05T18:30:00-07:00",
      city: "Pasadena",
      region: "CA",
      country: "US",
      venue: "Venue shared after confirmation",
      seats: 12,
      price: "$49",
      priceNumber: "49.00",
      currency: "USD",
      image: "./assets/event-coffee.jpg"
    },
    {
      id: "sunday-walk",
      titleZh: "周日城市散步",
      titleEn: "Sunday City Walk",
      date: "Sunday · 10:00 AM",
      startDate: "2026-09-13T10:00:00-07:00",
      city: "Los Angeles",
      region: "CA",
      country: "US",
      venue: "Meeting point shared after confirmation",
      seats: 16,
      price: "$39",
      priceNumber: "39.00",
      currency: "USD",
      image: "./assets/event-walk.jpg"
    },
    {
      id: "small-dinner",
      titleZh: "小型主题晚餐",
      titleEn: "Small Group Dinner",
      date: "Friday · 7:00 PM",
      startDate: "2026-09-18T19:00:00-07:00",
      city: "Arcadia",
      region: "CA",
      country: "US",
      venue: "Restaurant shared after confirmation",
      seats: 10,
      price: "$69",
      priceNumber: "69.00",
      currency: "USD",
      image: "./assets/event-dinner.jpg"
    }
  ],

  mapPoints: [
    { city: "Pasadena", x: 67, y: 34, zh: "本周咖啡交流 · 剩余4个名额", en: "Coffee meetup · 4 spots left" },
    { city: "Arcadia", x: 79, y: 58, zh: "小型晚餐 · 周五停止申请", en: "Small dinner · Closes Friday" },
    { city: "Los Angeles", x: 37, y: 66, zh: "城市散步与看展活动", en: "City walk and gallery event" },
    { city: "Rosemead", x: 70, y: 76, zh: "英语交流小组正在报名", en: "English exchange group open" }
  ],

  posts: [
    { type: "platform", time: "Today", zh: "本周新增一场小型主题晚餐，报名确认后提供具体地点。", en: "A new small-group dinner was added this week. Venue details follow confirmation." },
    { type: "activity", time: "2h", zh: "Pasadena 咖啡交流剩余 4 个确认名额。", en: "Four confirmed spots remain for the Pasadena coffee meetup." },
    { type: "member", time: "4h", zh: "最近开始学做意大利菜，想参加一起做饭的小组。", en: "I recently started learning Italian cooking and would like to join a cooking group." }
  ],

  challenge: {
    titleZh: "和一个新朋友认真聊十分钟",
    titleEn: "Have one thoughtful ten-minute conversation",
    textZh: "本周在活动或学习小组中，认真听完一个人的故事，不急着判断，也不急着交换联系方式。",
    textEn: "At an event or learning group, listen fully to one person's story without rushing to judge or exchange contact details."
  },

  learningGroups: [
    { city: "Pasadena", titleZh: "英语交流", titleEn: "English Exchange", textZh: "4—8人小组，每周一次轻松对话。", textEn: "A relaxed weekly conversation group for 4–8 people." },
    { city: "Arcadia", titleZh: "一起做饭", titleEn: "Cook Together", textZh: "一起完成一道菜，在协作中自然认识。", textEn: "Complete one dish together and connect through collaboration." },
    { city: "Los Angeles", titleZh: "阅读与城市散步", titleEn: "Reading & City Walk", textZh: "一段短阅读，加一次真实城市散步。", textEn: "A short reading followed by a real city walk." }
  ],

  plans: [
    {
      id: "club",
      name: "Club",
      price: 99,
      summaryZh: "进入本地活动与公共学习小组。",
      summaryEn: "Access local events and public learning groups.",
      featuresZh: ["每月1次基础活动", "每周2条动态", "公共学习小组", "有限会员简介"],
      featuresEn: ["1 basic event monthly", "2 posts weekly", "Public learning groups", "Limited member profiles"]
    },
    {
      id: "connection",
      name: "Connection",
      price: 299,
      summaryZh: "为认真寻找长期关系的人提供更多真实参与。",
      summaryEn: "More real participation for members seeking a serious relationship.",
      featuresZh: ["每月3次活动或小组", "更多授权会员简介", "限定学习小组", "活动优先报名", "有限人工介绍"],
      featuresEn: ["3 events or groups monthly", "More authorized profiles", "Member-only learning groups", "Priority registration", "Limited human introductions"]
    },
    {
      id: "private",
      name: "Private",
      price: 599,
      summaryZh: "更深入的人工服务与私人活动协调。",
      summaryEn: "Deeper human support and private event coordination.",
      featuresZh: ["人工整理个人资料", "每月人工推荐", "私人小型活动", "优先确认名额", "双人体验协调"],
      featuresEn: ["Human profile preparation", "Monthly recommendations", "Private small events", "Highest registration priority", "Couple experience coordination"]
    }
  ]
};