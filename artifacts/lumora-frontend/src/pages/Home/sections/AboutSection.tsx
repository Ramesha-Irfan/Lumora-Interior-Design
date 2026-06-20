import { motion } from "framer-motion";
import { Reveal } from "../components/Reveal";

export function AboutSection() {
  return (
    <section className="py-28" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <Reveal>
              <p className="text-[9px] tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: "#A78B75" }}>Who We Are</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light leading-[1.08] tracking-[-0.01em] mb-8" style={{ color: "#161313" }}>
                A team of skilled,<br />
                enthusiasts providing<br />
                <em className="not-italic" style={{ color: "#A78B75" }}>high-quality</em> solutions.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="w-10 h-px mb-8" style={{ background: "#D9D4CE" }} />
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: "#5C5148" }}>
                Founded in 2021, Lumora AI was born from the belief that exceptional interior design should be accessible to everyone. We combine cutting-edge AI with decades of design expertise to deliver spaces that breathe luxury.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="text-sm leading-relaxed max-w-md mb-12" style={{ color: "#5C5148" }}>
                It is greatly important to us that we respond to the architecture, location, and context of each building. We believe a real sense of ownership creates exceptional spaces.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="flex items-center gap-10 pb-10 border-b" style={{ borderColor: "#D9D4CE" }}>
                {[["98%", "Client Satisfaction"], ["12K+", "Rooms Designed"], ["50+", "Design Styles"]].map(([val, label]) => (
                  <div key={label}>
                    <p className="font-heading text-3xl font-light mb-1" style={{ color: "#161313" }}>{val}</p>
                    <p className="text-[9px] tracking-[0.16em] uppercase" style={{ color: "#8E8178" }}>{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative h-[540px]">
            <Reveal delay={0.15} className="absolute top-0 right-0 w-[72%] h-[78%] overflow-hidden shadow-lux" style={{ borderRadius: 24 }}>
              <motion.img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80" alt="About" className="w-full h-full object-cover"
                whileHover={{ scale: 1.04 }} transition={{ duration: 0.75 }} />
            </Reveal>
            <Reveal delay={0.28} className="absolute bottom-0 left-0 w-[52%] h-[50%] overflow-hidden shadow-lux" style={{ borderRadius: 24, border: "4px solid #FAF7F2" }}>
              <motion.img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" alt="Kitchen" className="w-full h-full object-cover"
                whileHover={{ scale: 1.04 }} transition={{ duration: 0.75 }} />
            </Reveal>
            <Reveal delay={0.4} className="absolute bottom-28 right-4 px-5 py-4 shadow-lux" style={{ background: "#161313", borderRadius: 16 }}>
              <p className="text-[8px] tracking-[0.25em] uppercase mb-1" style={{ color: "#A78B75" }}>Award</p>
              <p className="text-white text-xs font-medium">Best AI Design</p>
              <p className="text-[9px]" style={{ color: "#8E8178" }}>Platform 2024</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

