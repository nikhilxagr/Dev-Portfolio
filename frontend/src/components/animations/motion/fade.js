export const fadeIn = (delay = 0, duration = 0.5) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration, ease: "easeOut", delay },
});

export const fadeUp = (delay = 0, duration = 0.5, distance = 20) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -distance },
  transition: { duration, ease: [0.25, 0.1, 0.25, 1], delay },
});

export const fadeDown = (delay = 0, duration = 0.5, distance = 20) => ({
  initial: { opacity: 0, y: -distance },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: distance },
  transition: { duration, ease: [0.25, 0.1, 0.25, 1], delay },
});
