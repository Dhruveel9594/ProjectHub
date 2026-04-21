
// src/pages/CreateProjectPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import InputField from "../Components/InputField";
import Navbar from "../Components/Navbar";

const PROJECT_TYPES = [
  "Mini Project",
  "Major Project",
  "Final Year Project",
  "Research Paper",
  "Open Source",
];

const YEAR_OPTIONS = ["FIRST", "SECOND", "THIRD", "FOURTH"];

const DEPARTMENTS = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

export default function CreateProjectPage() {
  const navigate     = useNavigate();
  const { isLoggedIn } = useAuth();

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const [form, setForm] = useState({
    title:       "",
    description: "",
    techStack:   "",
    githubLink:  "",
    demoLink:    "",
    fileUrl:     "",
    thumbnailUrl:"",
    department:  "",
    projectType: "",
    year:        "",
    tag:         "",
  });

  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title)       e.title      = "Title is required";
    if (!form.description) e.description = "Description is required";
    if (!form.techStack)   e.techStack  = "Tech stack is required";
    if (!form.department)  e.department = "Department is required";
    if (!form.projectType) e.projectType = "Project type is required";
    if (!form.year)        e.year       = "Year is required";
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
      await projectService.create(form);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-2">
            ✦ Share Your Work
          </p>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Upload a Project
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Share your project with juniors and the community.
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-5 py-4 mb-6 text-sm">
            ✅ Project uploaded successfully! Redirecting...
          </div>
        )}

        {/* Error banner */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-6 text-sm">
            {apiError}
          </div>
        )}

        {/* Form card */}
        <div className="bg-[#16161f] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* ── Basic Info ── */}
            <SectionDivider title="Basic Information" />

            <InputField
              label="Project Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. AI-Based Attendance System"
              error={errors.title}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-medium">
                Description <span className="text-orange-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your project — what it does, the problem it solves, and how you built it..."
                rows={4}
                className={`bg-[#0a0a0f] border ${
                  errors.description ? "border-red-500" : "border-white/10"
                } text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all placeholder:text-gray-600 resize-none`}
              />
              {errors.description && (
                <p className="text-xs text-red-400">{errors.description}</p>
              )}
            </div>

            <InputField
              label="Tech Stack"
              name="techStack"
              value={form.techStack}
              onChange={handleChange}
              placeholder="e.g. React, Spring Boot, MySQL, Tailwind CSS"
              error={errors.techStack}
              required
            />

            <InputField
              label="Tags"
              name="tag"
              value={form.tag}
              onChange={handleChange}
              placeholder="e.g. AI, Machine Learning, Web Dev"
            />

            {/* ── Classification ── */}
            <SectionDivider title="Classification" />

            <div className="grid grid-cols-3 gap-4">

              {/* Department */}
              <SelectField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                error={errors.department}
                required
                options={DEPARTMENTS}
              />

              {/* Project Type */}
              <SelectField
                label="Project Type"
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                error={errors.projectType}
                required
                options={PROJECT_TYPES}
              />

              {/* Year */}
              <SelectField
                label="Year"
                name="year"
                value={form.year}
                onChange={handleChange}
                error={errors.year}
                required
                options={YEAR_OPTIONS}
                labelMap={{ FIRST: "1st Year", SECOND: "2nd Year", THIRD: "3rd Year", FOURTH: "4th Year" }}
              />
            </div>

            {/* ── Links ── */}
            <SectionDivider title="Links" />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="GitHub Link"
                name="githubLink"
                value={form.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/you/repo"
              />
              <InputField
                label="Demo Link"
                name="demoLink"
                value={form.demoLink}
                onChange={handleChange}
                placeholder="https://your-demo.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Thumbnail URL"
                name="thumbnailUrl"
                value={form.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://image-url.com/thumb.png"
              />
              <InputField
                label="File / ZIP URL"
                name="fileUrl"
                value={form.fileUrl}
                onChange={handleChange}
                placeholder="https://storage.com/project.zip"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(249,115,22,0.35)]"
              >
                {loading ? "Uploading..." : "Upload Project"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 border border-white/10 hover:border-white/30 hover:bg-white/5 text-white font-medium rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

// ── Helper sub-components ─────────────────────────────────────

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest whitespace-nowrap">
        {title}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, required, options, labelMap }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-300 font-medium">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`bg-[#0a0a0f] border ${
          error ? "border-red-500" : "border-white/10"
        } text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500/60 transition-all`}
      >
        <option value="" className="bg-[#16161f]">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#16161f]">
            {labelMap ? labelMap[opt] ?? opt : opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}