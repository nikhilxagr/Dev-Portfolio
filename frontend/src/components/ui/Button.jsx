import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-50'

const variants = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]',
  secondary:
    'border border-slate-200 bg-slate-100 text-slate-900 hover:border-slate-300 hover:bg-slate-200/70 dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#222734]',
  ghost:
    'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.16] dark:hover:bg-[#1a1e28]',
}

const MotionLink = motion.create(Link)
const MotionAnchor = motion.a
const MotionButton = motion.button

const Button = ({
  children,
  className,
  variant = 'primary',
  to,
  href,
  target,
  rel,
  ...props
}) => {
  const classes = clsx(baseClass, variants[variant], className)
  const tapProps = {
    whileTap: { scale: 0.98 },
    transition: { duration: 0.12, ease: 'easeOut' },
  }

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...tapProps}>
        {children}
      </MotionLink>
    )
  }

  if (href) {
    return (
      <MotionAnchor href={href} target={target} rel={rel} className={classes} {...tapProps}>
        {children}
      </MotionAnchor>
    )
  }

  return (
    <MotionButton type="button" className={classes} {...tapProps} {...props}>
      {children}
    </MotionButton>
  )
}

export default Button
