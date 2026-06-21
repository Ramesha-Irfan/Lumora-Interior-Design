import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, Download, Trash2 } from "lucide-react";
import { MOCK_FAVORITES } from "@/services/mockDashboardData";

export default function Favorites() {
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);
  const [q, setQ] = useState("");

  const items = favorites.filter((f) => f.title.toLowerCase().includes(q.toLowerCase()));

  async function handleDownload(imageUrl: string, title: string) {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    }
  }

  function handleRemove(id: number) {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>Favorites</p>
        <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Saved inspiration</h1>
        <p className="text-sm mt-1" style={{ color: "#7A6D63" }}>{favorites.length} item{favorites.length !== 1 ? "s" : ""} saved</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8E8178" }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search favorites…"
          className="w-full pl-11 pr-4 py-3 text-sm focus:outline-none transition-colors"
          style={{ background: "#FAF7F2", border: "1px solid rgba(22,19,19,0.08)", borderRadius: 14, color: "#161313" }}
          onFocus={e => (e.target.style.borderColor = "rgba(167,139,117,0.4)")}
          onBlur={e => (e.target.style.borderColor = "rgba(22,19,19,0.08)")} />
      </div>

      {favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16" style={{ color: "#8E8178" }}>
          <Star className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No favorites yet. Save designs you love from the gallery.</p>
        </motion.div>
      ) : items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12" style={{ color: "#8E8178" }}>
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No results for "{q}"</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <AnimatePresence>
            {items.map((g, i) => (
              <motion.div key={g.id} layout
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="overflow-hidden group"
                style={{ borderRadius: 18, border: "1px solid rgba(22,19,19,0.06)" }}>
                <div className="relative overflow-hidden">
                  <img src={g.imageUrl} alt={g.title} className={`w-full object-cover ${g.height} transition-transform duration-500 group-hover:scale-105`} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(22,19,19,0.6) 0%, transparent 50%)" }} />
                  <button type="button"
                    className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center"
                    style={{ background: "rgba(22,19,19,0.55)", borderRadius: 999 }}>
                    <Star className="w-4 h-4" fill="#A78B75" style={{ color: "#A78B75" }} />
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between" style={{ background: "#FAF7F2" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#161313" }}>{g.title}</p>
                    <p className="text-xs" style={{ color: "#8E8178" }}>{g.type}</p>
                  </div>
                  <div className="flex gap-1">
                    <button type="button"
                      onClick={() => handleDownload(g.imageUrl, g.title)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "#8E8178" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#A78B75")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#8E8178")}
                      title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button type="button"
                      onClick={() => handleRemove(g.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "#8E8178" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#F87171")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#8E8178")}
                      title="Remove from favorites">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
