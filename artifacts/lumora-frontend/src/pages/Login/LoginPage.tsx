import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function validate() {
    if (!email) return "Please enter your email address.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) { setError(result.error ?? "Login failed."); return; }
    setSuccess(true);
    await new Promise((r) => setTimeout(r, 700));
    setLocation("/dashboard");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#161313" }}>
      {/* Left panel — image + branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85"
            alt="Luxury interior" className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(22,19,19,0.82) 0%, rgba(22,19,19,0.55) 60%, rgba(22,19,19,0.3) 100%)" }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer w-fit mb-auto">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#A78B75" }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading text-lg font-light tracking-[0.15em] lowercase text-white">
                lumora<span style={{ color: "#A78B75" }}>.</span>
              </span>
            </div>
          </Link>

          {/* Headline */}
          <div className="mt-auto mb-auto">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-[10px] tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A78B75" }}>
              Premium AI Interior Design
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="font-heading text-5xl font-light text-white leading-tight mb-5">
              Elevate every<br />
              <span style={{ color: "#A78B75" }}>living space.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-base leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Upload your room, choose a style, and watch Lumora AI transform any space into an architectural masterpiece.
            </motion.p>
          </div>

          {/* Feature card */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="mt-auto p-5"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1554995207-c18c203602cb?w=200&q=80" alt="example"
                className="w-16 h-16 object-cover shrink-0" style={{ borderRadius: 12 }} />
              <div>
                <p className="text-sm font-medium text-white mb-0.5">Modern Luxury Suite</p>
                <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Generated in 18 seconds</p>
                <span className="text-[9px] font-medium tracking-[0.15em] uppercase px-2.5 py-1" style={{ background: "rgba(167,139,117,0.25)", color: "#CFC8C2", borderRadius: 999 }}>
                  Style: Luxury · 98% match
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[480px] shrink-0 flex items-center justify-center px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link href="/">
            <div className="flex items-center gap-2 mb-10 cursor-pointer lg:hidden">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "#A78B75" }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-heading text-base font-light tracking-[0.15em] lowercase text-white">
                lumora<span style={{ color: "#A78B75" }}>.</span>
              </span>
            </div>
          </Link>

          <div className="mb-8">
            <h2 className="font-heading text-3xl font-light text-white mb-2">Welcome back.</h2>
            <p className="text-sm" style={{ color: "#8E8178" }}>Sign in to continue designing.</p>
          </div>

          {/* Hint */}
          <div className="mb-6 px-4 py-3" style={{ background: "rgba(167,139,117,0.08)", borderRadius: 14, border: "1px solid rgba(167,139,117,0.18)" }}>
            <p className="text-xs" style={{ color: "#CFC8C2" }}>
              <span className="font-semibold" style={{ color: "#A78B75" }}>New here?</span>{" "}
              Create a free account first — or use any email/password you signed up with.
            </p>
          </div>

          {/* Error / Success */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-4 py-3 text-sm mb-5"
                style={{ background: "rgba(255,80,80,0.08)", borderRadius: 12, border: "1px solid rgba(255,80,80,0.15)", color: "#F87171" }}>
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-3 text-sm mb-5"
                style={{ background: "rgba(167,139,117,0.12)", borderRadius: 12, border: "1px solid rgba(167,139,117,0.25)", color: "#A78B75" }}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />Signed in! Redirecting…
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-2" style={{ color: "#8E8178" }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8E8178" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 text-sm focus:outline-none transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "#FAF7F2" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(167,139,117,0.6)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#8E8178" }}>Password</label>
                <span className="text-xs cursor-pointer transition-colors" style={{ color: "#A78B75" }}>Forgot password?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8E8178" }} />
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 text-sm focus:outline-none transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "#FAF7F2" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(167,139,117,0.6)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }} />
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#8E8178" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={loading || success}
              whileHover={{ backgroundColor: "#8D705E", boxShadow: "0 12px 32px rgba(167,139,117,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 text-white text-sm font-medium tracking-[0.1em] transition-all duration-300 mt-2"
              style={{ background: "#A78B75", borderRadius: 999 }}>
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>)
                : success ? (<><CheckCircle2 className="w-4 h-4" />Success!</>)
                : (<>Sign In <ArrowRight className="w-4 h-4" /></>)}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs" style={{ color: "#8E8178" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <p className="text-center text-sm" style={{ color: "#8E8178" }}>
            Don't have an account?{" "}
            <Link href="/signup">
              <span className="font-medium cursor-pointer transition-colors" style={{ color: "#A78B75" }}>Create one free</span>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

