import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { BrandHeader, NavHeader } from './components/Header'
import { Features, HeroCard, Mission, Newsletter } from './components/Sections'
import { VideoBackground } from './components/VideoBackground'
import { useScrubVideos } from './hooks/useScrubVideos'

gsap.registerPlugin(ScrollTrigger)

const isMobile = window.matchMedia('(max-width: 768px)').matches
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Phones get 720p encodes (~40% of the weight); posters cover the first paint
const VIDEOS = [1, 2, 3].map((n) => ({
  src: `/videos/bloom-${n}${isMobile ? '-mobile' : ''}.mp4`,
  poster: `/videos/bloom-${n}-poster.jpg`,
}))

// Hidden state shared by every reveal. With reduced motion only the fade remains.
const motion = reduceMotion ? 0 : 1
const hidden = (blur: number, x = 0, y = 0) => ({
  autoAlpha: 0,
  filter: `blur(${blur * motion}px)`,
  x: x * motion,
  y: y * motion,
})
const sharp = { autoAlpha: 1, x: 0, y: 0, filter: 'blur(0px)' }

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const { videoRefs, ready, error, update } = useScrubVideos(VIDEOS.length)

  useLayoutEffect(() => {
    // Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
    const lenis = new Lenis({ lerp: reduceMotion ? 1 : 0.08 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // One timeline spanning the whole page: position 0 = top, 1 = bottom
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => update(self.progress),
        },
      })

      // Intro: hero card, nav and brand drift away
      tl.fromTo('.premium-botanical-card', sharp, { ...hidden(16, -35, 35), duration: 0.15 }, 0)
        .fromTo('.premium-header-nav', sharp, { ...hidden(14, 0, -35), duration: 0.15 }, 0.03)
        .fromTo('.premium-brand-header', sharp, { ...hidden(12, -25, -35), duration: 0.15 }, 0.06)

      // Feature cards: staggered entrance, then exit after the first video
      const cards = gsap.utils.toArray<HTMLElement>('.premium-feature-card')
      const cardMotion = [
        { x: -35, enter: 0.15, enterDur: 0.15, exitDur: 0.12 },
        { x: 0, enter: 0.18, enterDur: 0.13, exitDur: 0.15 },
        { x: 35, enter: 0.21, enterDur: 0.11, exitDur: 0.18 },
      ]
      cards.forEach((card, i) => {
        const m = cardMotion[i]
        tl.fromTo(card, hidden(16, m.x, 35), { ...sharp, duration: m.enterDur }, m.enter)
          .to(card, { ...hidden(16, m.x, 35), duration: m.exitDur }, 0.333)
      })

      // Mission paragraphs: rise in, hold, rise out
      const paras = gsap.utils.toArray<HTMLElement>('.mission-para')
      const paraStarts = [0.44, 0.62, 0.8]
      paras.forEach((para, i) => {
        const start = paraStarts[i]
        tl.fromTo(para, hidden(20, 0, 120), { ...sharp, duration: 0.03 }, start)
          .to(para, { ...hidden(20, 0, -120), duration: 0.03 }, start + 0.15)
      })

      // Newsletter form lands at the very end
      tl.fromTo('.feedback-form-card', hidden(20, 0, 120), { ...sharp, duration: 0.03 }, 0.94)

      // Pad the timeline so positions above map exactly onto scroll progress
      tl.set({}, {}, 1)
    }, rootRef)

    update(0)

    return () => {
      ctx.revert()
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  function explore() {
    lenisRef.current?.scrollTo(window.innerHeight * 0.9)
  }

  return (
    <div className="scroll-container" ref={rootRef}>
      <main className="fixed-viewport">
        <BrandHeader />
        <NavHeader />
        <HeroCard onExplore={explore} />
        <Features />
        <Mission />
        <Newsletter />
        <VideoBackground sources={VIDEOS} videoRefs={videoRefs} />

        <div className={`loading-screen${ready ? ' hidden' : ''}`} role="status" aria-live="polite">
          <svg className="loading-spinner" viewBox="0 0 64 64" aria-hidden="true">
            <circle className="loading-spinner-track" cx="32" cy="32" r="28" strokeWidth="2" fill="transparent" />
            <circle
              className="loading-spinner-arc" cx="32" cy="32" r="28" strokeWidth="3" fill="transparent"
              strokeDasharray="176" strokeDashoffset="132" strokeLinecap="round"
            />
          </svg>
          <p className="loading-text">Préparation de votre café</p>
        </div>

        <div className={`error-screen${error ? ' show' : ''}`} role="alert">
          <div className="error-card">
            <p className="error-title">Erreur de chargement</p>
            <p className="error-msg">Impossible de charger les vidéos. Vérifiez votre connexion et rechargez la page.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
