# Singles Club PWA v1.0.0 — Final Product

Production-oriented, bilingual, merchant-operated local singles club PWA.

## What is connected

- Public events
- Live activity map
- Public posts
- Shared learning groups
- $99 / $299 / $599 membership plans
- Three-step member application
- Private photo upload
- Application status tracking
- Merchant review workflow
- Merchant-owned Stripe, Zelle, QR, cash, bank, or other payment methods
- Exact venue release after confirmation
- Merchant dashboard
- Event management
- Post management
- Application status management
- Plan management
- Club settings
- Privacy, terms, community rules, and refund pages
- Multi-tenant database structure
- Row-level security
- PWA installation and offline shell
- Organization, WebSite, and Event structured data

## Setup

1. Create a Supabase project owned by the merchant.
2. Run:
   - `supabase/01-schema.sql`
   - `supabase/02-policies.sql`
   - `supabase/03-seed.sql`
3. Create the merchant login user in Supabase Authentication.
4. Add that user's UUID to `tenant_admins` using the final statement in `03-seed.sql`.
5. Edit `config.js`:
   - Supabase URL
   - Supabase anon key
   - tenant slug
   - official site URL
6. Deploy all files to Cloudflare Pages or another static host.
7. Log in through `#admin`.
8. Replace sample events, dates, prices, payment methods, legal business information, and images.

## Payment model

Each merchant adds its own:

- Stripe Payment Links
- Zelle information
- Payment QR image URL
- Bank transfer instructions
- On-site payment

Funds go directly to the merchant. The software does not pool or transfer merchant funds.

## Important legal boundary

Software architecture and contract language can clarify responsibility, but cannot automatically eliminate every legal obligation. The merchant remains responsible for event operation, membership decisions, customer service, refunds, privacy compliance, and local licensing. The software provider remains responsible for its own technical conduct and legal obligations.

## Privacy

The member photo bucket is private. Public users may upload photos with size and type restrictions. Only authenticated tenant administrators can read photos belonging to their tenant.

## Multi-tenant readiness

Every operational table includes `tenant_id`. RLS policies separate tenant data. The first merchant uses one tenant, and additional merchants can later be added without redesigning the schema.
