"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side validation to save API quota and provide instant feedback
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter both email and password");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!supabase) {
      setError("Authentication service is temporarily unavailable");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });

      if (authError) {
        // Map technical errors to user-friendly messages
        const friendlyError = authError.message.includes("Invalid credentials")
          ? "Invalid email or password. Please try again."
          : authError.message;

        setError(friendlyError);
        setLoading(false);
        return;
      }

      if (data.session) {
        // Force a refresh of the current page to update server-side auth state
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Authentication failed. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("A system error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center border-r border-white/5" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.08) 100%)" }}>
        <div className="text-center px-12">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)", boxShadow: "0 25px 50px rgba(124,58,237,0.25)" }}
          >
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-white mb-4">Welcome Back</h2>
          <p className="text-white/60 leading-relaxed max-w-sm mx-auto">
            Continue analyzing contracts and protecting your interests with AI-powered insights.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            {[["10k+", "Users"], ["98%", "Accuracy"], ["2min", "Avg Review"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-white/40 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
            >
              S
            </div>
            <span className="text-white font-semibold text-xl">SignSafe</span>
          </Link>

          <h1 className="text-3xl font-serif text-white mb-2">Log in to your account</h1>
          <p className="text-white/50 mb-8 leading-relaxed">Enter your credentials to access your dashboard.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-red-400 text-sm border" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none transition-colors text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#7C3AED")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-sm">Password</label>
                <Link href="/forgot-password" className="text-sm transition-colors" style={{ color: "#7C3AED" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#06B6D4")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#7C3AED")}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/25 focus:outline-none transition-colors text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#7C3AED")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded"
                style={{ accentColor: "#7C3AED" }}
              />
              <label htmlFor="remember" className="text-white/50 text-sm select-none cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold transition-opacity disabled:opacity-50 hover:opacity-90 active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Log In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 mt-8 text-sm">
            {"Don't have an account?"}{" "}
            <Link href="/signup" className="transition-colors" style={{ color: "#7C3AED" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#06B6D4")}
              onMouseLeave={e => (e.currentTarget.style.color = "#7C3AED")}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
