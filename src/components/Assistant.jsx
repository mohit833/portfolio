import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data'
import { SUGGESTIONS, fallbackAnswer } from '../lib/fallback'
import { ease } from './motion'

const SECTION_LABELS = {
  about: 'About',
  skills: 'Skills',
  'case-study': 'Case study',
  impact: 'Proof',
  experience: 'Experience',
  work: 'Work',
  recognition: 'Awards',
  beyond: 'Beyond code',
  contact: 'Contact',
}

const NOTES = {
  claude: 'Answered by Claude, using only Mohit’s portfolio.',
  gemini: 'Answered by Gemini, using only Mohit’s portfolio.',
  scripted: 'Answering from a short scripted profile right now.',
  default: 'Answers use only what is on Mohit’s portfolio.',
}

const GREETING = {
  id: 'hello',
  role: 'assistant',
  text: `Ask me anything about ${profile.name.split(' ')[0]} — his work, his stack, or how to reach him. I will open the right part of the site as I answer.`,
  done: true,
}

function goToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.1 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [via, setVia] = useState(null)
  const logRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-assistant', onOpen)
    return () => window.removeEventListener('open-assistant', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  const send = useCallback(
    async (raw) => {
      const question = raw.trim()
      if (!question || busy) return
      setBusy(true)
      setInput('')
      const history = [...messages, { id: `u${Date.now()}`, role: 'user', text: question }]
      setMessages(history)

      let reply
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history.filter((m) => m.id !== 'hello').map((m) => ({ role: m.role, content: m.text })),
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.text) {
          setVia(data.via)
          reply = { text: data.text, section: data.section }
        }
        else if (res.status === 429) reply = { text: data.error, section: null }
        else {
          setVia('scripted')
          reply = fallbackAnswer(question)
        }
      } catch {
        setVia('scripted')
        reply = fallbackAnswer(question)
      }

      setMessages((all) => [
        ...all,
        { id: `a${Date.now()}`, role: 'assistant', text: reply.text, section: reply.section, done: true },
      ])
      setBusy(false)
      if (reply.section) setTimeout(() => goToSection(reply.section), 400)
    },
    [busy, messages],
  )

  return (
    <>
      <button className="assistant-fab" onClick={() => setOpen((o) => !o)} aria-label="Ask the assistant about Mohit">
        <span className="assistant-spark" aria-hidden="true">
          ✦
        </span>
        <span className="assistant-fab-label">Ask AI</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            className="assistant"
            role="dialog"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease }}
          >
            <header className="assistant-head">
              <span className="assistant-title">
                <span className="assistant-spark" aria-hidden="true">
                  ✦
                </span>
                Ask about Mohit
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close assistant">
                ✕
              </button>
            </header>

            <div className="assistant-log" ref={logRef} aria-live="polite">
              {messages.map((m) => (
                <div className={`assistant-msg is-${m.role}`} key={m.id}>
                  <p>{m.text}</p>
                  {m.section && SECTION_LABELS[m.section] && (
                    <button className="assistant-jump" onClick={() => goToSection(m.section)}>
                      ↳ {SECTION_LABELS[m.section]}
                    </button>
                  )}
                </div>
              ))}
              {busy && (
                <div className="assistant-msg is-assistant">
                  <span className="assistant-typing" aria-label="Thinking">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              )}
            </div>

            <div className="assistant-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} disabled={busy} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>

            <form
              className="assistant-input"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                aria-label="Ask a question about Mohit"
                maxLength={500}
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
                ↑
              </button>
            </form>
            <p className="assistant-note">{NOTES[via] ?? NOTES.default}</p>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
