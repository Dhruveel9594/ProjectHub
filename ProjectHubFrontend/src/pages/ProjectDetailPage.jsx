// src/pages/LoginPage.jsx
// Updated to handle 2FA redirect

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import InputField from "../Components/InputField";

export default function LoginPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form,    setForm]    = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(form);
      const data = res.data;

      // ── 2FA CHECK ──
      // If backend says 2FA is required → redirect to 2FA page
      // Pass tempToken via router state (not URL — more secure)
      if (data.requiresTwoFactor) {
        navigate("/verify-2fa", {
          state: { tempToken: data.tempToken }
        });
        return;
      }

      // Normal login — store tokens and redirect
      login(
        { id: data.id, username: data.username, email: data.email, role: data.role },
        data.accessToken,
        data.refreshToken
      );
      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <Link to="/">
          <div className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Project<span className="text-orange-500">Hub</span>
          </div>
        </Link>
        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 relative">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Welcome back 👋
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to your ProjectHub account
            </p>
          </div>

          <div className="bg-[#16161f] border border-white/10 rounded-2xl p-8">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <InputField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
              <InputField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(249,115,22,0.35)]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register"
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}