import { useEffect, useRef, useState } from 'react'
import { about, profile } from '../data'
import { APPS, appById } from './apps'
import { ask } from './brain'

const HELP = [
  'Commands:',
  '  help               show this list',
  '  whoami             who is Mohit?',
  '  ls                 list apps',
  '  open <app>         open an app, e.g. open projects',
  '  ask <question>     ask Orbit, the AI agent',
  '  cat about.txt      read the short bio',
  '  experience, projects, awards, skills, contact, resume',
  '  date · echo · clear · classic',
]

export default function Terminal({ openApp, focusSignal }) {
  const [lines, setLines] = useState([
    { kind: 'out', text: 'MohitOS terminal. Type `help` to see what you can do.' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [focusSignal])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [lines])

  const out = (...text) => text.map((t) => ({ kind: 'out', text: t }))

  function run(raw) {
    const cmd = raw.trim()
    const [name = '', ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ')
    const lower = name.toLowerCase() === 'orbit' ? 'agent' : name.toLowerCase()
    let result = []

    if (!cmd) result = []
    else if (lower === 'clear') {
      setLines([])
      return
    } else if (lower === 'help') result = out(...HELP)
    else if (lower === 'whoami') result = out(`mohit: ${profile.role} @ ${profile.company}, ${profile.location}`)
    else if (lower === 'ls') result = out(APPS.map((a) => `${a.id}.app`).join('   '), 'about.txt')
    else if (lower === 'cat') {
      result = arg === 'about.txt' ? out(about.statement) : out(`cat: ${arg || '(nothing)'}: no such file`)
    } else if (lower === 'open' || appById[lower]) {
      const target = lower === 'open' ? arg.toLowerCase().replace(/\.app$/, '') : lower
      const id = target === 'orbit' ? 'agent' : target
      if (appById[id]) {
        openApp(id)
        result = out(`opening ${appById[id].title}…`)
      } else result = out(`open: no such app: ${arg || '(nothing)'}. Try \`ls\`.`)
    } else if (lower === 'ask') {
      if (!arg) result = out('usage: ask <question>')
      else {
        const r = ask(arg)
        result = out(r.text)
        r.open.forEach((id, k) => setTimeout(() => openApp(id), 200 + k * 250))
      }
    } else if (lower === 'date') {
      result = out(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST')
    } else if (lower === 'echo') result = out(arg)
    else if (lower === 'classic') {
      window.location.href = '/classic'
      result = out('switching to the classic site…')
    } else if (lower === 'sudo') {
      if (/hire/i.test(arg)) {
        openApp('contact')
        result = out('[sudo] permission granted. Excellent decision. Opening Contact…')
      } else result = out('nice try. this incident will be reported.')
    } else if (lower === 'exit') result = out('there is no escape. Close the window instead.')
    else result = out(`command not found: ${name}. Type \`help\`.`)

    setLines((all) => [...all, { kind: 'in', text: cmd }, ...result])
    if (cmd) setHistory((h) => [cmd, ...h].slice(0, 50))
    setCursor(-1)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      setCursor(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(next)
      setInput(next >= 0 ? history[next] : '')
    }
  }

  return (
    <div className="term" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      {lines.map((l, i) =>
        l.kind === 'in' ? (
          <div className="term-line" key={i}>
            <span className="term-prompt">mohit@esko:~$</span> {l.text}
          </div>
        ) : (
          <div className="term-line term-out" key={i}>
            {l.text}
          </div>
        ),
      )}
      <form
        className="term-line term-form"
        onSubmit={(e) => {
          e.preventDefault()
          run(input)
          setInput('')
        }}
      >
        <label className="term-prompt" htmlFor="term-input">
          mohit@esko:~$
        </label>
        <input
          id="term-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </form>
      <div ref={endRef} />
    </div>
  )
}
