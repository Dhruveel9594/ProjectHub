// src/pages/DepartmentsPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../api/services";
import Navbar from "../Components/Navbar";

const DEPT_META = {
  "Computer Engineering":              { icon: "💻", color: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"  },
  "Information Technology":            { icon: "🌐", color: "bg-orange-500/15 border-orange-500/30 text-orange-300"  },
  "Electronics & Telecommunication":   { icon: "📡", color: "bg-cyan-500/15   border-cyan-500/30   text-cyan-300"    },
  "Mechanical Engineering":            { icon: "⚙️",  color: "bg-yellow-500/15 border-yellow-500/30 text-yellow-300" },
  "Civil Engineering":                 { icon: "🏗️",  color: "bg-green-500/15  border-green-500/30  text-green-300"  },
  "Electrical Engineering":            { icon: "⚡",  color: "bg-pink-500/15   border-pink-500/30   text-pink-300"   },
};

export default function DepartmentsPage() {
  const navigate = useNavigate();
  const [deptCounts, setDeptCounts] = useState({});
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    projectService
      .getAll()
      .then((res) => {
        // Count projects per department
        const counts = {};
        res.data.forEach((p) => {
          if (p.department) {
            counts[p.department] = (counts[p.department] || 0) + 1;
          }
        });
        setDeptCounts(counts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const departments = Object.keys(DEPT_META);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-2">
            ✦ Explore by Field
          </p>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Departments
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Browse projects by engineering department
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="h-36 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => {
              const { icon, color } = DEPT_META[dept];
              const count = deptCounts[dept] || 0;

              return (
                <button
                  key={dept}
                  onClick={() =>
                    navigate(`/browse?department=${encodeURIComponent(dept)}`)
                  }
                  className="group bg-[#16161f] border border-white/10 hover:border-white/25 rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                >
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl mb-4 ${color}`}
                  >
                    {icon}
                  </div>
                  <h3
                    className="font-bold text-base mb-1 group-hover:text-orange-300 transition-colors"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {dept}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {count} project{count !== 1 ? "s" : ""}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}