// context/LoadingContext.tsx
"use client";

import { createContext, useContext, useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";

const LoadingContext = createContext<{
  isPending: boolean;
  navigate: (href: string) => void;
}>({ isPending: false, navigate: () => {} });

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isTransitioning, startTransition] = useTransition();
  const [minTimeReached, setMinTimeReached] = useState(true);

  const navigate = useCallback((href: string) => {
    setMinTimeReached(false);

    // Paksa loading tampil minimal 400ms
    setTimeout(() => setMinTimeReached(true), 400);

    startTransition(() => {
      router.push(href);
    });
  }, [router]);

  const isPending = isTransitioning || !minTimeReached;

  return (
    <LoadingContext.Provider value={{ isPending, navigate }}>
      {children}
      {isPending && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);