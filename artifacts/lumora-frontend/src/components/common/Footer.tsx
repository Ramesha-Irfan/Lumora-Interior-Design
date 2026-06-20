import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Services: ["Interior Design", "Room Redesign", "AI Studio", "3D Visualization", "Color Consulting"],
  Company: ["About", "Projects", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer style={{ background: "#120F0E" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="text-[9px] tracking-[0.28em] uppercase mb-3 font-medium" style={{ color: "#8E8178" }}>Stay Inspired</p>
            <h3 className="font-heading text-3xl md:text-4xl font-light text-white leading-snug">
              Get weekly design<br />
              <em className="not-italic" style={{ color: "#A78B75" }}>inspiration.</em>
            </h3>
          </div>
          <div className="flex items-stretch w-full md:w-auto max-w-sm overflow-hidden" style={{ borderRadius: 999 }}>
            <input
              type="email" placeholder="your@email.com"
              className="flex-1 px-6 py-3.5 text-sm text-white focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRight: "none", borderRadius: "999px 0 0 999px" }}
            />
            <motion.button
              whileHover={{ backgroundColor: "#8D705E" }}
              whileTap={{ scale: 0.97 }}
              className="px-5 flex items-center justify-center transition-colors duration-300"
              style={{ background: "#A78B75", borderRadius: "0 999px 999px 0" }}
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <Link href="/">
              <span className="font-heading text-2xl font-light tracking-[0.14em] lowercase cursor-pointer text-white">
                lumora<span style={{ color: "#A78B75" }}>.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mt-5 max-w-xs" style={{ color: "#8E8178" }}>
              We craft intelligent interior spaces where technology meets artistry. Luxury design, made accessible.
            </p>
            <div className="flex items-center gap-5 mt-8">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <motion.button key={i} whileHover={{ color: "#A78B75" }} transition={{ duration: 0.25 }}
                  className="transition-colors duration-300" style={{ color: "#8E8178" }}>
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-5" style={{ color: "#8E8178" }}>{group}</p>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link}>
                    <motion.span
                      whileHover={{ color: "#A78B75" }}
                      className="text-sm cursor-pointer transition-colors duration-300"
                      style={{ color: "#CFC8C2" }}
                    >
                      {link}
                    </motion.span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 mt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs tracking-wide" style={{ color: "#8E8178" }}>
            &copy; 2026 Lumora AI. All rights reserved.
          </p>
          <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(142,129,120,0.4)" }}>
            Premium Interior Design Studio
          </p>
        </div>
      </div>
    </footer>
  );
}

