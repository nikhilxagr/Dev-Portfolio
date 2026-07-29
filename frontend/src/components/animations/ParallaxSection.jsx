import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const MotionDiv = motion.div

/**
 * ParallaxSection — scroll-driven parallax offset for backgrounds or elements.
 *
 * @param {number}  speed    - Parallax speed multiplier. Positive = slower (bg), negative = faster.
 *                             Typical values: 0.3 for slow bg, -0.2 for faster element.
 * @param {string}  className
 */
const ParallaxSection = ({
  children,
  speed = 0.3,
  className = '',
  style = {},
}) => {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Map scroll progress to a vertical translate value
  const yRange = speed * 120 // px of total movement
  const y = useTransform(scrollYProgress, [0, 1], [-yRange / 2, yRange / 2])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={style}>
      <MotionDiv style={{ y }} className="will-change-transform">
        {children}
      </MotionDiv>
    </div>
  )
}

export default ParallaxSection
