"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.turnstile.render(ref.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token: string) => onVerify(token),
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onVerify]);

  return <div ref={ref} />;
}   