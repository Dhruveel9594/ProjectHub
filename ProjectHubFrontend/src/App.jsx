// src/App.jsx — Add these routes for 2FA

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage          from "./pages/LandingPage";
import LoginPage            from "./pages/LoginPage";
import RegisterPage         from "./pages/RegisterPage";
import CreateProjectPage    from "./pages/CreateProjectPage";
import UserProfilePage      from "./pages/UserProfilePage";
import BrowsePage           from "./pages/BrowsePage";
import DepartmentsPage      from "./pages/DepartmentsPage";
import ProjectDetailPage    from "./pages/ProjectDetailPage";
import TwoFactorSetupPage from "./pages/TwoFactorSetupPage";   // NEW
import TwoFactorLoginPage from "./pages/TwoFactorLoginPage";    // NEW

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/"             element={<LandingPage />}       />
          <Route path="/login"        element={<LoginPage />}         />
          <Route path="/register"     element={<RegisterPage />}      />
          <Route path="/browse"       element={<BrowsePage />}        />
          <Route path="/departments"  element={<DepartmentsPage />}   />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          {/* 2FA Login step — public but requires tempToken in state */}
          <Route path="/verify-2fa"   element={<TwoFactorLoginPage />} />

          {/* Protected */}
          <Route path="/create-project" element={
            <ProtectedRoute><CreateProjectPage /></ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute><UserProfilePage /></ProtectedRoute>
          }/>
          <Route path="/setup-2fa" element={
            <ProtectedRoute><TwoFactorSetupPage /></ProtectedRoute>
          }/>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
