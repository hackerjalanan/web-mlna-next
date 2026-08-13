"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Terminal,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";

import {
  guides,
  type GuideCategory,
} from "@/data/guides";

const categories: GuideCategory[] = [
  "All",
  "Terminal",
  "Next.js",
  "React",
  "Laravel",
  "Database",
  "Git",
  "Troubleshooting",
];

export default function Guide() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<GuideCategory>("All");

  const [openGuide, setOpenGuide] =
    useState<number | null>(null);

  const filteredGuides = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return guides
      .filter((guide) => {
        const matchSearch =
          guide.title.toLowerCase().includes(keyword) ||
          guide.description.toLowerCase().includes(keyword) ||
          guide.category.toLowerCase().includes(keyword);

        const matchCategory =
          category === "All" ||
          guide.category === category;

        return matchSearch && matchCategory;
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime(),
      );
  }, [search, category]);

  return (
    <section className="min-h-screen px-2 py-2 md:px-4">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm text-cyan-400">
            DEVELOPER GUIDE
          </p>

          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Guide
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Catatan, dokumentasi, tutorial, command
            terminal, dan berbagai panduan development.
          </p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <div className="relative">
            <Search
              size={18}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari guide, command, atau code..."
              className="
                w-full rounded-xl
                border border-white/10
                bg-slate-900/70
                py-3 pl-10 pr-4
                text-sm text-white
                outline-none
                placeholder:text-slate-500
                focus:border-cyan-400/50
              "
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`
                whitespace-nowrap
                rounded-full px-4 py-2
                text-xs font-medium
                transition-all
                ${
                  category === item
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Result */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {filteredGuides.length} guide
          </span>

          {(search || category !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="
                flex items-center gap-1
                text-xs text-slate-400
                hover:text-white
              "
            >
              <X size={14} />
              Reset
            </button>
          )}
        </div>

        {/* Guide List */}
        <div className="space-y-3">
        {filteredGuides.map((guide) => {
            const isOpen = openGuide === guide.id;

            return (
            <div
                key={guide.id}
                className="
                overflow-hidden
                rounded-2xl
                border border-white/10
                bg-slate-900/60
                backdrop-blur-xl
                transition-all duration-300
                hover:border-cyan-400/30
                "
            >
                {/* Guide Header */}
                <button
                type="button"
                onClick={() =>
                    setOpenGuide(isOpen ? null : guide.id)
                }
                className="
                    group flex w-full
                    items-center gap-4
                    p-4 text-left
                "
                >
                {/* Icon */}
                <div
                    className="
                    flex h-11 w-11
                    shrink-0 items-center justify-center
                    rounded-xl
                    bg-cyan-400/10
                    text-cyan-400
                    "
                >
                    {guide.category === "Terminal" ? (
                    <Terminal size={21} />
                    ) : (
                    <ChevronRight
                        size={21}
                        className={`
                        transition-transform duration-300
                        ${isOpen ? "rotate-90" : ""}
                        `}
                    />
                    )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-white">
                        {guide.title}
                    </h2>

                    <span
                        className="
                        rounded-full
                        bg-white/5
                        px-2 py-0.5
                        text-[10px]
                        text-slate-400
                        "
                    >
                        {guide.category}
                    </span>
                    </div>

                    <p
                    className="
                        line-clamp-2
                        text-xs leading-5
                        text-slate-400
                    "
                    >
                    {guide.description}
                    </p>

                    <div
                    className="
                        mt-2 flex items-center gap-3
                        text-[10px] text-slate-500
                    "
                    >
                    <span>{guide.date}</span>

                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {guide.readTime}
                    </span>
                    </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                    size={18}
                    className={`
                    shrink-0
                    text-slate-600
                    transition-transform duration-300
                    group-hover:text-cyan-400
                    ${isOpen ? "rotate-90 text-cyan-400" : ""}
                    `}
                />
                </button>

                {/* Detail */}
                <div
                className={`
                    grid transition-all duration-300
                    ${
                    isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                `}
                >
                <div className="overflow-hidden">
                    <div className="border-t border-white/10 px-5 pb-5 pt-4">

                    {/* Description */}
                    <p
                        className="
                        text-sm leading-7
                        text-slate-300
                        "
                    >
                        {guide.content}
                    </p>

                    {/* Code */}
                    {guide.code && (
                        <div
                        className="
                            mt-5
                            overflow-hidden
                            rounded-xl
                            border border-white/10
                        "
                        >
                        {/* Code Header */}
                        <div
                            className="
                            flex items-center justify-between
                            border-b border-white/10
                            bg-slate-900
                            px-4 py-2
                            "
                        >
                            <span
                            className="
                                text-[10px]
                                uppercase
                                text-slate-500
                            "
                            >
                            {guide.language}
                            </span>

                            <Terminal
                            size={14}
                            className="text-slate-500"
                            />
                        </div>

                        {/* Code */}
                        <pre
                            className="
                            overflow-x-auto
                            bg-black/40
                            p-4
                            text-xs leading-6
                            text-slate-300
                            "
                        >
                            <code>{guide.code}</code>
                        </pre>
                        </div>
                    )}

                    {/* Date */}
                    <div
                        className="
                        mt-5
                        border-t border-white/10
                        pt-3
                        text-[10px]
                        text-slate-500
                        "
                    >
                        Updated {guide.date}
                    </div>

                    </div>
                </div>
                </div>
            </div>
            );
        })}
        </div>     

        {/* Empty */}
        {filteredGuides.length === 0 && (
          <div className="
            flex min-h-48
            items-center justify-center
            rounded-2xl
            border border-dashed
            border-white/10
            text-sm text-slate-500
          ">
            Guide tidak ditemukan.
          </div>
        )}
      </div>

  
    </section>
  );
}