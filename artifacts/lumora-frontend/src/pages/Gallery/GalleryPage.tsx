import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Heart, Loader2 } from "lucide-react";
import {
  GALLERY_CATEGORIES,
  searchPhotos,
  getPhotoUrl,
  getFallbackImage,
  type UnsplashPhoto,
} from "@/services/unsplash";

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 6;

function LazyImage({
  photo,
  onToggleSave,
  isSaved,
}: {
  photo: UnsplashPhoto;
  onToggleSave: (id: number) => void;
  isSaved: boolean;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const src = hasError ? getFallbackImage() : getPhotoUrl(photo);

  return (
    <div ref={imgRef} className={`relative w-full ${photo.height}`}>
      {(!isVisible || !loaded) && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            borderRadius: 20,
            background:
              "linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.04) 100%)",
          }}
        />
      )}

      {isVisible && (
        <motion.img
          src={src}
          alt={photo.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ borderRadius: 20 }}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setHasError(true);
            setLoaded(true);
          }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          borderRadius: 20,
          background:
            "linear-gradient(to top, rgba(22,19,19,0.88) 0%, rgba(22,19,19,0.3) 50%, transparent 100%)",
        }}
      />

      {/* Hover content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onToggleSave(photo.id); }}
            data-testid={`button-save-${photo.id}`}
            className="w-9 h-9 flex items-center justify-center transition-all duration-200"
            style={{
              background: isSaved ? "#A78B75" : "rgba(22,19,19,0.6)",
              backdropFilter: "blur(8px)",
              borderRadius: 999,
              border: `1px solid ${isSaved ? "#A78B75" : "rgba(255,255,255,0.15)"}`,
            }}
          >
            <Heart
              className="w-4 h-4"
              fill={isSaved ? "#FAF7F2" : "none"}
              style={{ color: isSaved ? "#FAF7F2" : "rgba(255,255,255,0.7)" }}
            />
          </motion.button>
        </div>
        <div>
          <span
            className="inline-block text-[9px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 mb-2"
            style={{
              background: "rgba(167,139,117,0.25)",
              color: "#CFC8C2",
              borderRadius: 999,
              border: "1px solid rgba(167,139,117,0.3)",
            }}
          >
            {photo.type}
          </span>
          <p className="text-white text-sm font-medium">{photo.title}</p>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [activeCategory, debouncedSearch]);

  const filtered = searchPhotos(debouncedSearch, activeCategory);
  const visible = filtered.slice(0, visibleCount);

  const toggleSave = useCallback((id: number) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((n) => n + LOAD_MORE_COUNT);
      setIsLoadingMore(false);
    }, 400);
  };

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "#161313" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Hero header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[10px] tracking-[0.35em] uppercase font-medium mb-4" style={{ color: "#A78B75" }}>
            Community Showcase
          </motion.p>
          <h1 className="font-heading text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
            Inspiration{" "}
            <span style={{ color: "#A78B75" }}>Gallery</span>
          </h1>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "#8E8178" }}>
            Explore curated high-quality interior design photos — modern, luxury, minimalist, and beyond.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8E8178" }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms, styles, spaces…"
            data-testid="input-gallery-search"
            className="w-full pl-12 pr-5 py-4 text-sm text-white focus:outline-none transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 999,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(167,139,117,0.6)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
        </motion.div>

        {/* Category filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2.5 mb-4">
          {GALLERY_CATEGORIES.map((cat) => (
            <motion.button key={cat} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(cat)}
              data-testid={`filter-${cat.toLowerCase().replace(/ /g, "-")}`}
              className="px-5 py-2 text-sm font-medium transition-all duration-200"
              style={{
                borderRadius: 999,
                background: activeCategory === cat ? "#A78B75" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeCategory === cat ? "#A78B75" : "rgba(255,255,255,0.08)"}`,
                color: activeCategory === cat ? "#FAF7F2" : "#CFC8C2",
                boxShadow: activeCategory === cat ? "0 10px 25px rgba(167,139,117,0.25)" : "none",
              }}>
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Results count */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="text-center text-xs mb-10" style={{ color: "#8E8178" }}>
          {filtered.length > 0
            ? `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length} designs`
            : "No designs found"}
        </motion.p>

        {/* Masonry grid */}
        <div ref={ref} className="masonry">
          {visible.map((photo, i) => (
            <motion.div key={`${photo.id}-${activeCategory}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.035 }}
              className="masonry-item"
            >
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 25px 50px rgba(0,0,0,0.30)" }}
                className="relative overflow-hidden group cursor-pointer transition-all duration-500"
                style={{ borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
                data-testid={`card-gallery-${photo.id}`}
              >
                <LazyImage
                  photo={photo}
                  onToggleSave={toggleSave}
                  isSaved={savedItems.has(photo.id)}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {visible.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(167,139,117,0.07)", borderRadius: 20 }}>
              <Search className="w-7 h-7" style={{ color: "#A78B75", opacity: 0.5 }} />
            </div>
            <p className="text-base mb-4" style={{ color: "#8E8178" }}>
              No designs found{search ? ` for "${search}"` : ` in ${activeCategory}`}
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="text-sm transition-colors"
              style={{ color: "#A78B75" }}>
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-14">
            <motion.button
              whileHover={{ borderColor: "#A78B75", color: "#FAF7F2" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              data-testid="button-load-more"
              className="inline-flex items-center gap-2 px-10 py-3.5 text-sm font-medium transition-all duration-300"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 999,
                color: "#8E8178",
              }}>
              {isLoadingMore ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</>
              ) : (
                `Load More Designs (${filtered.length - visibleCount} remaining)`
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
