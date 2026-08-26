"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaGlobe,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "sonner";
import type { ContactRequest } from "@/types/contact";

const SOCIALS = [
  { icon: FaEnvelope, label: "Email", value: "ademlna.dev@gmail.com", href: "mailto:ademlna.dev@gmail.com" },
  { icon: FaGithub, label: "GitHub", value: "ademlna", href: "https://github.com/ademlna" },
  { icon: FaLinkedin, label: "LinkedIn", value: "ade-mlna", href: "https://linkedin.com/in/ade-mlna" },
  { icon: FaInstagram, label: "Instagram", value: "ade_mlna", href: "https://instagram.com/ade_mlna" },
  { icon: FaGlobe, label: "Website", value: "ade-maulana.my.id", href: "https://ade-maulana.my.id" },
];

const FIELDS = [
  { name: "name", label: "Name", type: "text", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "subject", label: "Subject", type: "text", placeholder: "Project discussion" },
];

const inputClass =
  "w-full rounded-sm border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50 disabled:opacity-50";

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface ApiResponse {
  success: boolean;
  message: string;
  code?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactRequest>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus("loading");
    const toastId = toast.loading("Mengirim pesan...");

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Terjadi kesalahan");
      }

      toast.success(data.message || "Pesan berhasil dikirim", { id: toastId });

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan", {
        id: toastId,
      });
      setStatus("error");
    }
  };

  const isLoading = status === "loading";

  return (
    <main className="min-h-screen px-3 py-3  md:px-3">
      <div className="mx-auto max-w-[1440px]">
        <section className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm text-cyan-400">CONTACT</p>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Mari terhubung.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Jika kamu memiliki project, peluang kerja, atau ingin berdiskusi
            mengenai development, jangan ragu untuk menghubungi saya.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Contact Info */}
          <section>
            <h2 className="mb-5 text-lg font-semibold text-white">Contact Information</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-sm border border-white/10 bg-slate-900/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-cyan-400/10 text-cyan-400">
                  <FaMapMarkerAlt size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="mt-1 text-sm text-slate-300">Indonesia</p>
                </div>
              </div>

              {SOCIALS.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-sm border border-white/10 bg-slate-900/50 p-4 transition-colors hover:border-cyan-400/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-cyan-400/10 text-cyan-400">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm text-slate-300">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Form */}
          <section className="rounded-sm  border border-white/10 bg-slate-900/50 p-5 md:p-6">
            <h2 className="text-lg font-semibold text-white">Send a Message</h2>
            <p className="mt-1 text-xs text-slate-500">
              Saya akan membalas pesan secepat mungkin.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {FIELDS.map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label htmlFor={name} className="mb-2 block text-xs font-medium text-slate-300">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    required
                    disabled={isLoading}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={inputClass}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className="mb-2 block text-xs font-medium text-slate-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  disabled={isLoading}
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className={`resize-none ${inputClass}`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <FaSpinner size={16} className="animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}