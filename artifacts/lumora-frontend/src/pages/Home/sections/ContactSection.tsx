import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../components/Reveal";

export function ContactSection() {
  return (
    <section className="py-28" style={{ background: "#1B1715" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <Reveal><p className="text-[9px] tracking-[0.3em] uppercase mb-5 font-medium" style={{ color: "#A78B75" }}>Get In Touch</p></Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-heading text-4xl md:text-5xl font-light leading-snug mb-6 text-white">
                Let&apos;s create your<br />
                <em className="not-italic" style={{ color: "#A78B75" }}>dream space</em><br />
                together.
              </h2>
            </Reveal>
            <Reveal delay={0.14}><p className="text-sm leading-relaxed max-w-sm mb-12" style={{ color: "#CFC8C2" }}>
              Ready to transform your space? Reach out and one of our design consultants will be in touch within 24 hours.
            </p></Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-5">
                {[["Email", "hello@lumora.ai"], ["Studio", "Open Mon–Fri, 9am–6pm"], ["Location", "New York · London · Dubai"]].map(([label, val]) => (
                  <div key={label} className="flex items-center gap-5">
                    <span className="text-[9px] tracking-[0.22em] uppercase w-16 shrink-0" style={{ color: "#8E8178" }}>{label}</span>
                    <span className="text-sm" style={{ color: "#CFC8C2" }}>{val}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[{ label: "Full Name", placeholder: "John Smith", type: "text" }, { label: "Email", placeholder: "you@email.com", type: "email" }].map(f => (
                  <div key={f.label}>
                    <label className="block text-[9px] tracking-[0.22em] uppercase mb-2.5" style={{ color: "#8E8178" }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      className="w-full px-5 py-3.5 text-sm text-white focus:outline-none transition-colors duration-300"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14 }}
                      onFocus={e => (e.target.style.borderColor = "rgba(167,139,117,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.22em] uppercase mb-2.5" style={{ color: "#8E8178" }}>Subject</label>
                <input type="text" placeholder="Interior Design Consultation"
                  className="w-full px-5 py-3.5 text-sm text-white focus:outline-none transition-colors duration-300"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14 }}
                  onFocus={e => (e.target.style.borderColor = "rgba(167,139,117,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.22em] uppercase mb-2.5" style={{ color: "#8E8178" }}>Message</label>
                <textarea rows={5} placeholder="Tell us about your project..."
                  className="w-full px-5 py-3.5 text-sm text-white resize-none focus:outline-none transition-colors duration-300"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14 }}
                  onFocus={e => (e.target.style.borderColor = "rgba(167,139,117,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
              <motion.button
                whileHover={{ backgroundColor: "#8D705E", boxShadow: "0 12px 32px rgba(167,139,117,0.45)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full btn-lux btn-lux-primary justify-center"
                style={{ borderRadius: 999 }}
              >
                Send Message <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

