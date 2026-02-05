
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import LegalNotice from './pages/public/LegalNotice';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import FloatingChatbot from './components/FloatingChatbot';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      {!isAdminRoute && <FloatingChatbot />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
