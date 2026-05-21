"use client"

import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"

export function DearGuestSection() {
  const searchParams = useSearchParams()
  const guestName = searchParams.get("guest") || "Valued Guest"
  const guestPax  = parseInt(searchParams.get("pax") || "2")
  const hasPax    = searchParams.get("pax") !== null

  return (
    <section className="py-20 md:py-28" style={{ background: "#F8F4EE" }}>
      <div className="container mx-auto px-4 max-w-lg">
        {/* Ornament */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #A8B5A2, transparent)" }} />
          <span style={{ color: "#A8B5A2", fontSize: "0.8rem" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #A8B5A2, transparent)" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="text-center"
        >
          <p className="font-serif text-3xl md:text-4xl mb-6" style={{ color: "#4E433B" }}>
            Dear{" "}
            <em className="italic" style={{ color: "#7A9172" }}>{guestName}</em>,
          </p>

          <p className="font-serif text-lg md:text-xl leading-loose mb-6" style={{ color: "#6B5E52" }}>
            Together with our families, we joyfully request the honour of your presence as we celebrate the beginning of our forever.
          </p>

          <p className="font-serif text-lg leading-loose" style={{ color: "#6B5E52" }}>
            Your presence will make our day truly complete.
          </p>

          {hasPax && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-xs tracking-[0.25em] uppercase"
              style={{
                border: "1px solid #A8B5A2",
                color: "#7A9172",
                fontFamily: "var(--font-sans)",
                fontWeight: 300,
              }}
            >
              🪑 &nbsp; {guestPax} {guestPax === 1 ? "Seat" : "Seats"} Reserved for You
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
