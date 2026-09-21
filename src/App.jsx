import { MotionConfig } from 'framer-motion'
import { Cursor, Footer, Nav, ScrollProgress } from './components/Chrome'
import Hero from './components/Hero'
import Projects from './components/Projects'
import { About, Beyond, Contact, Experience, Marquee, Recognition } from './components/Sections'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Cursor />
      <div className="noise" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
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
