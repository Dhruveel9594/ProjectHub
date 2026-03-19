import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8090/api/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="px-12 pb-16">
      <SectionHeader
        label="Featured Work"
        title="Trending Projects"
        sub="Handpicked projects loved by juniors this semester"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}