import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { Cursor, Footer, Nav, Preloader, ScrollProgress } from './components/Chrome'
import Hero from './components/Hero'
import Projects from './components/Projects'
import { About, Beyond, Contact, Experience, Expertise, Marquee, Recognition } from './components/Sections'

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const instance = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { duration: 1.4 } })
    setLenis(instance)
    return () => instance.destroy()
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
      <ScrollProgress />
      <Cursor />
      <div className="noise" aria-hidden="true" />
      <Nav />
      <main>
        <Hero ready={!loading} />
        <Marquee />
        <About />
        <Expertise />
        <Experience />
        <Projects />
        <Recognition />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
