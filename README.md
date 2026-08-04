# Singles Club PWA v1.0.0

A premium, minimal, bilingual PWA for one local singles club.

## Included

- App-like mobile interface
- Chinese / English
- Real event cards and horizontal browsing
- Featured event module
- Three-step member application
- 1–3 photo preview
- Application number
- Stripe Payment Link
- Zelle
- Custom QR payment
- On-site payment
- PWA installation and offline shell
- Organization, WebSite, Event JSON-LD
- robots.txt and sitemap.xml
- FAQ and visible local service information

## Before deployment

Edit `config.js`:

- `brandName`
- `pageTitle`
- `siteUrl`
- `city`
- `contactEmail`
- `formEndpoint`
- payment settings
- event dates, cities, prices, venues and images

Replace `https://example.com/` in `robots.txt` and `sitemap.xml`.

Replace the sample image files in `assets/` with real, authorized club event photos.

## Application delivery

Without `formEndpoint`, the page generates an application number but does not deliver the full application to the operator. Connect Formspree/FormSubmit or add Supabase for shared management.

## Deployment

Upload the full folder contents to Cloudflare Pages, Netlify, GitHub Pages, or another static host.
