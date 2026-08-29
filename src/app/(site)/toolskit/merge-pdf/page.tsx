'use client';

import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FaFilePdf, FaFileImage, FaTrash, FaArrowUp, FaArrowDown, FaDownload, FaPlus } from 'react-icons/fa6';

type FileItem = { id: string; file: File; type: 'pdf' | 'image' };

export default function MergePdfImage() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError('');
    const newItems: FileItem[] = Array.from(fileList)
      .filter((file) => file.type === 'application/pdf' || file.type.startsWith('image/'))
      .map((file) => ({ id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`, file, type: file.type === 'application/pdf' ? 'pdf' : 'image' }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  const moveItem = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const mergeFiles = async () => {
    if (items.length === 0) return;
    setMerging(true);
    setError('');
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        const bytes = await item.file.arrayBuffer();

        if (item.type === 'pdf') {
          const srcPdf = await PDFDocument.load(bytes);
          const pages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
          pages.forEach((page) => mergedPdf.addPage(page));
        } else {
          const isPng = item.file.type === 'image/png';
          const image = isPng ? await mergedPdf.embedPng(bytes) : await mergedPdf.embedJpg(bytes);
          const page = mergedPdf.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Gagal menggabungkan file. Pastikan semua file valid (PDF tidak rusak / terkunci password).');
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-400">Upload beberapa file PDF dan/atau gambar (JPG/PNG), atur urutannya, lalu gabung jadi satu file PDF. Semua diproses langsung di browser kamu.</p>

      <input ref={inputRef} type="file" multiple accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={(e) => handleFiles(e.target.files)} />

      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-sm border border-dashed border-white/20 bg-slate-900/60 py-8 text-sm text-slate-300 transition hover:border-orange-400/40 hover:text-orange-400"
      >
        <FaPlus size={14} />
        Pilih file PDF atau gambar
      </button>

      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 rounded-sm border border-white/10 bg-slate-900/60 px-3 py-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${item.type === 'pdf' ? 'bg-rose-400/10 text-rose-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                {item.type === 'pdf' ? <FaFilePdf size={14} /> : <FaFileImage size={14} />}
              </span>

              <span className="flex-1 truncate text-sm text-slate-300">{item.file.name}</span>

              <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="text-slate-500 transition hover:text-white disabled:opacity-30">
                <FaArrowUp size={12} />
              </button>
              <button onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="text-slate-500 transition hover:text-white disabled:opacity-30">
                <FaArrowDown size={12} />
              </button>
              <button onClick={() => removeItem(item.id)} className="text-slate-500 transition hover:text-rose-400">
                <FaTrash size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        onClick={mergeFiles}
        disabled={items.length === 0 || merging}
        className="flex items-center justify-center gap-2 rounded-sm bg-orange-400 py-3 text-sm font-medium text-slate-950 transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FaDownload size={14} />
        {merging ? 'Menggabungkan...' : `Gabung & Unduh (${items.length} file)`}
      </button>
    </div>
  );
}