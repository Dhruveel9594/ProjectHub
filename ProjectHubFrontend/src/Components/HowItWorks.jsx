import { HOW_IT_WORKS } from "../data/landingData";
import SectionHeader from "./SectionHeader";
export default function HowItWorks() {
  return (
    <section className="px-12 pb-16">
      <SectionHeader
        label="Simple Process"
        title="How It Works"
        sub="Get started in minutes"
      />

      {/* 4-column grid with dividers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
        {HOW_IT_WORKS.map((step) => (
          <StepCard key={step.num} step={step} />
        ))}
      </div>
    </section>
  );
}

// ── StepCard ──────────────────────────────────────────────────
function StepCard({ step }) {
  return (
    <div className="bg-[#16161f] p-8 relative group hover:bg-[#1c1c2a] transition-colors duration-200">
      {/* Ghost step number in background */}
      <span
        className="absolute top-4 right-5 text-5xl font-extrabold text-white/4 leading-none select-none"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {step.num}
      </span>

      <div className="text-3xl mb-4">{step.icon}</div>
      <h3
        className="font-bold text-base mb-2"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {step.title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
    </div>
  );
}