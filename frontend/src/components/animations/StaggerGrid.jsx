import { motion } from 'framer-motion'

const MotionDiv = motion.div

export const StaggerGrid = ({ children, className = '' }) => {
  return (
    <MotionDiv
      className={className}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </MotionDiv>
  )
}

export const StaggerItem = ({ children, className = '' }) => {
  return (
    <MotionDiv
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      }}
    >
      {children}
    </MotionDiv>
  )
}
