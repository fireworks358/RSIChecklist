# Emergency Airway Portal

An NHS-branded, offline-first Progressive Web App (PWA) designed for 15.6-inch tablets to provide quick access to emergency airway guidelines for healthcare professionals.

## Features

- **NHS Branding**: Follows NHS Digital Service Manual style guidelines with official colors
- **Offline-First**: All PDFs are pre-cached for offline access using Service Workers
- **Touch-Optimized**: Large touch targets (minimum 60px) optimized for tablet interaction
- **Split-Screen Landing**: Quick access to Adult and Paediatric guidelines
- **PDF Viewer**: Full-featured PDF viewer with zoom, pagination, and navigation controls
- **Responsive Design**: Optimized for 15.6-inch tablet landscape orientation

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS v3 with custom NHS theme
- **PWA**: vite-plugin-pwa with Workbox
- **PDF Viewer**: react-pdf library
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Adding Clinical Guidelines

Place the PDF in `public/guidelines/adult/` or `public/guidelines/paediatric/`, then register it in [src/data/guidelines.ts](src/data/guidelines.ts) with the new guideline metadata.

If you add/rename/remove a PDF, also update the matching entry in [generate-legacy-portal.cjs](generate-legacy-portal.cjs) and re-run `node generate-legacy-portal.cjs` (see below).

## Legacy Portal (old iPads, iOS 11+)

`public/legacy-portal/` is a second, minimal product for hospital iPads too old to run the main PWA reliably (iOS 11 Safari has limited/buggy Service Worker support and can't run the modern PDF.js viewer). It's plain HTML/CSS with **no build step and no service worker** — a landing page with tiles that link straight to PDFs, which iOS Safari opens in its native viewer. Almost every page is JS-free; the Directory page's search box is the one exception, using a small vanilla `<script>` to filter as you type.

### Directory page

`directory.html` is a searchable phone/bleep directory with a tap-to-call QR code for the switchboard at the top. Its content comes from [directory-data.csv](directory-data.csv), not from the generator script — edit that CSV to add, rename, remove, or re-nest entries (nesting is just `Parent > Child` in the `Path` column), then rebuild with `node generate-legacy-portal.cjs`.

If you change the Switchboard number, also regenerate its QR code:

```bash
python3 generate-directory-qr.py
```

(requires `pip install qrcode`).

It's installable as its own home-screen app, separate from the main PWA. Each page carries `apple-mobile-web-app-*` meta tags, an `apple-touch-icon`, and a `manifest.json` (name "Emergency Airway Portal (Legacy)", scoped to `legacy-portal/`) — all of which work without any JavaScript, so "Add to Home Screen" on old iOS gives it a distinct icon/title from the main app. There's deliberately no service worker behind it, so it won't trigger Chrome/Android's automatic install banner (which requires one) — "Add to Home Screen" from the browser menu still works there.

It's generated (not hand-edited) from a metadata list in [generate-legacy-portal.cjs](generate-legacy-portal.cjs) that mirrors `src/data/guidelines.ts`. To regenerate after changing guidelines:

```bash
node generate-legacy-portal.cjs
```

Because it lives under `public/`, Vite copies it into `dist/legacy-portal/` unmodified during `npm run build`, so it deploys automatically with the rest of the site to:

```
https://fireworks358.github.io/RSIChecklist/legacy-portal/
```

## NHS Branding

The application follows NHS Digital Service Manual guidelines:

- **Primary Color**: #005EB8 (NHS Blue)
- **Secondary Color**: #FFFFFF (White)
- **Background**: #F0F4F5 (Light Grey)
- **Typography**: Bold, black, sans-serif (Arial/Helvetica)

## Offline Functionality

The application uses Service Workers to cache all assets and PDFs for offline use:

- **Pre-caching**: All PDFs are cached on first load
- **Maximum file size**: 10MB per PDF
- **Cache strategy**: Cache-first for PDFs and assets

To verify offline functionality:
1. Open Chrome DevTools → Application → Service Workers
2. Check that the service worker is registered
3. Go to Network tab → Select "Offline"
4. Navigate through the app - everything should work

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `node generate-icons.cjs` - Regenerate app icons

## Deployment

Deploy to any static hosting platform (Netlify, Vercel, GitHub Pages, etc.). The app MUST be served over HTTPS for PWA features to work.

---

**Made for the NHS with ❤️**
