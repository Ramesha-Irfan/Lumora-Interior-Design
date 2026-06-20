import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: (i as number) * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Reveal({ children, className = "", delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial="hidden" animate={inView ? "show" : "hidden"}
      variants={fadeUp} custom={delay}>
      {children}
    </motion.div>
  );
}

