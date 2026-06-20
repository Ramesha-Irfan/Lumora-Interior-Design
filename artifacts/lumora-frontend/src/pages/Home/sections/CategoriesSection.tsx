import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/constants/homePageData";
import { ROUTES } from "@/constants/routes";
import { Reveal } from "../components/Reveal";

export function CategoriesSection() {
  return (
    <section style={{ background: "#2A2320" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between py-10 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Reveal>
            <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "#8E8178" }}>Our Specialities</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href={ROUTES.gallery}>
              <motion.span whileHover={{ x: 4 }} className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-colors" style={{ color: "#A78B75" }}>
                View All <ArrowRight className="w-3 h-3" />
              </motion.span>
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-8">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.label} delay={i * 0.1}>
              <motion.div
                whileHover="hover"
                className="relative overflow-hidden cursor-pointer group"
                style={{ borderRadius: 24, minHeight: 380, border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <motion.img
                  src={cat.img} alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  variants={{ hover: { scale: 1.07 } }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #161313 20%, rgba(22,19,19,0.55) 60%, transparent 100%)" }} />
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ borderRadius: 24, border: "1.5px solid transparent" }}
                  variants={{ hover: { borderColor: "#A78B75" } }}
                  transition={{ duration: 0.35 }}
                />
                <motion.div
                  className="absolute inset-0"
                  variants={{ hover: { backgroundColor: "rgba(0,0,0,0.18)" } }}
                  initial={{ backgroundColor: "rgba(0,0,0,0)" }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-heading text-xl font-light text-white mb-1.5">{cat.label}</p>
                      <p className="text-xs leading-relaxed max-w-[160px]" style={{ color: "#CFC8C2" }}>{cat.desc}</p>
                    </div>
                    <motion.div
                      className="w-9 h-9 flex items-center justify-center shrink-0 mb-1 transition-colors"
                      style={{ borderRadius: 999, border: "1px solid rgba(167,139,117,0.5)", background: "transparent" }}
                      variants={{ hover: { backgroundColor: "#A78B75", borderColor: "#A78B75" } }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "#B8A08C" }} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

