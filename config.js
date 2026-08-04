const CONFIG = {
  brandName: "Singles Club",
  pageTitle: "Singles Club — Real Local Events and Serious Connections",
  siteUrl: "https://example.com/",
  city: "Los Angeles, California",
  contactEmail: "hello@example.com",

  // 使用 Formspree、FormSubmit 或你自己的接收地址；留空时只生成报名编号。
  formEndpoint: "",

  // 商家自己的 Stripe Payment Link
  stripeUrl: "",

  zelle: {
    enabled: true,
    name: "Club Name",
    contact: "zelle@example.com"
  },

  qr: {
    enabled: false,
    label: "Scan to pay",
    imageUrl: ""
  },

  onsitePayment: true,

  events: [
    {
      id: "coffee-conversation",
      titleZh: "咖啡与认真交流",
      titleEn: "Coffee & Conversation",
      date: "Saturday · 6:30 PM",
      startDate: "2026-09-05T18:30:00-07:00",
      city: "Los Angeles",
      region: "CA",
      country: "US",
      venue: "Venue shared after confirmation",
      seats: 12,
      price: "$29",
      priceNumber: "29.00",
      currency: "USD",
      image: "./assets/event-coffee.jpg"
    },
    {
      id: "sunday-walk",
      titleZh: "周日城市散步",
      titleEn: "Sunday City Walk",
      date: "Sunday · 10:00 AM",
      startDate: "2026-09-13T10:00:00-07:00",
      city: "Pasadena",
      region: "CA",
      country: "US",
      venue: "Meeting point shared after confirmation",
      seats: 16,
      price: "$19",
      priceNumber: "19.00",
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
      price: "$39",
      priceNumber: "39.00",
      currency: "USD",
      image: "./assets/event-dinner.jpg"
    }
  ]
};