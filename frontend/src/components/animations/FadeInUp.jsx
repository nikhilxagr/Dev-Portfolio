import { motion } from 'framer-motion'
import { fadeUp, fadeDown } from './motion/fade.js'

const MotionDiv = motion.div

const FadeInUp = ({
  children,
  delay = 0,
  distance = 28,
  direction = 'up',
  once = true,
  className = '',
  style = {},
}) => {
  const variant = direction === 'up' ? fadeUp(delay, 0.7, distance) : fadeDown(delay, 0.7, distance)

  return (
    <MotionDiv
      className={`transform-gpu will-change-transform ${className}`}
      style={style}
      initial={variant.initial}
      whileInView={variant.animate}
      viewport={{ once, margin: "-50px 0px", amount: 0 }}
      transition={variant.transition}
    >
      {children}
    </MotionDiv>
  )
}

export default FadeInUp

