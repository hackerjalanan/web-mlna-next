"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RESUME_PATH = "/portofl/CV_Ade_Maulana_Hidayah_Programer-engl.pdf";

export default function ResumePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm text-white/50 hover:text-white transition-colors mb-2"
            >
              ← Kembali
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold">Resume</h1>
          </div>

          {!isMobile && (
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
          )}
        </div>

        {isMobile ? (
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-8 text-center">
            <p className="text-white/70 mb-4">
              Preview PDF tidak didukung di browser mobile.
            </p>
            <a
              href={RESUME_PATH}
              download="CV_Ade_Maulana_Hidayah.pdf"
              className="inline-block px-5 py-2.5 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] transition-colors text-sm"
            >
              Unduh Resume
            </a>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0d0d]">
            <iframe
              id="resume-iframe"
              src={RESUME_PATH}
              className="w-full h-[75vh] md:h-[85vh] bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}