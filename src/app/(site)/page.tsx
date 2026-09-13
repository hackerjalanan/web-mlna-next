import Hero from "@/components/site/home/Hero";
import QuickStats from "@/components/site/home/QuickStats";
import AboutPreview from "@/components/site/home/AboutPreview";
import TechStack from "@/components/site/home/TechStack";
import Projects from "@/components/site/home/Projects";
import BackendShowcase from "@/components/site/home/BackendShowcase";
import Services from "@/components/site/home/Services";
import Process from "@/components/site/home/Process";
import CTA from "@/components/site/home/CTA";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background — trimmed down to two soft glows instead of five,
          so it stays subtle rather than filling the whole page */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 top-[55%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1440px]">
        <Hero />
        <QuickStats />
        <AboutPreview />
        <TechStack />
        <Projects />
        <BackendShowcase />
        <Process />
        <Services />
        <CTA />
      </div>
    </div>
  );
}
