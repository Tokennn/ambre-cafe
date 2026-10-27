import { useId } from 'react'

type LogoProps = { className?: string }

// Coffee bean: a tilted oval with an S-shaped crease cut out of it
const CREASE = 'M28 7C20 14 30 22 24.5 28S18 36 21 41'

export function Logo({ className }: LogoProps) {
  const maskId = useId()

  return (
    <svg viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <mask id={maskId}>
        <rect width="49" height="48" fill="white" />
        <path d={CREASE} stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      </mask>
      <ellipse cx="24.5" cy="24" rx="16" ry="22" transform="rotate(30 24.5 24)" fill="white" mask={`url(#${maskId})`} />
    </svg>
  )
}
