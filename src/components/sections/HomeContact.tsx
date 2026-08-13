import {
  ArrowUpRight,
  Mail,
} from "lucide-react";

export default function HomeContact() {
  return (
    <section className="px-6 py-12 md:px-10 lg:px-14">
        <div className="
            relative
            overflow-hidden
            rounded-2xl
            border border-cyan-400/20
            bg-slate-900/50
            px-6 py-8
            sm:px-8
        ">
            {/* Glow */}
            <div className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-cyan-400/10
                blur-3xl
                "> 

                <div className="
                relative
                flex
                flex-col
                gap-6
                sm:flex-row
                sm:items-center
                sm:justify-between
                "/>
                <div className="max-w-2xl">
                    <p className="
                    text-[10px]
                    font-medium
                    tracking-[0.3em]
                    text-cyan-400
                    ">
                    LET'S CONNECT
                    </p>

                    <h2 className="
                    mt-2
                    text-2xl
                    font-bold
                    text-slate-100
                    sm:text-3xl
                    ">
                    Have a project in mind?
                    </h2>

                    <p className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-500
                    sm:text-sm
                    ">
                    Terbuka untuk peluang kerja, freelance,
                    maupun kolaborasi dalam membangun produk digital.
                    </p>
                </div>

                <a
                    href="/contact"
                    className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-cyan-400
                    px-5 py-2.5
                    text-xs
                    font-semibold
                    text-slate-950
                    transition-all
                    hover:scale-105
                    hover:bg-cyan-300
                    active:scale-95
                    "
                >
                    <Mail size={14} />
                    Contact Me
                    <ArrowUpRight size={14} />
                </a>
            </div>
        </div>
    </section>
  );
}