import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { HOME_TESTIMONIALS } from "@/constants/homePageData";
import { Reveal } from "../components/Reveal";

export function TestimonialsSection() {
  return (
    <section className="py-28" style={{ background: "#EFE7DD" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-[9px] tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A78B75" }}>Testimonials</p>
            <h2 className="font-heading text-4xl md:text-5xl font-light leading-snug" style={{ color: "#161313" }}>
              What our clients<br />
              <em className="not-italic" style={{ color: "#A78B75" }}>are saying</em>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOME_TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(20,15,10,0.14)" }}
                transition={{ duration: 0.4 }}
                className="glass-light p-8 shadow-lux-sm"
                style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,0.35)" }}
              >
                <Quote className="w-6 h-6 mb-5" style={{ color: "#B8A08C" }} />
                <p className="text-sm leading-relaxed mb-7 italic" style={{ color: "#5C5148" }}>&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5" fill="#A78B75" style={{ color: "#A78B75" }} />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center text-sm font-medium" style={{ background: "#D9D4CE", color: "#1B1B1B", borderRadius: 999 }}>
                    {t.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#161313" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#8E8178" }}>{t.role}</p>
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

