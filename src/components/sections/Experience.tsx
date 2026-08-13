import {
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

const experiences = [
  {
    role: "Fullstack Programmer",
    company: "PT. Gama Integra Informatika",
    period: "2024 — 2025",
    description:
      "Mengembangkan dan melakukan maintenance aplikasi web, membangun fitur, mengelola database, melakukan troubleshooting, serta bekerja pada sisi frontend dan backend.",
  },
  {
    role: "Freelance Developer & Designer",
    company: "Independent",
    period: "2024 — Present",
    description:
      "Mengerjakan berbagai kebutuhan website, UI implementation, pengembangan aplikasi, dan maintenance project.",
  },
];

export default function Experience() {
  return (
    <section className="px-6 py-12 md:px-10 lg:px-14">
      <div className="mb-6">
        <p className="text-[10px] font-medium tracking-[0.3em] text-cyan-400">
          EXPERIENCE
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
          Work Experience
        </h2>
      </div>

      <div className="space-y-3">
        {experiences.map((experience) => (
          <article
            key={`${experience.role}-${experience.company}`}
            className="
              rounded-xl
              border border-white/10
              bg-slate-900/40
              p-4
              transition-colors
              hover:border-cyan-400/20
              sm:p-5
            "
          >
            <div className="flex gap-4">
              <div className="
                hidden
                h-9 w-9
                shrink-0
                items-center justify-center
                rounded-lg
                bg-cyan-400/10
                text-cyan-400
                sm:flex
              ">
                <BriefcaseBusiness size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="
                  flex
                  flex-wrap
                  items-center
                  gap-x-2
                  gap-y-1
                ">
                  <h3 className="text-sm font-semibold text-slate-200">
                    {experience.role}
                  </h3>

                  <span className="hidden text-slate-700 sm:block">
                    /
                  </span>

                  <span className="text-xs text-cyan-400/80">
                    {experience.company}
                  </span>
                </div>

                <div className="
                  mt-1
                  flex
                  items-center
                  gap-1
                  text-[10px]
                  text-slate-600
                ">
                  <CalendarDays size={12} />
                  {experience.period}
                </div>

                <p className="
                  mt-3
                  max-w-4xl
                  text-xs
                  leading-6
                  text-slate-500
                ">
                  {experience.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <a
        href="/about"
        className="
          mt-5
          inline-block
          text-xs
          text-cyan-400
          hover:text-cyan-300
        "
      >
        View full experience →
      </a>
    </section>
  );
}