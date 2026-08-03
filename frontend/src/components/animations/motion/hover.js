export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2, ease: "easeOut" } },
  whileTap: { y: 0, scale: 0.98 },
};

export const hoverScale = {
  whileHover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } },
  whileTap: { scale: 0.97 },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};
