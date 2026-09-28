import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import 'lenis/dist/lenis.css'
import { Cursor, Footer, Preloader, ScrollProgress } from './components/Chrome'
import Nav from './components/Nav'
import Assistant from './components/Assistant'
import Hero from './components/Hero'
import CaseStudy from './components/CaseStudy'
import Impact from './components/Impact'
import Systems from './components/Systems'
import Work from './components/Work'
import { About, Beyond, Contact, Experience, Marquee, Recognition } from './components/Sections'

// Show the intro loader once per browser session.
function seenIntro() {
  try {
    return sessionStorage.getItem('intro-seen') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [loading, setLoading] = useState(() => !seenIntro())
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    // Touch devices already scroll smoothly; running Lenis there only adds a
    // permanent animation loop that competes with taps.
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    )
      return
    const instance = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { duration: 1.4 } })
    setLenis(instance)
    window.__lenis = instance
    return () => {
      instance.destroy()
      delete window.__lenis
    }
  }, [])

  useEffect(() => {
    if (!lenis) return
    loading ? lenis.stop() : lenis.start()
  }, [lenis, loading])

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem('intro-seen', '1')
    } catch {}
    window.scrollTo(0, 0)
    setLoading(false)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader onDone={finishIntro} />}</AnimatePresence>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <ScrollProgress />
      <Cursor />
      <div className="noise" aria-hidden="true" />
      <Nav />
      <main>
        <Hero ready={!loading} />
        <Marquee />
        <About />
        <Systems />
        <CaseStudy />
        <Impact />
        <Experience />
        <Work />
        <Recognition />
        <Beyond />
        <Contact />
      </main>
      <Footer />
      <Assistant />
      <Analytics />
      <SpeedInsights />
    </MotionConfig>
  )
}
