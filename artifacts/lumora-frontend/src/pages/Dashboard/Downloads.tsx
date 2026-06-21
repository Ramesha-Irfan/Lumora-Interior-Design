import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileImage, CheckCircle2 } from "lucide-react";
import { MOCK_DOWNLOADS } from "@/services/mockDashboardData";

export default function Downloads() {
  const [downloading, setDownloading] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());

  async function handleDownload(file: typeof MOCK_DOWNLOADS[0]) {
    if (downloading === file.id) return;
    setDownloading(file.id);
    try {
      const res = await fetch(file.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDone((prev) => new Set(prev).add(file.id));
      setTimeout(() => setDone((prev) => { const s = new Set(prev); s.delete(file.id); return s; }), 3000);
    } catch {
      window.open(file.imageUrl, "_blank");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>Downloads</p>
        <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Exported renders</h1>
        <p className="text-sm mt-2" style={{ color: "#7A6D63" }}>High-resolution files ready for presentations.</p>
      </div>

      <div className="space-y-3">
        {MOCK_DOWNLOADS.map((f, i) => (
          <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="flex items-center gap-4 p-4"
            style={{ background: "#FAF7F2", borderRadius: 14, border: "1px solid rgba(22,19,19,0.06)" }}>
            <div className="w-14 h-14 shrink-0 overflow-hidden" style={{ borderRadius: 12 }}>
              <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#161313" }}>{f.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "#8E8178" }}>{f.size} · {f.date}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload(f)}
              disabled={downloading === f.id}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium shrink-0 transition-all"
              style={{
                background: done.has(f.id) ? "rgba(167,139,117,0.12)" : "#161313",
                borderRadius: 12,
                color: done.has(f.id) ? "#A78B75" : "#FAF7F2",
                opacity: downloading === f.id ? 0.6 : 1,
              }}>
              {done.has(f.id) ? (
                <><CheckCircle2 className="w-4 h-4" /> Saved</>
              ) : downloading === f.id ? (
                <><Download className="w-4 h-4 animate-bounce" /> Saving…</>
              ) : (
                <><Download className="w-4 h-4" /> Download</>
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Empty state (shown when list would be empty) */}
      {MOCK_DOWNLOADS.length === 0 && (
        <div className="text-center py-16" style={{ color: "#8E8178" }}>
          <FileImage className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No downloads yet. Export your designs from the studio.</p>
        </div>
      )}
    </div>
  );
}
