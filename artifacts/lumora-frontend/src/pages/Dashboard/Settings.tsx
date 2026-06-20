import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({ name, username });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#A78B75" }}>Settings</p>
        <h1 className="font-heading text-3xl font-light" style={{ color: "#161313" }}>Account</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5 p-6 shadow-lux-sm" style={{ background: "#FAF7F2", borderRadius: 18, border: "1px solid rgba(22,19,19,0.06)" }}>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-2 font-medium" style={{ color: "#8E8178" }}>Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-sm focus:outline-none"
            style={{ background: "#F5F1EC", border: "1px solid rgba(22,19,19,0.08)", borderRadius: 12, color: "#161313" }} />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-2 font-medium" style={{ color: "#8E8178" }}>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 text-sm focus:outline-none"
            style={{ background: "#F5F1EC", border: "1px solid rgba(22,19,19,0.08)", borderRadius: 12, color: "#161313" }} />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase mb-2 font-medium" style={{ color: "#8E8178" }}>Email</label>
          <input value={user?.email ?? ""} readOnly
            className="w-full px-4 py-3 text-sm opacity-70 cursor-not-allowed"
            style={{ background: "#F5F1EC", border: "1px solid rgba(22,19,19,0.08)", borderRadius: 12, color: "#161313" }} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}
            className="px-6 py-3 text-xs font-medium tracking-[0.15em] uppercase text-white disabled:opacity-60"
            style={{ background: "#A78B75", borderRadius: 999 }}>
            {saving ? "Saving…" : "Save changes"}
          </motion.button>
          {saved && <span className="text-xs" style={{ color: "#5C5148" }}>Saved.</span>}
        </div>
      </form>
    </div>
  );
}
