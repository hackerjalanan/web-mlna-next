const steps = [
  {
    number: "01",
    title: "Understand",
    description: "Memahami kebutuhan dan masalah.",
  },
  {
    number: "02",
    title: "Plan",
    description: "Merancang struktur dan solusi.",
  },
  {
    number: "03",
    title: "Build",
    description: "Mengembangkan frontend dan backend.",
  },
  {
    number: "04",
    title: "Test",
    description: "Testing dan troubleshooting.",
  },
  {
    number: "05",
    title: "Improve",
    description: "Maintenance dan improvement.",
  },
];

export default function HowIWork() {
  return (
    <section className="px-6 py-12 md:px-10 lg:px-14">
      <div className="mb-6">
        <p className="text-[10px] font-medium tracking-[0.3em] text-cyan-400">
          WORKFLOW
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
          How I Work
        </h2>
      </div>

      <div className="
        grid
        gap-2
        sm:grid-cols-5
      ">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="
              relative
              rounded-xl
              border border-white/10
              bg-slate-900/40
              p-4
            "
          >
            <span className="
              text-[10px]
              font-medium
              text-cyan-400
            ">
              {step.number}
            </span>

            <h3 className="
              mt-3
              text-xs
              font-semibold
              text-slate-200
            ">
              {step.title}
            </h3>

            <p className="
              mt-1.5
              text-[10px]
              leading-5
              text-slate-500
            ">
              {step.description}
            </p>

            {index !== steps.length - 1 && (
              <span className="
                absolute
                right-[-8px]
                top-1/2
                z-10
                hidden
                h-px
                w-3
                bg-white/10
                sm:block
              " />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}