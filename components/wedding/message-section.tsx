"use client"

import { motion } from "framer-motion"
import { Heart, Gift, Copy, Check } from "lucide-react"
import { useState } from "react"

export function MessageSection() {
  const [copied, setCopied] = useState(false)
  const accountNumber = "76 441 334"

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/30"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/20"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Decorative heart */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
          >
            <Heart className="w-10 h-10 text-primary fill-primary/30" />
          </motion.div>

          <h2 className="font-serif text-4xl md:text-5xl mb-8 font-light">
            Wishes & Love
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mb-10" />

          <p className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed mb-4">
            Your presence is the greatest gift.
          </p>

          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            For those who wish, contribution details are available below.
          </p>

          {/* Gift Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 md:p-10 max-w-md mx-auto"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-7 h-7 text-primary" />
            </div>

            <h3 className="font-serif text-2xl mb-2">Wedding Gift</h3>
            <p className="text-muted-foreground text-sm mb-6">
              WhishMoney
            </p>

            <div className="bg-background/80 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs text-muted-foreground block mb-1">Account Number</span>
                <span className="font-mono text-lg md:text-xl tracking-wider font-medium">{accountNumber}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 group"
                aria-label="Copy account number"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <Copy className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>

            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary text-sm mt-3"
              >
                Copied to clipboard!
              </motion.p>
            )}

            <p className="text-muted-foreground/70 text-xs mt-6 italic">
              Your love and blessings mean the world to us
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
