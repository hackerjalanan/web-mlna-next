"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function BotGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const renderedRef = useRef(false);

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

      if (!window.turnstile) return;

      renderedRef.current = true;

      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,

        theme: "dark",

        callback: async (token: string) => {
          try {
            setError(false);

            const res = await fetch("/api/verify-turnstile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token,
              }),
            });

            if (!res.ok) {
              throw new Error("Verification request failed");
            }

            const data = await res.json();

            if (data.success) {
              sessionStorage.setItem("bot_verified", "true");
              setVerified(true);
            } else {
              setError(true);
            }
          } catch (err) {
            console.error("Turnstile verification error:", err);
            setError(true);
          }
        },

        "error-callback": () => {
          setError(true);
        },

        "expired-callback": () => {
          setError(false);
        },
      });
    }

    // Script sudah tersedia
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Script sudah ada tetapi belum selesai load
    const existingScript =
      document.querySelector<HTMLScriptElement>(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      );

    if (existingScript) {
      existingScript.addEventListener("load", renderWidget);

      return () => {
        existingScript.removeEventListener("load", renderWidget);
      };
    }

    // Load script Cloudflare
    const script = document.createElement("script");

    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js";

    script.async = true;
    script.defer = true;
    script.onload = renderWidget;

    document.body.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }

      widgetIdRef.current = null;
      renderedRef.current = false;
    };
  }, []);

  /*
   * Sedang mengecek sessionStorage
   */
  if (checking) {
    return null;
  }

  /*
   * Sudah lolos verifikasi
   */
  if (verified) {
    return <>{children}</>;
  }

  /*
   * Halaman verification
   */
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pt-[15vh]">
        {/* Content */}
        <div className="max-w-[900px]">
          {/* Domain */}
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-white sm:text-[40px]">
            {typeof window !== "undefined"
              ? window.location.hostname
              : "your-domain.com"}
          </h1>

          {/* Title */}
          <h2 className="mt-3 text-[23px] font-semibold leading-tight text-white sm:text-[26px]">
            Performing security verification
          </h2>

          {/* Description */}
          <p className="mt-2 max-w-[900px] text-[16px] leading-[1.45] text-white/75 sm:text-[17px]">
            This website uses a security service to protect against
            malicious bots. This page is displayed while the website
            verifies you are not a bot.
          </p>

          {/* Turnstile */}
          <div className="mt-7">
            <div
              ref={widgetRef}
              className="min-h-[65px]"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-400">
              Verification failed. Please refresh the page and try again.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pb-8 pt-20">
          <div className="border-t border-white/20" />

          <div className="mt-5 flex flex-col items-center justify-center gap-1 text-center text-[12px] text-white/70 sm:flex-row sm:gap-1">
            <span>Ray ID: verification</span>

            <span className="hidden sm:inline">|</span>

            <span>
              Performance and Security by{" "}
              <span className="font-medium text-white underline underline-offset-2">
                Cloudflare
              </span>
            </span>

            <span className="hidden sm:inline">|</span>

            <span className="underline underline-offset-2">
              Privacy
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}