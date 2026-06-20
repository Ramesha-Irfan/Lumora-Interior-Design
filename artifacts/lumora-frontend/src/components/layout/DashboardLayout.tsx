import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard, Folder, Clock, Star, Download as DownloadIcon,
  Sparkles, Settings, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Folder, label: "Projects", href: "/dashboard/projects" },
  { icon: Clock, label: "History", href: "/dashboard/history" },
  { icon: Star, label: "Favorites", href: "/dashboard/favorites" },
  { icon: DownloadIcon, label: "Downloads", href: "/dashboard/downloads" },
];

function isActive(href: string, location: string) {
  if (href === "/dashboard") return location === "/dashboard";
  return location.startsWith(href);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  function handleLogout() {
    logout();
    setLocation("/login");
    onNavigate?.();
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#161313" }}>
      <Link href="/" onClick={onNavigate}>
        <div className="flex items-center gap-2 px-5 mb-8 cursor-pointer">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#A78B75" }}>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-heading text-lg font-light tracking-[0.14em] lowercase text-white">
            lumora<span style={{ color: "#A78B75" }}>.</span>
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-3 px-5 mb-6 py-4 mx-2" style={{ background: "rgba(167,139,117,0.1)", borderRadius: 16, border: "1px solid rgba(167,139,117,0.15)" }}>
        <div className={`w-10 h-10 flex items-center justify-center text-white font-semibold text-sm shrink-0`}
          style={{ background: "#A78B75", borderRadius: 12 }}>
          {user?.avatarInitials ?? "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "#FAF7F2" }}>{user?.name ?? "Guest"}</p>
          <p className="text-xs" style={{ color: "#8E8178" }}>{user?.plan ?? "Free"} Plan</p>
        </div>
      </div>

      <div className="h-px mx-5 mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

      <nav className="flex-1 px-3 space-y-0.5">
        <p className="text-[9px] font-medium tracking-[0.25em] uppercase px-3 mb-3" style={{ color: "#8E8178" }}>Menu</p>
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(href, location);
          return (
            <Link key={href} href={href} onClick={onNavigate}>
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200"
                style={{
                  borderRadius: 12,
                  background: active ? "rgba(167,139,117,0.15)" : "transparent",
                  border: active ? "1px solid rgba(167,139,117,0.2)" : "1px solid transparent",
                }}
              >
                <Icon className="w-4 h-4 shrink-0" style={{ color: active ? "#A78B75" : "#CFC8C2" }} />
                <span className="flex-1 text-sm" style={{ color: active ? "#FAF7F2" : "#CFC8C2" }}>{label}</span>
                {active && <ChevronRight className="w-3 h-3" style={{ color: "#A78B75" }} />}
              </motion.div>
            </Link>
          );
        })}

        <div className="h-px my-3 mx-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        <p className="text-[9px] font-medium tracking-[0.25em] uppercase px-3 mb-3" style={{ color: "#8E8178" }}>Account</p>

        <Link href="/dashboard/settings" onClick={onNavigate}>
          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200"
            style={{
              borderRadius: 12,
              background: isActive("/dashboard/settings", location) ? "rgba(167,139,117,0.15)" : "transparent",
              border: isActive("/dashboard/settings", location) ? "1px solid rgba(167,139,117,0.2)" : "1px solid transparent",
            }}
          >
            <Settings className="w-4 h-4 shrink-0" style={{ color: isActive("/dashboard/settings", location) ? "#A78B75" : "#CFC8C2" }} />
            <span className="text-sm" style={{ color: isActive("/dashboard/settings", location) ? "#FAF7F2" : "#CFC8C2" }}>Settings</span>
          </motion.div>
        </Link>

        <motion.div
          whileHover={{ x: 3 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200 group"
          style={{ borderRadius: 12 }}
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-red-400 transition-colors" style={{ color: "#CFC8C2" }} />
          <span className="text-sm group-hover:text-red-400 transition-colors" style={{ color: "#CFC8C2" }}>Logout</span>
        </motion.div>
      </nav>

      <div className="px-3 mt-4 pb-2">
        <Link href="/studio" onClick={onNavigate}>
          <motion.button
            whileHover={{ backgroundColor: "#8D705E", boxShadow: "0 8px 24px rgba(167,139,117,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3 text-white text-[11px] font-medium tracking-[0.18em] uppercase transition-all duration-300"
            style={{ background: "#A78B75", borderRadius: 999 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            New Design
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F1EC" }}>
      <motion.aside
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex flex-col w-64 fixed top-0 left-0 bottom-0 z-40"
        style={{ background: "#161313", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="px-0 py-6 h-full">
          <SidebarContent />
        </div>
      </motion.aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-5 py-3.5 flex items-center justify-between"
        style={{ background: "rgba(245,241,236,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <Link href="/">
          <span className="font-heading text-base font-light tracking-[0.15em] lowercase" style={{ color: "#161313" }}>
            lumora<span style={{ color: "#A78B75" }}>.</span>
          </span>
        </Link>
        <button onClick={() => setMobileOpen(true)} style={{ color: "#8E8178" }}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-50" style={{ background: "rgba(22,19,19,0.6)" }} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 z-50 py-6"
              style={{ background: "#161313" }}
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-5" style={{ color: "#8E8178" }}>
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0 px-5 md:px-8 py-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}

