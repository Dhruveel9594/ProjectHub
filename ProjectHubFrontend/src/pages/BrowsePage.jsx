// src/pages/BrowsePage.jsx

import { useEffect, useState } from "react";
import { projectService } from "../api/services";
import Navbar from "../Components/Navbar";
import ProjectCard from "../Components/ProjectCard";

const DEPARTMENTS = [
  "All",
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

const YEAR_OPTIONS = [
  { label: "All Years", value: "" },
  { label: "1st Year",  value: "FIRST"  },
  { label: "2nd Year",  value: "SECOND" },
  { label: "3rd Year",  value: "THIRD"  },
  { label: "4th Year",  value: "FOURTH" },
];

const TYPE_OPTIONS = [
  "All",
  "Mini Project",
  "Major Project",
  "Final Year Project",
  "Research Paper",
  "Open Source",
];

const SORT_OPTIONS = [
  { label: "Newest First",  value: ""           },
  { label: "Top Rated",     value: "top-rated"  },
  { label: "Most Saved",    value: "most-saved" },
];

export default function BrowsePage() {
  const [projects,    setProjects]    = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [department,  setDepartment]  = useState("All");
  const [year,        setYear]        = useState("");
  const [projectType, setProjectType] = useState("All");
  const [sortBy,      setSortBy]      = useState("");

  // Fetch all projects once
  useEffect(() => {
    projectService
      .getAll()
      .then((res) => {
        setProjects(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  // Apply filters on every filter change
  useEffect(() => {
    let result = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.techStack?.toLowerCase().includes(q) ||
          p.tag?.toLowerCase().includes(q)
      );
    }

    if (department !== "All") {
      result = result.filter((p) =>
        p.department?.toLowerCase() === department.toLowerCase()
      );
    }

    if (year) {
      result = result.filter((p) =>
        p.year?.toUpperCase() === year.toUpperCase()
      );
    }

    if (projectType !== "All") {
      result = result.filter((p) =>
        p.projectType?.toLowerCase() === projectType.toLowerCase()
      );
    }

    if (sortBy === "top-rated") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "most-saved") {
      result = [...result].sort((a, b) => b.bookmarkCount - a.bookmarkCount);
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setFiltered(result);
  }, [search, department, year, projectType, sortBy, projects]);

  const clearFilters = () => {
    setSearch("");
    setDepartment("All");
    setYear("");
    setProjectType("All");
    setSortBy("");
  };

  const hasFilters =
    search || department !== "All" || year || projectType !== "All" || sortBy;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-2">
            ✦ Explore
          </p>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Browse Projects
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, tech stack, or tags..."
            className="w-full bg-[#16161f] border border-white/10 focus:border-orange-500/50 text-white text-sm rounded-2xl pl-10 pr-4 py-3.5 outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* ── Filter row ── */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-[#16161f] border border-white/10 text-sm text-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500/50 transition-all"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} className="bg-[#16161f]">{d}</option>
            ))}
          </select>

          {/* Year */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-[#16161f] border border-white/10 text-sm text-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500/50 transition-all"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y.value} value={y.value} className="bg-[#16161f]">
                {y.label}
              </option>
            ))}
          </select>

          {/* Project Type */}
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="bg-[#16161f] border border-white/10 text-sm text-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500/50 transition-all"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t} className="bg-[#16161f]">{t}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#16161f] border border-white/10 text-sm text-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500/50 transition-all"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#16161f]">
                {s.label}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2.5 rounded-xl transition-all"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#16161f] border border-white/10 rounded-2xl h-64 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <p className="text-red-400 text-sm text-center py-12">{error}</p>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-400 text-base">No projects match your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-orange-400 hover:text-orange-300 text-sm transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Projects grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}