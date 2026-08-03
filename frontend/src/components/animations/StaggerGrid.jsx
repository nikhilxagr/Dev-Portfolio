import { motion } from 'framer-motion'
import { staggerContainer, staggerItem as itemVariant } from './motion/stagger.js'

const MotionDiv = motion.div

export const StaggerGrid = ({ children, className = '' }) => {
  return (
    <MotionDiv
      className={`transform-gpu ${className}`}
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px 0px", amount: 0.15 }}
    >
      {children}
    </MotionDiv>
  )
}

export const StaggerItem = ({ children, className = '' }) => {
  return (
    <MotionDiv
      className={`transform-gpu ${className}`}
      variants={itemVariant}
    >
      {children}
    </MotionDiv>
  )
}
