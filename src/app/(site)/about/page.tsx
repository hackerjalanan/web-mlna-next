import {
  Code2,
  Database,
  Server,
  Palette,
  GitBranch,
  BriefcaseBusiness,
} from "lucide-react";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiPostgresql,
  SiTailwindcss,
  SiGit,
  SiPython,
  SiFlask,
  SiDart,
  SiFlutter,
  SiDocker,
  SiVite,
  SiWebpack,
  SiRedux,
  SiPostman,
  SiFigma,
} from "react-icons/si";

const skills = [
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
  },
  {
    name: "React.js",
    icon: SiReact,
    color: "#61DAFB",
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#FFFFFF",
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#339933",
  },
  {
    name: "Express.js",
    icon: SiExpress,
    color: "#FFFFFF",
  },
  {
    name: "PHP",
    icon: SiPhp,
    color: "#777BB4",
  },
  {
    name: "Laravel",
    icon: SiLaravel,
    color: "#FF2D20",
  },
  {
    name: "MySQL",
    icon: SiMysql,
    color: "#4479A1",
  },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
    color: "#4169E1",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06B6D4",
  },
  {
    name: "Git",
    icon: SiGit,
    color: "#F05032",
  },
  {
    name: "Python",
    icon: SiPython,
    color: "#3776AB",
  },
  {
    name: "Flask",
    icon: SiFlask,
    color: "#FFFFFF",
  },
  {
    name: "Dart",
    icon: SiDart,
    color: "#0175C2",
  },
  {
    name: "Flutter",
    icon: SiFlutter,
    color: "#02569B",
  },
  {
    name: "Docker",
    icon: SiDocker,
    color: "#2496ED",
  },
  {
    name: "Vite",
    icon: SiVite,
    color: "#646CFF",
  },
  {
    name: "Webpack",
    icon: SiWebpack,
    color: "#8DD6F9",
  },
  {
    name: "Redux",
    icon: SiRedux,
    color: "#764ABC",
  },
  {
    name: "Postman",
    icon: SiPostman,
    color: "#FF6C37",
  },
  {
    name: "Figma",
    icon: SiFigma,
    color: "#F24E1E",
  },
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
      "Mengembangkan dan melakukan maintenance aplikasi web, mengelola database, membangun fitur, melakukan troubleshooting, serta bekerja dengan backend.",
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
    <main className="min-h-screen py-0 ">
      <div className="mx-auto px-4 max-w-[1440px] md:px-4 py-4">

        {/* Header */}
        <section className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-medium text-cyan-400">
            ABOUT ME
          </p>

         

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
            rounded-lg
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
                    rounded-lg
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
                    rounded-lg                    bg-cyan-400/10
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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        
          {skills.map((skill) => {
            const Icon = skill.icon;
            
            return (
              <div
                key={skill.name}
                className="
                  h-20
                 
                  border border-white/10
                  bg-white/5
                  px-10
                  transition
                  hover:border-white/20
                  hover:bg-white/10
                "
              >
                <div className="flex h-full items-center gap-3">
                  <Icon
                    className="shrink-0 text-3xl"
                    style={{ color: skill.color }}
                  />

                  <span className="text-sm font-medium text-slate-200">
                    {skill.name}
                  </span>
                </div>
              </div>
            );
          })}
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
                  rounded-lg
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
                    rounded-lg                    bg-white/5
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
                Saya berfokus membangun aplikasi dengan struktur kode yang rapi,
                efisien, dan mudah dikembangkan untuk kebutuhan jangka panjang.
              </p>

              <p>
                Terbiasa melakukan analisis masalah, debugging, membaca dokumentasi,
                menggunakan Git dalam workflow pengembangan, senang mengeksplorasi
                teknologi baru untuk meningkatkan kualitas setiap project yang dikerjakan.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}