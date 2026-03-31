import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const MotionDiv = motion.div
const LOADER_STEPS = [10, 20, 30, 50, 70, 100]
const STEP_INTERVAL_MS = 360
const FINISH_DELAY_MS = 520

const PortfolioLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(LOADER_STEPS[0])

  useEffect(() => {
    let stepIndex = 0

    const intervalId = window.setInterval(() => {
      stepIndex += 1

      if (stepIndex >= LOADER_STEPS.length) {
        window.clearInterval(intervalId)
        return
      }

      setProgress(LOADER_STEPS[stepIndex])
    }, STEP_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (progress !== 100) {
      return
    }

    const finishTimeoutId = window.setTimeout(() => {
      onComplete?.()
    }, FINISH_DELAY_MS)

    return () => {
      window.clearTimeout(finishTimeoutId)
    }
  }, [onComplete, progress])

  return (
    <MotionDiv
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/95 backdrop-blur-md"
      initial={{ opacity: 0, scale: 1.015 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <MotionDiv
        className="flex w-[min(92vw,460px)] flex-col items-center gap-4 rounded-2xl border border-cyan-300/20 bg-slate-950/65 px-6 py-8 text-center shadow-[0_12px_40px_rgba(2,8,20,0.45)]"
        initial={{ scale: 0.985, opacity: 0 }}
        animate={progress === 100 ? { scale: [1, 1.018, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ duration: progress === 100 ? 0.34 : 0.24, ease: 'easeOut' }}
      >
        <MotionDiv
          className="h-20 w-20 rounded-full border-2 border-cyan-300/60 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        />

        <div>
          <p className="font-display text-xl uppercase tracking-[0.16em] text-cyan-100">Nikhil Agrahari</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
            Full Stack and Security Portfolio
          </p>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-400">
            <span>Loading Portfolio</span>
            <MotionDiv
              key={progress}
              className="font-display text-sm tracking-[0.16em] text-cyan-100"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {progress}%
            </MotionDiv>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full border border-cyan-300/25 bg-slate-900/85">
            <MotionDiv
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300"
              initial={{ width: '10%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
            {LOADER_STEPS.map((step) => (
              <span key={step} className={progress >= step ? 'text-emerald-200' : 'text-slate-600'}>
                {step}
              </span>
            ))}
          </div>
        </div>
      </MotionDiv>
    </MotionDiv>
  )
}

export default PortfolioLoader
