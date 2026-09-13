import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaGlobe } from "react-icons/fa";
import { projectService } from "@/services/projects.service";
import type { Project } from "@/types/projects";

const NewBadge = () => (
  <span className="ml-2 rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
    New
  </span>
);

const isUsableUrl = (url?: string | null) =>
  !!url && url.trim() !== "" && url.trim() !== "#";

// Priority sama seperti ProjectsCarousel: demo -> github -> slug page -> /projects
const getProjectHref = (project: Project) => {
  if (isUsableUrl(project.demo)) return { href: project.demo as string, isExternal: true };
  if (isUsableUrl(project.github)) return { href: project.github as string, isExternal: true };
  if (project.slug) return { href: `/projects/${project.slug}`, isExternal: false };
  return { href: "/projects", isExternal: false };
};

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Toolskit", href: "/toolskit" },
  { label: "About", href: "/about" },
];

const STACK = ["Laravel", "Next.js", "React", "Node.js / Express", "MySQL", "Tailwind CSS"];

const RESOURCES = [
  { label: "Resume / CV", href: "/resume.pdf" },
  { label: "Blog", href: "/projects", isNew: true },
  { label: "Uses", href: "/uses" },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/ademlna", icon: FaGithub },
  { label: "LinkedIn", href: "https://linkedin.com/in/ade-mlna", icon: FaLinkedin },
  { label: "Instagram", href: "https://instagram.com/ade_mlna", icon: FaInstagram },
  { label: "Email", href: "mailto:ademlna.dev@gmail.com", icon: FaEnvelope },
  { label: "Website", href: "https://ade-maulana.my.id", icon: FaGlobe },
];

export default async function Footer() {
  const allProjects = await projectService.getFeaturedProjects(6);
  const featuredProjects = allProjects.filter((project) => project.featured);

  return (
    <footer className="border-t border-white/10 bg-black px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {/* Navigation */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Navigation</h3>
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-cyan-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects — sama sumber data dengan FeaturedProjects */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Projects</h3>
          <ul className="space-y-3">
            {featuredProjects.map((project) => {
              const { href, isExternal } = getProjectHref(project);
              return (
                <li key={project.id}>
                  <Link
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="truncate text-sm text-white/60 transition-colors hover:text-cyan-400"
                  >
                    {project.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Stack */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Stack</h3>
          <ul className="space-y-3">
            {STACK.map((tech) => (
              <li key={tech} className="text-sm text-white/60">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Resources</h3>
          <ul className="space-y-3">
            {RESOURCES.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-white/60 transition-colors hover:text-cyan-400"
                >
                  {link.label}
                  {link.isNew && <NewBadge />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Connect</h3>
          <ul className="space-y-3">
            {SOCIALS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-white/60 transition-colors hover:text-cyan-400"
                >
                  <link.icon size={13} className="mr-2 shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1440px] flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
        <p>© {new Date().getFullYear()} Ade Maulana Hidayah. All rights reserved.</p>
        <p>Built with Next.js & Tailwind CSS.</p>
      </div>
    </footer>
  );
}