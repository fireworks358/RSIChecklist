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

`public/legacy-portal/` is a second, minimal product for hospital iPads too old to run the main PWA reliably (very old iOS Safari has limited/buggy Service Worker support and can't run the modern PDF.js viewer). Content-wise it's still just plain HTML/CSS links to PDFs, which iOS Safari opens in its native viewer — but it's also its own installable PWA with client-side search, kept deliberately separate from the main app:

- **Its own service worker** ([public/legacy-portal/sw.js](public/legacy-portal/sw.js)), hand-written (no Workbox), scoped only to `/legacy-portal/`. It precaches the small app shell on install and lazily caches PDFs the first time each one is opened — the ~40MB paediatric PDF set (one file alone is ~30MB) is never bulk-precached, so install can't hang or fail on old hardware.
- **Its own manifest** ([public/legacy-portal/manifest.json](public/legacy-portal/manifest.json)) plus `apple-mobile-web-app-*` meta tags in every page head, so "Add to Home Screen" works both via the manifest (modern Safari/Chrome) and the legacy Apple meta tags (old iOS).
- **Client-side search** ([public/legacy-portal/search.js](public/legacy-portal/search.js)) on the Adult/Paediatric list pages — plain ES5, filters by title/description as you type. Progressive enhancement: the full list is already in the HTML, so if the script fails to load the page still works, just without filtering.
- The main app's build (`vite.config.ts`) explicitly excludes `legacy-portal/**` from its own precache and navigation fallback, so a device that has the main app installed won't have its root-scoped service worker hijack the legacy portal's first load.

It's generated (not hand-edited) from a metadata list in [generate-legacy-portal.cjs](generate-legacy-portal.cjs) that mirrors `src/data/guidelines.ts`. To regenerate after changing guidelines:

```bash
node generate-legacy-portal.cjs
```

Because it lives under `public/`, Vite copies it into `dist/legacy-portal/` unmodified during `npm run build`, so it deploys automatically with the rest of the site to:

```
https://fireworks358.github.io/RSIChecklist/legacy-portal/
```

Note: true iOS Service Worker support only arrived in iOS 11.3 (11.0–11.2 have none). On those, the portal still works as a plain set of linked pages — it just can't be installed or used offline until the device is on 11.3+.

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
