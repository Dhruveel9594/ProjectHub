import { useEffect, useState } from "react";
import axios from "axios";

// Fallback static values while loading
const DEFAULT_STATS = [
  { value: "...", color: "text-orange-400", label: "Projects Uploaded"   },
  { value: "...", color: "text-indigo-400", label: "Departments"         },
  { value: "...", color: "text-cyan-400",   label: "Students Registered" },
  { value: "...", color: "text-green-400",  label: "Colleges"            },
];

export default function StatsBar() {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    // Fetch projects and derive counts from the response
    axios
      .get("http://localhost:8090/api/projects")
      .then((res) => {
        const projects = res.data;

        // Derive unique departments from project data
        const departments = new Set(projects.map((p) => p.department)).size;

        // Derive unique student IDs
        const students = new Set(projects.map((p) => p.student?.id)).size;

        // Derive unique colleges
        const colleges = new Set(
          projects.map((p) => p.student?.collegeName).filter(Boolean)
        ).size;

        setStats([
          { value: `${projects.length}+`, color: "text-orange-400", label: "Projects Uploaded"   },
          { value: departments,            color: "text-indigo-400", label: "Departments"         },
          { value: `${students}+`,         color: "text-cyan-400",   label: "Students Registered" },
          { value: colleges || "—",        color: "text-green-400",  label: "Colleges"            },
        ]);
      })
      .catch(() => {
        // If API fails keep showing default placeholders
      });
  }, []);

  return (
    <div className="flex mx-12 mb-16 border border-white/10 rounded-2xl overflow-hidden">
      {stats.map(({ value, color, label }, index) => (
        <div
          key={label}
          className={`flex-1 py-7 px-8 text-center ${
            index < stats.length - 1 ? "border-r border-white/10" : ""
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