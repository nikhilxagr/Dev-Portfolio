import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * CountUp — animates a number from 0 to `end` when it enters the viewport.
 *
 * @param {number}  end       - Target number
 * @param {number}  duration  - Animation duration in ms (default 1800)
 * @param {string}  prefix    - Text before the number (e.g. '$')
 * @param {string}  suffix    - Text after the number (e.g. '+', '%')
 * @param {string}  className
 */
const CountUp = ({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const startVal = 0

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      const currentVal = Math.round(startVal + (end - startVal) * easedProgress)
      setCount(currentVal)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}

export default CountUp
