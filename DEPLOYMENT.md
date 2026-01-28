# Deployment Guide

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Prerequisites

- A GitHub account
- Repository pushed to GitHub at `https://github.com/fireworks358/RSIChecklist`

### Setup Instructions

#### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Save the settings

#### 2. Push Your Code

Push all your changes to the `main` branch:

```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

#### 3. Automatic Deployment

The GitHub Actions workflow will automatically:
- Trigger on every push to the `main` branch
- Install dependencies
- Build the production version
- Deploy to GitHub Pages

You can also trigger the deployment manually:
1. Go to **Actions** tab in your repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

### Access Your Deployed Site

After successful deployment, your site will be available at:
```
https://fireworks358.github.io/RSIChecklist/
```

### Configuration Details

#### Vite Configuration
- **Base path**: `/RSIChecklist/` (matches repository name)
- **PWA manifest** configured for offline support
- **Service worker** enabled for caching

#### Important Notes

1. **Large PDF Handling**: The `trauma-reference-document.pdf` (30.5 MB) is excluded from precaching to prevent service worker issues. It will still be cached on-demand when accessed.

2. **Offline Support**: All other PDFs and assets are cached automatically for offline access.

3. **Asset Paths**: All paths in the application use the base path `/RSIChecklist/`, ensuring proper resource loading on GitHub Pages.

### Troubleshooting

#### Build Fails
- Check the Actions tab for error logs
- Ensure all dependencies are properly listed in `package.json`
- Verify TypeScript compilation passes locally

#### Assets Not Loading
- Confirm the base path in `vite.config.ts` matches your repository name
- Check browser console for 404 errors
- Verify the `.nojekyll` file is present in the `public` directory

#### Service Worker Issues
- Clear browser cache and service worker
- Check that PWA manifest is properly configured
- Verify the service worker is registered (check browser DevTools → Application → Service Workers)

### Local Testing

To test the production build locally:

```bash
# Build the production version
npm run build

# Preview the production build
npm run preview
```

The preview server will run at `http://localhost:4173/RSIChecklist/`

### Manual Deployment (Alternative)

If you prefer manual deployment using gh-pages:

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Deploy manually:
```bash
npm run deploy
```

This will build and push the `dist` folder to the `gh-pages` branch.
