"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center">
          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-wide mb-4"
          >
            Rayan <span className="text-primary">&</span> Razan
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-muted-foreground text-lg md:text-xl font-light tracking-widest uppercase mb-8"
          >
            We&apos;re Getting Married
          </motion.p>

          {/* Couple Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative w-full max-w-md md:max-w-lg aspect-[3/4] rounded-t-full overflow-hidden shadow-2xl mb-10"
          >
            <div className="absolute inset-0 border-8 border-card/50 rounded-t-full z-10 pointer-events-none" />
            <Image
              src="/images/couple.png"
              alt="Rayan and Razan"
              fill
              className="object-cover object-top"
              priority
            />
          </motion.div>

          {/* Invitation text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-xl"
          >
            <p className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed mb-4">
              Together with love, we invite you to celebrate a night filled with joy, laughter, and beautiful memories
            </p>
            <span className="text-2xl text-primary">♡</span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm tracking-widest uppercase">Scroll</span>
              <svg width="20" height="30" viewBox="0 0 20 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="18" height="28" rx="9" />
                <motion.circle
                  cx="10"
                  cy="8"
                  r="2"
                  fill="currentColor"
                  animate={{ cy: [8, 14, 8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
