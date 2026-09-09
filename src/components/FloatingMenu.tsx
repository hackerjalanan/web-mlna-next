"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";

import ChatWidget from "./sections/ChatWidget";
import FireworkButton from "@/components/sections/FireworkButton";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {/* FLOATING MENU */}
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={{
          top: -600,
          left: -400,
          right: 20,
          bottom: 20,
        }}
        style={{ touchAction: "none" }}
        className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end gap-3"
      >
        {/* CHAT WINDOW */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative z-[10001]"
          >
            <ChatWidget
              onClose={() => {
                setShowChat(false);
                setIsOpen(false);
              }}
            />
          </motion.div>
        )}

        {/* MENU LIST */}
        {isOpen && !showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-[10001] flex flex-col items-end gap-3"
          >
            {/* CHAT BUTTON */}
            <button
              type="button"
              onClick={() => {
                setShowChat(true);
                setIsOpen(false);
              }}
              className="flex h-12 items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-900/90 px-4 text-cyan-200 shadow-xl shadow-cyan-500/20 backdrop-blur-xl transition hover:scale-110"
            >
              <MessageCircle size={18} />
              <span className="text-sm">Chat</span>
            </button>

            {/* FIREWORK BUTTON */}
            <div className="relative z-[10002]">
              <FireworkButton
                onLaunch={() => {
                  setIsOpen(false);
                }}
              />
            </div>
          </motion.div>
        )}

        {/* MAIN BUTTON */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative z-[10001] flex h-14 w-14 cursor-grab items-center justify-center rounded-full border border-cyan-400/20 bg-slate-900/90 text-cyan-200 shadow-xl shadow-cyan-500/20 backdrop-blur-xl transition hover:scale-110 active:cursor-grabbing"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <Sparkles
              size={24}
              className="animate-pulse"
            />
          )}
        </button>
      </motion.div>
    </>
  );
}
