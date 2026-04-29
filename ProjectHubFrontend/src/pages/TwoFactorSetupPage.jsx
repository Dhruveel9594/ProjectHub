// src/pages/TwoFactorSetupPage.jsx
// User visits this from profile settings to enable 2FA

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Navbar from "../Components/Navbar";

export default function TwoFactorSetupPage() {
  const navigate = useNavigate();

  const [step,       setStep]       = useState(1);    // 1 = intro, 2 = scan QR, 3 = verify, 4 = done
  const [qrCode,     setQrCode]     = useState("");
  const [secret,     setSecret]     = useState("");
  const [code,       setCode]       = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  // Step 1 → 2: Generate QR code
  const handleStartSetup = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/2fa/setup");
      setQrCode(res.data.qrCodeImage);
      setSecret(res.data.secret);
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Failed to start 2FA setup.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → 3: User scanned QR, now enter code
  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/2fa/setup/confirm", { code: parseInt(code) });
      setStep(4);
    } catch (err) {
      setError(err.response?.data || "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <div className="max-w-lg mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-2">
            ✦ Account Security
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Enable Two-Factor Authentication
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Add an extra layer of security to your account.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {["Start", "Scan QR", "Verify", "Done"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > i + 1
                  ? "bg-green-500 text-white"
                  : step === i + 1
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-gray-500"
              }`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${step === i + 1 ? "text-white" : "text-gray-600"}`}>
                {label}
              </span>
              {i < 3 && <div className="w-6 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#16161f] border border-white/10 rounded-2xl p-8">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* ── Step 1: Introduction ── */}
          {step === 1 && (
            <div>
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-lg font-bold mb-3"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                What is 2FA?
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Two-factor authentication adds a second verification step when
                you log in. Even if someone steals your password, they can't
                access your account without your phone.
              </p>

              <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-2">
                <p className="text-sm text-gray-300 font-medium mb-2">What you need:</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>📱</span>
                  <span>Google Authenticator or Authy app on your phone</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>📷</span>
                  <span>Camera to scan a QR code</span>
                </div>
              </div>

              <button
                onClick={handleStartSetup}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
              >
                {loading ? "Setting up..." : "Start Setup →"}
              </button>
            </div>
          )}

          {/* ── Step 2: Scan QR code ── */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                Scan this QR Code
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Open Google Authenticator or Authy → tap + → Scan QR code
              </p>

              {/* QR Code image */}
              <div className="flex justify-center mb-5">
                <div className="bg-white p-3 rounded-xl">
                  <img src={qrCode} alt="2FA QR Code" width={180} height={180} />
                </div>
              </div>

              {/* Manual entry option */}
              <div className="bg-white/5 rounded-xl p-4 mb-5">
                <p className="text-xs text-gray-500 mb-1">
                  Can't scan? Enter this code manually:
                </p>
                <p className="text-sm font-mono text-orange-300 tracking-wider break-all">
                  {secret}
                </p>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-xl transition-all"
              >
                I've scanned it →
              </button>
            </div>
          )}

          {/* ── Step 3: Enter code to verify ── */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                Enter Verification Code
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Enter the 6-digit code from your authenticator app to confirm setup.
              </p>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-[#0a0a0f] border border-white/10 focus:border-orange-500/50 text-white text-2xl font-mono text-center tracking-widest rounded-xl px-4 py-4 outline-none transition-all mb-5"
              />

              <button
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 6}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
              >
                {loading ? "Verifying..." : "Verify & Enable 2FA"}
              </button>
            </div>
          )}

          {/* ── Step 4: Success ── */}
          {step === 4 && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-bold mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                2FA Enabled!
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Your account is now protected with two-factor authentication.
                You'll need your authenticator app every time you log in.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs rounded-xl px-4 py-3 mb-6 text-left">
                ⚠️ Important: If you lose your phone, you won't be able to log in.
                Contact support to recover your account.
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Back to Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}