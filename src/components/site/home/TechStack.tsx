"use client";

import { motion } from "framer-motion";
import { Code2, Server, Database, Wrench } from "lucide-react";

// Warna dipetakan sesuai fungsi kategori, bukan rotasi:
// Frontend -> purple (primary/tech), Backend -> blue (accent/service),
// Database -> emerald (stabil, menyimpan data dengan aman),
// Tools -> red dipakai secukupnya sebagai penanda "actionable/workflow"
const groups = [
  {
    title: "Frontend",
    icon: Code2,
    color: "#8B5CF6",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    icon: Server,
    color: "#3B82F6",
    items: ["Node.js", "Express.js", "REST API", "JWT"],
  },
  {
    title: "Database",
    icon: Database,
    color: "#10B981",
    items: ["PostgreSQL", "MySQL", "Supabase"],
  },
  {
    title: "Tools",
    icon: Wrench,
    color: "#EF4444",
    items: ["Git", "GitHub", "Vercel", "VS Code"],
  },
];

export default function TechStack() {
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
          Stack
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Tech Stack
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/50 sm:text-base">
          Tools dan teknologi yang saya pakai sehari-hari untuk membangun product end-to-end.
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4">
        {groups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.45,
              delay: groupIndex * 0.08,
              ease: "easeOut",
            }}
            className={`
              group relative py-6
              px-4
              border-white/[0.07]
              ${groupIndex % 2 !== 0 ? "border-l" : ""}
              ${groupIndex >= 2 ? "border-t" : ""}
              lg:border-t-0
              lg:border-l
              lg:py-0
              lg:px-6
              ${groupIndex === 0 ? "lg:border-l-0 lg:pl-0" : ""}
            `}
          >
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: groupIndex * 0.3,
              }}
              className="inline-flex"
            >
              <group.icon
                size={20}
                style={{ color: group.color }}
                strokeWidth={1.75}
              />
            </motion.div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              {group.title}
            </h3>

            <ul className="mt-4 space-y-2.5">
              {group.items.map((item, itemIndex) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.3,
                    delay:
                      groupIndex * 0.08 +
                      itemIndex * 0.05 +
                      0.15,
                  }}
                  className="text-sm text-white/50 transition-colors duration-200"
                  style={{
                    ["--hover-color" as string]: group.color,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = group.color)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "")
                  }
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}