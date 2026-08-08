const skills = [
  "Laravel",
  "PHP",
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "JavaScript",
  "TypeScript",
  "Tailwind CSS",
  "MySQL",
  "Git",
  "GitHub",
];

export default function Skills() {
  return (
    <section id="skills" className="bg-white/[0.02] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Skills
        </p>

        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Technologies
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center text-slate-300 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:text-cyan-400"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}