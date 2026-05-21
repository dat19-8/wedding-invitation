"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

export function DetailsSection() {
  return (
    <section className="py-20 md:py-32 relative" id="details">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          {/* Section title */}
          <motion.div variants={itemVariants} className="mb-16">
            <span className="text-primary tracking-[0.3em] uppercase text-sm">Save The Date</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mt-4 font-light">
              The Big Day
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mt-6" />
          </motion.div>

          {/* Details cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Date */}
            <motion.div
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-2">Date</h3>
              <p className="text-muted-foreground text-lg">Sunday</p>
              <p className="font-serif text-3xl text-foreground mt-2">June 21, 2026</p>
            </motion.div>

            {/* Time */}
            <motion.div
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-2">Time</h3>
              <p className="font-serif text-3xl text-foreground mt-2">8:30 PM</p>
            </motion.div>

            {/* Location */}
            <motion.div
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-2">Location</h3>
              <p className="font-serif text-3xl text-foreground mt-2">Pleine Nature</p>
            </motion.div>
          </div>

          {/* Location button */}
          <motion.div variants={itemVariants} className="mt-12">
            <a
              href="https://www.google.com/maps?q=Pleine+Nature,+Dekwaneh&ftid=0x151f3d7df6109521:0xf35c713fa9df89e1&entry=gps&shh=CAE&lucs=,94297699,94284502,94231188,94280568,47071704,94218641,94282134,100799872,94286869&g_ep=CAISEjI2LjE4LjAuOTA2NTA0NDMzMBgAINeCAypSLDk0Mjk3Njk5LDk0Mjg0NTAyLDk0MjMxMTg4LDk0MjgwNTY4LDQ3MDcxNzA0LDk0MjE4NjQxLDk0MjgyMTM0LDEwMDc5OTg3Miw5NDI4Njg2OUICTEI%3D&skid=add6f23c-eddb-493a-a986-230d5b77428e&g_st=iw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium tracking-wide">Open Location</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
