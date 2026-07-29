import { motion } from 'framer-motion'

const MotionSpan = motion.span

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
    },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      mass: 0.6,
    },
  },
}

/**
 * RevealText — word-by-word staggered text reveal (like Framer.com).
 *
 * @param {string}    text       - The text to reveal
 * @param {string}    as         - HTML element tag (default 'p')
 * @param {number}    delay      - Initial delay before stagger begins
 * @param {boolean}   once       - Only animate once (default true)
 * @param {string}    className  - Wrapper class
 */
const RevealText = ({
  text = '',
  as: Tag = 'p',
  delay = 0,
  once = true,
  className = '',
}) => {
  const words = text.split(' ')

  return (
    <motion.div
      tag={Tag}
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.28em' }}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, i) => (
        <MotionSpan
          key={`${word}-${i}`}
          variants={wordVariants}
          style={{ display: 'inline-block' }}
        >
          {word}
        </MotionSpan>
      ))}
    </motion.div>
  )
}

export default RevealText
