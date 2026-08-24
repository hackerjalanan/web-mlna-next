import {
  Code2,
  Database,
  Server,
  Wrench,
} from "lucide-react";

const skillGroups = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js", "Flutter", "dart",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend",
    icon: Server,
    skills: [
      "Node.js",
      "Express.js",
      "PHP",
      "Laravel",
      "REST API",
    ],
  },
  {
    title: "Database",
    icon: Database,
    skills: [
      "MySQL",
      "PostgreSQL",
      "Database Design",
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    skills: [
      "Git",
      "GitHub",
      "Postman",
      "Figma",
      "Docker",
    ],
  },
];

export default function Skills() {
  return (
    <section className="px-3 py-12 md:px-3 lg:px-4">
      <div className="mb-6">
        <p className="text-[10px] font-medium tracking-[0.3em] text-cyan-400">
          TECHNOLOGIES
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
          Skills & Tech Stack
        </h2>

        <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
          Teknologi yang biasa saya gunakan dalam pengembangan
          aplikasi web.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => {
          const Icon = group.icon;

          return (
            <div
              key={group.title}
              className="
                rounded-xl
                border border-white/10
                bg-slate-900/40
                p-4
                transition-all
                hover:border-cyan-400/20
              "
            >
              <div className="mb-4 flex items-center gap-2">
                <Icon
                  size={17}
                  className="text-cyan-400"
                />

                <h3 className="text-xs font-semibold text-slate-200">
                  {group.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-md
                      border border-white/5
                      bg-white/[0.03]
                      px-2 py-1
                      text-[10px]
                      text-slate-400
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <a
          href="/about"
          className="
            text-xs
            text-cyan-400
            transition-colors
            hover:text-cyan-300
          "
        >
          View all skills →
        </a>
      </div>
    </section>
  );
}