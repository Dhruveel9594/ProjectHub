import { STATS } from "../data/landingData";

export default function StatsBar() {
  return (
    <div className="flex mx-12 mb-16 border border-white/10 rounded-2xl overflow-hidden">
      {STATS.map(({ value, color, label }, index) => (
        <div
          key={label}
          className={`flex-1 py-7 px-8 text-center ${
            index < STATS.length - 1 ? "border-r border-white/10" : ""
          }`}
        >
          <div
            className={`font-extrabold text-4xl tracking-tight mb-1 ${color}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {value}
          </div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      ))}
    </div>
  );
}