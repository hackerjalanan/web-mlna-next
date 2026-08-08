export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Ade Maulana. All rights reserved.</p>

        <p>Built with Next.js & Tailwind CSS</p>
      </div>
    </footer>
  );
}