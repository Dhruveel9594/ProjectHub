export default function ProjectCard({ project }) {

  const techTags = project.techStack
    ? project.techStack.split(",").map((t) => t.trim())
    : [];

  const initials = project.student?.name
    ? project.student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const yearLabel = {
    FIRST: "1st Year", SECOND: "2nd Year",
    THIRD: "3rd Year", FOURTH: "4th Year",
  }[project.year] ?? project.year;

  const avatarColors = [
    "bg-orange-500", "bg-indigo-500", "bg-cyan-500",
    "bg-pink-500", "bg-green-500", "bg-purple-500",
  ];
  const avatarBg =
    avatarColors[(project.student?.name?.charCodeAt(0) ?? 0) % avatarColors.length];

  const tagStyles = [
    "bg-indigo-500/15 text-indigo-300",
    "bg-orange-500/15 text-orange-300",
    "bg-cyan-500/15 text-cyan-300",
    "bg-green-500/15 text-green-300",
    "bg-pink-500/15 text-pink-300",
  ];

  return (
    <article className="group bg-[#16161f] border border-white/10 hover:border-indigo-500/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-orange-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          {project.department}
        </span>
        <div className="flex items-center gap-2">
          {project.verified && (
            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
              ✓ Verified
            </span>
          )}
          <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {yearLabel}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-base mb-1 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
        {project.title}
      </h3>

      <p className="text-xs text-orange-400 mb-2">{project.projectType}</p>

      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {techTags.map((tech, index) => (
          <span key={tech} className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagStyles[index % tagStyles.length]}`}>
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className={`w-6 h-6 rounded-full ${avatarBg} flex items-center justify-center text-white text-[10px] font-bold`}>
            {initials}
          </div>
          {project.student?.name ?? "Unknown"}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>⭐ {project.rating?.toFixed(1) ?? "0.0"}</span>
          <span>🔖 {project.bookmarkCount ?? 0}</span>
        </div>
      </div>
    </article>
  );
}