import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Assets from './pages/Assets/Assets';
import AuditLogs from './pages/AuditLogs/AuditLogs';
import Reports from './pages/Reports/Reports';
import Users from './pages/Users/Users';
import Alerts from './pages/Alerts/Alerts';
import Scanner from './pages/Scanner/Scanner';
import Settings from './pages/Settings/Settings';
import Landing from './pages/Auth/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Dashboard />} />
              <Route path="assets" element={<Assets />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<Users />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="scanner" element={<Scanner />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
