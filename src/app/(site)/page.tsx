import QuickProfile from "@/components/sections/QuickProfile";
import Skills from "@/components/sections/Skills";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Experience from "@/components/sections/Experience";
import WhatICanDo from "@/components/sections/WhatICanDo";
import HowIWork from "@/components/sections/HowIWork";
import HeroCarousel from "@/components/sections/HeroCarousel";
import Contact from "@/app/contact/page";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* ...background div tetap sama... */}
      <div className="mx-auto max-w-[1440px]">
        <HeroCarousel />
        <QuickProfile />
        <Skills />
        <FeaturedProjects />
        <Experience />
        <WhatICanDo />
        <HowIWork />
        <Contact />
      </div>
    </div>
  );
}