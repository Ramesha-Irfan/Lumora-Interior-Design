import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { ROUTES } from "@/constants/routes";

export function BestInteriorSection() {
  return (
    <section className="py-28 border-t" style={{ background: "#FAF7F2", borderColor: "#D9D4CE" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal className="overflow-hidden shadow-lux" style={{ borderRadius: 24 }}>
            <motion.img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80" alt="Best Interior"
              className="w-full h-[520px] object-cover" whileHover={{ scale: 1.04 }} transition={{ duration: 0.8 }} />
          </Reveal>
          <div>
            <Reveal><p className="text-[9px] tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: "#A78B75" }}>Why Choose Us</p></Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-heading text-4xl md:text-5xl font-light leading-[1.1] mb-6" style={{ color: "#161313" }}>
                Discover the best<br />interior design for<br />
                <em className="not-italic" style={{ color: "#A78B75" }}>your sweet home</em>
              </h2>
            </Reveal>
            <Reveal delay={0.14}><div className="w-10 h-px mb-8" style={{ background: "#D9D4CE" }} /></Reveal>
            <Reveal delay={0.18}><p className="text-sm leading-relaxed max-w-md mb-4" style={{ color: "#5C5148" }}>
              Founded in 2021 having previously worked in the traditional and the serviced office world. We bring decades of professional experience to every project.
            </p></Reveal>
            <Reveal delay={0.22}><p className="text-sm leading-relaxed max-w-md mb-10" style={{ color: "#5C5148" }}>
              It is greatly important to us that we respond to the architecture, location, and context of each building — creating spaces where people truly belong.
            </p></Reveal>
            <Reveal delay={0.28}>
              <Link href={ROUTES.studio}>
                <motion.button
                  whileHover={{ backgroundColor: "#8D705E", boxShadow: "0 12px 32px rgba(167,139,117,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-lux btn-lux-primary" style={{ borderRadius: 999 }}
                >
                  Start Designing <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

