import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Download, Trash2 } from "lucide-react";
import { MOCK_HISTORY } from "@/services/mockDashboardData";

export default function History() {
  const [entries, setEntries] = useState(MOCK_HISTORY);

  async function handleDownload(thumbUrl: string, title: string) {
    try {
      const res = await fetch(thumbUrl);
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
      window.open(thumbUrl, "_blank");
    }
  }

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>History</p>
        <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Past generations</h1>
        <p className="text-sm mt-2" style={{ color: "#7A6D63" }}>Every render you have created in Lumora Studio.</p>
      </div>

      {entries.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16" style={{ color: "#8E8178" }}>
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No history yet. Start designing in the studio.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {entries.map((e, i) => (
              <motion.div key={e.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8, height: 0 }}
                transition={{ delay: i * 0.04, duration: 0.22 }}
                className="flex items-center gap-4 p-4 group"
                style={{ background: "#FAF7F2", borderRadius: 16, border: "1px solid rgba(22,19,19,0.06)" }}>
                <img src={e.thumbUrl} alt={e.title} className="w-14 h-14 object-cover shrink-0" style={{ borderRadius: 12 }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: "#161313" }}>{e.title}</p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#8E8178" }}>
                    <Clock className="w-3 h-3" />{e.date}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDownload(e.thumbUrl, e.title)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: "#8E8178" }}
                    onMouseEnter={e2 => (e2.currentTarget.style.color = "#A78B75")}
                    onMouseLeave={e2 => (e2.currentTarget.style.color = "#8E8178")}
                    title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(e.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: "#8E8178" }}
                    onMouseEnter={e2 => (e2.currentTarget.style.color = "#F87171")}
                    onMouseLeave={e2 => (e2.currentTarget.style.color = "#8E8178")}
                    title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
