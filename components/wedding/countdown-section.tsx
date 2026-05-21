"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const weddingDate = new Date("2026-06-21T20:30:00").getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = weddingDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-t from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-sm">Counting Down To</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 font-light">
            Our Forever
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mt-6" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-3xl mx-auto"
        >
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              variants={itemVariants}
              className="relative group"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 flex flex-col items-center justify-center group-hover:border-primary/40 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/10">
                {/* Decorative corner accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-primary/30 rounded-tl" />
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-primary/30 rounded-tr" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-primary/30 rounded-bl" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-primary/30 rounded-br" />
                
                <motion.span
                  key={mounted ? unit.value : "loading"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-3xl md:text-5xl text-foreground"
                >
                  {mounted ? unit.value.toString().padStart(2, "0") : "--"}
                </motion.span>
                <span className="text-muted-foreground text-xs md:text-sm tracking-wider uppercase mt-1">
                  {unit.label}
                </span>
              </div>

              {/* Separator dots (except for last item) */}
              {index < timeUnits.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 flex-col gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center text-muted-foreground mt-12 font-serif text-lg"
        >
          Until we say &ldquo;I do&rdquo;
        </motion.p>
      </div>
    </section>
  )
}
