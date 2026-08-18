import {
  Code2,
  Database,
  Layout,
  Server,
} from "lucide-react";

const capabilities = [
  {
    number: "01",
    title: "Frontend Development",
    description:
      "Membangun interface responsive dan reusable menggunakan React.js, Next.js, TypeScript, dan Tailwind CSS.",
    icon: Layout,
  },
  {
    number: "02",
    title: "Backend Development",
    description:
      "Membangun REST API, business logic, authentication, dan integrasi sistem menggunakan Node.js dan Laravel.",
    icon: Server,
  },
  {
    number: "03",
    title: "Database",
    description:
      "Merancang struktur database, query, relasi data, serta melakukan maintenance database aplikasi.",
    icon: Database,
  },
  {
    number: "04",
    title: "Web Application",
    description:
      "Mengembangkan aplikasi web dari proses perencanaan, implementasi, testing, hingga maintenance.",
    icon: Code2,
  },
];

export default function WhatICanDo() {
  return (
    <section className="px-3 py-10 md:px-3 lg:px-4">
      <div className="mb-6">
        <p className="text-[10px] font-medium tracking-[0.3em] text-cyan-400">
          EXPERTISE
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
          What I Can Do
        </h2>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {capabilities.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.number}
              className="
                group
                flex
                gap-4
                rounded-xl
                border border-white/10
                bg-slate-900/40
                p-4
                transition-all
                hover:border-cyan-400/20
              "
            >
              <div className="
                flex
                h-9 w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-cyan-400/10
                text-cyan-400
              ">
                <Icon size={16} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-600">
                    {item.number}
                  </span>

                  <h3 className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </h3>
                </div>

                <p className="
                  mt-2
                  text-[11px]
                  leading-5
                  text-slate-500
                ">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}