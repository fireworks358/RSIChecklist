import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation';
import { LandingPage } from './pages/LandingPage';
import { CategoryView } from './pages/CategoryView';
import { PDFViewerPage } from './pages/PDFViewerPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/category/:category" element={<CategoryView />} />
          <Route path="/pdf/:id" element={<PDFViewerPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
