import { FLOATING_TAGS } from "../data/landingData";
import { useNavigate } from "react-router-dom";


export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative px-12 pt-24 pb-20 overflow-hidden">

      {/* Background Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-175 h-100 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-16 -right-24 w-100 h-75 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Live Badge */}
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium px-4 py-1.5 rounded-full mb-7">
        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
        Open for all college students
      </div>

      {/* Headline */}
      <h1
        className="text-[clamp(2.8rem,5.5vw,5rem)] font-extrabold leading-[1.05] tracking-tight max-w-3xl mb-6"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Where{" "}
        <span className="bg-linear-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
          Senior Projects
        </span>
        <br />
        Inspire{" "}
        <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Junior Builders
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-lg font-light max-w-lg leading-relaxed mb-10">
        A platform for college students to share, discover, and build upon
        each other's projects — across batches, branches, and semesters.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => navigate("/browse")}
          className="bg-orange-500 hover:bg-orange-400 ... group-hover:bg-orange-400/90 text-white text-sm font-medium px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          Explore Projects →
        </button>
        <button
          onClick={() => navigate("/create-project")}
          className="border border-white/15 ... hover:border-orange-500/50 text-white text-sm font-medium px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          Upload Your Project
        </button>
      </div>

      {/* Floating Tags — right side */}
      <div className="absolute right-12 top-20 flex flex-col gap-2.5">
        {FLOATING_TAGS.map(({ color, label }) => (
          <FloatTag key={label} color={color} label={label} />
        ))}
      </div>
    </section>
  );
}

// ── FloatTag ─────────────────────────────────────────────────
function FloatTag({ color, label }) {
  return (
    <div className="flex items-center gap-2.5 bg-[#16161f] border border-white/10 hover:border-orange-500/50 text-gray-400 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-all duration-200 cursor-default animate-[float_4s_ease-in-out_infinite]">
      <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />
      {label}
    </div>
  );
}