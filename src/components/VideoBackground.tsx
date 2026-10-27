import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'

type VideoBackgroundProps = {
  sources: { src: string; poster: string }[]
  videoRefs: RefObject<(HTMLVideoElement | null)[]>
}

const PARALLAX_PX = 24

export function VideoBackground({ sources, videoRefs }: VideoBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Cursor parallax: the background drifts opposite to the pointer
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const xTo = gsap.quickTo(wrapper, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(wrapper, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      xTo(x * -PARALLAX_PX)
      yTo(y * -PARALLAX_PX)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="bg-wrapper" ref={wrapperRef}>
      {sources.map(({ src, poster }, i) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[i] = el
          }}
          src={src}
          poster={poster}
          preload="auto"
          muted
          playsInline
        />
      ))}
    </div>
  )
}
