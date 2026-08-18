"use client";

import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function BotGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const renderedRef = useRef(false); // guard biar render cuma sekali

  useEffect(() => {
    const cached = sessionStorage.getItem("bot_verified");
    if (cached === "true") {
      setVerified(true);
      setChecking(false);
      return;
    }
    setChecking(false);

    function renderWidget() {
      if (renderedRef.current || !widgetRef.current) return;
      renderedRef.current = true;

      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: async (token: string) => {
          const res = await fetch("/api/verify-turnstile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (data.success) {
            sessionStorage.setItem("bot_verified", "true");
            setVerified(true);
          } else {
            setError(true);
          }
        },
        "error-callback": () => setError(true),
      });
    }

    // Kalau script sudah pernah dimuat sebelumnya (misalnya karena Strict Mode
    // atau navigasi ulang), langsung render tanpa nambah script baru
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Kalau tag script sudah ada di DOM tapi belum selesai load, tunggu event load-nya
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", renderWidget);
      return () => existingScript.removeEventListener("load", renderWidget);
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.body.appendChild(script);

    return () => {
      // Bersihkan widget saat unmount, jangan hapus script-nya
      // (script boleh tetap ada untuk dipakai ulang)
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      renderedRef.current = false;
    };
  }, []);

  if (checking) return null;

  if (!verified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Memverifikasi bahwa kamu bukan bot...
        </p>
        <div ref={widgetRef} />
        {error && (
          <p className="text-sm text-red-500">
            Verifikasi gagal. Coba refresh halaman.
          </p>
        )}
      </div>
    );
  }

  return <>{children}</>;
}