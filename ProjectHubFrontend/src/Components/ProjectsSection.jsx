import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8090/api/projects")
      .then((res) => setProjects(res.data))
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-12 pb-16">
      <SectionHeader
        label="Featured Work"
        title="Trending Projects"
        sub="Handpicked projects loved by juniors this semester"
      />

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#16161f] border border-white/10 rounded-2xl p-6 h-64 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <p className="text-red-400 text-sm text-center py-8">{error}</p>
      )}

      {/* Projects grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.length === 0 ? (
            <p className="text-gray-500 text-sm col-span-3 text-center py-8">
              No projects uploaded yet. Be the first!
            </p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      )}
    </section>
  );
}