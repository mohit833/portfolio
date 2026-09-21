import { useEffect, useRef, useState } from 'react'
import { ask, suggestions } from './brain'
import { appById } from './apps'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const GREETING = {
  id: 0,
  role: 'agent',
  text: "Hi, I'm Orbit, Mohit's AI agent. Ask me anything about his work and I'll pull it up for you.",
  tools: [],
  open: [],
  done: true,
}

export default function Agent({ openApp, mobile, focusSignal }) {
  const [msgs, setMsgs] = useState([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)
  const logRef = useRef(null)

  useEffect(() => {
    if (!mobile) inputRef.current?.focus({ preventScroll: true })
  }, [focusSignal, mobile])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  const update = (id, patch) =>
    setMsgs((all) => all.map((m) => (m.id === id ? { ...m, ...(typeof patch === 'function' ? patch(m) : patch) } : m)))

  async function send(raw) {
    const q = raw.trim()
    if (!q || busy) return
    setBusy(true)
    setInput('')
    const r = ask(q)
    const id = Date.now()
    setMsgs((all) => [
      ...all,
      { id: id - 1, role: 'user', text: q },
      {
        id,
        role: 'agent',
        text: '',
        done: false,
        open: r.open,
        tools: r.tools.map(([name, args]) => ({ name, args, done: false })),
      },
    ])

    await sleep(380)
    for (let i = 0; i < r.tools.length; i++) {
      await sleep(380 + Math.random() * 320)
      update(id, (m) => ({ tools: m.tools.map((t, j) => (j === i ? { ...t, done: true } : t)) }))
    }
    const words = r.text.split(' ')
    for (let i = 1; i <= words.length; i++) {
      update(id, { text: words.slice(0, i).join(' ') })
      await sleep(26)
    }
    update(id, { done: true })
    // The agent drives the OS: it opens the windows that answer the question.
    if (!mobile) r.open.forEach((app, k) => setTimeout(() => openApp(app), 150 + k * 260))
    setBusy(false)
  }

  return (
    <div className="agent">
      <div className="agent-log" ref={logRef} aria-live="polite">
        {msgs.map((m) =>
          m.role === 'user' ? (
            <div className="agent-msg is-user" key={m.id}>
              {m.text}
            </div>
          ) : (
            <div className="agent-msg is-bot" key={m.id}>
              {m.tools.length > 0 && (
                <div className="agent-tools">
                  {m.tools.map((t) => (
                    <div className={`agent-tool${t.done ? ' is-done' : ''}`} key={t.name + t.args}>
                      <span className="agent-tool-state">{t.done ? '✓' : <i className="agent-spin" />}</span>
                      <code>
                        {t.name}({t.args})
                      </code>
                    </div>
                  ))}
                </div>
              )}
              {m.text ? (
                <p>
                  {m.text}
                  {!m.done && <span className="agent-caret" />}
                </p>
              ) : (
                !m.done &&
                m.tools.every((t) => t.done) && (
                  <span className="agent-typing" aria-label="Thinking">
                    <i />
                    <i />
                    <i />
                  </span>
                )
              )}
              {m.done && m.open.length > 0 && (
                <div className="agent-opened">
                  {m.open.map((app) => (
                    <button key={app} onClick={() => openApp(app)}>
                      {mobile ? 'Open' : '↳ Opened'} {appById[app].title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
      </div>

      <div className="agent-suggest">
        {suggestions.map((s) => (
          <button key={s} disabled={busy} onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>

      <form
        className="agent-input"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Mohit…"
          aria-label="Ask a question about Mohit"
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
          ↑
        </button>
      </form>
      <p className="agent-note">Runs in your browser, using answers written from Mohit's portfolio.</p>
    </div>
  )
}
