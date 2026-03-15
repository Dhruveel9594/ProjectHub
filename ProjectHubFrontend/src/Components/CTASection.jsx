export default function CTASection() {
  return (
    <section className="mx-12 mb-16">
      <div className="relative bg-linear-to-br from-indigo-500/15 to-orange-500/10 border border-indigo-500/25 rounded-3xl px-12 py-20 text-center overflow-hidden">

        {/* Glow behind content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <h2
          className="relative text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Start Building Your Legacy Today
        </h2>

        <p className="relative text-gray-400 mb-9 text-base">
          Upload your project and help the next batch of students build something great.
        </p>

        <div className="relative flex gap-4 justify-center">
          <button className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-9 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(249,115,22,0.35)]">
            Get Started Free →
          </button>
          <button className="border border-white/15 hover:border-white/30 hover:bg-white/5 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-200">
            Browse Projects
          </button>
        </div>
      </div>
    </section>
  );
}