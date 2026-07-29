import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const MotionDiv = motion.div

/**
 * ScrollProgressBar — a thin reading progress bar fixed at the top of the viewport.
 * Uses Framer Motion useScroll + useSpring for buttery smooth animation.
 * Inspired by GitHub / YouTube / Vercel docs.
 */
const ScrollProgressBar = () => {
  const rawProgress = useMotionValue(0)

  // Spring-smooth the raw scroll value — feels physically real
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.4,
  })

  const rafRef = useRef(null)

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop || 0
      const scrollableHeight = doc.scrollHeight - doc.clientHeight

      if (scrollableHeight <= 0) {
        rawProgress.set(0)
        return
      }

      const progress = Math.min(1, Math.max(0, scrollTop / scrollableHeight))
      rawProgress.set(progress)
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateProgress)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [rawProgress])

  return (
    <MotionDiv
      className="fixed left-0 top-0 z-[9999] h-[3px] origin-left will-change-transform"
      style={{
        scaleX: smoothProgress,
        background:
          'linear-gradient(90deg, #22c55e 0%, #38bdf8 40%, #818cf8 80%, #a78bfa 100%)',
        boxShadow: '0 0 10px rgba(56,189,248,0.6), 0 0 20px rgba(34,197,94,0.35)',
      }}
    />
  )
}

export default ScrollProgressBar
