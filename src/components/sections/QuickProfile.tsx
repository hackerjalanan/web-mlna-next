"use client";

import {
  BriefcaseBusiness,
  Code2,
  FolderKanban,
  GraduationCap,
} from "lucide-react";

const stats = [
  {
    value: "1+",
    label: "Years Experience",
    icon: BriefcaseBusiness,
  },
  {
    value: "10+",
    label: "Technologies",
    icon: Code2,
  },
  {
    value: "10+",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    value: "S1",
    label: "Information Systems",
    icon: GraduationCap,
  },
];

export default function QuickProfile() {
  return (
    <section className="px-3 py-12 md:px-3 lg:px-4">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
        {/* Description */}
        <div>
          <p className="mb-2 text-[10px] font-medium tracking-[0.3em] text-cyan-400">
            ABOUT ME
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Fullstack Developer
          </h2>

          <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">
            Saya memiliki latar belakang Sistem Informasi dan
            pengalaman dalam pengembangan aplikasi web dari sisi
            frontend maupun backend.
          </p>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">
            Fokus saya adalah membangun aplikasi yang terstruktur,
            responsive, mudah digunakan, dan mudah dikembangkan.
          </p>

          <a
            href="/about"
            className="
              mt-5 inline-flex
              text-xs font-medium
              text-cyan-400
              transition-colors
              hover:text-cyan-300
            "
          >
            More about me →
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="
                  rounded-xl
                  border border-white/10
                  bg-slate-900/40
                  p-4
                  transition-colors
                  hover:border-cyan-400/20
                "
              >
                <Icon
                  size={16}
                  className="mb-3 text-cyan-400"
                />

                <p className="text-xl font-bold text-slate-100">
                  {stat.value}
                </p>

                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}