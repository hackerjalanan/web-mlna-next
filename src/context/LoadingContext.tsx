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
import Loading from "./Loading";

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

      if (timerRef.current) clearTimeout(timerRef.current);

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
      {isPending && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);