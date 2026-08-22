"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    setLoading(false);

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen bg-white">
      {/* ---------------------------------------------------------------- */}
      {/* LEFT — brand panel (desktop only)                                 */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative hidden w-[42%] flex-col justify-between bg-black px-12 py-14 lg:flex">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/50">
            Portfolio
          </span>
        </div>

        <div>
          <p className="font-serif text-4xl leading-[1.15] text-white">
            Every project
            <br />
            has a record.
          </p>

          <div className="mt-8 h-px w-12 bg-white/30" />

          <p className="mt-8 max-w-xs text-sm leading-relaxed text-white/50">
            Kelola galeri, project, dan aktivitas yang tampil di portfolio
            dari satu tempat.
          </p>
        </div>

        <span className="text-xs text-white/30">
          Restricted access · Admin only
        </span>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* RIGHT — form                                                       */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 lg:hidden">
            Portfolio
          </span>

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 lg:mt-0">
            Admin Access
          </p>

          <h1 className="mt-2 font-serif text-3xl text-black">Sign in</h1>

          <p className="mt-2 text-sm text-neutral-500">
            Masukkan kredensial untuk masuk ke dashboard.
          </p>

          <form onSubmit={handleLogin} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-500"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="admin@email.com"
                className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2.5 text-[15px] text-black outline-none transition placeholder:text-neutral-400 focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-500"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2.5 text-[15px] text-black outline-none transition placeholder:text-neutral-400 focus:border-black"
              />
            </div>

            {error && (
              <div className="border-l-2 border-black pl-3">
                <p className="text-sm text-neutral-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center bg-black text-sm font-medium uppercase tracking-wide text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}