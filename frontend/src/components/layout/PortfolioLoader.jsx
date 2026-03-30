import { motion } from 'framer-motion'

const MotionDiv = motion.div

const PortfolioLoader = () => {
  return (
    <MotionDiv
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/95 backdrop-blur-md"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <MotionDiv
          className="h-20 w-20 rounded-full border-2 border-cyan-300/60 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.05, ease: 'linear' }}
        />
        <div>
          <p className="font-display text-xl uppercase tracking-[0.16em] text-cyan-100">Nikhil Agrahari</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
            Full Stack and Security Portfolio
          </p>
        </div>
      </div>
    </MotionDiv>
  )
}

export default PortfolioLoader
