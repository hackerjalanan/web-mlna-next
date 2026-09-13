"use client";

import { motion } from "framer-motion";
import {
  Database,
  Globe,
  KeyRound,
  LayoutDashboard,
  Layers,
  Plug,
  Server,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const services = [
  {
    icon: Server,
    title: "REST API & Backend",
    description:
      "Scalable backend services with Node.js and Express, backed by PostgreSQL or MySQL for reliable data persistence.",
  },
  {
    icon: LayoutDashboard,
    title: "Full-Stack Web Application",
    description:
      "End-to-end applications with Next.js, React, and TypeScript — responsive UI connected to working backend logic.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Dashboard",
    description:
      "Internal tools with authentication, role-based access control, CRUD operations, and reporting built for daily operations.",
  },
  {
    icon: Database,
    title: "Database System",
    description:
      "Schema design and management with PostgreSQL, MySQL, or Supabase, optimized for query performance and data integrity.",
  },
  {
    icon: Plug,
    title: "API Integration",
    description:
      "Connect third-party services — payment gateways, auth providers, or messaging APIs — into your existing system securely.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Cross-platform mobile apps with Flutter and Dart, from authentication flows to secure session management.",
  },
  {
    icon: KeyRound,
    title: "Authentication System",
    description:
      "Secure login and registration flows with JWT, OTP verification, and Redis-backed session management.",
  },
  {
    icon: Globe,
    title: "Landing Page & Company Profile",
    description:
      "Fast, responsive marketing sites with HTML, CSS, and JavaScript — built to load quickly and convert.",
  },
  {
    icon: Layers,
    title: "Laravel Backend Services",
    description:
      "Robust APIs and backend logic with Laravel, paired with MySQL and Redis for caching and session storage.",
  },
];

export default function Services() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
      >
        What I Can Build
      </motion.h2>

      <div
        className="
          mt-14 grid grid-cols-1 gap-x-12 gap-y-14
          sm:grid-cols-2
          lg:grid-cols-3 lg:gap-y-16
        "
      >
        {services.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
            className="group"
          >
            <Icon
              size={22}
              strokeWidth={1.5}
              className="text-white/70 transition-colors group-hover:text-white"
            />

            <h3 className="mt-4 text-lg font-semibold text-white">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/50">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}