# Dynamix Group LLC Website Blueprint

## 1) Sitemap
- Home (`/index.html`)
- About (`/about.html`)
- Services (`/services.html`)
- Industries (`/industries.html`)
- Contact (`/contact.html`)

## 2) Wireframe-Level Layout

### Home
- Header: logo, 5-link navigation
- Hero: headline, supporting copy, 2 CTAs, right-side leadership image
- Value statement: positioning against general staffing
- Services overview: 3 cards
- Approach section: consultative process and bullet points
- Leadership section: Lou Carcelli highlight
- Trust section: national reach, strategic focus, business alignment
- Final CTA band
- Footer

### About
- Page hero with trust-oriented intro
- Philosophy section (why firm exists / how it works)
- Leadership section for Lou Carcelli
- Proof list (why clients choose Dynamix Group)
- CTA band
- Footer

### Services
- Page hero
- 3 service cards: executive search, leadership placement, succession planning
- Process section with clear steps
- Positioning block: not staffing volume
- CTA band
- Footer

### Industries
- Page hero
- 2-column scope cards:
  - Industries served
  - Functional expertise
- Context section (range without complexity)
- CTA band
- Footer

### Contact
- Page hero with invitation
- Left: essential contact form (name, company, email, phone, message)
- Right: contact info, engagement triggers, office visual
- Footer

## 3) High-Fidelity Design Description
- Design language: minimal, restrained, corporate.
- Color system:
  - Background: off-white (`#f7f6f3`)
  - Text: deep slate (`#1f2933`)
  - Accent: muted navy (`#22384d`)
  - Lines/surfaces: soft neutral grays
- Typography:
  - Headings: `Fraunces` (editorial-serious, premium)
  - Body/UI: `Source Sans 3` (clean, readable)
- Layout:
  - Wide but controlled container (`min(1120px, 92vw)`)
  - Generous vertical rhythm and section spacing
  - Card/split/grid modules for scannability
- Motion:
  - Soft reveal-on-scroll
  - Gentle hover elevation and transitions
  - No heavy animation
- Mobile UX:
  - Collapsible navigation
  - Single-column stacking under 980px
  - Touch-friendly spacing and controls

## 4) Complete Website Copy
All production copy is implemented directly in:
- `index.html`
- `about.html`
- `services.html`
- `industries.html`
- `contact.html`

The copy follows the PRD voice and positioning:
- Executive search and strategic recruitment
- Leadership and impact hiring
- Consultative, customized process
- Distinct from mass staffing

## 5) Suggested Tech Stack (Production Upgrade)
- Framework: Next.js (App Router)
- Styling: Tailwind CSS + design tokens
- CMS: Sanity or Contentful (editable page sections)
- Forms: Server action + Resend or Formspree + Cloudflare Turnstile
- Hosting: Vercel
- Analytics: Plausible or GA4
- SEO: native Next metadata + structured data

## 6) Example Component Structure (If Migrated to Next.js)
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/sections/Hero.tsx`
- `components/sections/ServiceCards.tsx`
- `components/sections/LeadershipHighlight.tsx`
- `components/sections/TrustStats.tsx`
- `components/sections/CtaBand.tsx`
- `components/forms/ContactForm.tsx`
- `app/page.tsx` (Home)
- `app/about/page.tsx`
- `app/services/page.tsx`
- `app/industries/page.tsx`
- `app/contact/page.tsx`

## Notes
- Current implementation is a complete static site with shared CSS/JS.
- Real imagery is sourced from Unsplash URLs.
- Contact form is currently front-end placeholder; connect to production backend for secure delivery and spam protection.
