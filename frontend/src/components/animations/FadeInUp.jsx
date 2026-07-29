import { motion } from 'framer-motion'

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
  const yInit = direction === 'up' ? distance : -distance

  return (
    <MotionDiv
      className={`transform-gpu ${className}`}
      style={style}
      initial={{ opacity: 0, y: yInit }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // Apple Expo easeOut
        delay,
      }}
    >
      {children}
    </MotionDiv>
  )
}

export default FadeInUp

