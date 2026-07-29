import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-50 transform-gpu'

const variants = {
  primary: 'bg-cyan-300 text-slate-950 hover:bg-cyan-200 shadow-md hover:shadow-lg shadow-cyan-300/20',
  secondary:
    'border border-emerald-300/50 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20 shadow-sm',
  ghost:
    'border border-slate-400/70 bg-white/30 text-slate-800 hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-600 dark:bg-transparent dark:text-slate-100 dark:hover:border-cyan-300 dark:hover:text-cyan-100',
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
  const hoverTapProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.15, ease: 'easeOut' },
  }

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...hoverTapProps}>
        {children}
      </MotionLink>
    )
  }

  if (href) {
    return (
      <MotionAnchor href={href} target={target} rel={rel} className={classes} {...hoverTapProps}>
        {children}
      </MotionAnchor>
    )
  }

  return (
    <MotionButton type="button" className={classes} {...hoverTapProps} {...props}>
      {children}
    </MotionButton>
  )
}

export default Button

