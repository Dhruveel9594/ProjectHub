// src/pages/TwoFactorLoginPage.jsx
// Shown automatically after password check when 2FA is enabled

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

export default function TwoFactorLoginPage() {
  const navigate        = useNavigate();
  const location        = useLocation();
  const { login }       = useAuth();

  // tempToken passed from LoginPage via router state
  const tempToken = location.state?.tempToken;

  const [code,    setCode]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [attempts, setAttempts] = useState(0);

  // Redirect if no tempToken (user navigated here directly)
  if (!tempToken) {
    navigate("/login");
    return null;
  }

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-2fa", {
        tempToken,
        code: parseInt(code),
      });

      const data = res.data;

      // Store auth data and redirect to home
      login(
        { id: data.id, username: data.username, email: data.email, role: data.role },
        data.accessToken,
        data.refreshToken
      );

      navigate("/");

    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setCode("");

      if (newAttempts >= 5) {
        setError("Too many failed attempts. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          err.response?.data ||
          `Invalid code. ${5 - newAttempts} attempts remaining.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="text-xl font-extrabold tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          Project<span className="text-orange-500">Hub</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Login
        </button>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-4">

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm">

          {/* Icon + title */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Two-Factor Authentication
            </h1>
            <p className="text-gray-400 text-sm">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <div className="bg-[#16161f] border border-white/10 rounded-2xl p-8">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            {/* Code input */}
            <div className="mb-5">
              <label className="text-sm text-gray-300 font-medium block mb-2">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="000000"
                autoFocus
                className="w-full bg-[#0a0a0f] border border-white/10 focus:border-orange-500/50 text-white text-3xl font-mono text-center tracking-[0.5em] rounded-xl px-4 py-4 outline-none transition-all"
              />
            </div>

            {/* Hint */}
            <p className="text-xs text-gray-600 text-center mb-5">
              Open Google Authenticator or Authy on your phone
            </p>

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={loading || code.length !== 6}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(249,115,22,0.35)]"
            >
              {loading ? "Verifying..." : "Verify →"}
            </button>

            {/* Back to login */}
            <p className="text-center text-xs text-gray-600 mt-4">
              Lost your phone?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                Start over
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}