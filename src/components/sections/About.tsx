export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          About
        </p>

        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Let's Work Together
        </h2>

        <p className="mt-6 max-w-2xl leading-8 text-slate-400">
          Jika kamu tertarik untuk bekerja sama atau ingin
          berdiskusi mengenai project, silakan hubungi saya.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="mailto:email@example.com"
            className="rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Email Me
          </a>

          <a
            href="#"
            className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white hover:border-cyan-400 hover:text-cyan-400"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}