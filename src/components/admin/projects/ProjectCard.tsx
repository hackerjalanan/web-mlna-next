import Link from "next/link";
import { Code2, ExternalLink, Pencil } from "lucide-react";
import { Project } from "@/types/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const hasGithub = !!project.github?.trim() && project.github !== "#";
  const hasDemo = !!project.demo?.trim() && project.demo !== "#";
  const hasLink = !!project.link?.trim() && project.link !== "#";

  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl transition hover:border-cyan-400/30">
      <Link
        href={`/admin/projects/${project.slug}/edit`}
        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 hover:text-cyan-400"
      >
        <Pencil size={14} />
      </Link>

      <div className="absolute left-3 top-3 z-10 flex gap-2">
        <span className="rounded-lg bg-cyan-400/10 px-3 py-1 text-xs text-cyan-400">
          {project.category}
        </span>
        {project.year && (
          <span className="rounded-lg bg-slate-900/80 px-3 py-1 text-xs text-slate-400">
            {project.year}
          </span>
        )}
      </div>

      <div className="p-5 pt-12">
        <h3 className="line-clamp-2 text-lg font-semibold text-white">{project.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies?.map((tech) => (
            <span key={tech} className="rounded-lg bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          {hasGithub && (
            <Link
              href={project.github!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-2 text-xs text-slate-300 hover:text-cyan-400"
            >
              <Code2 size={14} /> GitHub
            </Link>
          )}

          {(hasDemo || hasLink) && (
            <Link
              href={project.demo || project.link!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-cyan-400/10 px-3 py-2 text-xs text-cyan-400"
            >
              <ExternalLink size={14} /> {hasDemo ? "Demo" : "Lihat"}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}