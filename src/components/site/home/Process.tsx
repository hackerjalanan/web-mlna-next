"use client";

import { motion } from "framer-motion";
import { Compass, PenTool, Code2, Rocket } from "lucide-react";

// Warna dipilih sesuai fungsi step, bukan sekadar rotasi warna:
// Understand -> blue (accent/eksplorasi), Plan -> purple (architecture),
// Build -> red (action/hands-on), Deploy -> emerald (stable/shipped)
const steps = [
  {
    number: "01",
    title: "Understand",
    text: "Memahami kebutuhan dan tujuan project.",
    icon: Compass,
    color: "#3B82F6",
  },
  {
    number: "02",
    title: "Plan",
    text: "Menyusun architecture, database, API, dan flow.",
    icon: PenTool,
    color: "#8B5CF6",
  },
  {
    number: "03",
    title: "Build",
    text: "Mengembangkan fitur dengan clean dan maintainable code.",
    icon: Code2,
    color: "#EF4444",
  },
  {
    number: "04",
    title: "Deploy",
    text: "Testing, optimization, deployment, dan maintenance.",
    icon: Rocket,
    color: "#10B981",
  },
];

export default function Process() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">
          Workflow
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          How I Work
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/50 sm:text-base">
          Empat tahap yang saya lalui di setiap project, dari riset awal sampai maintenance.
        </p>
      </motion.div>

      <div className="relative mt-16">
        {/* Connecting line — hanya tampil di layout horizontal (lg ke atas) */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 lg:block"
        />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
                className="group relative"
              >
                {/* Icon marker — duduk di atas connecting line */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#050505] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon size={18} style={{ color: step.color }} strokeWidth={1.75} />
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-white/30">{step.number}</span>
                    <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="mt-2 max-w-[26ch] text-sm leading-6 text-white/50">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}