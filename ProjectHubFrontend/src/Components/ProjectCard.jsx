/**
 * ProjectCard — displays a single project.
 * Used inside ProjectsSection.
 */
export default function ProjectCard({ project }) {
  return (
    <article className="group bg-[#16161f] border border-white/10 hover:border-indigo-500/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">

      {/* Top accent line — visible on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-orange-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header: icon + year badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${project.iconBg}`}>
          {project.icon}
        </div>
        <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          {project.year}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-bold text-base mb-2 tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed mb-4">
        {project.desc}
      </p>

      {/* Tech stack tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map(({ label, style }) => (
          <span
            key={label}
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${style}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Footer: author + rating */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className={`w-6 h-6 rounded-full ${project.avatarBg} flex items-center justify-center text-white text-[10px] font-bold`}>
            {project.initials}
          </div>
          {project.author}
        </div>
        <span className="text-xs text-gray-500">{project.rating}</span>
      </div>
    </article>
  );
}