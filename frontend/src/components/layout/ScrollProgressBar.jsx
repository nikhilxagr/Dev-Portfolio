import { useEffect, useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'

const MotionDiv = motion.div

/**
 * ScrollProgressBar — thin solid reading progress hairline fixed at the top of the viewport.
 */
const ScrollProgressBar = () => {
  const progress = useMotionValue(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop || 0
      const scrollableHeight = doc.scrollHeight - doc.clientHeight

      if (scrollableHeight <= 0) {
        progress.set(0)
        return
      }

      progress.set(Math.min(1, Math.max(0, scrollTop / scrollableHeight)))
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
  }, [progress])

  return (
    <MotionDiv
      className="fixed left-0 top-0 z-[9999] h-[2px] w-full origin-left bg-emerald-600 dark:bg-emerald-500 will-change-transform"
      style={{ scaleX: progress }}
    />
  )
}

export default ScrollProgressBar
