import {
  ArrowUpRight,
  Code2,
  ExternalLink,
} from "lucide-react";
import { projects } from "@/data/projects";

const truncate = (text: string, maxLength: number = 46) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export default function FeaturedProjects() {
  return (
    <section className="px-3 py-4 md:px-3 lg:px-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium tracking-[0.3em] text-cyan-400">
            SELECTED WORK
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
            Featured Projects
          </h2>

          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Beberapa project yang pernah saya kerjakan.
          </p>
        </div>

        <a
          href="/projects"
          className="
            hidden
            text-xs
            text-cyan-400
            transition-colors
            hover:text-cyan-300
            sm:block
          "
        >
          View all →
        </a>
      </div>
      <div
        className="
          flex
          gap-3
          overflow-x-auto
          px-1
          pb-2
          snap-x
          snap-mandatory
          scrollbar-thin
          scrollbar-thumb-cyan-400/40
        "
      >
        {projects.map((project, index) => (
          <article
            key={project.title}
            className="
              group
              min-w-0
              shrink-0
              basis-[calc((100%-1.5rem)/3)]
              snap-start

              rounded-lg
              border border-white/10
              bg-slate-900/40

              p-3

              transition-all
              hover:-translate-y-1
              hover:border-cyan-400/20

              lg:basis-[calc((100%-1.5rem)/3)]
            "
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[8px] text-slate-600">
                0{index + 1}
              </span>

              <ArrowUpRight
                size={13}
                className="
                  text-slate-600
                  transition-colors
                  group-hover:text-cyan-400
                "
              />
            </div>

            {/* Title */}
            <h3
              className="
                line-clamp-2
                text-[11px]
                font-semibold
                leading-4
                text-slate-200
              "
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="
                mt-1.5
                min-h-[40px]
                line-clamp-3
                text-[9px]
                leading-4
                text-slate-500
              "
            >
              {truncate(project.description)}
            </p>

            {/* Stack */}
            <div className="mt-3 flex flex-wrap gap-1">
              {projects.map((project, index) => (
                <span
                  key={project.slug}
                  className="
                    rounded-md
                    bg-cyan-400/5
                    px-1.5
                    py-0.5
                    text-[8px]
                    text-cyan-400/80
                  "
                >
                  {project.slug}
                </span>
              ))}
            </div>

            {/* Links */}
            <div
              className="
                mt-3
                flex
                gap-2
                border-t
                border-white/5
                pt-3
              "
            >
              <a
                href={project.link}
                className="
                  flex
                  items-center
                  gap-1
                  text-[8px]
                  text-slate-500
                  hover:text-slate-300
                "
              >
                <Code2 size={11} />
                GitHub
              </a>

              <a
                href={project.link}
                className="
                  flex
                  items-center
                  gap-1
                  text-[8px]
                  text-slate-500
                  hover:text-cyan-400
                "
              >
                <ExternalLink size={11} />
                Demo
              </a>
            </div>
          </article>
        ))}
      </div>

      <a
        href="/projects"
        className="mt-5 inline-block text-xs text-cyan-400 sm:hidden"
      >
        View all projects →
      </a>
    </section>
  );
}