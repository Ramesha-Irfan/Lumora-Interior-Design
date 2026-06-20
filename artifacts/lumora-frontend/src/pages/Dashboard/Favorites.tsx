import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, Download, Trash2 } from "lucide-react";
import { apiGet, apiDelete } from "@/services/api";

interface Favorite {
  id: number;
  title: string;
  type: string;
  imageUrl: string;
  height: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    apiGet<Favorite[]>("/favorites")
      .then(setFavorites)
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  const items = favorites.filter((g) => g.title.toLowerCase().includes(q.toLowerCase()));

  async function handleRemove(id: number) {
    try {
      await apiDelete(`/favorites/${id}`);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch {
      // silently fail
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>Favorites</p>
        <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Saved inspiration</h1>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8E8178" }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search favorites…"
          className="w-full pl-11 pr-4 py-3 text-sm focus:outline-none"
          style={{ background: "#FAF7F2", border: "1px solid rgba(22,19,19,0.08)", borderRadius: 14, color: "#161313" }} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2].map((n) => (
            <div key={n} className="overflow-hidden animate-pulse" style={{ borderRadius: 18, border: "1px solid rgba(22,19,19,0.06)" }}>
              <div className="h-[300px]" style={{ background: "#F5F1EC" }} />
              <div className="p-4" style={{ background: "#FAF7F2" }}>
                <div className="h-4 rounded w-1/2" style={{ background: "#F5F1EC" }} />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#8E8178" }}>
          <Star className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No favorites yet. Save designs you love from the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <AnimatePresence>
            {items.map((g, i) => (
              <motion.div key={g.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                className="overflow-hidden shadow-lux-sm" style={{ borderRadius: 18, border: "1px solid rgba(22,19,19,0.06)" }}>
                <div className="relative">
                  <img src={g.imageUrl} alt={g.title} className={`w-full object-cover ${g.height}`} />
                  <button type="button" className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center"
                    style={{ background: "rgba(22,19,19,0.55)", borderRadius: 999 }}>
                    <Star className="w-4 h-4" fill="#A78B75" style={{ color: "#A78B75" }} />
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between" style={{ background: "#FAF7F2" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#161313" }}>{g.title}</p>
                    <p className="text-xs" style={{ color: "#8E8178" }}>{g.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="p-2" style={{ color: "#8E8178" }} aria-label="Download"><Download className="w-4 h-4" /></button>
                    <button type="button" className="p-2" style={{ color: "#8E8178" }} aria-label="Remove"
                      onClick={() => handleRemove(g.id)}><Trash2 className="w-4 h-4" /></button>
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
