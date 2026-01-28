import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register service worker
const updateSW = registerSW({
  immediate: true,
  onRegistered(registration) {
    if (registration) {
      console.log('SW Registration:', registration);
    }
  },
  onRegisterError(error) {
    console.error('Service Worker registration error:', error);
  },
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('✓ App ready to work offline');
    console.log('✓ Service worker activated and caches ready');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
