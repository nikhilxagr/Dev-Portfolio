import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const MotionDiv = motion.div;

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 400, mass: 0.2 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    const timer = setTimeout(() => setIsVisible(true), 0);

    const updatePosition = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.closest("a, button, input, textarea, select, [role='button'], .interactive") !== null;
      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", updatePosition, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <MotionDiv
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          scale: isClicking ? 0.75 : isHovered ? 1.65 : 1,
          opacity: isHovered ? 0.55 : 0.35,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/50 bg-emerald-500/10 transform-gpu will-change-transform"
      />

      <MotionDiv
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 dark:bg-emerald-400 transform-gpu will-change-transform"
      />
    </>
  );
};

export default CustomCursor;
