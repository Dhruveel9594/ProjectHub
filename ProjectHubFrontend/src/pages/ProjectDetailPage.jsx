// src/pages/ProjectDetailPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "../api/services";
import Navbar          from "../Components/Navbar";
import BookmarkButton  from "../Components/BookmarkButton";
import StarRating      from "../Components/StarRating";
import CommentsSection from "../Components/CommentsSection";

const YEAR_LABELS = {
  FIRST: "1st Year", SECOND: "2nd Year",
  THIRD: "3rd Year", FOURTH: "4th Year",
};

const TAG_STYLES = [
  "bg-indigo-500/15 text-indigo-300", "bg-orange-500/15 text-orange-300",
  "bg-cyan-500/15 text-cyan-300",     "bg-green-500/15 text-green-300",
  "bg-pink-500/15 text-pink-300",
];

const AVATAR_COLORS = [
  "bg-orange-500","bg-indigo-500","bg-cyan-500","bg-pink-500","bg-green-500",
];

export default function ProjectDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [project,  setProject]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    projectService
      .getById(id)
      .then((res) => setProject(res.data))
      .catch(() => setError("Project not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-4xl">😕</p>
          <p className="text-gray-400">{error || "Project not found."}</p>
          <button onClick={() => navigate("/browse")}
            className="text-orange-400 hover:text-orange-300 text-sm">
            ← Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const techTags = project.techStack
    ? project.techStack.split(",").map((t) => t.trim())
    : [];

  const tagsArr = project.tag
    ? project.tag.split(",").map((t) => t.trim())
    : [];

  const initials = project.student?.name
    ? project.student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const avatarBg =
    AVATAR_COLORS[(project.student?.name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          ← Back
        </button>

        {/* ── Header card ── */}
        <div className="bg-[#16161f] border border-white/10 rounded-2xl p-8 mb-6">

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full">
              {project.department}
            </span>
            <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full">
              {YEAR_LABELS[project.year] ?? project.year}
            </span>
            <span className="text-xs bg-orange-500/15 text-orange-300 border border-orange-500/20 px-3 py-1 rounded-full">
              {project.projectType}
            </span>
            {project.verified && (
              <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1 rounded-full">
                ✓ Faculty Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight mb-3"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            {project.title}
          </h1>

          <p className="text-gray-400 leading-relaxed text-base mb-6">
            {project.description}
          </p>

          {/* ── Rating + Bookmark row ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <StarRating
              projectId={project.id}
              initialRating={project.rating ?? 0}
            />
            <BookmarkButton
              projectId={project.id}
              initialCount={project.bookmarkCount ?? 0}
            />
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${avatarBg} flex items-center justify-center text-white font-bold text-sm`}>
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {project.student?.name ?? "Unknown"}
              </p>
              <p className="text-xs text-gray-500">
                {project.student?.collegeName} · {project.student?.branch}
              </p>
            </div>
            <span className="ml-auto text-xs text-gray-600">
              {project.createdAt && new Date(project.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* ── Main content ── */}
          <div className="col-span-2 space-y-6">

            {/* Tech Stack */}
            {techTags.length > 0 && (
              <div className="bg-[#16161f] border border-white/10 rounded-2xl p-6">
                <h2 className="text-base font-bold mb-4"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  🛠 Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {techTags.map((tech, i) => (
                    <span key={tech}
                      className={`text-sm font-medium px-3 py-1.5 rounded-full ${TAG_STYLES[i % TAG_STYLES.length]}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tagsArr.length > 0 && (
              <div className="bg-[#16161f] border border-white/10 rounded-2xl p-6">
                <h2 className="text-base font-bold mb-4"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  🏷 Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tagsArr.map((tag) => (
                    <span key={tag}
                      className="text-sm text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <CommentsSection projectId={project.id} />
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Links */}
            <div className="bg-[#16161f] border border-white/10 rounded-2xl p-6 space-y-3">
              <h2 className="text-base font-bold mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                🔗 Links
              </h2>
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all">
                  ⌨️ View on GitHub
                </a>
              )}
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white bg-orange-500 hover:bg-orange-400 px-4 py-2.5 rounded-xl transition-all font-medium">
                  🚀 Live Demo
                </a>
              )}
              {project.fileUrl && (
                <a href={project.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all">
                  📦 Download Files
                </a>
              )}
              {!project.githubLink && !project.demoLink && !project.fileUrl && (
                <p className="text-xs text-gray-600 italic">No links provided.</p>
              )}
            </div>

            {/* Info */}
            <div className="bg-[#16161f] border border-white/10 rounded-2xl p-6 space-y-3">
              <h2 className="text-base font-bold mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                📋 Info
              </h2>
              <InfoRow label="Department" value={project.department} />
              <InfoRow label="Year"       value={YEAR_LABELS[project.year] ?? project.year} />
              <InfoRow label="Type"       value={project.projectType} />
              <InfoRow label="Status"
                value={project.verified ? "✓ Verified" : "Pending"}
                valueClass={project.verified ? "text-green-400" : "text-yellow-500"} />
              <InfoRow label="Saves"      value={`${project.bookmarkCount ?? 0}`} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueClass = "text-gray-300" }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value || "—"}</span>
    </div>
  );
}