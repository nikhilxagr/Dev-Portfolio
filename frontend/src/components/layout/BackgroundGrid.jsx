import { motion } from 'framer-motion'

const MotionDiv = motion.div

const BackgroundGrid = () => {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-mesh-grid bg-[size:42px_42px] opacity-30" />
      <MotionDiv
        className="pointer-events-none fixed -left-24 top-28 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
      />
      <MotionDiv
        className="pointer-events-none fixed -right-24 bottom-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{ x: [0, -32, 0], y: [0, 24, 0] }}
        transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
      />
    </>
  )
}

export default BackgroundGrid
