import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Wand2, TrendingUp, Image, Star, ChevronRight, MoreHorizontal } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { apiGet } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface DashboardStats {
  designsThisMonth: number;
  savedInspirations: number;
  aiCreditsLeft: number;
  recentProjects: number;
  chartData: Array<{ name: string; generations: number }>;
}

interface Project {
  id: number;
  name: string;
  style: string;
  imageUrl: string;
  date: string;
}

const recentGenerations = [
  { id: 1, before: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80", after: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&q=80", style: "Luxury", date: "Jun 20, 2026", name: "Luxury Redesign" },
  { id: 2, before: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80", after: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80", style: "Minimalist", date: "Jun 18, 2026", name: "Minimalist Redesign" },
  { id: 3, before: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80", after: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=200&q=80", style: "Gaming", date: "Jun 15, 2026", name: "Gaming Redesign" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="px-4 py-3 text-sm shadow-lux" style={{ background: "#161313", borderRadius: 12, border: "1px solid rgba(167,139,117,0.2)" }}>
        <p className="text-xs mb-1" style={{ color: "#8E8178" }}>{label}</p>
        <p className="font-medium" style={{ color: "#FAF7F2" }}>{payload[0].value} generations</p>
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiGet<DashboardStats>("/dashboard/stats").then(setStats).catch(() => null);
    apiGet<Project[]>("/projects").then((p) => setProjects(p.slice(0, 4))).catch(() => setProjects([]));
  }, []);

  const statCards = [
    { label: "Designs This Month", value: stats ? String(stats.designsThisMonth) : "—", delta: null, icon: Wand2 },
    { label: "Saved Inspirations", value: stats ? String(stats.savedInspirations) : "—", delta: null, icon: Image },
    { label: "Favorite Style", value: "Luxury", delta: null, icon: Star },
    { label: "AI Credits Left", value: stats ? String(stats.aiCreditsLeft) : "—", delta: "of 100", icon: TrendingUp },
  ];

  const chartData = stats?.chartData ?? [];

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>Dashboard</p>
        <h1 className="font-heading text-3xl font-light mb-1" style={{ color: "#161313" }}>
          Welcome back, {user?.name?.split(" ")[0] ?? "Designer"}
        </h1>
        <p className="text-sm" style={{ color: "#7A6D63" }}>Here is what is happening with your Lumora workspace.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="p-5 shadow-lux-sm" style={{ background: "#FAF7F2", borderRadius: 16, border: "1px solid rgba(22,19,19,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#8E8178" }}>{s.label}</span>
              <s.icon className="w-4 h-4" style={{ color: "#A78B75" }} />
            </div>
            <p className="font-heading text-2xl font-light mb-1" style={{ color: "#161313" }}>{s.value}</p>
            {s.delta && <p className="text-xs" style={{ color: "#5C5148" }}>{s.delta}</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="xl:col-span-2 p-6 shadow-lux-sm" style={{ background: "#FAF7F2", borderRadius: 20, border: "1px solid rgba(22,19,19,0.06)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-lg font-light" style={{ color: "#161313" }}>Generation activity</h2>
            <MoreHorizontal className="w-4 h-4 cursor-pointer" style={{ color: "#8E8178" }} />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: "#8E8178", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8E8178", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={(props) => <CustomTooltip active={props.active} payload={props.payload as Array<{ value: number }> | undefined} label={props.label as string | undefined} />} cursor={{ fill: "rgba(167,139,117,0.08)" }} />
                <Bar dataKey="generations" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? "#A78B75" : "rgba(167,139,117,0.45)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 shadow-lux-sm" style={{ background: "#161313", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-heading text-lg font-light text-white mb-4">Recent designs</h2>
          <div className="space-y-4">
            {recentGenerations.map((g) => (
              <div key={g.id} className="flex gap-3 items-center">
                <div className="flex -space-x-2">
                  <img src={g.before} alt="" className="w-10 h-10 rounded-lg object-cover ring-2 ring-lux-black" />
                  <img src={g.after} alt="" className="w-10 h-10 rounded-lg object-cover ring-2 ring-lux-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{g.name}</p>
                  <p className="text-xs" style={{ color: "#8E8178" }}>{g.style} · {g.date}</p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "#A78B75" }} />
              </div>
            ))}
          </div>
          <Link href="/studio">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 text-xs font-medium tracking-[0.15em] uppercase text-white"
              style={{ background: "#A78B75", borderRadius: 999 }}>
              Open studio
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {projects.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-6 shadow-lux-sm" style={{ background: "#FAF7F2", borderRadius: 20, border: "1px solid rgba(22,19,19,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg font-light" style={{ color: "#161313" }}>Your projects</h2>
            <Link href="/dashboard/projects">
              <span className="text-xs tracking-wide cursor-pointer" style={{ color: "#A78B75" }}>View all</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="flex gap-4 p-4 items-center" style={{ background: "#F5F1EC", borderRadius: 14, border: "1px solid rgba(22,19,19,0.05)" }}>
                <img src={p.imageUrl} alt="" className="w-16 h-16 object-cover shrink-0" style={{ borderRadius: 12 }} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: "#161313" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "#8E8178" }}>{p.date} · {p.style}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
