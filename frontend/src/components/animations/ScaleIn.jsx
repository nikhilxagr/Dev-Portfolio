import { motion } from 'framer-motion'

const MotionDiv = motion.div

/**
 * ScaleIn — scale + fade entrance animation for cards and images.
 *
 * @param {number}  delay      - Stagger delay in seconds
 * @param {number}  fromScale  - Initial scale value (default 0.88)
 * @param {boolean} once       - Only animate once (default true)
 */
const ScaleIn = ({
  children,
  delay = 0,
  fromScale = 0.88,
  once = true,
  className = '',
  style = {},
}) => {
  return (
    <MotionDiv
      className={`transform-gpu will-change-transform ${className}`}
      style={style}
      initial={{ opacity: 0, scale: fromScale, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once, margin: "-50px 0px", amount: 0.12 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 24,
        mass: 0.9,
        delay,
      }}
    >
      {children}
    </MotionDiv>
  )
}

export default ScaleIn
