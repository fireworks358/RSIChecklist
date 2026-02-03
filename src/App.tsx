import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation';
import { LandingPage } from './pages/LandingPage';
import { CategoryView } from './pages/CategoryView';
import { PDFViewerPage } from './pages/PDFViewerPage';
import { RotateButton } from './components/ui/RotateButton';

function AppLayout() {
  const location = useLocation();
  const isPDFPage = location.pathname.startsWith('/pdf/');
  const [isRotated, setIsRotated] = useState(false);

  // Auto-reset rotation when navigating away from PDF pages
  useEffect(() => {
    if (!isPDFPage) {
      setIsRotated(false);
    }
  }, [isPDFPage]);

  const routes = (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/category/:category" element={<CategoryView />} />
      <Route path="/pdf/:id" element={<PDFViewerPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );

  if (isRotated) {
    return (
      <div
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: 'top left',
          width: '100dvh',
          height: '100dvw',
          position: 'fixed',
          top: 0,
          left: '100dvw',
          '--app-height': '100dvw',
        } as React.CSSProperties}
      >
        <div style={{ overflowY: 'auto', height: '100%' }}>
          {routes}
        </div>
        <RotateButton isRotated={isRotated} onToggle={() => setIsRotated(prev => !prev)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ '--app-height': '100dvh' } as React.CSSProperties}>
      <Navigation />
      {routes}
      {isPDFPage && (
        <RotateButton isRotated={isRotated} onToggle={() => setIsRotated(prev => !prev)} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppLayout />
    </Router>
  );
}

export default App;
