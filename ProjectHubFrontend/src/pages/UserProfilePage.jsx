// src/pages/UserProfilePage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService, projectService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar";

const YEAR_LABELS  = { FIRST: "1st Year", SECOND: "2nd Year", THIRD: "3rd Year", FOURTH: "4th Year", GRADUATED: "Graduated" };
const YEAR_OPTIONS = ["FIRST", "SECOND", "THIRD", "FOURTH","GRADUATED"];
const DEPARTMENTS  = [
  "Computer Engineering", "Information Technology",
  "Electronics & Telecommunication", "Mechanical Engineering",
  "Civil Engineering", "Electrical Engineering",
];
const PROJECT_TYPES = [
  "Mini Project", "Major Project", "Final Year Project", "Research Paper", "Open Source",
];
const TAG_STYLES = [
  "bg-indigo-500/15 text-indigo-300", "bg-orange-500/15 text-orange-300",
  "bg-cyan-500/15 text-cyan-300",     "bg-green-500/15 text-green-300",
  "bg-pink-500/15 text-pink-300",
];

// ─────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const navigate             = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [profile,      setProfile]      = useState(null);
  const [projects,     setProjects]     = useState([]);
  const [editMode,     setEditMode]     = useState(false);
  const [form,         setForm]         = useState({});
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [saveMsg,      setSaveMsg]      = useState("");
  const [error,        setError]        = useState("");
  const [editProject,  setEditProject]  = useState(null);
  const [editForm,     setEditForm]     = useState({});
  const [editSaving,   setEditSaving]   = useState(false);
  const [editError,    setEditError]    = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!user) return;
    loadAll();
  }, [isLoggedIn, user]);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const userId = user.id || user.userId;
      const [projectsRes, profileRes] = await Promise.all([
        projectService.getAll(),
        userId ? userService.getById(userId) : Promise.resolve(null),
      ]);

      const mine = projectsRes.data.filter(
        (p) => p.student?.id === user.id || p.student?.username === user.username
      );
      setProjects(mine);

      if (profileRes) {
        setProfile(profileRes.data);
        initForm(profileRes.data);
      } else if (mine.length > 0) {
        setProfile(mine[0].student);
        initForm(mine[0].student);
      } else {
        setProfile({ username: user.username, email: user.email, name: user.name || "" });
        initForm({});
      }
    } catch {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const initForm = (data = {}) =>
    setForm({
      name:        data.name        || "",
      bio:         data.bio         || "",
      branch:      data.branch      || "",
      year:        data.year        || "",
      collegeName: data.collegeName || "",
    });

  const handleSave = async () => {
    const userId = profile?.id || user?.id;
    if (!userId) { setError("User ID not found."); return; }
    setSaving(true);
    try {
      const res = await userService.updateUser(userId, form);
      setProfile((p) => ({ ...p, ...res.data }));
      setEditMode(false);
      setSaveMsg("Profile updated!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  const openEditProject = (project) => {
    setEditProject(project);
    setEditError("");
    setEditForm({
      title:       project.title       || "",
      description: project.description || "",
      techStack:   project.techStack   || "",
      tag:         project.tag         || "",
      githubLink:  project.githubLink  || "",
      demoLink:    project.demoLink    || "",
      fileUrl:     project.fileUrl     || "",
      department:  project.department  || "",
      projectType: project.projectType || "",
      year:        project.year        || "",
    });
  };

  const handleProjectUpdate = async () => {
    if (!editForm.title || !editForm.description) {
      setEditError("Title and description are required.");
      return;
    }
    setEditSaving(true);
    setEditError("");
    try {
      const res = await projectService.update(editProject.id, editForm);
      setProjects((prev) =>
        prev.map((p) => (p.id === editProject.id ? { ...p, ...res.data } : p))
      );
      setEditProject(null);
      setSaveMsg("Project updated successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update project.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await projectService.delete(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSaveMsg("Project deleted.");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.username?.slice(0, 2)?.toUpperCase() ?? "??";

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Toasts */}
        {saveMsg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-5 py-3 mb-5">
            ✅ {saveMsg}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-5 py-3 mb-5">
            {error}
          </div>
        )}

        {/* ── Profile Card ── */}
        <div className="bg-[#16161f] border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-extrabold shrink-0">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {profile?.name || user?.username}
                </h2>
                <p className="text-gray-400 text-sm">@{profile?.username || user?.username}</p>
                <p className="text-gray-500 text-xs mt-0.5">{profile?.email || user?.email}</p>
                {profile?.role && (
                  <span className={`inline-block mt-2 text-xs font-semibold px-3 py-0.5 rounded-full ${
                    profile.role === "Faculty"
                      ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                      : "bg-orange-500/15 text-orange-300 border border-orange-500/30"
                  }`}>
                    {profile.role === "Faculty" ? "👨‍🏫 Faculty" : "🎓 Student"}
                  </span>
                )}
              </div>
            </div>

            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="border border-white/10 hover:border-orange-500/50 text-gray-300 hover:text-white text-sm px-5 py-2.5 rounded-xl transition-all">
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
                  {saving ? "Saving..." : "💾 Save"}
                </button>
                <button onClick={() => { setEditMode(false); initForm(profile); }} className="border border-white/10 text-gray-400 text-sm px-4 py-2.5 rounded-xl transition-all">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editMode ? (
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 grid grid-cols-2 gap-4">
              <Field label="Full Name">
                <Input value={form.name} onChange={(e) => setForm(p => ({...p, name: e.target.value}))} placeholder="Your full name" />
              </Field>
              <Field label="College">
                <Input value={form.collegeName} onChange={(e) => setForm(p => ({...p, collegeName: e.target.value}))} placeholder="e.g. SAKEC" />
              </Field>
              <Field label="Department">
                <SelectInput value={form.branch} onChange={(e) => setForm(p => ({...p, branch: e.target.value}))} options={DEPARTMENTS} />
              </Field>
              <Field label="Year">
                <SelectInput value={form.year} onChange={(e) => setForm(p => ({...p, year: e.target.value}))} options={YEAR_OPTIONS} labelMap={YEAR_LABELS} />
              </Field>
              <Field label="Bio" className="col-span-2">
                <textarea value={form.bio} onChange={(e) => setForm(p => ({...p, bio: e.target.value}))} rows={3} placeholder="Tell others about yourself..." className="w-full bg-[#0a0a0f] border border-white/10 focus:border-orange-500/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none resize-none transition-all" />
              </Field>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <InfoCard label="College"    value={profile?.collegeName} />
              <InfoCard label="Department" value={profile?.branch} />
              <InfoCard label="Year"       value={YEAR_LABELS[profile?.year] ?? profile?.year} />
              {profile?.bio && (
                <div className="col-span-3 bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bio</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── My Projects ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-1">✦ My Work</p>
            <h3 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              My Projects <span className="text-sm text-gray-500 font-normal">({projects.length})</span>
            </h3>
          </div>
          <button onClick={() => navigate("/create-project")} className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5">
            + Upload Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-[#16161f] border border-dashed border-white/10 rounded-2xl p-16 text-center">
            <p className="text-5xl mb-4">📂</p>
            <p className="text-gray-300 font-medium mb-1">No projects yet</p>
            <p className="text-gray-600 text-sm mb-6">Upload your first project and help juniors learn from your work.</p>
            <button onClick={() => navigate("/create-project")} className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-7 py-3 rounded-xl transition-all">
              Upload First Project →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <MyProjectCard
                key={project.id}
                project={project}
                onEdit={() => openEditProject(project)}
                onDelete={() => setDeleteTarget(project)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Project Modal ── */}
      {editProject && (
        <Modal onClose={() => setEditProject(null)}>
          <h2 className="text-xl font-extrabold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Edit Project</h2>
          <p className="text-gray-500 text-sm mb-6">Update your project details below.</p>

          {editError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{editError}</div>
          )}

          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
            <Field label="Title *">
              <Input value={editForm.title} onChange={(e) => setEditForm(p => ({...p, title: e.target.value}))} placeholder="Project title" />
            </Field>
            <Field label="Description *">
              <textarea value={editForm.description} onChange={(e) => setEditForm(p => ({...p, description: e.target.value}))} rows={4} placeholder="Describe your project..." className="w-full bg-[#0a0a0f] border border-white/10 focus:border-orange-500/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none resize-none transition-all" />
            </Field>
            <Field label="Tech Stack">
              <Input value={editForm.techStack} onChange={(e) => setEditForm(p => ({...p, techStack: e.target.value}))} placeholder="React, Spring Boot, MySQL" />
            </Field>
            <Field label="Tags">
              <Input value={editForm.tag} onChange={(e) => setEditForm(p => ({...p, tag: e.target.value}))} placeholder="AI, Web Dev, IoT" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Department">
                <SelectInput value={editForm.department} onChange={(e) => setEditForm(p => ({...p, department: e.target.value}))} options={DEPARTMENTS} />
              </Field>
              <Field label="Year">
                <SelectInput value={editForm.year} onChange={(e) => setEditForm(p => ({...p, year: e.target.value}))} options={YEAR_OPTIONS} labelMap={YEAR_LABELS} />
              </Field>
            </div>
            <Field label="Project Type">
              <SelectInput value={editForm.projectType} onChange={(e) => setEditForm(p => ({...p, projectType: e.target.value}))} options={PROJECT_TYPES} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="GitHub Link">
                <Input value={editForm.githubLink} onChange={(e) => setEditForm(p => ({...p, githubLink: e.target.value}))} placeholder="https://github.com/..." />
              </Field>
              <Field label="Demo Link">
                <Input value={editForm.demoLink} onChange={(e) => setEditForm(p => ({...p, demoLink: e.target.value}))} placeholder="https://demo.com" />
              </Field>
            </div>
            <Field label="File / ZIP URL">
              <Input value={editForm.fileUrl} onChange={(e) => setEditForm(p => ({...p, fileUrl: e.target.value}))} placeholder="https://storage.com/project.zip" />
            </Field>
          </div>

          <div className="flex gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={handleProjectUpdate} disabled={editSaving} className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
              {editSaving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={() => setEditProject(null)} className="px-6 border border-white/10 hover:border-white/30 text-gray-300 rounded-xl transition-all">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)} small>
          <div className="text-center">
            <p className="text-4xl mb-4">🗑️</p>
            <h2 className="text-lg font-extrabold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Delete Project?</h2>
            <p className="text-gray-400 text-sm mb-1">You are about to delete:</p>
            <p className="text-white font-semibold text-sm mb-2">"{deleteTarget.title}"</p>
            <p className="text-gray-600 text-xs mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 border border-white/10 hover:border-white/30 text-gray-300 py-3 rounded-xl transition-all">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MY PROJECT CARD
// ─────────────────────────────────────────────────────────────
function MyProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();
  const techTags = project.techStack ? project.techStack.split(",").map((t) => t.trim()) : [];

  return (
    <article className="group bg-[#16161f] border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-white/20">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-orange-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">{project.department}</span>
          <span className="text-xs text-gray-600 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
            {YEAR_LABELS[project.year] ?? project.year}
          </span>
          {project.verified && (
            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">✓ Verified</span>
          )}
        </div>

        {/* ✏️ Edit and 🗑️ Delete buttons */}
        <div className="flex gap-1.5 shrink-0 ml-2">
          <button
            onClick={onEdit}
            title="Edit project"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 text-gray-400 flex items-center justify-center transition-all border border-white/10 hover:border-indigo-500/40 text-sm"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            title="Delete project"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 flex items-center justify-center transition-all border border-white/10 hover:border-red-500/40 text-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        onClick={() => navigate(`/projects/${project.id}`)}
        className="font-bold text-base mb-1 tracking-tight cursor-pointer hover:text-orange-300 transition-colors"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {project.title}
      </h3>

      <p className="text-xs text-orange-400 mb-2">{project.projectType}</p>
      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {techTags.slice(0, 3).map((tech, i) => (
          <span key={tech} className={`text-xs font-medium px-2.5 py-1 rounded-full ${TAG_STYLES[i % TAG_STYLES.length]}`}>{tech}</span>
        ))}
        {techTags.length > 3 && (
          <span className="text-xs text-gray-600 px-2">+{techTags.length - 3} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>⭐ {project.rating?.toFixed(1) ?? "0.0"}</span>
          <span>🔖 {project.bookmarkCount ?? 0} saves</span>
        </div>
        <span className="text-xs text-gray-600">
          {project.createdAt && new Date(project.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function Modal({ children, onClose, small = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`bg-[#16161f] border border-white/10 rounded-2xl p-8 w-full relative shadow-2xl ${small ? "max-w-sm" : "max-w-2xl"}`}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all text-lg">✕</button>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-[#0a0a0f] border border-white/10 focus:border-orange-500/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-gray-600" />
  );
}

function SelectInput({ value, onChange, options, labelMap }) {
  return (
    <select value={value} onChange={onChange} className="w-full bg-[#0a0a0f] border border-white/10 focus:border-orange-500/50 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-all">
      <option value="" className="bg-[#16161f]">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-[#16161f]">{labelMap ? labelMap[opt] ?? opt : opt}</option>
      ))}
    </select>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white/5 rounded-xl px-4 py-3">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-200">{value || "—"}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-5">
        <div className="h-52 bg-white/5 rounded-2xl animate-pulse" />
        <div className="h-8 w-48 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-56 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-56 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}