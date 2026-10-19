import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BtnOutline, BtnPrimary } from "../components/HomeLinkButtons";
import { ROUTES } from "@/constants/routes";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex overflow-hidden" style={{ background: "#161313" }}>
      <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-36 w-full lg:w-[52%]">
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[11px] tracking-[0.32em] uppercase mb-8 font-medium"
          style={{ color: "#A78B75" }}
        >
          Premium Interior Design
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl md:text-6xl lg:text-7xl font-light leading-[1.04] tracking-[-0.01em] mb-8"
          style={{ color: "#FFFFFF" }}
        >
          Luxurious<br />
          comfort in a<br />
          <em className="not-italic font-light" style={{ color: "#A78B75" }}>refreshing</em><br />
          interior
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="w-10 h-px mb-7" style={{ background: "#A78B75" }} />

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }}
          className="text-sm leading-relaxed max-w-sm mb-12 font-light"
          style={{ color: "#CFC8C2" }}
        >
          Interior design is the art and science of enhancing the interior of a building to achieve a healthier and more aesthetically pleasing environment for the people using the space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-wrap items-center gap-4"
        >
          <BtnPrimary href={ROUTES.studio}>
            Explore Projects <ArrowRight className="w-3.5 h-3.5" />
          </BtnPrimary>
          <BtnOutline href={ROUTES.signup}>
            Contact Us
          </BtnOutline>
        </motion.div>

        <div className="hidden md:flex items-center gap-3 absolute left-20 bottom-12" style={{ color: "#8E8178" }}>
          <div className="w-px h-12" style={{ background: "rgba(255,255,255,0.12)" }} />
          <span className="text-[9px] tracking-[0.28em] uppercase">Scroll to Explore</span>
        </div>
      </div>

      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[50%] overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=90"
          alt="Luxury Interior"
          className="w-full h-full object-cover"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #161313 0%, rgba(22,19,19,0.3) 40%, transparent 100%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }}
          className="absolute bottom-14 left-10 px-7 py-5 shadow-lux"
          style={{ background: "#2A2320", borderRadius: 20 }}
        >
          <p className="text-[9px] tracking-[0.28em] uppercase mb-1.5" style={{ color: "#8E8178" }}>Satisfied Clients</p>
          <p className="font-heading text-3xl font-light" style={{ color: "#FFFFFF" }}>12,800<span style={{ color: "#A78B75" }}>+</span></p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.3 }}
          className="absolute top-24 right-10 px-5 py-3"
          style={{ background: "#A78B75", borderRadius: 999 }}
        >
          <p className="text-white text-[9px] tracking-[0.22em] uppercase font-medium">AI-Powered Design</p>
        </motion.div>
      </div>
    </section>
  );
}

