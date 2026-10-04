import { motion } from 'framer-motion'
import { fadeUp, fadeDown } from './motion/fade.js'

const MotionDiv = motion.div

const FadeInUp = ({
  children,
  delay = 0,
  distance = 0, // In-place steady fade: eliminates unsteady section sliding while scrolling
  direction = 'up',
  once = true,
  className = '',
  style = {},
}) => {
  // If a subtle micro-shift is requested (distance > 0), keep it tiny (e.g. 4-6px) and fast (0.22s)
  const variant = distance > 0
    ? (direction === 'up' ? fadeUp(delay, 0.22, distance) : fadeDown(delay, 0.22, distance))
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25, ease: "easeOut", delay },
      };

  return (
    <MotionDiv
      className={`transform-gpu will-change-transform ${className}`}
      style={style}
      initial={variant.initial}
      whileInView={variant.animate}
      viewport={{ once, margin: "0px", amount: 0.05 }}
      transition={variant.transition}
    >
      {children}
    </MotionDiv>
  );
};

export default FadeInUp

