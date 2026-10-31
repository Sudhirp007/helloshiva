# HelloShiva — Digital Marketing Agency & Free Marketing Tools

HelloShiva is a modern, high-performance digital marketing agency platform offering full-funnel digital marketing services, backed by 10 high-utility, free marketing and SEO tools.

## Architecture

- **Frontend**: Next.js (TypeScript, Tailwind CSS, App Router)
- **Backend**: Python FastAPI (SSRF-protected URL analysis, Lead capture, Admin API)
- **Database**: SQLite in WAL mode (ultra-lean memory footprint for 1 GB RAM cloud instances)
- **Reverse Proxy**: Nginx with Let's Encrypt / Cloudflare SSL
- **Hosting**: Oracle Cloud Infrastructure (Oracle Linux 9, x86_64)

## Main Agency Services

1. SEO Services (Organic Search Growth)
2. Technical SEO (Core Web Vitals & Crawlability)
3. Local SEO (Google Business Profile & Geo-Optimization)
4. Performance Marketing (Paid Search & Meta Ads)
5. Social Media Marketing (Brand Engagement)
6. Content Marketing (Conversion-focused Copy & Strategy)
7. Website Design & Development (Fast, High-converting UX)
8. Digital Strategy (Full-funnel Consulting)

## The 10 Free Marketing Tools

1. **SEO Page Analyzer** (`/tools/seo-page-analyzer`)
2. **SERP Preview Tool** (`/tools/serp-preview`) *(Browser-based)*
3. **Keyword Density Checker** (`/tools/keyword-density-checker`) *(Browser-based)*
4. **Heading Structure Checker** (`/tools/heading-checker`) *(Browser-based)*
5. **Robots.txt Tester** (`/tools/robots-txt-tester`)
6. **XML Sitemap Validator** (`/tools/sitemap-validator`)
7. **UTM Link Builder** (`/tools/utm-builder`) *(Browser-based)*
8. **URL Encoder / Decoder** (`/tools/url-encoder-decoder`) *(Browser-based)*
9. **Open Graph Previewer** (`/tools/open-graph-preview`)
10. **HTTP Headers Checker** (`/tools/http-headers-checker`)

## Development

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
