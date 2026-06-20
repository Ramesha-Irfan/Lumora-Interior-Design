import { motion } from "framer-motion";
import { Reveal } from "../components/Reveal";

export function ProcessSection() {
  const steps = [
    { num: "01", label: "Planning", desc: "This is where designer meets with the client to discuss their needs, preferences and so on. Every detail matters — from materials to mood." },
    { num: "02", label: "Estimating", desc: "This involves determining the anticipated costs associated with the project, ensuring it aligns with the client's budget and expectations." },
    { num: "03", label: "Building", desc: "Designer begins to procure all the necessary materials, furnishings, fixtures and coordinates with contractors to bring the vision to life." },
  ];
  return (
    <section className="py-28" style={{ background: "#F5F1EC" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <p className="text-[9px] tracking-[0.3em] uppercase mb-10 font-medium" style={{ color: "#A78B75" }}>Our Process</p>
            </Reveal>
            <div>
              {steps.map((step, i) => (
                <Reveal key={step.num} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ x: 6, backgroundColor: "#FAF7F2" }}
                    className="border-t py-8 cursor-default group px-4 transition-all duration-300"
                    style={{ borderColor: "#D9D4CE", borderRadius: 12 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="flex items-start gap-8">
                      <div className="shrink-0">
                        <p className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "#A78B75" }}>Step {step.num}</p>
                        <h3 className="font-heading text-2xl font-light group-hover:text-[#A78B75] transition-colors duration-300" style={{ color: "#161313" }}>{step.label}</h3>
                      </div>
                      <p className="text-sm leading-relaxed flex-1 mt-1" style={{ color: "#7A6D63" }}>{step.desc}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
              <div className="border-t" style={{ borderColor: "#D9D4CE" }} />
            </div>
          </div>

          <div>
            <Reveal delay={0.08}>
              <h2 className="font-heading text-4xl md:text-5xl font-light leading-snug mb-4" style={{ color: "#161313" }}>
                See how we <em className="not-italic" style={{ color: "#A78B75" }}>work</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-sm leading-relaxed max-w-sm mb-10" style={{ color: "#5C5148" }}>
                Let's see how we are working. Discover the best interior design for your sweet home — a seamless journey from imagination to reality.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="overflow-hidden shadow-lux" style={{ borderRadius: 24 }}>
              <motion.img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" alt="How we work"
                className="w-full h-80 object-cover" whileHover={{ scale: 1.04 }} transition={{ duration: 0.75 }} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

