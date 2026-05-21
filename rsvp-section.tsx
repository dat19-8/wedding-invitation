"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Phone, MessageCircle, Send, CheckCircle, Loader2, Edit3 } from "lucide-react"

// ✏️ Your Google Apps Script URL (same one, but now handles GET + POST)
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyOESZSL_GpnZTxBkweDlHzFxlohA-in_qMobW5WW7rCBSC_zJEt-I44qQTuXlF0yU/exec"

type Status = "checking" | "clean" | "confirmed" | "changing" | "done"

interface ExistingRSVP {
  attending: number
  respondentName: string
  phone: string
  lastUpdated: string
  rowIndex: number
}

export function RSVPSection() {
  const searchParams  = useSearchParams()
  const guestName     = searchParams.get("guest") || ""
  const guestPax      = parseInt(searchParams.get("pax") || "4")

  const [status,   setStatus]   = useState<Status>("checking")
  const [existing, setExisting] = useState<ExistingRSVP | null>(null)
  const [rowIndex, setRowIndex] = useState<number | null>(null)

  // Form fields
  const [name,    setName]    = useState(guestName)
  const [phone,   setPhone]   = useState("")
  const [count,   setCount]   = useState(String(guestPax))
  const [loading, setLoading] = useState(false)

  // ── On mount: ask the sheet if this guest already confirmed ──
  useEffect(() => {
    if (!guestName) { setStatus("clean"); return }

    const check = async () => {
      try {
        const res  = await fetch(
          `${GOOGLE_SHEET_URL}?action=check&guest=${encodeURIComponent(guestName)}`,
          { method: "GET", redirect: "follow" }
        )
        const data = await res.json()

        if (data.confirmed) {
          setExisting({
            attending:      data.attending,
            respondentName: data.respondentName,
            phone:          data.phone,
            lastUpdated:    data.lastUpdated,
            rowIndex:       data.rowIndex,
          })
          setRowIndex(data.rowIndex)
          setName(String(data.respondentName  || guestName))
          setPhone(String(data.phone          || ""))
          setCount(String(data.attending || guestPax))
          setStatus("confirmed")
        } else {
          setRowIndex(data.rowIndex ?? null)
          setStatus("clean")
        }
      } catch {
        // If check fails (network, CORS), fall through to clean form
        setStatus("clean")
      }
    }

    check()
  }, [guestName, guestPax])

  // ── Submit (new or update) ──
  async function handleSubmit() {
    if (!name.trim())             { alert("Please enter your name.");         return }
    if (!String(phone).trim())    { alert("Please enter your phone number."); return }

    setLoading(true)
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:          "rsvp",
          guestInvitedAs:  guestName || name,
          guestPaxAllowed: guestPax,
          respondentName:  name.trim(),
          phone:           String(phone).trim(),
          attending:       count,
          timestamp:       new Date().toLocaleString("en-GB"),
          rowIndex:        rowIndex ?? null,
        }),
      })
    } catch (_) { /* no-cors: expected */ }

    setLoading(false)
    setExisting({
      attending:      parseInt(count),
      respondentName: name.trim(),
      phone:          String(phone).trim(),
      lastUpdated:    new Date().toLocaleString("en-GB"),
      rowIndex:       rowIndex ?? 0,
    })
    setStatus("done")
  }

  // ─────────── UI ───────────

  const brideNumber = "+961 81 060 955"
  const groomNumber = "+961 76 441 334"

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: ".85rem 1rem",
    border: "1px solid #D4C4B0", background: "#fff",
    fontFamily: "var(--font-serif)", fontSize: "1.05rem",
    color: "#4E433B", borderRadius: 0, outline: "none",
    appearance: "none" as const,
  }

  const ornRow = (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,transparent,#A8B5A2,transparent)" }}/>
      <span style={{ color:"#A8B5A2", fontSize:"0.85rem" }}>✉</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,transparent,#A8B5A2,transparent)" }}/>
    </div>
  )

  return (
    <section className="py-20 md:py-32" style={{ background:"#F8F4EE" }} id="rsvp">
      <div className="container mx-auto px-4 max-w-lg">

        {ornRow}
        <p className="text-center text-xs tracking-[.55em] uppercase mb-2" style={{ color:"#A8B5A2" }}>
          Kindly Reply By June 10, 2026
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-center font-light mb-2" style={{ color:"#4E433B" }}>
          <em>RSVP</em>
        </h2>
        <div className="w-12 h-px mx-auto mb-10" style={{ background:"#A8B5A2" }}/>

        <AnimatePresence mode="wait">

          {/* ── CHECKING ── */}
          {status === "checking" && (
            <motion.div key="checking" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{color:"#A8B5A2"}}/>
              <p className="text-xs tracking-[.3em] uppercase" style={{color:"#A8B5A2"}}>Checking your reservation…</p>
            </motion.div>
          )}

          {/* ── CONFIRMED (already booked) ── */}
          {status === "confirmed" && existing && (
            <motion.div key="confirmed" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              transition={{duration:.5}}>

              {/* Big check */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                  style={{background:"#F0EBE3", border:"1px solid #A8B5A2"}}>
                  <CheckCircle className="w-10 h-10" style={{color:"#A8B5A2"}} strokeWidth={1.5}/>
                </div>
                <h3 className="font-serif text-3xl font-light mb-1" style={{color:"#4E433B"}}>You're All Set</h3>
                <p className="font-serif italic text-xl" style={{color:"#7A9172"}}>
                  {existing.attending} seat{existing.attending !== 1 ? "s" : ""} confirmed
                </p>
              </div>

              {/* Info card */}
              <div className="mb-8 p-5" style={{background:"#FDFAF6", border:"1px solid #E0D8CC", borderLeft:"2px solid #A8B5A2"}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm flex-shrink-0"
                    style={{background:"#F0EBE3", color:"#7A9172"}}>
                    {existing.respondentName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-serif" style={{fontSize:"1.05rem", color:"#4E433B"}}>{existing.respondentName}</p>
                    <p style={{fontSize:".85rem", color:"#6B5E52"}}>{existing.phone}</p>
                  </div>
                </div>
                <div className="pt-3" style={{borderTop:"1px solid #E8E2D9"}}>
                  <p style={{fontSize:".55rem", letterSpacing:".3em", textTransform:"uppercase", color:"#A8B5A2"}}>
                    Last updated: {existing.lastUpdated}
                  </p>
                </div>
              </div>

              {/* Pax breakdown */}
              <div className="flex items-center justify-between px-4 py-3 mb-8"
                style={{background:"#F0EBE3", border:"1px solid #D4C4B0"}}>
                <p style={{fontSize:".6rem", letterSpacing:".3em", textTransform:"uppercase", color:"#6B5E52"}}>
                  Seats reserved
                </p>
                <p className="font-serif" style={{fontSize:"1.3rem", color:"#4E433B"}}>
                  {existing.attending} <span style={{color:"#A8B5A2", fontSize:".9rem"}}>/ {guestPax || existing.attending}</span>
                </p>
              </div>

              {/* Change option */}
              <div className="text-center" style={{borderTop:"1px solid #E8E2D9", paddingTop:"1.5rem"}}>
                <p style={{fontSize:".75rem", color:"#6B5E52", marginBottom:"1rem"}}>
                  Need to make a change?
                </p>
                <button onClick={() => setStatus("changing")}
                  className="inline-flex items-center gap-2"
                  style={{
                    fontFamily:"var(--font-sans)", fontWeight:300, fontSize:".62rem",
                    letterSpacing:".35em", textTransform:"uppercase",
                    color:"#7A9172", background:"transparent",
                    border:"1px solid #A8B5A2", padding:".75rem 1.8rem",
                    cursor:"pointer",
                  }}>
                  <Edit3 className="w-3 h-3"/>
                  Modify Reservation
                </button>
              </div>
            </motion.div>
          )}

          {/* ── FORM (clean or changing) ── */}
          {(status === "clean" || status === "changing") && (
            <motion.div key="form" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:.4}}>

              {status === "changing" && (
                <div className="flex items-center justify-between mb-6 pb-4"
                  style={{borderBottom:"1px solid #E8E2D9"}}>
                  <p style={{fontSize:".6rem", letterSpacing:".35em", textTransform:"uppercase", color:"#A8B5A2"}}>
                    Updating your reservation
                  </p>
                  <button onClick={() => setStatus("confirmed")}
                    style={{fontSize:".6rem", color:"#6B5E52", background:"none", border:"none", cursor:"pointer", letterSpacing:".1em"}}>
                    ← Cancel
                  </button>
                </div>
              )}

              {/* Name */}
              <div className="mb-5">
                <label className="block text-xs tracking-[.35em] uppercase mb-2"
                  style={{color:"#6B5E52", fontWeight:300}}>Your Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Enter your name" style={inputStyle}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor="#A8B5A2"}
                  onBlur={e  => (e.target as HTMLInputElement).style.borderColor="#D4C4B0"}/>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <label className="block text-xs tracking-[.35em] uppercase mb-2"
                  style={{color:"#6B5E52", fontWeight:300}}>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+961 XX XXX XXX" style={inputStyle}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor="#A8B5A2"}
                  onBlur={e  => (e.target as HTMLInputElement).style.borderColor="#D4C4B0"}/>
              </div>

              {/* Count */}
              <div className="mb-8">
                <label className="block text-xs tracking-[.35em] uppercase mb-2"
                  style={{color:"#6B5E52", fontWeight:300}}>Number of Guests Attending</label>
                <div className="relative">
                  <select value={count} onChange={e => setCount(e.target.value)}
                    style={{...inputStyle, appearance:"none" as const}}>
                    {Array.from({length: guestPax}, (_,i) => i+1).map(n => (
                      <option key={n} value={n}>{n === 1 ? "1 Guest" : `${n} Guests`}</option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{color:"#A8B5A2"}}>▾</span>
                </div>
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 text-xs tracking-[.4em] uppercase font-light disabled:opacity-60"
                style={{background:"#A8B5A2", color:"#2C241C", fontFamily:"var(--font-sans)", border:"none", cursor:"pointer"}}
                onMouseEnter={e => { if(!loading){(e.currentTarget).style.background="#7A9172";(e.currentTarget).style.color="#fff"} }}
                onMouseLeave={e => { (e.currentTarget).style.background="#A8B5A2";(e.currentTarget).style.color="#2C241C" }}>
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin"/> Sending…</>
                  : <><Send className="w-4 h-4"/>
                    {status === "changing" ? "Update Confirmation" : "Confirm Attendance"}</>
                }
              </button>

              {/* Divider + phone */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px" style={{background:"#E8E2D9"}}/>
                <span className="text-xs tracking-widest uppercase" style={{color:"#A8B5A2"}}>or reach us</span>
                <div className="flex-1 h-px" style={{background:"#E8E2D9"}}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {label:"The Groom", name:"Rayan", num:groomNumber, wa:"96176441334"},
                  {label:"The Bride", name:"Razan", num:brideNumber, wa:"96181060955"},
                ].map(p => (
                  <div key={p.name} className="p-5 text-center" style={{background:"#fff", border:"1px solid #D4C4B0"}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-serif text-lg"
                      style={{background:"#F0EBE3", color:"#A8B5A2"}}>{p.name[0]}</div>
                    <p className="font-serif" style={{fontSize:"1.05rem", color:"#4E433B"}}>{p.name}</p>
                    <p style={{fontSize:".72rem", color:"#6B5E52", marginBottom:".6rem"}}>{p.label}</p>
                    <p style={{fontSize:".82rem", color:"#4E433B", marginBottom:".8rem"}}>{p.num}</p>
                    <div className="flex gap-2 justify-center">
                      <a href={`tel:${p.num.replace(/\s/g,"")}`}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs"
                        style={{background:"#F0EBE3", color:"#7A9172"}}>
                        <Phone className="w-3 h-3"/>Call
                      </a>
                      <a href={`https://wa.me/${p.wa}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-xs"
                        style={{background:"#F0EBE3", color:"#7A9172"}}>
                        <MessageCircle className="w-3 h-3"/>WA
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── DONE (just submitted or updated) ── */}
          {status === "done" && existing && (
            <motion.div key="done" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}}
              transition={{duration:.5}} className="text-center py-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{background:"#F0EBE3", border:"1px solid #A8B5A2"}}>
                <CheckCircle className="w-10 h-10" style={{color:"#A8B5A2"}} strokeWidth={1.5}/>
              </div>
              <h3 className="font-serif text-3xl font-light mb-2" style={{color:"#4E433B"}}>You're Confirmed!</h3>
              <p className="font-serif italic mb-8" style={{color:"#7A9172", fontSize:"1.1rem"}}>
                {existing.attending} seat{existing.attending !== 1 ? "s" : ""} reserved
              </p>
              <p className="font-serif" style={{fontSize:"1rem", color:"#6B5E52", lineHeight:1.9}}>
                Thank you so much, {existing.respondentName.split(" ")[0]}.<br/>
                We cannot wait to celebrate with you.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}
