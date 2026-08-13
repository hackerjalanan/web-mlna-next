"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Code2,
  BriefcaseBusiness,
  Send,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    console.log(form);

    // Nanti bisa dihubungkan ke:
    // API Route / Resend / Formspree / backend sendiri
  };

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <section className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm text-cyan-400">
            CONTACT
          </p>

          <h1 className="
            text-3xl font-bold
            tracking-tight text-white
            md:text-5xl
          ">
            Mari terhubung.
          </h1>

          <p className="
            mt-4
            text-sm leading-7
            text-slate-400
          ">
            Jika kamu memiliki project, peluang kerja,
            atau ingin berdiskusi mengenai development,
            jangan ragu untuk menghubungi saya.
          </p>
        </section>

        <div className="
          grid gap-8
          lg:grid-cols-[0.8fr_1.2fr]
        ">

          {/* Contact Info */}
          <section>
            <h2 className="mb-5 text-lg font-semibold text-white">
              Contact Information
            </h2>

            <div className="space-y-3">

              <a
                href="mailto:your@email.com"
                className="
                  flex items-center gap-4
                  rounded-xl
                  border border-white/10
                  bg-slate-900/50
                  p-4
                  transition-colors
                  hover:border-cyan-400/30
                "
              >
                <div className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-lg
                  bg-cyan-400/10
                  text-cyan-400
                ">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    your@email.com
                  </p>
                </div>
              </a>

              <div className="
                flex items-center gap-4
                rounded-xl
                border border-white/10
                bg-slate-900/50
                p-4
              ">
                <div className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-lg
                  bg-cyan-400/10
                  text-cyan-400
                ">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    Indonesia
                  </p>
                </div>
              </div>

            </div>

            {/* Social */}
            <div className="mt-8">
              <p className="mb-3 text-xs text-slate-500">
                FIND ME ONLINE
              </p>

              <div className="flex gap-2">

                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border border-white/10
                    bg-white/5
                    text-slate-400
                    transition-colors
                    hover:border-cyan-400/30
                    hover:text-cyan-400
                  "
                >
                  <Code2 size={18} />
                </a>

                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border border-white/10
                    bg-white/5
                    text-slate-400
                    transition-colors
                    hover:border-cyan-400/30
                    hover:text-cyan-400
                  "
                >
                  <BriefcaseBusiness size={18} />
                </a>

              </div>
            </div>
          </section>

          {/* Form */}
          <section className="
            rounded-2xl
            border border-white/10
            bg-slate-900/50
            p-5 md:p-6
          ">
            <h2 className="text-lg font-semibold text-white">
              Send a Message
            </h2>

            <p className="
              mt-1
              text-xs text-slate-500
            ">
              Saya akan membalas pesan secepat mungkin.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="
                    mb-2 block
                    text-xs font-medium
                    text-slate-300
                  "
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="
                    w-full rounded-xl
                    border border-white/10
                    bg-slate-950/60
                    px-4 py-3
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-400/50
                  "
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2 block
                    text-xs font-medium
                    text-slate-300
                  "
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="
                    w-full rounded-xl
                    border border-white/10
                    bg-slate-950/60
                    px-4 py-3
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-400/50
                  "
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="
                    mb-2 block
                    text-xs font-medium
                    text-slate-300
                  "
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project discussion"
                  className="
                    w-full rounded-xl
                    border border-white/10
                    bg-slate-950/60
                    px-4 py-3
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-400/50
                  "
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="
                    mb-2 block
                    text-xs font-medium
                    text-slate-300
                  "
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="
                    w-full resize-none
                    rounded-xl
                    border border-white/10
                    bg-slate-950/60
                    px-4 py-3
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:border-cyan-400/50
                  "
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  flex w-full
                  items-center justify-center
                  gap-2
                  rounded-xl
                  bg-cyan-400
                  px-4 py-3
                  text-sm font-semibold
                  text-slate-950
                  transition-all
                  hover:bg-cyan-300
                  active:scale-[0.98]
                "
              >
                <Send size={16} />
                Send Message
              </button>

            </form>
          </section>
        </div>
      </div>
    </main>
  );
}