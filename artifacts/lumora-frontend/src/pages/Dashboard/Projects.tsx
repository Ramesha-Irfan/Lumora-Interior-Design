import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Folder, Plus } from "lucide-react";
import { Link } from "wouter";
import { apiGet } from "@/services/api";

interface Project {
  id: number;
  name: string;
  style: string;
  imageUrl: string;
  date: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Project[]>("/projects")
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>Projects</p>
          <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Saved spaces</h1>
        </div>
        <Link href="/studio">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-medium tracking-[0.15em] uppercase text-white"
            style={{ background: "#A78B75", borderRadius: 999 }}>
            <Plus className="w-4 h-4" /> New project
          </motion.button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((n) => (
            <div key={n} className="overflow-hidden shadow-lux-sm flex animate-pulse h-36"
              style={{ background: "#FAF7F2", borderRadius: 18, border: "1px solid rgba(22,19,19,0.06)" }}>
              <div className="w-36 h-36 shrink-0" style={{ background: "#F5F1EC" }} />
              <div className="p-5 flex-1 space-y-3">
                <div className="h-3 rounded w-1/2" style={{ background: "#F5F1EC" }} />
                <div className="h-5 rounded w-3/4" style={{ background: "#F5F1EC" }} />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#8E8178" }}>
          <Folder className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No projects yet. Create your first one in the studio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="overflow-hidden shadow-lux-sm flex" style={{ background: "#FAF7F2", borderRadius: 18, border: "1px solid rgba(22,19,19,0.06)" }}>
              <img src={p.imageUrl} alt="" className="w-36 h-36 object-cover shrink-0" />
              <div className="p-5 flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Folder className="w-4 h-4" style={{ color: "#A78B75" }} />
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "#8E8178" }}>{p.style}</span>
                </div>
                <h3 className="font-heading text-lg font-light truncate" style={{ color: "#161313" }}>{p.name}</h3>
                <p className="text-xs mt-1" style={{ color: "#7A6D63" }}>{p.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
