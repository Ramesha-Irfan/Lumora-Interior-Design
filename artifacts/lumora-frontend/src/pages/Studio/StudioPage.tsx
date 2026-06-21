import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, Share2, Heart, CheckCircle, X, Image } from "lucide-react";
import BeforeAfterSlider from "@/components/common/BeforeAfterSlider";
import { STYLES } from "@/services/mockData";
import { STUDIO_STYLE_THUMBNAILS, getFallbackImage, getRandomStyleImage } from "@/services/unsplash";

const ORIGINAL_IMAGE = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&fit=crop&auto=format";

type Phase = "idle" | "uploaded" | "generating" | "done";

export default function Studio() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedStyle, setSelectedStyle] = useState<string>("luxury");
  const [progress, setProgress] = useState(0);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareLabel, setShareLabel] = useState<"Share" | "Copied!" | "Shared!">("Share");
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file?: File) => {
    const src = file ? URL.createObjectURL(file) : ORIGINAL_IMAGE;
    setUploadedPreview(src);
    setPhase("uploaded");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  const handleGenerate = () => {
    setPhase("generating");
    setProgress(0);
    setSaved(false);
    const newImage = getRandomStyleImage(selectedStyle, 900);
    setGeneratedImage(newImage);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("done"), 300);
          return 100;
        }
        return p + Math.random() * 12 + 4;
      });
    }, 180);
  };

  const handleReset = () => {
    setPhase("idle");
    setUploadedPreview(null);
    setProgress(0);
    setSaved(false);
  };

  const selectedStyleName = STYLES.find((s) => s.id === selectedStyle)?.name ?? "Luxury";

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lumora-${selectedStyle}-design.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(generatedImage, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Lumora AI Interior Design",
      text: `Check out this ${selectedStyleName} interior design I created with Lumora AI!`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setShareLabel("Shared!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareLabel("Copied!");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareLabel("Copied!");
      } catch {
        setShareLabel("Copied!");
      }
    }
    setTimeout(() => setShareLabel("Share"), 2500);
  };

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "#161313" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[10px] tracking-[0.35em] uppercase font-medium mb-4" style={{ color: "#A78B75" }}>
            AI Design Studio
          </motion.p>
          <h1 className="font-heading text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
            Redesign your{" "}
            <span style={{ color: "#A78B75" }}>space.</span>
          </h1>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "#8E8178" }}>
            Upload your room, choose a style, and let Lumora AI transform any space into an architectural masterpiece.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── Left panel ── */}
          <div className="space-y-5">

            {/* Upload zone */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-6"
              style={{ background: "#1E1A18", borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-white font-medium mb-5 flex items-center gap-2 text-sm tracking-wide">
                <Upload className="w-4 h-4" style={{ color: "#A78B75" }} />
                Upload Your Room
              </h2>

              {phase === "idle" ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="upload-zone"
                  className="relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300"
                  style={{
                    borderColor: isDragOver ? "#A78B75" : "rgba(255,255,255,0.12)",
                    background: isDragOver ? "rgba(167,139,117,0.06)" : "transparent",
                  }}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    data-testid="input-file-upload"
                    onChange={(e) => handleUpload(e.target.files?.[0])} />
                  <motion.div animate={{ y: isDragOver ? -8 : 0 }} transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center"
                      style={{ background: "rgba(167,139,117,0.1)", borderRadius: 20, border: "1px solid rgba(167,139,117,0.2)" }}>
                      <Image className="w-8 h-8" style={{ color: "#A78B75" }} />
                    </div>
                    <div>
                      <p className="font-medium text-white mb-1">Drop your room image here</p>
                      <p className="text-sm" style={{ color: "#8E8178" }}>or click to browse — JPG, PNG, WEBP</p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={uploadedPreview || ORIGINAL_IMAGE}
                    alt="Uploaded room"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = getFallbackImage(); }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(22,19,19,0.35)" }}>
                    <div className="flex items-center gap-2 px-4 py-2"
                      style={{ background: "rgba(167,139,117,0.15)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(167,139,117,0.3)" }}>
                      <CheckCircle className="w-4 h-4" style={{ color: "#A78B75" }} />
                      <span className="text-white text-sm font-medium">Room uploaded</span>
                    </div>
                  </div>
                  <button onClick={handleReset} data-testid="button-reset-upload"
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-colors"
                    style={{ background: "rgba(22,19,19,0.7)", borderRadius: 999, color: "rgba(255,255,255,0.7)" }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {phase === "idle" && (
                <button onClick={() => handleUpload()} data-testid="button-use-sample"
                  className="w-full mt-3 py-2.5 text-sm transition-colors"
                  style={{ color: "#8E8178", borderRadius: 12 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#CFC8C2")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8E8178")}>
                  Or use a sample room
                </button>
              )}
            </motion.div>

            {/* Style selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="p-6"
              style={{ background: "#1E1A18", borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-white font-medium mb-5 text-sm tracking-wide">Choose Design Style</h2>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {STYLES.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  const thumbSrc = STUDIO_STYLE_THUMBNAILS[style.id] ?? style.image;
                  return (
                    <motion.button key={style.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelectedStyle(style.id);
                        if (phase === "done") setPhase("uploaded");
                      }}
                      data-testid={`button-style-${style.id}`}
                      className="shrink-0 relative w-28 overflow-hidden transition-all duration-200"
                      style={{
                        borderRadius: 14,
                        border: `2px solid ${isSelected ? "#A78B75" : "rgba(255,255,255,0.08)"}`,
                        boxShadow: isSelected ? "0 15px 35px rgba(167,139,117,0.2)" : "none",
                        background: "#211C19",
                      }}>
                      <img
                        src={thumbSrc}
                        alt={style.name}
                        className="w-full h-16 object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = getFallbackImage(); }}
                        loading="lazy"
                      />
                      <div className="py-2 px-2.5" style={{ background: "#211C19" }}>
                        <p className="text-xs font-medium truncate" style={{ color: isSelected ? "#A78B75" : "#CFC8C2" }}>{style.name}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center"
                          style={{ background: "#A78B75", borderRadius: 999 }}>
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Generate button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <motion.button
                whileHover={phase === "uploaded" ? { backgroundColor: "#8D705E", boxShadow: "0 15px 35px rgba(167,139,117,0.35)" } : {}}
                whileTap={phase === "uploaded" ? { scale: 0.98 } : {}}
                onClick={phase === "uploaded" ? handleGenerate : undefined}
                disabled={phase !== "uploaded"}
                data-testid="button-generate"
                className="w-full py-4 text-white font-medium text-base transition-all duration-300"
                style={{
                  background: phase === "uploaded" ? "#A78B75" : "rgba(255,255,255,0.04)",
                  borderRadius: 999,
                  color: phase === "uploaded" ? "#FAF7F2" : "#8E8178",
                  cursor: phase === "uploaded" ? "pointer" : "not-allowed",
                  border: phase === "uploaded" ? "none" : "1px solid rgba(255,255,255,0.06)",
                  letterSpacing: "0.08em",
                }}>
                {phase === "generating" ? "Generating…" : "Generate Design"}
              </motion.button>
            </motion.div>
          </div>

          {/* ── Right panel — result ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="p-6 flex flex-col"
            style={{ background: "#1E1A18", borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-white font-medium mb-5 text-sm tracking-wide">Result</h2>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {(phase === "idle" || phase === "uploaded") && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-4 border-2 border-dashed"
                    style={{ aspectRatio: "16/9", borderRadius: 18, borderColor: "rgba(255,255,255,0.08)" }}>
                    <div className="w-16 h-16 flex items-center justify-center"
                      style={{ background: "rgba(167,139,117,0.07)", borderRadius: 20 }}>
                      <Image className="w-8 h-8" style={{ color: "#A78B75", opacity: 0.5 }} />
                    </div>
                    <p className="text-sm" style={{ color: "#8E8178" }}>Your AI result will appear here</p>
                  </motion.div>
                )}

                {phase === "generating" && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="relative flex flex-col items-center justify-center gap-6 p-8"
                    style={{ aspectRatio: "16/9", borderRadius: 18, background: "#211C19" }}
                    data-testid="loading-state">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 rounded-full"
                      style={{ border: "2px solid rgba(167,139,117,0.2)", borderTopColor: "#A78B75" }} />
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between text-xs mb-2" style={{ color: "#8E8178" }}>
                        <span>Generating your design…</span>
                        <span>{Math.min(Math.round(progress), 100)}%</span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <motion.div className="h-full rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%`, background: "#A78B75" }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white mb-1">Rendering in progress</p>
                      <p className="text-xs" style={{ color: "#8E8178" }}>Applying {selectedStyleName} style</p>
                    </div>
                  </motion.div>
                )}

                {phase === "done" && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }} data-testid="result-section">
                    <div className="mb-5">
                      <BeforeAfterSlider
                        beforeImage={uploadedPreview || ORIGINAL_IMAGE}
                        afterImage={generatedImage}
                        beforeLabel="Original"
                        afterLabel="AI Design"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ backgroundColor: "#8D705E", boxShadow: "0 12px 30px rgba(167,139,117,0.3)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleDownload}
                        disabled={downloading}
                        data-testid="button-download"
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-white text-sm font-medium transition-all duration-300"
                        style={{ background: "#A78B75", borderRadius: 999, opacity: downloading ? 0.7 : 1 }}>
                        <Download className="w-4 h-4" />
                        {downloading ? "Downloading…" : "Download"}
                      </motion.button>
                      <motion.button
                        whileHover={{ borderColor: "#A78B75" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSaved(!saved)}
                        data-testid="button-save"
                        className="flex items-center justify-center gap-2 py-3 px-5 text-sm font-medium transition-all duration-300"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${saved ? "#A78B75" : "rgba(255,255,255,0.08)"}`,
                          borderRadius: 999,
                          color: saved ? "#A78B75" : "#CFC8C2",
                        }}>
                        <Heart className="w-4 h-4" fill={saved ? "#A78B75" : "none"} style={{ color: saved ? "#A78B75" : "#CFC8C2" }} />
                        {saved ? "Saved" : "Save"}
                      </motion.button>
                      <motion.button
                        whileHover={{ borderColor: "rgba(255,255,255,0.2)", color: "#FAF7F2" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleShare}
                        data-testid="button-share"
                        className="flex items-center justify-center gap-2 py-3 px-5 text-sm font-medium transition-all duration-300"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${shareLabel !== "Share" ? "rgba(167,139,117,0.4)" : "rgba(255,255,255,0.08)"}`,
                          borderRadius: 999,
                          color: shareLabel !== "Share" ? "#A78B75" : "#8E8178",
                        }}>
                        <Share2 className="w-4 h-4" /> {shareLabel}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
