import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { apiGet } from "@/services/api";

interface HistoryEntry {
  id: number;
  title: string;
  style: string;
  thumbUrl: string;
  date: string;
}

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<HistoryEntry[]>("/history")
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>History</p>
        <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Past generations</h1>
        <p className="text-sm mt-2" style={{ color: "#7A6D63" }}>Every render you have created in Lumora Studio.</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-4 p-4 animate-pulse"
              style={{ background: "#FAF7F2", borderRadius: 16, border: "1px solid rgba(22,19,19,0.06)" }}>
              <div className="w-14 h-14 shrink-0" style={{ background: "#F5F1EC", borderRadius: 12 }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded w-1/2" style={{ background: "#F5F1EC" }} />
                <div className="h-3 rounded w-1/3" style={{ background: "#F5F1EC" }} />
              </div>
            </div>
          ))
        ) : entries.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#8E8178" }}>
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No history yet. Start designing in the studio.</p>
          </div>
        ) : (
          entries.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4" style={{ background: "#FAF7F2", borderRadius: 16, border: "1px solid rgba(22,19,19,0.06)" }}>
              <img src={e.thumbUrl} alt="" className="w-14 h-14 object-cover shrink-0" style={{ borderRadius: 12 }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "#161313" }}>{e.title}</p>
                <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#8E8178" }}>
                  <Clock className="w-3 h-3" /> {e.date}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
