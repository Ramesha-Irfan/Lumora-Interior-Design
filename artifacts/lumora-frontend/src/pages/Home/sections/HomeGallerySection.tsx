import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { HOME_GALLERY } from "@/constants/homePageData";
import { ROUTES } from "@/constants/routes";
import { Reveal } from "../components/Reveal";

export function HomePortfolioSection() {
  return (
    <section className="py-28" style={{ background: "#161313" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <Reveal>
            <p className="text-[9px] tracking-[0.3em] uppercase mb-3 font-medium" style={{ color: "#8E8178" }}>Portfolio</p>
            <h2 className="font-heading text-4xl md:text-5xl font-light leading-tight text-white">
              Our finest<br />
              <em className="not-italic" style={{ color: "#A78B75" }}>creations</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <Link href={ROUTES.gallery}>
              <motion.span whileHover={{ x: 4 }} className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-colors duration-300" style={{ color: "#A78B75" }}>
                View All Projects <ArrowRight className="w-3 h-3" />
              </motion.span>
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-3 gap-4" style={{ gridAutoRows: "200px" }}>
          {HOME_GALLERY.map((item, i) => (
            <Reveal key={i} delay={i * 0.07}
              className={`overflow-hidden group relative cursor-pointer ${item.tall ? "row-span-2" : "row-span-1"}`}
              style={{ borderRadius: 24 }}
            >
              <motion.img src={item.img} alt={item.label} className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} />
              <motion.div
                className="absolute inset-0 flex items-end p-5"
                style={{ background: "rgba(0,0,0,0.25)", borderRadius: 24 }}
                initial={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.45)" }}
                transition={{ duration: 0.35 }}
              >
                <motion.p className="text-white text-sm font-light tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</motion.p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

