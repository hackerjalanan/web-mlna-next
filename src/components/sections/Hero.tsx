export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-screen items-center px-6 pt-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            Hello, I'm
          </p>

          <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Ade Maulana
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-slate-300 sm:text-3xl">
            Fullstack Developer
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Saya membangun aplikasi web modern dengan fokus pada
            performa, pengalaman pengguna, dan solusi yang dapat
            diandalkan.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="rounded-lg border border-cyan-400/40 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-400/10"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-10 flex gap-6 text-sm text-slate-500">
            <span>Laravel</span>
            <span>React</span>
            <span>Next.js</span>
            <span>Node.js</span>
          </div>
        </div>
      </div>
    </section>
  );
}