import {
  ArrowUpRight,
  Code2,
  ExternalLink,
} from "lucide-react";

const truncate = (text: string, maxLength: number = 46) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

const projects = [
  {
    title: "Training Report",
    description:
      "Sistem untuk monitoring dan pelaporan training.",
    stack: ["React.js", "Node.js", "MySQL"],
    github: "https://github.com/ademlna/training-report-gii.git",
    demo: "https://fe-trainer-ade-legends-projects.vercel.app/",
  },
  {
    title: "Personal Portfolio",
    description:
      "Portfolio personal dengan Next.js dan Tailwind CSS untuk menampilkan profile dan project.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    github: "https://github.com/ademlna/personal-portofolio.git",
    demo: "https://ade-maulana.my.id/",
  },
  {
    title: "Mobile-Authentication-App",
    description:
      "Aplikasi autentikasi mobile dengan React Native dan Firebase.",
    stack: ["Dart", "Flutter", "Mysql"],
    github: "https://github.com/ademlna/Mobile-Authentication-App",
    demo: "https://ade-maulana.my.id/",
  },
  {
    title: "BE-Authentication-App",
    description:
      "Aplikasi autentikasi mobile dengan React Native dan Firebase.",
    stack: ["PHP", "Laravel", "Mysql"],
    github: "https://github.com/ademlna/Mobile-Authentication-App",
    demo: "https://ade-maulana.my.id/",
  },
  {
    title: "Babinsa Messenger",
    description:
      "Aplikasi komunikasi berbasis web dengan REST API untuk kebutuhan komunikasi.",
    stack: ["Node.js", "Express.js", "MySQL"],
    github: "#",
    demo: "#",
  },
];

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
              basis-[calc((100%-0.75rem)/2)]
              snap-start
              rounded-lg
              border border-white/10
              bg-slate-900/40
              p-5
              transition-all
              hover:-translate-y-1
              hover:border-cyan-400/20

              sm:basis-[calc((100%-0.75rem)/2)]

              lg:basis-[calc((100%-1.5rem)/3)]
            "
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] text-slate-600">
                0{index + 1}
              </span>

              <ArrowUpRight
                size={16}
                className="
                  text-slate-600
                  transition-colors
                  group-hover:text-cyan-400
                "
              />
            </div>

            <h3 className="text-sm font-semibold text-slate-200">
              {project.title}
            </h3>

            <p className="
              mt-2
              min-h-[48px]
              text-xs
              leading-6
              text-slate-500
            ">
              {truncate(project.description)}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="
                    rounded-md
                    bg-cyan-400/5
                    px-2 py-1
                    text-[9px]
                    text-cyan-400/80
                  "
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5 flex gap-3 border-t border-white/5 pt-4">
              <a
                href={project.github}
                className="
                  flex items-center gap-1
                  text-[10px]
                  text-slate-500
                  hover:text-slate-300
                "
              >
                <Code2 size={13} />
                GitHub
              </a>
              
              <a
                href={project.demo}
                className="
                  flex items-center gap-1
                  text-[10px]
                  text-slate-500
                  hover:text-cyan-400
                "
              >
                <ExternalLink size={13} />
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