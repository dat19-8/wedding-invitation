"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"

interface Props { onOpen: () => void }

export function LandingSection({ onOpen }: Props) {
  const flapRef = useRef<SVGPolygonElement>(null)
  const [state, setState] = useState<"closed"|"opening"|"cardOpen">("closed")

  function lc(a: string, b: string, t: number) {
    const p = (s: string, i: number) => parseInt(s.slice(i, i+2), 16)
    const h = (n: number) => Math.round(n).toString(16).padStart(2, "0")
    return "#"+h(p(a,1)+(p(b,1)-p(a,1))*t)+h(p(a,3)+(p(b,3)-p(a,3))*t)+h(p(a,5)+(p(b,5)-p(a,5))*t)
  }

  function handleOpen() {
    if (state !== "closed") return
    setState("opening")
    const flap = flapRef.current; if (!flap) return
    const s = [[0,0],[338,0],[169,216]], e = [[0,0],[338,0],[169,-216]]
    const dur = 860, t0 = performance.now() + 340
    function step(now: number) {
      const t = Math.max(0, Math.min((now-t0)/dur, 1))
      const ease = t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2
      flap.setAttribute("points", s.map((p,i)=>[p[0]+(e[i][0]-p[0])*ease, p[1]+(e[i][1]-p[1])*ease].join(",")).join(" "))
      flap.setAttribute("fill", lc("#E8E1D5","#C5BFB9",Math.sin(Math.max(0,t)*Math.PI)))
      if (t<1) requestAnimationFrame(step)
    }
    setTimeout(()=>requestAnimationFrame(step), 340)
    setTimeout(()=>setState("cardOpen"), 340+680)
  }

  const Leaf = ({cx,cy,rx,ry,r}:{cx:number,cy:number,rx:number,ry:number,r:number}) => (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#A8B5A2" transform={`rotate(${r},${cx},${cy})`}/>
  )

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background:"#F8F4EE", cursor: state==="closed"?"pointer":"default" }}
      exit={{ opacity:0 }}
      transition={{ duration:0.7 }}
      onClick={state==="closed" ? handleOpen : undefined}
    >
      {/* ── 1. Botanical background ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}} viewBox="0 0 338 738" preserveAspectRatio="xMidYMid slice">
        {/* Top-left */}
        <g opacity=".25">
          <path d="M-8,115 C12,140 36,174 58,212 C74,238 80,268 74,298" stroke="#A8B5A2" strokeWidth="2" fill="none" opacity=".5"/>
          <path d="M18,140 C3,124 -14,108 -28,90" stroke="#A8B5A2" strokeWidth="1.4" fill="none" opacity=".4"/>
          <path d="M42,178 C26,162 10,150 -6,140" stroke="#A8B5A2" strokeWidth="1.4" fill="none" opacity=".4"/>
          {[[-55,8,128,13,5.5],[-132,2,143,12,5],[-50,24,156,14,5.5],[-135,17,170,12,5],[-45,42,186,14,5.5],[-138,34,200,13,5],[-40,58,216,14,5.5],[-142,50,230,12,5],[-64,-10,102,10,4],[-74,-18,91,9,3.5],[-60,2,150,10,4],[-70,-6,140,9,3.5]].map(([r,cx,cy,rx,ry],i)=><Leaf key={i} cx={cx} cy={cy} rx={rx} ry={ry} r={r}/>)}
        </g>
        {/* Top-right */}
        <g opacity=".2" transform="translate(338,0) scale(-1,1)">
          <path d="M-8,85 C12,110 36,144 58,182 C74,208 80,238 74,268" stroke="#A8B5A2" strokeWidth="2" fill="none" opacity=".5"/>
          {[[-55,8,98,13,5.5],[-132,2,113,12,5],[-50,24,126,14,5.5],[-135,17,140,12,5],[-45,42,156,14,5.5],[-138,34,170,13,5]].map(([r,cx,cy,rx,ry],i)=><Leaf key={i} cx={cx} cy={cy} rx={rx} ry={ry} r={r}/>)}
        </g>
        {/* Bottom-left */}
        <g opacity=".2" transform="translate(0,738) scale(1,-1)">
          <path d="M-8,85 C12,110 36,144 58,182 C74,208 80,238 74,268" stroke="#A8B5A2" strokeWidth="2" fill="none" opacity=".5"/>
          {[[-55,8,98,13,5.5],[-132,2,113,12,5],[-50,24,126,14,5.5],[-135,17,140,12,5]].map(([r,cx,cy,rx,ry],i)=><Leaf key={i} cx={cx} cy={cy} rx={rx} ry={ry} r={r}/>)}
        </g>
        {/* Bottom-right */}
        <g opacity=".25" transform="translate(338,738) scale(-1,-1)">
          <path d="M-8,115 C12,140 36,174 58,212 C74,238 80,268 74,298" stroke="#A8B5A2" strokeWidth="2" fill="none" opacity=".5"/>
          {[[-55,8,128,13,5.5],[-132,2,143,12,5],[-50,24,156,14,5.5],[-135,17,170,12,5],[-45,42,186,14,5.5],[-138,34,200,13,5]].map(([r,cx,cy,rx,ry],i)=><Leaf key={i} cx={cx} cy={cy} rx={rx} ry={ry} r={r}/>)}
        </g>
        {/* Wedding rings */}
        <g stroke="#D4C4B0" strokeWidth="1.8" fill="none" opacity=".17">
          <circle cx="272" cy="128" r="16"/><circle cx="289" cy="128" r="16"/>
        </g>
        <g stroke="#D4C4B0" strokeWidth="1.6" fill="none" opacity=".13">
          <circle cx="62" cy="612" r="13"/><circle cx="76" cy="612" r="13"/>
        </g>
        {/* Flowers */}
        <g fill="#D4C4B0" opacity=".18">
          {[[169,64],[169,672]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="3.5"/><circle cx={x-9} cy={y-8} r="2.5"/><circle cx={x+9} cy={y-8} r="2.5"/><circle cx={x} cy={y-12} r="2.5"/><circle cx={x} cy={y+8} r="2.5"/></g>)}
        </g>
        {/* Dots */}
        <g fill="#A8B5A2" opacity=".12">
          <circle cx="200" cy="50" r="2"/><circle cx="212" cy="42" r="1.5"/>
          <circle cx="136" cy="688" r="2"/><circle cx="124" cy="695" r="1.5"/>
          <circle cx="302" cy="245" r="1.5"/><circle cx="40" cy="495" r="1.5"/>
        </g>
      </svg>

      {/* ── 2. Envelope fold lines + animated flap ── */}
      <svg className="absolute inset-0 w-full h-full" style={{zIndex:2}} viewBox="0 0 338 738" preserveAspectRatio="xMidYMid slice">
        <polygon points="0,0 0,738 169,369" fill="rgba(242,236,226,.5)" stroke="#D4C4B0" strokeWidth=".9"/>
        <polygon points="338,0 338,738 169,369" fill="rgba(242,236,226,.5)" stroke="#D4C4B0" strokeWidth=".9"/>
        <polygon points="0,738 338,738 169,369" fill="rgba(240,235,228,.65)" stroke="#D4C4B0" strokeWidth=".9"/>
        <polygon ref={flapRef} points="0,0 338,0 169,216" fill="#E8E1D5" stroke="#D4C4B0" strokeWidth=".9"/>
      </svg>

      {/* ── 3. Wax seal ── */}
      <AnimatePresence>
        {state === "closed" && (
          <motion.div
            exit={{ scale:0, opacity:0 }}
            transition={{ duration:0.45 }}
            onClick={(e)=>{e.stopPropagation();handleOpen()}}
            whileHover={{ scale:1.07 }}
            style={{
              position:"absolute", top:"50%", left:"50%",
              transform:"translate(-50%,-50%)",
              width:86, height:86, borderRadius:"50%",
              background:"#A8B5A2", zIndex:5,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer",
              boxShadow:"0 0 0 6px rgba(168,181,162,.22), 0 5px 24px rgba(168,181,162,.42)",
            }}
          >
            <div style={{ position:"absolute", inset:8, borderRadius:"50%", border:"1px solid rgba(255,255,255,.25)" }}/>
            <span className="font-serif italic" style={{ color:"#2C241C", fontSize:"1.25rem", letterSpacing:".04em", userSelect:"none", position:"relative", zIndex:1 }}>
              R &amp; R
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. Tap hint ── */}
      <AnimatePresence>
        {state === "closed" && (
          <motion.p
            exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
            style={{
              position:"absolute", bottom:80, left:0, right:0,
              textAlign:"center", fontSize:".56rem",
              letterSpacing:".45em", textTransform:"uppercase",
              color:"#A8B5A2", zIndex:5,
              animation:"breathe 2.5s ease-in-out infinite",
            }}
          >
            ✦ &nbsp; Tap to Open &nbsp; ✦
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── 5. Invitation card (slides up) ── */}
      <div
        style={{
          position:"absolute", inset:0, background:"#FDFAF6",
          zIndex:10, overflow:"hidden",
          transform: state==="cardOpen" ? "translateY(0%)" : "translateY(100%)",
          transition:"transform 0.88s cubic-bezier(0.15,0,0,1)",
        }}
      >
        {/* Card botanical corners */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}} viewBox="0 0 338 738" preserveAspectRatio="xMidYMid slice">
          {[
            [1,1],[-1,1],[1,-1],[-1,-1]
          ].map(([sx,sy],gi)=>(
            <g key={gi} opacity=".18" fill="#A8B5A2" transform={`translate(${sx<0?338:0},${sy<0?738:0}) scale(${sx},${sy})`}>
              <path d="M18,18 C24,32 30,48 36,68" stroke="#A8B5A2" strokeWidth="1.3" fill="none" opacity=".5"/>
              {[[-60,23,29,8,3.5],[-138,18,40,7,3],[-52,28,52,8,3.5],[-140,22,62,7,3]].map(([r,cx,cy,rx,ry],i)=><Leaf key={i} cx={cx} cy={cy} rx={rx} ry={ry} r={r}/>)}
            </g>
          ))}
        </svg>

        {/* Double inner border */}
        <div style={{ position:"absolute", inset:18, border:"1px solid rgba(168,181,162,.32)", pointerEvents:"none", zIndex:1 }}/>
        <div style={{ position:"absolute", inset:22, border:"1px solid rgba(168,181,162,.14)", pointerEvents:"none", zIndex:1 }}/>

        {/* Content */}
        <div style={{ position:"relative", zIndex:2, height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"3rem 2.8rem", textAlign:"center" }}>

          <p style={{ fontSize:".48rem", letterSpacing:".58em", textTransform:"uppercase", color:"#A8B5A2", marginBottom:".7rem", fontFamily:"var(--font-sans)", fontWeight:300 }}>
            You are invited
          </p>
          <p style={{ color:"#A8B5A2", fontSize:".7rem", letterSpacing:".4em", marginBottom:"1.5rem" }}>✦ &nbsp; ✦ &nbsp; ✦</p>

          <p className="font-serif italic" style={{ fontSize:".9rem", color:"#6B5E52", lineHeight:2, marginBottom:"2rem" }}>
            Together with our families, we<br/>joyfully request the honour<br/>of your presence
          </p>

          <p className="font-serif italic" style={{ fontSize:"2.9rem", color:"#4E433B", lineHeight:1.02, marginBottom:".1rem" }}>Rayan</p>
          <p className="font-serif italic" style={{ fontSize:"1.65rem", color:"#A8B5A2", lineHeight:1.4, marginBottom:".1rem" }}>&amp;</p>
          <p className="font-serif italic" style={{ fontSize:"2.9rem", color:"#4E433B", lineHeight:1.02, marginBottom:"2rem" }}>Razan</p>

          <div style={{ width:44, height:1, background:"#D4C4B0", marginBottom:"2rem" }}/>

          <div className="font-serif" style={{ color:"#4E433B", lineHeight:2.1, marginBottom:".6rem" }}>
            <p style={{ fontSize:"1.12rem" }}>Sunday, June 21, 2026</p>
            <p className="italic" style={{ fontSize:".88rem", color:"#6B5E52" }}>8:30 PM onwards</p>
          </div>

          <div className="font-serif" style={{ color:"#4E433B", lineHeight:2, marginBottom:"2.2rem" }}>
            <p style={{ fontSize:"1.08rem" }}>Pleine Nature</p>
            <p className="italic" style={{ fontSize:".82rem", color:"#6B5E52" }}>Dekwaneh, Lebanon</p>
          </div>

          <button
            onClick={(e)=>{ e.stopPropagation(); onOpen() }}
            style={{
              width:"100%", maxWidth:224, padding:"1.05rem 1.5rem",
              background:"#A8B5A2", color:"#2C241C", border:"none",
              fontFamily:"var(--font-sans)", fontWeight:300,
              fontSize:".58rem", letterSpacing:".4em", textTransform:"uppercase",
              cursor:"pointer", transition:"background .2s, color .2s",
            }}
            onMouseEnter={e=>{(e.target as HTMLElement).style.background="#7A9172";(e.target as HTMLElement).style.color="#fff"}}
            onMouseLeave={e=>{(e.target as HTMLElement).style.background="#A8B5A2";(e.target as HTMLElement).style.color="#2C241C"}}
          >
            Open Invitation
          </button>
        </div>
      </div>

      <style>{`@keyframes breathe{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </motion.div>
  )
}
