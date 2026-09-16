# JSON Toolbox

A static, dependency-free JSON utility SPA.

## Files
- `index.html` — SEO-ready app shell
- `styles.css` — responsive UI
- `app.js` — formatting, stringify, simplification and clipboard logic
- `robots.txt` — crawler rules
- `sitemap.xml` — replace `https://YOUR-DOMAIN.example/` with the real canonical URL

## Deploy
Upload all files to any static web server/CDN (Nginx, Apache, S3/CloudFront, Netlify, Vercel static hosting, GitHub Pages, etc.).

## Modes
- Format JSON: parses and pretty-prints with 2-space indentation.
- Stringify: returns the JSON value encoded as a JSON string, including escaped quotes/newlines.
- Simplify: recursively removes `null`, empty strings, empty arrays, and empty objects.

No API or backend is required. User JSON never leaves the browser.

## SEO
Before production:
1. Replace `/` in the canonical and Open Graph URL with the absolute production URL.
2. Replace the placeholder domain in `sitemap.xml`.
3. Add a custom favicon/OG image if desired.
4. Keep the page title and description aligned with the exact search intent you want to target.
