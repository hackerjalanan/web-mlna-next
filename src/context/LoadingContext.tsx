"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface LoadingContextType {
  isPending: boolean;
  navigate: (href: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isPending: false,
  navigate: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, startTransition] = useTransition();
  const [minTimeReached, setMinTimeReached] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback(
    (href: string) => {
      setMinTimeReached(false);

      // Bersihkan timer lama kalau ada klik menu beruntun
      if (timerRef.current) clearTimeout(timerRef.current);

      // Paksa loading tampil minimal 400ms biar tidak flicker
      timerRef.current = setTimeout(() => setMinTimeReached(true), 400);

      startTransition(() => {
        router.push(href);
      });
    },
    [router]
  );

  const isPending = isTransitioning || !minTimeReached;

  return (
    <LoadingContext.Provider value={{ isPending, navigate }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);