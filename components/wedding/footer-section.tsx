"use client"

import { motion } from "framer-motion"

export function FooterSection() {
  return (
    <footer className="py-16 text-center relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        {/* Decorative flourish */}
        <svg
          width="100"
          height="30"
          viewBox="0 0 100 30"
          fill="none"
          className="mx-auto mb-6 text-primary"
        >
          <path
            d="M50 15C50 15 35 5 20 5C5 5 0 15 0 15C0 15 5 25 20 25C35 25 50 15 50 15Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M50 15C50 15 65 5 80 5C95 5 100 15 100 15C100 15 95 25 80 25C65 25 50 15 50 15Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="50" cy="15" r="3" fill="currentColor" />
        </svg>

        <p className="font-serif text-2xl md:text-3xl text-foreground mb-4">
          We can&apos;t wait to celebrate with you
        </p>

        <p className="text-muted-foreground text-lg mb-8">
          With love,
        </p>

        <h3 className="font-serif text-3xl md:text-4xl font-light">
          Rayan <span className="text-primary">&</span> Razan
        </h3>

        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            June 21, 2026 • Pleine Nature
          </p>
        </div>
      </motion.div>
    </footer>
  )
}
