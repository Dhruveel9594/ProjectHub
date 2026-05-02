// src/components/StatsBar.jsx
// Fetches real platform stats from /api/stats.
// Shows a skeleton loader during fetch (handles Render cold start delay).
// Gracefully displays 0 for any empty count.

import { useEffect, useState } from "react";
import axios from "axios";

// ── Config ────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8090/api";

// ── Stat definitions ──────────────────────────────────────────
// label    → displayed below the number
// key      → matches the field name in StatsDTO
// color    → Tailwind text color class for the number
const STAT_CONFIG = [
  { label: "Students Registered", key: "studentCount",    color: "text-orange-400" },
  { label: "Projects Uploaded",   key: "projectCount",    color: "text-indigo-400" },
  { label: "Colleges",            key: "collegeCount",    color: "text-cyan-400"   },
  { label: "Departments",         key: "departmentCount", color: "text-green-400"  },
];

// ── Skeleton loader — shown while fetching ────────────────────
function StatsSkeleton() {
  return (
    <div className="flex mx-12 mb-16 border border-white/10 rounded-2xl overflow-hidden">
      {STAT_CONFIG.map((stat, index) => (
        <div
          key={stat.key}
          className={`flex-1 py-7 px-8 text-center animate-pulse ${
            index < STAT_CONFIG.length - 1 ? "border-r border-white/10" : ""
          }`}
        >
          {/* Number placeholder */}
          <div className="h-9 w-24 bg-white/10 rounded-lg mx-auto mb-3" />
          {/* Label placeholder */}
          <div className="h-3.5 w-32 bg-white/10 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}

// ── Single stat item ──────────────────────────────────────────
function StatItem({ label, value, color, isLast }) {
  return (
    <div
      className={`flex-1 py-7 px-8 text-center ${
        !isLast ? "border-r border-white/10" : ""
      }`}
    >
      <div
        className={`font-extrabold text-4xl tracking-tight mb-1 ${color}`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {/* Always show the number — 0 is a valid value */}
        {value.toLocaleString()}
        {value > 0 ? "+" : ""}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

// ── Main StatsBar component ───────────────────────────────────
export default function StatsBar() {
  const [stats,   setStats]   = useState(null);   // null = not yet loaded
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`${API_BASE}/stats`);
        if (!cancelled) {
          setStats(res.data);
        }
      } catch {
        if (!cancelled) {
          // On error show zeros — never break the UI
          setStats({
            studentCount:    0,
            projectCount:    0,
            collegeCount:    0,
            departmentCount: 0,
          });
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();

    // Cleanup — prevents state update if component unmounts during fetch
    return () => { cancelled = true; };
  }, []);

  // Show skeleton while loading (handles Render cold start)
  if (loading) return <StatsSkeleton />;

  return (
    <div className="flex mx-12 mb-16 border border-white/10 rounded-2xl overflow-hidden">
      {STAT_CONFIG.map((stat, index) => (
        <StatItem
          key={stat.key}
          label={stat.label}
          value={stats?.[stat.key] ?? 0}
          color={stat.color}
          isLast={index === STAT_CONFIG.length - 1}
        />
      ))}
    </div>
  );
}