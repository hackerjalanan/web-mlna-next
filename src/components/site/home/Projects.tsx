import { ArrowUpRight } from "lucide-react";
import { projectService } from "@/services/projects.service";
import { ProjectsCarousel } from "./ProjectsCarauserl";

export default async function FeaturedProjects() {
  const allProjects = await projectService.getFeaturedProjects(6);
  const projects = allProjects.filter((project) => project.featured);

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-3 text-sm text-white/50 sm:text-base">
            Beberapa project yang pernah saya kerjakan.
          </p>
        </div>

        <a
          href="/projects"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-[#8B5CF6] transition-colors hover:text-[#A855F7] sm:flex"
        >
          View all
          <ArrowUpRight size={14} />
        </a>
      </div>

      <ProjectsCarousel projects={projects} />

      <a
        href="/projects"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#8B5CF6] sm:hidden"
      >
        View all projects
        <ArrowUpRight size={14} />
      </a>
    </section>
  );
}