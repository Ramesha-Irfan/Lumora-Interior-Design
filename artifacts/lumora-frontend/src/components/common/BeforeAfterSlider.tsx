import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 2), 98);
    setSliderPos(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const onMove = (ev: MouseEvent) => updateSlider(ev.clientX);
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchStart = () => setIsDragging(true);
  const onTouchMove = (e: React.TouchEvent) => updateSlider(e.touches[0].clientX);
  const onTouchEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none cursor-ew-resize overflow-hidden"
      style={{ aspectRatio: "16/9", borderRadius: 20 }}
      onMouseMove={(e) => isDragging && updateSlider(e.clientX)}
      data-testid="before-after-slider"
    >
      <img src={afterImage} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />

      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <img src={beforeImage} alt={beforeLabel} className="w-full h-full object-cover" />
      </div>

      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 text-xs font-medium tracking-[0.1em] uppercase text-white"
          style={{ background: "rgba(22,19,19,0.6)", backdropFilter: "blur(8px)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)" }}>
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 text-xs font-medium tracking-[0.1em] uppercase"
          style={{ background: "rgba(167,139,117,0.7)", backdropFilter: "blur(8px)", borderRadius: 999, color: "#FAF7F2" }}>
          {afterLabel}
        </span>
      </div>

      <div className="absolute inset-y-0 w-px" style={{ left: `${sliderPos}%`, background: "rgba(255,255,255,0.5)" }} />

      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center cursor-ew-resize"
        style={{
          left: `${sliderPos}%`,
          width: 44, height: 44, borderRadius: 999,
          background: "rgba(22,19,19,0.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(167,139,117,0.4)",
          boxShadow: isDragging ? "0 0 0 4px rgba(167,139,117,0.25)" : "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        whileHover={{ scale: 1.12, borderColor: "#A78B75" }}
        whileTap={{ scale: 0.95 }}
        data-testid="slider-handle"
      >
        <GripVertical className="w-5 h-5" style={{ color: "#CFC8C2" }} />
      </motion.div>
    </div>
  );
}

