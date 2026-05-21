"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Suspense, useState } from "react"
import { LandingSection }    from "@/components/wedding/landing-section"
import { HeroSection }       from "@/components/wedding/hero-section"
import { DearGuestSection }  from "@/components/wedding/dear-guest-section"
import { DetailsSection }    from "@/components/wedding/details-section"
import { RSVPSection }       from "@/components/wedding/rsvp-section"
import { CountdownSection }  from "@/components/wedding/countdown-section"
import { MessageSection }    from "@/components/wedding/message-section"
import { FooterSection }     from "@/components/wedding/footer-section"

export default function WeddingInvitation() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Landing splash — unmounts with exit animation */}
      <AnimatePresence>
        {!open && (
          <LandingSection onOpen={() => setOpen(true)} />
        )}
      </AnimatePresence>

      {/* Main content fades in after opening */}
      <AnimatePresence>
        {open && (
          <motion.main
            className="min-h-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: "easeOut" }}
          >
            <HeroSection />

            {/* Dear Guest needs useSearchParams — wrap in Suspense */}
            <Suspense fallback={null}>
              <DearGuestSection />
            </Suspense>

            <DetailsSection />

            <CountdownSection />

            {/* RSVP also uses useSearchParams */}
            <Suspense fallback={null}>
              <RSVPSection />
            </Suspense>

            <MessageSection />
            <FooterSection />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
