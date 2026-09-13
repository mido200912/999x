/**
 * App.tsx — Main Router 
 * React No HTML Astro
 * route src/pages
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/public/Landing';
import Onboarding from './pages/public/Onboarding';
import AdminLogin from './pages/public/AdminLogin';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientRoadmap from './pages/client/ClientRoadmap';
import ClientTickets from './pages/client/ClientTickets';
import AdminCockpit from './pages/admin/AdminCockpit';
import AdminAIStudio from './pages/admin/AdminAIStudio';
import AdminCRM from './pages/admin/AdminCRM';
import SponsorStudio from './pages/admin/SponsorStudio';
import AdminProspects from './pages/admin/AdminProspects';
import AdminApprovals from './pages/admin/AdminApprovals';
import AdminDevPortal from './pages/admin/AdminDevPortal';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — English only */}
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/register" element={<Navigate to="/onboarding" replace />} />
        <Route path="/login" element={<Navigate to="/onboarding" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Client Hub — clientId from localStorage or ?id= */}
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/roadmap" element={<ClientRoadmap />} />
        <Route path="/client/tickets" element={<ClientTickets />} />
        <Route path="/sponsor-studio" element={<SponsorStudio />} />

        {/* Admin War Room */}
        <Route path="/admin/cockpit" element={<AdminCockpit />} />
        <Route path="/admin/ai-studio" element={<AdminAIStudio />} />
        <Route path="/admin/crm" element={<AdminCRM />} />
        <Route path="/admin/approvals" element={<AdminApprovals />} />
        <Route path="/admin/prospects" element={<AdminProspects />} />
        <Route path="/admin/dev" element={<AdminDevPortal />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}