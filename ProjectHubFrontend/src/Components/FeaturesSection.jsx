import SectionHeader from "./SectionHeader";
import { FEATURES } from "../data/landingData";

export default function FeaturesSection() {
  return (
    <section className="px-12 pb-16">
      <SectionHeader
        label="Platform Features"
        title="Everything You Need"
        sub="Built specifically for the college student community"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}

// ── FeatureCard ───────────────────────────────────────────────
function FeatureCard({ feature }) {
  return (
    <div className="bg-[#16161f] border border-white/10 hover:border-orange-500/30 rounded-2xl p-7 transition-colors duration-200 group">
      <div className="text-3xl mb-4">{feature.icon}</div>
      <h3
        className="font-bold text-sm mb-2"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {feature.title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
    </div>
  );
}