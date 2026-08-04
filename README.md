# Singles Club PWA v1.0.0 — Upgraded

A premium bilingual local singles club PWA with events, an activity map, daily feed, shared learning, membership tiers, applications, and merchant-owned payment options.

## Included

- Premium mobile-first PWA
- Chinese / English
- Pulsing local activity map
- Club, event, and member post labels
- Weekly challenge
- Shared learning groups
- $99 / $299 / $599 membership tiers
- One-time event pricing
- Three-step application
- 1–3 photo preview
- Application number
- Stripe, Zelle, QR, and on-site payment
- Minimal PIN-protected merchant settings on the current device
- Permission-based trust labels
- Organization, WebSite, and Event JSON-LD
- robots.txt and sitemap.xml

## Merchant settings

Tap the gear button and enter the PIN from `config.js`.

The minimal merchant panel can edit on the current browser:

- brand name
- city
- Stripe Payment Link
- Zelle details
- one urgency notice

For cross-device event editing, member review, payment confirmation, exact venue release, and shared administration, connect Supabase or another backend.

## Before deployment

Edit `config.js`:

- `brandName`
- `siteUrl`
- `city`
- `contactEmail`
- `adminPin`
- `formEndpoint`
- payment details
- real events, dates, prices, seats, cities, and images
- live notices, posts, learning groups, and membership plans

Replace `https://example.com/` in `robots.txt` and `sitemap.xml`.

Replace all sample images with real, authorized club event photography.

## Important

The animated map shows activity areas only. It must never display a member's exact home, live location, or movement.
