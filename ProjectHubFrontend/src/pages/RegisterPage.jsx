// src/pages/RegisterPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/services";
import InputField from "../Components/InputField";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Student", "Faculty"];

const YEAR_OPTIONS = ["FIRST", "SECOND", "THIRD", "FOURTH"];

const DEPARTMENTS = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    username:    "",
    name:        "",
    email:       "",
    password:    "",
    confirm:     "",
    branch:      "",
    year:        "",
    collegeName: "",
    bio:         "",
    role:        "",
  });

  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleRoleSelect = (role) => {
    setForm((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.username)              e.username    = "Username is required";
    if (!form.name)                  e.name        = "Full name is required";
    if (!form.email)                 e.email       = "Email is required";
    if (!form.password)              e.password    = "Password is required";
    if (form.password.length < 6)    e.password    = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm  = "Passwords do not match";
    if (!form.branch)                e.branch      = "Department is required";
    if (!form.year)                  e.year        = "Year is required";
    if (!form.collegeName)           e.collegeName = "College name is required";
    if (!form.role)                  e.role        = "Please select a role";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      await authService.register(payload);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <Link to="/">
          <div
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Project<span className="text-orange-500">Hub</span>
          </div>
        </Link>
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* ── Centered form ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 relative">

        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-lg">

          {/* Page title */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Join ProjectHub 🎓
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Create your student account
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[#16161f] border border-white/10 rounded-2xl p-8">

            {/* API error banner */}
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* ── Row: username + full name ── */}
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="john_doe"
                  error={errors.username}
                  required
                />
                <InputField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.name}
                  required
                />
              </div>

              {/* ── Email ── */}
              <InputField
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@college.edu"
                error={errors.email}
                required
              />

              {/* ── Row: password + confirm ── */}
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  error={errors.password}
                  required
                />
                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  error={errors.confirm}
                  required
                />
              </div>

              {/* ── College ── */}
              <InputField
                label="College Name"
                name="collegeName"
                value={form.collegeName}
                onChange={handleChange}
                placeholder="e.g. SAKEC, VJTI"
                error={errors.collegeName}
                required
              />

              {/* ── Row: department + year ── */}
              <div className="grid grid-cols-2 gap-4">

                {/* Department */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-gray-300 font-medium">
                    Department <span className="text-orange-400">*</span>
                  </label>
                  <select
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    className={`bg-[#0a0a0f] border ${
                      errors.branch ? "border-red-500" : "border-white/10"
                    } text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500/60 transition-all`}
                  >
                    <option value="" className="bg-[#16161f]">Select dept.</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-[#16161f]">{d}</option>
                    ))}
                  </select>
                  {errors.branch && (
                    <p className="text-xs text-red-400">{errors.branch}</p>
                  )}
                </div>

                {/* Year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-gray-300 font-medium">
                    Year <span className="text-orange-400">*</span>
                  </label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className={`bg-[#0a0a0f] border ${
                      errors.year ? "border-red-500" : "border-white/10"
                    } text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500/60 transition-all`}
                  >
                    <option value="" className="bg-[#16161f]">Select year</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y} className="bg-[#16161f]">
                        {y.charAt(0) + y.slice(1).toLowerCase()} Year
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="text-xs text-red-400">{errors.year}</p>
                  )}
                </div>
              </div>

              {/* ── Role selector ── */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-300 font-medium">
                  I am a <span className="text-orange-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        form.role === r
                          ? r === "Student"
                            ? "bg-orange-500/15 border-orange-500/60 text-orange-300"
                            : "bg-indigo-500/15 border-indigo-500/60 text-indigo-300"
                          : "bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {r === "Student" ? "🎓 Student" : "👨‍🏫 Faculty"}
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-xs text-red-400">{errors.role}</p>
                )}
              </div>

              {/* ── Bio ── */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-300 font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell others a bit about yourself..."
                  rows={3}
                  className="bg-[#0a0a0f] border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all placeholder:text-gray-600 resize-none"
                />
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(249,115,22,0.35)]"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}