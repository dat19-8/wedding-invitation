"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface Props { onOpen: () => void }

export function LandingSection({ onOpen }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer select-none"
      style={{ background: "#F0EBE1" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onClick={onOpen}
    >
      {/* ── Phone image (portrait ≤ md) ── */}
      <Image
        src="/images/envelope_3.png"
        alt="Wedding invitation envelope"
        fill
        priority
        className="block md:hidden"
        style={{ objectFit: "cover", objectPosition: "center" }}
        draggable={false}
      />

      {/* ── Desktop image (≥ md) ── */}
      <Image
        src="/images/envelope_2.png"
        alt="Wedding invitation envelope"
        fill
        priority
        className="hidden md:block"
        style={{ objectFit: "cover", objectPosition: "center" }}
        draggable={false}
      />

      {/* ── Subtle tap hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: "9%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 8, height: 8, borderRadius: "50%", background: "#C4A05A" }}
        />
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "0.9rem",
          letterSpacing: "0.1em",
          color: "rgba(140,110,60,.75)",
        }}>
          Tap anywhere to open
        </p>
      </motion.div>
    </motion.div>
  )
}
