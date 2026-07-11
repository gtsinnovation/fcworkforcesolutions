import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
// Add page imports here
import Home from './pages/Home';
import Services from '@/pages/fcws/Services';
import ServiceDetail from '@/pages/fcws/ServiceDetail';
import About from '@/pages/fcws/About';
import Careers from '@/pages/fcws/Careers';
import RequestCare from '@/pages/fcws/RequestCare';
import Quiz from '@/pages/fcws/Quiz';
import AdminDashboard from '@/pages/fcws/AdminDashboard';
import CaregiverDashboard from '@/pages/fcws/CaregiverDashboard';
import ClientPortal from '@/pages/fcws/ClientPortal';
import DashboardShell from '@/components/fcws/DashboardShell';
import { ADMIN_NAV, CAREGIVER_NAV, CLIENT_NAV } from '@/components/fcws/dashboardNav';
import PWAInstallPrompt from '@/components/fcws/PWAInstallPrompt';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/request-care" element={<RequestCare />} />
      <Route path="/quiz" element={<Quiz />} />
      
      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<DashboardShell navItems={ADMIN_NAV} title="Admin" roleLabel="Admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route element={<DashboardShell navItems={CAREGIVER_NAV} title="Caregiver" roleLabel="Caregiver" />}>
          <Route path="/caregiver" element={<CaregiverDashboard />} />
        </Route>
        <Route element={<DashboardShell navItems={CLIENT_NAV} title="Family Portal" roleLabel="Client" />}>
          <Route path="/portal" element={<ClientPortal />} />
        </Route>
      </Route>
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
          <PWAInstallPrompt />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App