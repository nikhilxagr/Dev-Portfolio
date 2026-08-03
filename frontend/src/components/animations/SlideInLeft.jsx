import { motion } from 'framer-motion'

const MotionDiv = motion.div

/**
 * SlideInLeft — slides in from the left or right of the viewport.
 *
 * @param {string}  from      - 'left' | 'right' (default 'left')
 * @param {number}  distance  - Travel distance in px (default 50)
 * @param {number}  delay     - Stagger delay in seconds
 * @param {boolean} once      - Only animate once (default true)
 */
const SlideInLeft = ({
  children,
  from = 'left',
  distance = 50,
  delay = 0,
  once = true,
  className = '',
  style = {},
}) => {
  const xInit = from === 'left' ? -distance : distance

  return (
    <MotionDiv
      className={`transform-gpu will-change-transform ${className}`}
      style={style}
      initial={{ opacity: 0, x: xInit }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-50px 0px", amount: 0.15 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 26,
        mass: 0.8,
        delay,
      }}
    >
      {children}
    </MotionDiv>
  )
}

export default SlideInLeft
