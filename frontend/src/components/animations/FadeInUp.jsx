import { motion } from 'framer-motion'

const MotionDiv = motion.div

const FadeInUp = ({ children, delay = 0, className = '' }) => {
  return (
    <MotionDiv
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </MotionDiv>
  )
}

export default FadeInUp
