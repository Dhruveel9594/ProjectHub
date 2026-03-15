/**
 * SectionHeader — reusable label + title + subtitle used at top of each section.
 * @param {string} label  - small uppercase label
 * @param {string} title  - large heading
 * @param {string} sub    - muted subtitle
 */
export default function SectionHeader({ label, title, sub }) {
  return (
    <div className="mb-11">
      <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-2.5">
        ✦ {label}
      </p>
      <h2
        className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold tracking-tight mb-2"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {title}
      </h2>
      {sub && <p className="text-gray-400 text-base">{sub}</p>}
    </div>
  );
}