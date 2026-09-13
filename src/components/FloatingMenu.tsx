"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";

import ChatWidget from "./sections/ChatWidget";
import FireworkButton from "@/components/sections/FireworkButton";
import FireworksOverlay, {
  FireworksOverlayHandle,
} from "@/components/sections/FireworksOverlay";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fireworksRef = useRef<FireworksOverlayHandle>(null);

  /**
   * FIREWORK
   *
   * Klik fireworks tidak menutup menu.
   * Menu tetap terbuka selama animasi berlangsung.
   */
  const handleFirework = () => {
    requestAnimationFrame(() => {
      fireworksRef.current?.launch();
    });
  };

  return (
    <>
      {/* =========================================================
          FLOATING MENU
          ========================================================= */}
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={{
          top: -600,
          left: -400,
          right: 20,
          bottom: 20,
        }}
        style={{
          touchAction: "none",
        }}
        className="
          fixed
          bottom-6
          right-6
          z-[10000]
          flex
          flex-col
          items-end
          gap-3
        "
      >
        {/* =======================================================
            CHAT WINDOW
            ======================================================= */}
        {showChat && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
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

        {/* =======================================================
            MENU LIST
            ======================================================= */}
        {isOpen && !showChat && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              relative
              z-[10001]
              flex
              flex-col
              items-end
              gap-3
            "
          >
            {/* ===================================================
                CHAT
                =================================================== */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setShowChat(true);
                setIsOpen(false);
              }}
              className="
                flex
                h-12
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/20
                bg-slate-900/90
                px-4
                text-cyan-200
                shadow-xl
                shadow-cyan-500/20
                backdrop-blur-xl
              "
            >
              <MessageCircle size={18} />

              <span className="text-sm">
                Chat
              </span>
            </motion.button>

            {/* ===================================================
                FIREWORK
                =================================================== */}
            <div className="relative z-[10002]">
              <FireworkButton
                onLaunch={handleFirework}
              />
            </div>
          </motion.div>
        )}

        {/* =======================================================
            MAIN BUTTON
            ======================================================= */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => {
            if (showChat) {
              setShowChat(false);
              return;
            }

            setIsOpen((prev) => !prev);
          }}
          className="
            relative
            z-[10001]
            flex
            h-14
            w-14
            cursor-grab
            items-center
            justify-center
            rounded-full
            border
            border-cyan-400/20
            bg-slate-900/90
            text-cyan-200
            shadow-xl
            shadow-cyan-500/20
            backdrop-blur-xl
            active:cursor-grabbing
          "
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <Sparkles
              size={24}
              className="animate-pulse"
            />
          )}
        </motion.button>
      </motion.div>

      {/* =========================================================
          FIREWORKS OVERLAY
          ========================================================= */}
      <FireworksOverlay
        ref={fireworksRef}
        onFinish={() => {
          // Menu tetap terbuka.
        }}
      />
    </>
  );
}
