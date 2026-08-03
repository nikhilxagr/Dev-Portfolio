export const slideLeft = (delay = 0, duration = 0.5, distance = 30) => ({
  initial: { opacity: 0, x: distance },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -distance },
  transition: { duration, ease: [0.25, 0.1, 0.25, 1], delay },
});

export const slideRight = (delay = 0, duration = 0.5, distance = 30) => ({
  initial: { opacity: 0, x: -distance },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: distance },
  transition: { duration, ease: [0.25, 0.1, 0.25, 1], delay },
});
