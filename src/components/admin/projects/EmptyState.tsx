export default function EmptyState({ search }: { search: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center">
      <p className="text-sm font-medium text-slate-300">Proyek tidak ditemukan</p>
      {search && (
        <p className="mt-2 text-xs text-slate-500">
          Tidak ada proyek yang cocok dengan <span className="text-cyan-400">{search}</span>
        </p>
      )}
    </div>
  );
}