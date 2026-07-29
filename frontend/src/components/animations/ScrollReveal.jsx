import { motion } from 'framer-motion'

const MotionDiv = motion.div

const VARIANTS = {
  up:    { hidden: { opacity: 0, y: 30 },              show: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -30 },             show: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -40 },             show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 },              show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.85 },        show: { opacity: 1, scale: 1 } },
  fade:  { hidden: { opacity: 0 },                     show: { opacity: 1 } },
  blur:  { hidden: { opacity: 0, filter: 'blur(8px)' },show: { opacity: 1, filter: 'blur(0px)' } },
}

const SPRING = {
  type: 'spring',
  stiffness: 240,
  damping: 26,
  mass: 0.7,
}

/**
 * ScrollReveal — universal scroll-triggered reveal HOC.
 *
 * @param {'up'|'down'|'left'|'right'|'scale'|'fade'|'blur'}  direction
 * @param {number}  delay    - Delay in seconds before animation starts
 * @param {boolean} once     - Only animate once (default true)
 * @param {number}  amount   - Viewport intersection threshold 0–1 (default 0.15)
 * @param {string}  className
 *
 * @example
 * <ScrollReveal direction="left" delay={0.1}>
 *   <MyCard />
 * </ScrollReveal>
 */
const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  once = true,
  amount = 0.15,
  className = '',
  style = {},
}) => {
  const variants = VARIANTS[direction] ?? VARIANTS.up

  return (
    <MotionDiv
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </MotionDiv>
  )
}

export default ScrollReveal
