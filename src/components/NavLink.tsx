// components/NavLink.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <a href={href} onClick={handleClick} className={isPending ? "opacity-50" : ""}>
      {children}
    </a>
  );
}