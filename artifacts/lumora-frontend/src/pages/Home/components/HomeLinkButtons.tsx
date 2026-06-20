import { motion } from "framer-motion";
import { Link } from "wouter";

export function BtnPrimary({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ backgroundColor: "#8D705E", boxShadow: "0 12px 32px rgba(167,139,117,0.45)" }}
        whileTap={{ scale: 0.96 }}
        className="btn-lux btn-lux-primary"
        style={{ borderRadius: 999 }}
      >
        {children}
      </motion.button>
    </Link>
  );
}

export function BtnOutline({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{ borderColor: "rgba(255,255,255,0.45)", backgroundColor: "rgba(255,255,255,0.06)" }}
        whileTap={{ scale: 0.96 }}
        className="btn-lux btn-lux-outline"
        style={{ borderRadius: 999 }}
      >
        {children}
      </motion.button>
    </Link>
  );
}

