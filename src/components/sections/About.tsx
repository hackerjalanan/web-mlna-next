export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          About Me
        </p>

        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Mengenal Saya
        </h2>

        <div className="mt-8 max-w-3xl">
          <p className="leading-8 text-slate-400">
            Saya adalah seorang developer yang memiliki pengalaman
            dalam pengembangan aplikasi web menggunakan teknologi
            frontend maupun backend.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            Saya terbiasa bekerja dengan Laravel, React, Next.js,
            Node.js, MySQL, serta berbagai tools pendukung
            pengembangan aplikasi.
          </p>
        </div>
      </div>
    </section>
  );
}