// app/gallery/loading.tsx
export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400 border-r-sky-500" />
          <span className="text-lg font-bold text-cyan-400">ADM</span>
        </div>

        <p className="mt-4 text-xs tracking-[0.3em] text-slate-500">
          LOADING
        </p>
      </div>
    </div>
  );
}