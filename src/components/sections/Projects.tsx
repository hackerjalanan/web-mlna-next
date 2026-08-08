const projects = [
  {
    title: "Babinsa Messenger",
    description:
      "Aplikasi web untuk mendukung komunikasi dan pelaporan.",
    technologies: ["Node.js", "Express.js", "MySQL"],
  },
  {
    title: "Training Dashboard",
    description:
      "Dashboard monitoring training dengan tampilan data secara real-time.",
    technologies: ["React.js", "Node.js", "MySQL"],
  },
  {
    title: "Portfolio Website",
    description:
      "Website portfolio personal dengan desain modern dan responsive.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Projects
        </p>

        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          My Projects
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-2 hover:border-cyan-400/40"
            >
              <h3 className="text-xl font-semibold">
                {project.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs text-cyan-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}