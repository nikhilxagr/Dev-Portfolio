import { memo } from 'react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: 'easeOut',
    },
  },
}

const SectionTitle = ({
  eyebrow,
  title,
  description,
  className = '',
  mobileCenter = true,
  animate = true,
}) => {
  const alignmentClass = mobileCenter ? 'text-center sm:text-left' : ''
  const descriptionAlignmentClass = mobileCenter ? 'mx-auto sm:mx-0' : ''

  const content = (
    <div className={`relative ${alignmentClass} ${className}`.trim()}>
      {eyebrow ? (
        <motion.p
          variants={animate ? itemVariants : undefined}
          className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400"
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <motion.h2
        variants={animate ? itemVariants : undefined}
        className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] leading-[1.15] text-slate-900 dark:text-[#eef0f5] sm:text-4xl"
      >
        {title}
      </motion.h2>

      {description ? (
        <motion.p
          variants={animate ? itemVariants : undefined}
          className={`section-title-description mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8] sm:text-base ${descriptionAlignmentClass}`}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {content}
    </motion.div>
  )
}

const MemoizedSectionTitle = memo(SectionTitle)
MemoizedSectionTitle.displayName = 'SectionTitle'

export default MemoizedSectionTitle
