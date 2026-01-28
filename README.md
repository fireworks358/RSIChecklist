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

## Adding Your Clinical Guidelines

### Required PDF Files

Replace the placeholder PDFs in these folders with your actual clinical guidelines:

**Adult Guidelines** (`public/guidelines/adult/`):
1. `rsi-checklist.pdf`
2. `difficult-airway-algorithm.pdf`
3. `cico-algorithm.pdf`
4. `failed-intubation-drill.pdf`

**Paediatric Guidelines** (`public/guidelines/paediatric/`):
1. `rsi-checklist.pdf`
2. `difficult-airway-algorithm.pdf`
3. `cico-algorithm.pdf`
4. `failed-intubation-drill.pdf`

### Adding New Guidelines

To add more guidelines, update [src/data/guidelines.ts](src/data/guidelines.ts) with the new guideline metadata.

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
- `node generate-pdfs.cjs` - Regenerate placeholder PDFs
- `node generate-icons.cjs` - Regenerate placeholder icons

## Deployment

Deploy to any static hosting platform (Netlify, Vercel, GitHub Pages, etc.). The app MUST be served over HTTPS for PWA features to work.

---

**Made for the NHS with ❤️**
