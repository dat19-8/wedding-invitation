"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"

interface Props { onOpen: () => void }

// ── Colour palette ──────────────────────────────────────────
const ENV_BG    = "#C2CDD5"   // dusty blue paper
const FOLD_FILL = "rgba(60,90,110,.06)"
const FOLD_STR  = "rgba(60,90,110,.18)"
const SEAL_BASE = "#D4A870"   // warm tan wax
const SEAL_MID  = "#C08845"
const SEAL_DARK = "#A87038"
const SEAL_DEEP = "#9C6830"
const TEXT_COL  = "rgba(40,72,92,.6)"
// ────────────────────────────────────────────────────────────

export function LandingSection({ onOpen }: Props) {
  const flapRef = useRef<SVGPolygonElement>(null)
  const [opened, setOpened] = useState(false)

  function lc(a: string, b: string, t: number) {
    const p = (s: string, i: number) => parseInt(s.slice(i, i+2), 16)
    const h = (n: number) => Math.round(n).toString(16).padStart(2, "0")
    return "#"+h(p(a,1)+(p(b,1)-p(a,1))*t)+h(p(a,3)+(p(b,3)-p(a,3))*t)+h(p(a,5)+(p(b,5)-p(a,5))*t)
  }

  function handleOpen() {
    if (opened) return
    setOpened(true)

    const flap = flapRef.current
    if (!flap) return

    const start = [[0,0],[338,0],[169,216]]
    const end   = [[0,0],[338,0],[169,-216]]
    const dur   = 860
    const t0    = performance.now() + 320

    function step(now: number) {
      const t    = Math.max(0, Math.min((now - t0) / dur, 1))
      const ease = t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2) / 2
      flap.setAttribute("points",
        start.map((p, i) => [
          p[0] + (end[i][0] - p[0]) * ease,
          p[1] + (end[i][1] - p[1]) * ease,
        ].join(",")).join(" ")
      )
      // Flap colour shifts as it "turns over"
      flap.setAttribute("fill",
        lc("#98ADB8", "#B0C2CC", Math.sin(Math.max(0, t) * Math.PI * .9))
      )
      if (t < 1) requestAnimationFrame(step)
      else setTimeout(onOpen, 220) // ← goes directly to the website
    }

    requestAnimationFrame(step)
  }

  // Repeating petal helper
  const petals = (cy: number, rx: number, ry: number, count: number, offset = 0, fill: string) =>
    Array.from({ length: count }, (_, i) => (
      <ellipse
        key={i}
        cx={0} cy={cy} rx={rx} ry={ry}
        fill={fill}
        transform={`rotate(${offset + (360 / count) * i})`}
      />
    ))

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer"
      style={{
        background: ENV_BG,
        backgroundImage: "radial-gradient(circle, rgba(60,90,110,.055) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
      onClick={handleOpen}
    >

      {/* ── Envelope fold lines + animated flap ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
        viewBox="0 0 338 738"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Left fold */}
        <polygon points="0,0 0,738 169,369"
          fill={FOLD_FILL} stroke={FOLD_STR} strokeWidth=".9"/>
        {/* Right fold */}
        <polygon points="338,0 338,738 169,369"
          fill={FOLD_FILL} stroke={FOLD_STR} strokeWidth=".9"/>
        {/* Bottom fold */}
        <polygon points="0,738 338,738 169,369"
          fill="rgba(60,90,110,.09)" stroke={FOLD_STR} strokeWidth=".9"/>
        {/* Top flap (animated) */}
        <polygon
          ref={flapRef}
          points="0,0 338,0 169,216"
          fill="rgba(60,90,110,.04)"
          stroke={FOLD_STR}
          strokeWidth=".9"
        />
      </svg>

      {/* ── Floral wax seal ── */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.42 }}
            onClick={e => { e.stopPropagation(); handleOpen() }}
            whileHover={{ scale: 1.05 }}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5, cursor: "pointer",
            }}
          >
            <svg
              width="118" height="118"
              viewBox="-59 -59 118 118"
              style={{ overflow: "visible" }}
            >
              {/* Wax base */}
              <circle r="54" fill={SEAL_BASE}/>
              {/* Edge highlight – suggests 3-D depth */}
              <circle r="50" fill="none" stroke="rgba(255,220,155,.25)" strokeWidth="6"/>
              {/* Decorative rings */}
              <circle r="48" fill="none" stroke={SEAL_DARK} strokeWidth="1.5"/>
              <circle r="40" fill="none" stroke={SEAL_DARK} strokeWidth=".8"/>

              {/* Outer 8 petals */}
              <g opacity=".88">{petals(-28, 6.5, 11.5, 8, 0,    SEAL_MID)}</g>
              {/* Middle 8 petals (offset 22.5°) */}
              <g opacity=".92">{petals(-18, 5.5, 8.5,  8, 22.5, SEAL_DARK)}</g>
              {/* Inner 6 petals */}
              <g>{petals(-9,  4,   6.5,  6, 0,    SEAL_MID)}</g>

              {/* Centre dot */}
              <circle r="7.5" fill={SEAL_DEEP}/>
              <circle r="4"   fill={SEAL_BASE}/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── "Click to open" hint ── */}
      <AnimatePresence>
        {!opened && (
          <motion.p
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute", bottom: 80,
              left: 0, right: 0, textAlign: "center",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "1rem",
              letterSpacing: ".12em",
              color: TEXT_COL,
              zIndex: 5,
              animation: "cto 2.8s ease-in-out infinite",
            }}
          >
            Click to open
          </motion.p>
        )}
      </AnimatePresence>

      <style>{`@keyframes cto{0%,100%{opacity:.45}50%{opacity:.9}}`}</style>
    </motion.div>
  )
}
