import Project from "@/app/projects/projectsPage";

import MainLayout from "@/components/layout/MainLayout";

export default function Page() {
  return (  
    <MainLayout>
      <div className="relative isolate overflow-hidden">
        {/* Background blur circles */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Top left */}
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

          {/* Top right */}
          <div className="absolute -right-32 top-96 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />

          {/* Middle */}
          <div className="absolute left-1/3 top-[40%] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Bottom left */}
          <div className="absolute -left-40 top-[65%] h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

          {/* Bottom right */}
          <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
        <Project />
      </div>
    </MainLayout>
  );
}