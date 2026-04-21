import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Request from './pages/Request';
import Volunteer from './pages/Volunteer';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Impact from './pages/Impact';
import MyDonations from './pages/MyDonations';
import MyRequests from './pages/MyRequests';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AvailableFood from './pages/AvailableFood';
import Deliveries from './pages/Deliveries';
import MyTasks from './pages/MyTasks';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDonations from './pages/AdminDonations';
import AdminRequests from './pages/AdminRequests';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminVolunteers from './pages/AdminVolunteers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import { AuthDialogProvider } from './context/AuthDialogContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthDialogProvider>
        <Layout>
          <Routes>

            {/* ── Fully Public ── */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/volunteer" element={<Volunteer />} />

            {/* ── Private (any logged-in user) ── */}
            <Route path="/donate" element={<PrivateRoute><Donate /></PrivateRoute>} />
            <Route path="/request" element={<PrivateRoute><Request /></PrivateRoute>} />
            
            <Route path="/map" element={<PrivateRoute><MapView /></PrivateRoute>} />
            <Route path="/impact" element={<PrivateRoute><Impact /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/my-donations" element={<PrivateRoute><MyDonations /></PrivateRoute>} />
            <Route path="/my-requests" element={<PrivateRoute><MyRequests /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

            {/* ── Private (role-restricted) ── */}
            <Route path="/available-food" element={
              <PrivateRoute allowedRoles={['receiver']}>
                <AvailableFood />
              </PrivateRoute>
            } />
            <Route path="/deliveries" element={
              <PrivateRoute allowedRoles={['volunteer']}>
                <Deliveries />
              </PrivateRoute>
            } />
            <Route path="/my-tasks" element={
              <PrivateRoute allowedRoles={['volunteer']}>
                <MyTasks />
              </PrivateRoute>
            } />

            {/* ── Admin only ── */}
            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminUsers />
              </PrivateRoute>
            } />
            <Route path="/admin/donations" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDonations />
              </PrivateRoute>
            } />
            <Route path="/admin/requests" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminRequests />
              </PrivateRoute>
            } />
            <Route path="/admin/analytics" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminAnalytics />
              </PrivateRoute>
            } />
            <Route path="/admin/volunteers" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminVolunteers />
              </PrivateRoute>
            } />

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Layout>
      </AuthDialogProvider>
    </BrowserRouter>
  );
}