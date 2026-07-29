import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 26,
      mass: 0.6,
    },
  },
}

const ruleVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 24,
      delay: 0.15,
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
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/35 dark:bg-emerald-300/10 dark:text-emerald-200 px-3 py-1 font-display text-[10px] uppercase tracking-[0.2em] sm:text-xs font-bold"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300" />
          {eyebrow}
        </motion.p>
      ) : null}

      <motion.h2
        variants={animate ? itemVariants : undefined}
        className="mt-3 font-display text-[1.9rem] font-semibold leading-tight text-slate-900 dark:text-cyan-50 sm:text-[2.35rem] lg:text-[2.8rem]"
      >
        {title}
      </motion.h2>

      <motion.span
        variants={animate ? ruleVariants : undefined}
        className="section-title-rule mt-4 inline-block h-px w-24 origin-left bg-gradient-to-r from-cyan-500/75 via-emerald-500/70 to-transparent dark:from-cyan-300/75 dark:via-emerald-300/70"
      />

      {description ? (
        <motion.p
          variants={animate ? itemVariants : undefined}
          className={`section-title-description mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8 ${descriptionAlignmentClass}`}
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

export default SectionTitle
