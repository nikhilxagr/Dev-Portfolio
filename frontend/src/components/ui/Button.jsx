import clsx from 'clsx'
import { Link } from 'react-router-dom'

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-50'

const variants = {
  primary: 'bg-cyan-300 text-slate-950 hover:bg-cyan-200',
  secondary:
    'border border-emerald-300/50 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20',
  ghost:
    'border border-slate-400/70 bg-white/30 text-slate-800 hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-600 dark:bg-transparent dark:text-slate-100 dark:hover:border-cyan-300 dark:hover:text-cyan-100',
}

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

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
