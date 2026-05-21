"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Phone, MessageCircle, Send, CheckCircle, Loader2, Edit3, HeartOff } from "lucide-react"

// ✏️ Your Google Apps Script URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwSKjD9q4IAnv80oUwZ2XOxV5zEzsCJTxVqYwo7yD1DF15GG3y9aYEsHvcFAE1zVyHt/exec"

type Status = "checking" | "clean" | "confirmed" | "declined" | "changing" | "done"

interface ExistingRSVP {
  attending: number
  respondentName: string
  phone: string
  lastUpdated: string
  rowIndex: number
  wasDeclined?: boolean
}

export function RSVPSection() {
  const searchParams = useSearchParams()
  const guestName    = searchParams.get("guest") || ""
  const guestPax     = parseInt(searchParams.get("pax") || "4")

  const [status,      setStatus]      = useState<Status>("checking")
  const [existing,    setExisting]    = useState<ExistingRSVP | null>(null)
  const [rowIndex,    setRowIndex]    = useState<number | null>(null)
  const [doneDeclined,setDoneDeclined]= useState(false)

  // Form fields
  const [name,       setName]       = useState(guestName)
  const [phone,      setPhone]      = useState("")
  const [count,      setCount]      = useState(String(guestPax))
  const [isAttending,setIsAttending]= useState(true)
  const [loading,    setLoading]    = useState(false)

  // ── Check sheet on load ──────────────────────────────────
  useEffect(() => {
    if (!guestName) { setStatus("clean"); return }

    const check = async () => {
      try {
        const res  = await fetch(
          `${GOOGLE_SHEET_URL}?action=check&guest=${encodeURIComponent(guestName)}`,
          { method: "GET", redirect: "follow" }
        )
        const data = await res.json()

        if (data.confirmed || data.declined) {
          const wasDeclined = data.declined === true || Number(data.attending) === 0
          setExisting({
            attending:      Number(data.attending),
            respondentName: String(data.respondentName || ""),
            phone:          String(data.phone          || ""),
            lastUpdated:    String(data.lastUpdated    || ""),
            rowIndex:       data.rowIndex,
            wasDeclined,
          })
          setRowIndex(data.rowIndex)
          setName(String(data.respondentName  || guestName))
          setPhone(String(data.phone          || ""))
          setCount(wasDeclined ? String(guestPax) : String(data.attending || guestPax))
          setIsAttending(!wasDeclined)
          setStatus(wasDeclined ? "declined" : "confirmed")
        } else {
          setRowIndex(data.rowIndex ?? null)
          setStatus("clean")
        }
      } catch {
        setStatus("clean")
      }
    }

    check()
  }, [guestName, guestPax])

  // ── Submit ───────────────────────────────────────────────
  async function handleSubmit() {
    if (!name.trim())           { alert("Please enter your name.");         return }
    if (!String(phone).trim())  { alert("Please enter your phone number."); return }

    setLoading(true)
    const attending = isAttending ? count : "0"

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
          attending,
          isDeclined:      !isAttending,
          timestamp:       new Date().toLocaleString("en-GB"),
          rowIndex:        rowIndex ?? null,
        }),
      })
    } catch (_) {}

    setLoading(false)
    setDoneDeclined(!isAttending)
    setExisting({
      attending:      isAttending ? parseInt(count) : 0,
      respondentName: name.trim(),
      phone:          String(phone).trim(),
      lastUpdated:    new Date().toLocaleString("en-GB"),
      rowIndex:       rowIndex ?? 0,
    })
    setStatus("done")
  }

  // ── Shared styles ────────────────────────────────────────
  const brideNumber = "+961 81 060 955"
  const groomNumber = "+961 76 441 334"

  const inputStyle: React.CSSProperties = {
    width:"100%", padding:".85rem 1rem",
    border:"1px solid #D4C4B0", background:"#fff",
    fontFamily:"var(--font-serif)", fontSize:"1.05rem",
    color:"#4E433B", borderRadius:0, outline:"none",
  }

  const ornRow = (icon = "✉") => (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px" style={{background:"linear-gradient(to right,transparent,#A8B5A2,transparent)"}}/>
      <span style={{color:"#A8B5A2",fontSize:".85rem"}}>{icon}</span>
      <div className="flex-1 h-px" style={{background:"linear-gradient(to right,transparent,#A8B5A2,transparent)"}}/>
    </div>
  )

  // ── Attend / Decline toggle ──────────────────────────────
  const AttendToggle = () => (
    <div className="mb-7">
      <label className="block text-xs tracking-[.35em] uppercase mb-3"
        style={{color:"#6B5E52", fontWeight:300}}>Will you be joining us?</label>
      <div className="grid grid-cols-2 gap-3">
        {/* Accept */}
        <button
          type="button"
          onClick={() => setIsAttending(true)}
          style={{
            padding:".85rem .5rem",
            background: isAttending ? "#A8B5A2" : "transparent",
            border: isAttending ? "1px solid #A8B5A2" : "1px solid #D4C4B0",
            color: isAttending ? "#2C241C" : "#6B5E52",
            fontFamily:"var(--font-sans)", fontWeight:300,
            fontSize:".58rem", letterSpacing:".3em", textTransform:"uppercase",
            cursor:"pointer", transition:"all .2s",
          }}
        >
          ✓ &nbsp;Accept
        </button>

        {/* Decline */}
        <button
          type="button"
          onClick={() => setIsAttending(false)}
          style={{
            padding:".85rem .5rem",
            background: !isAttending ? "#E8E0D8" : "transparent",
            border: !isAttending ? "1px solid #C4B8B0" : "1px solid #D4C4B0",
            color: !isAttending ? "#6B4E4E" : "#6B5E52",
            fontFamily:"var(--font-sans)", fontWeight:300,
            fontSize:".58rem", letterSpacing:".3em", textTransform:"uppercase",
            cursor:"pointer", transition:"all .2s",
          }}
        >
          ✗ &nbsp;Decline
        </button>
      </div>
    </div>
  )

  // ── Render ───────────────────────────────────────────────
  return (
    <section className="py-20 md:py-32" style={{background:"#F8F4EE"}} id="rsvp">
      <div className="container mx-auto px-4 max-w-lg">

        {ornRow()}
        <p className="text-center text-xs tracking-[.55em] uppercase mb-2 font-bold" style={{color:"#A8B5A2"}}>
          Kindly Reply By June 10, 2026
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-center font-light mb-2" style={{color:"#4E433B"}}>
          <em>RSVP</em>
        </h2>
        <div className="w-12 h-px mx-auto mb-10" style={{background:"#A8B5A2"}}/>

        <AnimatePresence mode="wait">

          {/* ── CHECKING ── */}
          {status === "checking" && (
            <motion.div key="checking" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{color:"#A8B5A2"}}/>
              <p className="text-xs tracking-[.3em] uppercase" style={{color:"#A8B5A2"}}>Checking your reservation…</p>
            </motion.div>
          )}

          {/* ── CONFIRMED ── */}
          {status === "confirmed" && existing && (
            <motion.div key="confirmed" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              transition={{duration:.5}}>
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
              <div className="mb-8 p-5" style={{background:"#FDFAF6",border:"1px solid #E0D8CC",borderLeft:"2px solid #A8B5A2"}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm flex-shrink-0"
                    style={{background:"#F0EBE3",color:"#7A9172"}}>
                    {existing.respondentName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-serif" style={{fontSize:"1.05rem",color:"#4E433B"}}>{existing.respondentName}</p>
                    <p style={{fontSize:".85rem",color:"#6B5E52"}}>{existing.phone}</p>
                  </div>
                </div>
                <div className="pt-3" style={{borderTop:"1px solid #E8E2D9"}}>
                  <p style={{fontSize:".55rem",letterSpacing:".3em",textTransform:"uppercase",color:"#A8B5A2"}}>
                    Updated: {existing.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 mb-8"
                style={{background:"#F0EBE3",border:"1px solid #D4C4B0"}}>
                <p style={{fontSize:".6rem",letterSpacing:".3em",textTransform:"uppercase",color:"#6B5E52"}}>Seats reserved</p>
                <p className="font-serif" style={{fontSize:"1.3rem",color:"#4E433B"}}>
                  {existing.attending} <span style={{color:"#A8B5A2",fontSize:".9rem"}}>/ {guestPax}</span>
                </p>
              </div>
              <div className="text-center" style={{borderTop:"1px solid #E8E2D9",paddingTop:"1.5rem"}}>
                <p style={{fontSize:".75rem",color:"#6B5E52",marginBottom:"1rem"}}>Need to make a change?</p>
                <button onClick={() => setStatus("changing")}
                  className="inline-flex items-center gap-2"
                  style={{fontFamily:"var(--font-sans)",fontWeight:300,fontSize:".62rem",letterSpacing:".35em",textTransform:"uppercase",color:"#7A9172",background:"transparent",border:"1px solid #A8B5A2",padding:".75rem 1.8rem",cursor:"pointer"}}>
                  <Edit3 className="w-3 h-3"/>Modify Reservation
                </button>
              </div>
            </motion.div>
          )}

          {/* ── DECLINED (previously sent regrets) ── */}
          {status === "declined" && existing && (
            <motion.div key="declined" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              transition={{duration:.5}} className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{background:"#F0EBE3",border:"1px solid #C4B8B0"}}>
                <HeartOff className="w-9 h-9" style={{color:"#B09090"}} strokeWidth={1.5}/>
              </div>
              <h3 className="font-serif text-3xl font-light mb-2" style={{color:"#4E433B"}}>You Sent Your Regrets</h3>
              <p className="font-serif italic mb-8" style={{color:"#8A7070",fontSize:"1rem"}}>
                Confirmed by {existing.respondentName}
              </p>
              <div className="p-6 mb-8 text-center"
                style={{background:"#FDFAF6",border:"1px solid #E0D8CC",borderLeft:"2px solid #C4B8B0"}}>
                <p className="font-serif italic" style={{fontSize:"1.05rem",color:"#6B5E52",lineHeight:2}}>
                  "We'll hold a place for you in our hearts on our special day."
                </p>
              </div>
              <div style={{borderTop:"1px solid #E8E2D9",paddingTop:"1.5rem"}}>
                <p style={{fontSize:".75rem",color:"#6B5E52",marginBottom:"1rem"}}>Changed your mind?</p>
                <button onClick={() => { setIsAttending(true); setCount(String(guestPax)); setStatus("changing") }}
                  className="inline-flex items-center gap-2"
                  style={{fontFamily:"var(--font-sans)",fontWeight:300,fontSize:".62rem",letterSpacing:".35em",textTransform:"uppercase",color:"#7A9172",background:"transparent",border:"1px solid #A8B5A2",padding:".75rem 1.8rem",cursor:"pointer"}}>
                  <Edit3 className="w-3 h-3"/>Update My RSVP
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
                  <p style={{fontSize:".6rem",letterSpacing:".35em",textTransform:"uppercase",color:"#A8B5A2"}}>
                    Updating your reservation
                  </p>
                  <button
                    onClick={() => setStatus(existing?.wasDeclined ? "declined" : "confirmed")}
                    style={{fontSize:".6rem",color:"#6B5E52",background:"none",border:"none",cursor:"pointer",letterSpacing:".1em"}}>
                    ← Cancel
                  </button>
                </div>
              )}

              {/* Attend / Decline toggle */}
              <AttendToggle />

              {/* Name */}
              <div className="mb-5">
                <label className="block text-xs tracking-[.35em] uppercase mb-2"
                  style={{color:"#6B5E52",fontWeight:300}}>Your Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Enter your name" style={inputStyle}
                  onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#A8B5A2"}
                  onBlur={e =>(e.target as HTMLInputElement).style.borderColor="#D4C4B0"}/>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <label className="block text-xs tracking-[.35em] uppercase mb-2"
                  style={{color:"#6B5E52",fontWeight:300}}>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+961 XX XXX XXX" style={inputStyle}
                  onFocus={e=>(e.target as HTMLInputElement).style.borderColor="#A8B5A2"}
                  onBlur={e =>(e.target as HTMLInputElement).style.borderColor="#D4C4B0"}/>
              </div>

              {/* Seat count — only shown when accepting */}
              <AnimatePresence>
                {isAttending && (
                  <motion.div className="mb-8"
                    initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
                    exit={{opacity:0,height:0}} transition={{duration:.25}}>
                    <label className="block text-xs tracking-[.35em] uppercase mb-2"
                      style={{color:"#6B5E52",fontWeight:300}}>Number of Guests Attending</label>
                    <div className="relative">
                      <select value={count} onChange={e => setCount(e.target.value)}
                        style={{...inputStyle, appearance:"none" as const}}>
                        {Array.from({length:guestPax},(_,i)=>i+1).map(n=>(
                          <option key={n} value={n}>{n===1?"1 Guest":`${n} Guests`}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{color:"#A8B5A2"}}>▾</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decline note shown below phone when declining */}
              <AnimatePresence>
                {!isAttending && (
                  <motion.div className="mb-8 p-4"
                    initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
                    exit={{opacity:0,height:0}} transition={{duration:.25}}
                    style={{background:"#F8F4EE",border:"1px solid #E0D8CC",borderLeft:"2px solid #C4B8B0"}}>
                    <p className="font-serif italic" style={{fontSize:".95rem",color:"#8A7070",lineHeight:1.9}}>
                      We completely understand, and we are so grateful you took the time to let us know.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 text-xs tracking-[.4em] uppercase font-light mb-8 disabled:opacity-60"
                style={{
                  background: isAttending ? "#A8B5A2" : "#C4B8B0",
                  color:"#2C241C",fontFamily:"var(--font-sans)",border:"none",cursor:"pointer",
                }}
                onMouseEnter={e=>{if(!loading)(e.currentTarget.style.background=isAttending?"#7A9172":"#A89090")}}
                onMouseLeave={e=>{e.currentTarget.style.background=isAttending?"#A8B5A2":"#C4B8B0"}}>
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin"/> Sending…</>
                  : isAttending
                    ? <><Send className="w-4 h-4"/>{status==="changing"?"Update Confirmation":"Confirm Attendance"}</>
                    : <><Send className="w-4 h-4"/>Send My Regrets</>
                }
              </button>

              {/* Phone contact strip */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px" style={{background:"#E8E2D9"}}/>
                <span className="text-xs tracking-widest uppercase" style={{color:"#A8B5A2"}}>or reach us</span>
                <div className="flex-1 h-px" style={{background:"#E8E2D9"}}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {label:"The Groom",name:"Rayan",num:groomNumber,wa:"96176441334"},
                  {label:"The Bride",name:"Razan",num:brideNumber,wa:"96181060955"},
                ].map(p=>(
                  <div key={p.name} className="p-5 text-center" style={{background:"#fff",border:"1px solid #D4C4B0"}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-serif text-lg"
                      style={{background:"#F0EBE3",color:"#A8B5A2"}}>{p.name[0]}</div>
                    <p className="font-serif" style={{fontSize:"1.05rem",color:"#4E433B"}}>{p.name}</p>
                    <p style={{fontSize:".72rem",color:"#6B5E52",marginBottom:".6rem"}}>{p.label}</p>
                    <p style={{fontSize:".82rem",color:"#4E433B",marginBottom:".8rem"}}>{p.num}</p>
                    <div className="flex gap-2 justify-center">
                      <a href={`tel:${p.num.replace(/\s/g,"")}`} className="flex items-center gap-1 px-3 py-1.5 text-xs"
                        style={{background:"#F0EBE3",color:"#7A9172"}}>
                        <Phone className="w-3 h-3"/>Call
                      </a>
                      <a href={`https://wa.me/${p.wa}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-xs"
                        style={{background:"#F0EBE3",color:"#7A9172"}}>
                        <MessageCircle className="w-3 h-3"/>WA
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── DONE ── */}
          {status === "done" && existing && (
            <motion.div key="done" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}}
              transition={{duration:.5}} className="text-center py-8">

              {doneDeclined ? (
                // ── Decline success ──
                <>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{background:"#F0EBE3",border:"1px solid #C4B8B0"}}>
                    <HeartOff className="w-9 h-9" style={{color:"#B09090"}} strokeWidth={1.5}/>
                  </div>
                  <h3 className="font-serif text-3xl font-light mb-6" style={{color:"#4E433B"}}>
                    We'll Miss You Dearly
                  </h3>
                  <div className="p-6 mb-6" style={{background:"#FDFAF6",border:"1px solid #E0D8CC",borderLeft:"2px solid #C4B8B0"}}>
                    <p className="font-serif italic" style={{fontSize:"1rem",color:"#6B5E52",lineHeight:2.1}}>
                      "We would have loved nothing more than to share this milestone with you,{" "}
                      {existing.respondentName.split(" ")[0]}.
                      Though you won't be with us in person, you'll be in our hearts throughout our special day."
                    </p>
                    <p className="font-serif mt-4" style={{fontSize:".9rem",color:"#A8B5A2"}}>
                      — Rayan &amp; Razan
                    </p>
                  </div>
                  <p style={{fontSize:".65rem",letterSpacing:".25em",textTransform:"uppercase",color:"#A8B5A2"}}>
                    Thank you for letting us know ♡
                  </p>
                </>
              ) : (
                // ── Confirm success ──
                <>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{background:"#F0EBE3",border:"1px solid #A8B5A2"}}>
                    <CheckCircle className="w-10 h-10" style={{color:"#A8B5A2"}} strokeWidth={1.5}/>
                  </div>
                  <h3 className="font-serif text-3xl font-light mb-2" style={{color:"#4E433B"}}>You're Confirmed!</h3>
                  <p className="font-serif italic mb-6" style={{color:"#7A9172",fontSize:"1.1rem"}}>
                    {existing.attending} seat{existing.attending!==1?"s":""} reserved
                  </p>
                  <p className="font-serif" style={{fontSize:"1rem",color:"#6B5E52",lineHeight:1.9}}>
                    Thank you so much, {existing.respondentName.split(" ")[0]}.<br/>
                    We cannot wait to celebrate with you.
                  </p>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}
