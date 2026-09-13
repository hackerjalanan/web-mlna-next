"use client";

import { useRouter } from "next/navigation";

export default function ResumePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm text-white/50 hover:text-white transition-colors mb-2"
            >
              ← Kembali
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold">Resume</h1>
            <p className="text-white/50 text-sm mt-1">
              Ade Maulana Hidayah — Full Stack Developer
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const iframe = document.getElementById(
                  "resume-iframe"
                ) as HTMLIFrameElement | null;
                iframe?.contentWindow?.print();
              }}
              className="px-4 py-2 text-sm rounded-lg bg-[#A855F7] hover:bg-[#9333EA] transition-colors"
            >
              Cetak
            </button>
            <a
              href="/api/v1/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm rounded-lg border border-white/15 hover:bg-white/5 transition-colors"
            >
              Buka Tab Baru
            </a>
          </div>
        </div>

        {/* Resume viewer */}
        <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0d0d]">
          <iframe
            id="resume-iframe"
            src="/api/v1/resume"
            className="w-full h-[75vh] md:h-[85vh] bg-white"
          />
        </div>
      </div>
    </div >
  );
}