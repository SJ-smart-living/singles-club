window.APP_CONFIG = {
  apiBaseUrl: "https://singles-club-backend.onrender.com",
  siteUrl: "https://sj-smart-living.github.io/singles-club/",
  adminUrl: "https://singles-club-backend.onrender.com/admin.html",
  defaultLanguage: "zh",
  maxPhotos: 3,
  maxPhotoBytes: 5 * 1024 * 1024,
  allowedPhotoTypes: ["image/jpeg", "image/png", "image/webp"],
  statusOrder: [
    "submitted",
    "under_review",
    "approved",
    "awaiting_payment",
    "payment_pending",
    "payment_received",
    "confirmed",
    "venue_unlocked",
    "checked_in",
    "completed"
  ]
};
