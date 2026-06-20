import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/gallery" },
  { label: "Studio", href: "/studio" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={scrolled ? {
        background: "rgba(22,19,19,0.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 8px 32px rgba(20,15,10,0.25)",
      } : {
        background: "transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/">
          <motion.div whileHover={{ opacity: 0.75 }} transition={{ duration: 0.3 }} className="cursor-pointer">
            <span className="font-heading text-xl font-light tracking-[0.16em] lowercase text-white">
              lumora<span style={{ color: "#A78B75" }}>.</span>
            </span>
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const active = link.href === "/" ? location === "/" : location.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className="relative text-[10px] font-medium tracking-[0.2em] uppercase cursor-pointer transition-colors duration-400 group"
                  style={{ color: active ? "#FAF7F2" : "rgba(250,247,242,0.45)" }}
                  whileHover={{ color: "#FAF7F2" }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-px transition-all duration-400"
                    style={{
                      width: active ? "100%" : "0%",
                      background: "#A78B75",
                    }}
                  />
                </motion.span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-5">
          <Link href="/login">
            <motion.span
              className="text-[10px] font-medium tracking-[0.18em] uppercase cursor-pointer transition-colors duration-300"
              style={{ color: "rgba(250,247,242,0.45)" }}
              whileHover={{ color: "#FAF7F2" }}
            >
              Sign In
            </motion.span>
          </Link>
          <Link href="/signup">
            <motion.button
              whileHover={{ backgroundColor: "#8D705E", boxShadow: "0 8px 24px rgba(167,139,117,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-lux btn-lux-primary"
              style={{ borderRadius: 999, paddingTop: 10, paddingBottom: 10 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>

        <button className="md:hidden transition-colors duration-200" onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "rgba(250,247,242,0.65)" }}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(22,19,19,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="px-8 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span onClick={() => setMenuOpen(false)}
                    className="block text-sm font-medium tracking-[0.18em] uppercase cursor-pointer transition-colors duration-200"
                    style={{ color: "rgba(250,247,242,0.5)" }}>
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
              <Link href="/login">
                <span onClick={() => setMenuOpen(false)}
                  className="block text-sm font-medium tracking-[0.18em] uppercase cursor-pointer transition-colors duration-200"
                  style={{ color: "rgba(250,247,242,0.4)" }}>
                  Sign In
                </span>
              </Link>
              <Link href="/signup">
                <button onClick={() => setMenuOpen(false)} className="w-full btn-lux btn-lux-primary justify-center" style={{ borderRadius: 999 }}>
                  Get Started Free
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

