# Acalo — Premium Static Education Site (Phase 1 Launch)

A launch-ready static website for **Acalo** (`acalo.live`) built for GitHub Pages using only HTML, CSS, and vanilla JavaScript.

## 1) Project Overview
This repo ships Phase 1: conversion-focused public website for LSAT, IB, GCSE, and writing/reasoning support.

It includes:
- Homepage with premium conversion flow
- Courses page with pricing and comparison
- Notes hub with search + category filters
- Downloads page with free/premium split and future gated area
- Results page with methodology-led trust
- About page with brand-first positioning
- Contact/booking page with validation and integration hooks

## 2) File Structure

```
.
├── index.html
├── courses.html
├── notes.html
├── downloads.html
├── results.html
├── about.html
├── contact.html
├── styles.css
├── script.js
├── config.js
├── robots.txt
├── sitemap.xml
└── assets
    ├── images/
    ├── icons/
    └── data/
        ├── courses.json
        ├── notes.json
        ├── downloads.json
        ├── faqs.json
        └── testimonials.json
```

## 3) How to Edit Copy
- Static page copy: edit the relevant `.html` file.
- Reusable/structured sections:
  - Programs: `assets/data/courses.json`
  - Notes: `assets/data/notes.json`
  - Downloads: `assets/data/downloads.json`
  - FAQs: `assets/data/faqs.json`

## 4) How to Edit Pricing
Edit `config.js` under `pricing`:
- `diagnostic`
- `oneToOne`
- `pack4`
- `intensive7`
- `ibgcse`

Each item supports both `usd` and `inr` fields.

## 5) How to Set Payment Links
Edit `config.js` under `payments`:
- `diagnostic`
- `oneToOne`
- `pack4`
- `intensive7`
- `ibgcse`

Use hosted checkout/payment links from Stripe or Razorpay. Buttons fail gracefully with a message if any URL is missing.

## 6) How to Set Calendly Link
Edit `config.js`:
- `bookingUrl`: set your Calendly (or other scheduler) URL.

All booking buttons read this field.

## 7) How to Set Form Endpoints
Edit `config.js`:
- `contactFormEndpoint`
- `leadMagnetFormEndpoint`

Suggested static-compatible options:
- Formspree
- Basin
- Getform
- Google Apps Script endpoint

If endpoints are blank, forms show clear fallback messages (no silent failure).

## 8) Deploy to GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set source to **Deploy from branch**.
4. Select `main` (or preferred branch) and root (`/`).
5. Save and wait for deployment URL.

## 9) Connect Custom Domain (`acalo.live`)
1. In GitHub Pages settings, set custom domain to `acalo.live`.
2. In DNS provider:
   - Add A records for GitHub Pages IPs.
   - Add `www` CNAME to `<username>.github.io` if needed.
3. Enable HTTPS in Pages settings.
4. Add a `CNAME` file later if your workflow requires it.

## 10) Enable Phase 2 Later (Dynamic Student Layer)
The frontend is prepared for expansion via config hooks and placeholder modules.

Planned modules:
- Profile creation
- Student login/signup
- Student dashboard
- Doubt submission
- Gated downloads
- Purchased resource access
- Session history
- Teacher expansion architecture

### Recommended Phase 2 stack
- **Supabase Auth**: login/signup/session management
- **Supabase Database**: profiles, doubts, purchases, sessions
- **Stripe/Razorpay**: hosted checkout + webhook-based access
- **Calendly**: scheduling flows
- **Formspree**: interim forms

## 11) Suggested External Services
- Supabase
- Stripe
- Razorpay
- Calendly
- Formspree

## 12) What is Intentionally Static in Phase 1
- Public pages and content delivery
- Pricing display with localStorage currency preference
- Search/filtering for notes/downloads
- Payment/scheduling as external links
- Form submissions via third-party endpoints

## 13) What is Prepared for Expansion
- Config-driven integration points in `config.js`
- JSON data-driven content rendering from `assets/data`
- Placeholder UI sections for student portal and gated resources
- Documented data-contract stubs for future profile/doubt/purchase/session records

---

## Quick Launch Checklist
- [ ] Update `primaryEmail` in `config.js`
- [ ] Set `bookingUrl`
- [ ] Set payment URLs
- [ ] Set contact + lead form endpoints
- [ ] Replace placeholder testimonials with verified statements
- [ ] Add OG image at `assets/images/og-acalo.jpg`
