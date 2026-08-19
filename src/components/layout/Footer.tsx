import {
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 px-2 py-4">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} Ade Maulana Hidayah. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/ade_mlna"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-colors hover:text-cyan-400"
          >
            <FaInstagram className="h-5 w-5" />
          </a>

          <a
            href="https://linkedin.com/in/ade-mlna"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-cyan-400"
          >
            <FaLinkedin className="h-5 w-5" />
          </a>

          <a
            href="https://github.com/ademlna"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-cyan-400"
          >
            <FaGithub className="h-5 w-5" />
          </a>

          <a
            href="https://ade-maulana.my.id"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
            className="transition-colors hover:text-cyan-400"
          >
            <FaGlobe className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
