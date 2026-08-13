import {
  Code2,
  Database,
  Server,
  Palette,
  GitBranch,
  BriefcaseBusiness,
} from "lucide-react";

const skills = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "PHP",
  "Laravel",
  "MySQL",
  "PostgreSQL",
  "Tailwind CSS",
  "Git",
];

const services = [
  {
    title: "Frontend Development",
    description:
      "Membangun interface web yang responsive, terstruktur, dan nyaman digunakan menggunakan React.js, Next.js, dan Tailwind CSS.",
    icon: Code2,
  },
  {
    title: "Backend Development",
    description:
      "Mengembangkan REST API, business logic, authentication, dan integrasi sistem menggunakan Node.js, Express.js, dan Laravel.",
    icon: Server,
  },
  {
    title: "Database",
    description:
      "Merancang struktur database, membuat query, melakukan maintenance, dan mengelola data aplikasi menggunakan MySQL dan PostgreSQL.",
    icon: Database,
  },
  {
    title: "UI Implementation",
    description:
      "Mengubah desain menjadi interface web yang responsive dan konsisten dengan memperhatikan detail layout serta usability.",
    icon: Palette,
  },
];

const experiences = [
  {
    role: "Fullstack Programmer",
    company: "PT. Gama Integra Informatika",
    period: "2024 — 2025",
    description:
      "Mengembangkan dan melakukan maintenance aplikasi web, mengelola database, membangun fitur, melakukan troubleshooting, serta bekerja dengan teknologi frontend dan backend.",
  },
  {
    role: "Freelance Developer & Designer",
    company: "Independent",
    period: "2024 — Present",
    description:
      "Mengerjakan berbagai kebutuhan website dan interface, mulai dari pengembangan aplikasi, implementasi desain, hingga maintenance.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <section className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-medium text-cyan-400">
            ABOUT ME
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Mengenal saya lebih dekat.
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-400 md:text-base">
            Saya Ade Maulana Hidayah, seorang programmer dengan
            fokus pada pengembangan aplikasi web dan pengalaman
            di sisi frontend maupun backend.
          </p>
        </section>

        {/* Profile */}
        <section className="mb-14 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">

          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">
              Profile
            </h2>

            <div className="space-y-4 text-sm leading-7 text-slate-400">
              <p>
                Saya memiliki latar belakang Sistem Informasi dan
                ketertarikan pada software development, khususnya
                pengembangan aplikasi web.
              </p>

              <p>
                Dalam proses pengembangan, saya terbiasa bekerja
                dengan frontend, backend, database, REST API,
                serta melakukan maintenance dan troubleshooting
                aplikasi.
              </p>

              <p>
                Saya menyukai proses mengubah sebuah kebutuhan
                menjadi aplikasi yang terstruktur, mudah digunakan,
                dan mudah dikembangkan kembali.
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="
            rounded-2xl
            border border-white/10
            bg-slate-900/60
            p-6
          ">
            <h2 className="mb-5 text-sm font-semibold text-white">
              Quick Information
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">
                  Education
                </p>
                <p className="mt-1 text-slate-300">
                  S1 Sistem Informasi
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Role
                </p>
                <p className="mt-1 text-slate-300">
                  Fullstack Programmer
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Focus
                </p>
                <p className="mt-1 text-slate-300">
                  Web Development
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Availability
                </p>
                <p className="mt-1 text-cyan-400">
                  Open to opportunities
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What I Do */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs text-cyan-400">
              EXPERTISE
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              What I Do
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-slate-900/50
                    p-5
                    transition-colors
                    hover:border-cyan-400/30
                  "
                >
                  <div className="
                    mb-4 flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-cyan-400/10
                    text-cyan-400
                  ">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-sm font-semibold text-white">
                    {service.title}
                  </h3>

                  <p className="
                    mt-2
                    text-xs leading-6
                    text-slate-400
                  ">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs text-cyan-400">
              TECHNOLOGIES
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Technical Skills
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="
                  rounded-lg
                  border border-white/10
                  bg-white/5
                  px-3 py-2
                  text-xs text-slate-300
                "
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs text-cyan-400">
              EXPERIENCE
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Work Experience
            </h2>
          </div>

          <div className="space-y-4">
            {experiences.map((experience) => (
              <div
                key={`${experience.role}-${experience.company}`}
                className="
                  rounded-2xl
                  border border-white/10
                  bg-slate-900/50
                  p-5
                "
              >
                <div className="flex gap-4">
                  <div className="
                    hidden h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-white/5
                    text-cyan-400
                    sm:flex
                  ">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <div className="
                      flex flex-wrap
                      items-center gap-2
                    ">
                      <h3 className="text-sm font-semibold text-white">
                        {experience.role}
                      </h3>

                      <span className="text-xs text-slate-600">
                        •
                      </span>

                      <span className="text-xs text-cyan-400">
                        {experience.period}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {experience.company}
                    </p>

                    <p className="
                      mt-3
                      text-xs leading-6
                      text-slate-400
                    ">
                      {experience.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="
          border-t border-white/10
          pt-10
        ">
          <div className="max-w-3xl">
            <p className="text-xs text-cyan-400">
              WORKING PRINCIPLES
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              How I Work
            </h2>

            <div className="
              mt-5
              space-y-3
              text-sm leading-7
              text-slate-400
            ">
              <p>
                Saya mengutamakan kode yang terstruktur,
                mudah dipahami, dan dapat dikembangkan kembali.
              </p>

              <p>
                Saya juga terbiasa melakukan debugging,
                membaca dokumentasi, menggunakan Git,
                serta mempelajari teknologi baru ketika
                dibutuhkan oleh sebuah project.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}