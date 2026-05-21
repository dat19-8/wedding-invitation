"use client"

import { motion, AnimatePresence } from "framer-motion"

interface LandingSectionProps {
  onOpen: () => void
}

export function LandingSection({ onOpen }: LandingSectionProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#2C241C" }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(168,181,162,0.13) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full -top-24 -left-24"
          style={{ background: "rgba(168,181,162,0.12)", filter: "blur(80px)" }} />
        <div className="absolute w-64 h-64 rounded-full bottom-0 right-0"
          style={{ background: "rgba(212,196,176,0.1)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 text-center px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-xs tracking-[0.7em] uppercase mb-9"
          style={{ color: "#A8B5A2" }}
        >
          ✦ &nbsp; You Are Invited &nbsp; ✦
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif italic leading-none mb-0"
          style={{ fontSize: "clamp(3rem,13vw,5.5rem)", color: "#F8F4EE" }}
        >
          Rayan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.28 }}
          className="font-serif italic"
          style={{ fontSize: "clamp(1.8rem,8vw,3.2rem)", color: "#A8B5A2", lineHeight: 1.3 }}
        >
          &amp;
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="font-serif italic leading-none"
          style={{ fontSize: "clamp(3rem,13vw,5.5rem)", color: "#F8F4EE" }}
        >
          Razan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-xs tracking-[0.45em] uppercase mt-6 mb-10"
          style={{ color: "#D4C4B0" }}
        >
          Sunday &nbsp;·&nbsp; June 21, 2026 &nbsp;·&nbsp; Pleine Nature
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="flex items-center gap-4 w-44 mx-auto mb-10"
        >
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #A8B5A2, transparent)" }} />
          <span style={{ color: "#A8B5A2", fontSize: "0.7rem" }}>◆</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #A8B5A2, transparent)" }} />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="relative overflow-hidden text-xs tracking-[0.4em] uppercase font-light px-12 py-5 cursor-pointer border-none"
          style={{ background: "#A8B5A2", color: "#2C241C", fontFamily: "var(--font-sans)" }}
        >
          Open Invitation
        </motion.button>
      </div>
    </motion.div>
  )
}
