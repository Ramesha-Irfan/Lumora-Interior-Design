import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Plus, X, Calendar } from "lucide-react";
import { Link } from "wouter";
import { MOCK_PROJECTS } from "@/services/mockDashboardData";

export default function Projects() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [deleting, setDeleting] = useState<number | null>(null);

  function handleDelete(id: number) {
    setDeleting(id);
    setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleting(null);
    }, 300);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>Projects</p>
          <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Saved spaces</h1>
          <p className="text-sm mt-1" style={{ color: "#7A6D63" }}>{projects.length} project{projects.length !== 1 ? "s" : ""} saved</p>
        </div>
        <Link href="/studio">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-medium tracking-[0.15em] uppercase text-white"
            style={{ background: "#A78B75", borderRadius: 999 }}>
            <Plus className="w-4 h-4" /> New project
          </motion.button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16" style={{ color: "#8E8178" }}>
          <Folder className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No projects yet. Create your first one in the studio.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {projects.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: deleting === p.id ? 0 : 1, y: 0, scale: deleting === p.id ? 0.96 : 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05, duration: 0.25 }}
                className="overflow-hidden flex group relative"
                style={{ background: "#FAF7F2", borderRadius: 18, border: "1px solid rgba(22,19,19,0.06)" }}>
                <img src={p.imageUrl} alt={p.name} className="w-36 h-36 object-cover shrink-0" />
                <div className="p-5 flex flex-col justify-center min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="w-4 h-4" style={{ color: "#A78B75" }} />
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "#8E8178" }}>{p.style}</span>
                  </div>
                  <h3 className="font-heading text-lg font-light truncate" style={{ color: "#161313" }}>{p.name}</h3>
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#7A6D63" }}>
                    <Calendar className="w-3 h-3" />{p.date}
                  </p>
                </div>
                <button onClick={() => handleDelete(p.id)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(22,19,19,0.08)", borderRadius: 999, color: "#8E8178" }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
