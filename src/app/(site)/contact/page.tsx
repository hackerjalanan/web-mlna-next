  "use client";

  import { useState } from "react";
  import { AnimatePresence, motion } from "framer-motion";
  import {
    FaEnvelope,
    FaLocationDot,
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaGlobe,
    FaPaperPlane,
    FaCheck,
    FaXmark,
  } from "react-icons/fa6";
  import type { ContactRequest } from "@/types/contact";
  import Loading from "@/context/Loading";

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
    "w-full border-b border-white/10 bg-transparent px-0 py-3 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-[#A855F7]/60 disabled:opacity-40";

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
    const [resultMessage, setResultMessage] = useState("");

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setStatus("loading");

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

        setResultMessage(data.message || "Pesan berhasil dikirim");
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } catch (err) {
        setResultMessage(err instanceof Error ? err.message : "Terjadi kesalahan");
        setStatus("error");
      } finally {
        setTimeout(() => setStatus("idle"), 2200);
      }
    };

    const isLoading = status === "loading";
    const isDisabled = status === "loading" || status === "success";

    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          {/* ================= HEADER ================= */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-20 max-w-2xl"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#A855F7]">
              Contact
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Mari terhubung.
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/50 md:text-base">
              Jika kamu memiliki project, peluang kerja, atau ingin berdiskusi
              mengenai development, jangan ragu untuk menghubungi saya.
            </p>
          </motion.section>

          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            {/* ================= CONTACT INFO ================= */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <h2 className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-white/40">
                Information
              </h2>

              <div className="space-y-0">
                <div className="flex items-center gap-4 border-b border-white/[0.06] py-5">
                  <FaLocationDot size={16} className="shrink-0 text-[#10B981]" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-white/30">Location</p>
                    <p className="mt-1 text-sm text-white/80">Indonesia</p>
                  </div>
                </div>

                {SOCIALS.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 border-b border-white/[0.06] py-5 transition-colors hover:border-[#A855F7]/30"
                  >
                    <Icon
                      size={16}
                      className="shrink-0 text-white/40 transition-colors group-hover:text-[#A855F7]"
                    />
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-white/30">{label}</p>
                      <p className="mt-1 text-sm text-white/80 transition-colors group-hover:text-white">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.section>

            {/* ================= FORM ================= */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
                Send a Message
              </h2>
              <p className="mt-2 text-xs text-white/30">
                Saya akan membalas pesan secepat mungkin.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                {FIELDS.map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label htmlFor={name} className="mb-1 block text-xs text-white/40">
                      {label}
                    </label>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      required
                      disabled={isDisabled}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="mb-1 block text-xs text-white/40">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    disabled={isDisabled}
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    className={`resize-none ${inputClass}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="group mt-4 flex items-center gap-3 text-sm font-medium text-white transition-colors hover:text-[#A855F7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Send Message</span>
                  <FaPaperPlane
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>
            </motion.section>
          </div>
        </div>

        {/* ================= STATUS OVERLAY (loading / success / error) ================= */}
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/85 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                { status === "loading" && <Loading label="Mengirim pesan..." size={32} />}

                {status === "success" && (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#10B981]/30">
                      <FaCheck size={18} className="text-[#10B981]" />
                    </div>
                    <p className="max-w-xs text-sm text-white/70">{resultMessage}</p>
                  </>
                )}
                {status === "error" && (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#EF4444]/30">
                      <FaXmark size={18} className="text-[#EF4444]" />
                    </div>
                    <p className="max-w-xs text-sm text-white/70">{resultMessage}</p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    );
  }