'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaQrcode, FaPenFancy, FaFileWord, FaKey, FaMagnifyingGlass, FaImage, FaArrowLeft, FaCode, FaPalette, FaEraser, FaLayerGroup, FaWeightScale } from 'react-icons/fa6';
const TOOLS = [
  { name: 'QR Code Generator', href: '/toolskit/qr-code', icon: FaQrcode, color: 'text-cyan-400 bg-cyan-400/10' },
  { name: 'Remove Background', href: '/toolskit/remove-background', icon: FaEraser, color: 'text-rose-400 bg-rose-400/10' },
  { name: 'Password Generator', href: '/toolskit/password-generator', icon: FaKey, color: 'text-amber-400 bg-amber-400/10' },
  { name: 'Image Compressor', href: '/toolskit/image-compressor', icon: FaImage, color: 'text-emerald-400 bg-emerald-400/10' },
  { name: 'JSON Formatter', href: '/toolskit/json-formatter', icon: FaCode, color: 'text-violet-400 bg-violet-400/10' },
  { name: 'Color Palette', href: '/toolskit/color-palette', icon: FaPalette, color: 'text-pink-400 bg-pink-400/10' },
  { name: 'TSX Formatter', href: '/toolskit/tsx-formatter', icon: FaCode, color: 'text-sky-400 bg-sky-400/10' },
  { name: 'Gabung PDF/Gambar', href: '/toolskit/merge-pdf', icon: FaLayerGroup, color: 'text-orange-400 bg-orange-400/10' },
  { name: 'PDF to DOCS', href: '/toolskit/pdf-to-docs', icon: FaFileWord, color: 'text-blue-400 bg-blue-400/10' },
  { name: 'Hitung BMI', href: '/toolskit/kalkulator-bmi', icon: FaWeightScale, color: 'text-violet-400 bg-violet-400/10' },
  { name: 'Hitung Body Fat', href: '/toolskit/kalkulator-body-fat', icon: FaWeightScale, color: 'text-pink-400 bg-pink-400/10' },
  { name: 'Paraprase', href: '/toolskit/paraprase', icon: FaPenFancy, color: 'text-orange-400 bg-orange-400/10' },
];

export default function ToolsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isToolPage = pathname !== '/toolskit';
  const [search, setSearch] = useState('');
  const filteredTools = TOOLS.filter((tool) => tool.name.toLowerCase().includes(search.toLowerCase()));
  const activeTool = TOOLS.find((tool) => tool.href === pathname);

  return (
    <main className="min-h-screen px-4 py-15  md:px-4 py-7">
      <div className="mx-auto max-w-[1440px]">
        {!isToolPage ? (
          <>
            <header className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-white md:text-4xl">Utility Tools</h1>
              <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">Kumpulan tools kecil untuk membantu rutinitas sehari-hari.</p>

              <div className="mx-auto mt-6 max-w-md">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/60 px-4 py-3">
                  <FaMagnifyingGlass size={14} className="text-slate-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari tools..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex flex-col items-center justify-center gap-3 rounded-sm border border-white/10 bg-slate-900/40 p-6 transition hover:border-white/20 hover:bg-white/5"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-sm transition group-hover:scale-110 ${tool.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-center text-sm text-slate-300 group-hover:text-white">{tool.name}</span>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <section>
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <Link href="/toolskit" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400">
                <FaArrowLeft size={13} />
                Kembali
              </Link>

              {activeTool && (
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-sm ${activeTool.color}`}>
                    <activeTool.icon size={16} />
                  </div>
                  <h2 className="text-base font-semibold text-white">{activeTool.name}</h2>
                </div>
              )}
            </div>

            <div className="rounded-sm border border-white/10 bg-slate-900/40 p-5 md:p-8">{children}</div>
          </section>
        )}
      </div>
    </main>
  );
}