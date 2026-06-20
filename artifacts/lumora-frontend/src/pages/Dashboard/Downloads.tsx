import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileImage } from "lucide-react";
import { apiGet } from "@/services/api";

interface DownloadFile {
  id: number;
  name: string;
  size: string;
  date: string;
}

export default function Downloads() {
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<DownloadFile[]>("/downloads")
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>Downloads</p>
        <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Exported renders</h1>
        <p className="text-sm mt-2" style={{ color: "#7A6D63" }}>High-resolution files ready for presentations.</p>
      </div>

      <div className="space-y-2">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-4 p-4 animate-pulse"
              style={{ background: "#FAF7F2", borderRadius: 14, border: "1px solid rgba(22,19,19,0.06)" }}>
              <div className="w-10 h-10 shrink-0" style={{ background: "#F5F1EC", borderRadius: 12 }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded w-1/3" style={{ background: "#F5F1EC" }} />
                <div className="h-3 rounded w-1/4" style={{ background: "#F5F1EC" }} />
              </div>
            </div>
          ))
        ) : files.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#8E8178" }}>
            <Download className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No downloads yet. Export your designs from the studio.</p>
          </div>
        ) : (
          files.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4" style={{ background: "#FAF7F2", borderRadius: 14, border: "1px solid rgba(22,19,19,0.06)" }}>
              <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(167,139,117,0.12)", borderRadius: 12 }}>
                <FileImage className="w-5 h-5" style={{ color: "#A78B75" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#161313" }}>{f.name}</p>
                <p className="text-xs" style={{ color: "#8E8178" }}>{f.size} · {f.date}</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button"
                className="p-3 shrink-0" style={{ background: "#161313", borderRadius: 12, color: "#FAF7F2" }} aria-label="Download file">
                <Download className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
