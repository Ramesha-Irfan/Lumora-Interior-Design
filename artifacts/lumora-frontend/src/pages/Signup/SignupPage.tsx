import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, AtSign, ArrowRight, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const map = [
      { label: "Weak", color: "#F87171" },
      { label: "Fair", color: "#FBBF24" },
      { label: "Good", color: "#A78B75" },
      { label: "Strong", color: "#86EFAC" },
      { label: "Very Strong", color: "#4ADE80" },
    ];
    return { score, ...map[score] };
  }, [password]);

  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-300"
            style={{ background: i < strength.score ? strength.color : "rgba(255,255,255,0.1)" }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
    </motion.div>
  );
}

function LuxField({ label, type = "text", value, onChange, placeholder, autoComplete, icon: Icon, error, suffix }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; autoComplete?: string; icon: any; error?: string; suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-2" style={{ color: "#8E8178" }}>{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8E8178" }} />
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete}
          className="w-full pl-11 pr-4 py-3.5 text-sm focus:outline-none transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "#FAF7F2" }}
          onFocus={e => { e.target.style.borderColor = "rgba(167,139,117,0.6)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }} />
        {suffix && <div className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="text-xs mt-1 flex items-center gap-1" style={{ color: "#F87171" }}>
            <AlertCircle className="w-3 h-3 shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form & { global: string; terms: string }>>({});

  function update(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.username.trim()) e.username = "Username is required.";
    else if (!/^[a-z0-9_]+$/i.test(form.username)) e.username = "Only letters, numbers, underscores.";
    if (!form.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Must be at least 8 characters.";
    if (!form.confirm) e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    if (!agreed) e.terms = "You must accept the terms.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const result = await signup({ name: form.name, username: form.username, email: form.email, password: form.password });
    setLoading(false);
    if (!result.ok) { setErrors({ global: result.error }); return; }
    setSuccess(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLocation("/dashboard");
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#161313" }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
            style={{ background: "#A78B75", borderRadius: 24 }}>
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-heading text-3xl font-light text-white mb-2">Welcome to Lumora AI.</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} style={{ color: "#8E8178" }}>
            Your account is ready. Taking you to your dashboard…
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#161313" }}>
      {/* Left panel */}
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=85" alt="Luxury interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(22,19,19,0.85) 0%, rgba(22,19,19,0.6) 60%, rgba(22,19,19,0.35) 100%)" }} />
        </div>
        <div className="relative z-10 flex flex-col h-full p-12">
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
          <div className="mt-auto mb-auto">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-[10px] tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A78B75" }}>
              Join 12,000+ Designers
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="font-heading text-5xl font-light text-white leading-tight mb-5">
              Start designing<br />
              <span style={{ color: "#A78B75" }}>for free today.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-base leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Transform any room into a luxury interior with AI-powered design in under 30 seconds.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="mt-auto p-5"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-xs font-medium text-white mb-3">Free Plan Includes</p>
            {["5 AI generations per month", "Standard HD resolution", "3 core design styles", "Gallery access"].map((f) => (
              <div key={f} className="flex items-center gap-2.5 py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#A78B75" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{f}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="w-full lg:w-130 shrink-0 flex items-center justify-center px-8 py-12 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">

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
            <h2 className="font-heading text-3xl font-light text-white mb-2">Create your account.</h2>
            <p className="text-sm" style={{ color: "#8E8178" }}>Get started for free — no credit card needed.</p>
          </div>

          <AnimatePresence>
            {errors.global && (
              <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-4 py-3 text-sm mb-5"
                style={{ background: "rgba(255,80,80,0.08)", borderRadius: 12, border: "1px solid rgba(255,80,80,0.15)", color: "#F87171" }}>
                <AlertCircle className="w-4 h-4" />{errors.global}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Username */}
            <div className="grid grid-cols-2 gap-3">
              <LuxField label="Full Name" value={form.name} onChange={v => update("name", v)} placeholder="Alex Rivera" autoComplete="name" icon={User} error={errors.name} />
              <LuxField label="Username" value={form.username} onChange={v => update("username", v)} placeholder="alexrivera" autoComplete="username" icon={AtSign} error={errors.username} />
            </div>

            <LuxField label="Email Address" type="email" value={form.email} onChange={v => update("email", v)} placeholder="you@example.com" autoComplete="email" icon={Mail} error={errors.email} />

            <div>
              <LuxField label="Password" type={showPass ? "text" : "password"} value={form.password} onChange={v => update("password", v)}
                placeholder="Min. 8 characters" autoComplete="new-password" icon={Lock} error={errors.password}
                suffix={
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{ color: "#8E8178" }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                } />
              <PasswordStrength password={form.password} />
            </div>

            <LuxField label="Confirm Password" type={showConfirm ? "text" : "password"} value={form.confirm} onChange={v => update("confirm", v)}
              placeholder="Repeat your password" autoComplete="new-password" icon={Lock} error={errors.confirm}
              suffix={
                <button type="button" onClick={() => setShowConfirm(s => !s)} style={{ color: "#8E8178" }}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              } />

            {/* Terms */}
            <div>
              <div className="flex items-start gap-3">
                <button type="button" onClick={() => { setAgreed(a => !a); setErrors(e => ({ ...e, terms: "" })); }}
                  className="w-4 h-4 rounded flex items-center justify-center border shrink-0 mt-0.5 transition-all"
                  style={{ background: agreed ? "#A78B75" : "transparent", borderColor: agreed ? "#A78B75" : "rgba(255,255,255,0.2)" }}>
                  {agreed && <CheckCircle2 className="w-3 h-3 text-white" />}
                </button>
                <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  I agree to the{" "}
                  <span className="cursor-pointer transition-colors" style={{ color: "#A78B75" }}>Terms of Service</span>{" "}
                  and{" "}
                  <span className="cursor-pointer transition-colors" style={{ color: "#A78B75" }}>Privacy Policy</span>
                </span>
              </div>
              {errors.terms && (
                <p className="text-xs mt-1 ml-7 flex items-center gap-1" style={{ color: "#F87171" }}>
                  <AlertCircle className="w-3 h-3 shrink-0" />{errors.terms}
                </p>
              )}
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ backgroundColor: "#8D705E", boxShadow: "0 12px 32px rgba(167,139,117,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 text-white text-sm font-medium tracking-widest transition-all duration-300"
              style={{ background: "#A78B75", borderRadius: 999 }}>
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>) : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#8E8178" }}>
            Already have an account?{" "}
            <Link href="/login">
              <span className="font-medium cursor-pointer" style={{ color: "#A78B75" }}>Sign in</span>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

