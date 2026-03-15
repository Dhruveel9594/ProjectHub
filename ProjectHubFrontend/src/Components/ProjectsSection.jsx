import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import { PROJECTS } from "../data/landingData";

export default function ProjectsSection() {
  return (
    <section className="px-12 pb-16">
      <SectionHeader
        label="Featured Work"
        title="Trending Projects"
        sub="Handpicked projects loved by juniors this semester"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}