const APP_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",

  tenantSlug: "singles-club",
  brandFallback: "Singles Club",
  siteUrl: "https://example.com/",
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