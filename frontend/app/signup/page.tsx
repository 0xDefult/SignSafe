"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#06B6D4", "#10B981"][strength];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    router.push("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#08080F" }}>
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
            >
              AI
            </div>
            <span className="text-white font-semibold text-xl">SignSafe</span>
          </Link>

          <h1 className="text-3xl font-serif text-white mb-2">Create your account</h1>
          <p className="text-white/50 mb-8 leading-relaxed">Start analyzing contracts with AI-powered insights.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Chen"
                  className="w-full rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none transition-colors text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.name ? "#EF4444" : "rgba(255,255,255,0.1)"}` }}
                  onFocus={e => !errors.name && (e.currentTarget.style.borderColor = "#7C3AED")}
                  onBlur={e => !errors.name && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>

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
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.email ? "#EF4444" : "rgba(255,255,255,0.1)"}` }}
                  onFocus={e => !errors.email && (e.currentTarget.style.borderColor = "#7C3AED")}
                  onBlur={e => !errors.email && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/25 focus:outline-none transition-colors text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.password ? "#EF4444" : "rgba(255,255,255,0.1)"}` }}
                  onFocus={e => !errors.password && (e.currentTarget.style.borderColor = "#7C3AED")}
                  onBlur={e => !errors.password && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
              {/* Password Strength Bar */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.1)" }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel} password</p>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded"
                style={{ accentColor: "#7C3AED" }}
              />
              <label htmlFor="terms" className="text-white/50 text-sm leading-relaxed cursor-pointer select-none">
                I agree to the{" "}
                <span className="cursor-pointer" style={{ color: "#7C3AED" }}>Terms of Service</span>
                {" "}and{" "}
                <span className="cursor-pointer" style={{ color: "#7C3AED" }}>Privacy Policy</span>
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
                <>Create Account <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 mt-8 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="transition-colors" style={{ color: "#7C3AED" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#06B6D4")}
              onMouseLeave={e => (e.currentTarget.style.color = "#7C3AED")}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center border-l border-white/5" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.08) 100%)" }}>
        <div className="text-center px-12">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)", boxShadow: "0 25px 50px rgba(124,58,237,0.25)" }}
          >
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-white mb-4">Contract Protection Made Simple</h2>
          <p className="text-white/60 leading-relaxed max-w-sm mx-auto">
            Join 10,000+ legal professionals who trust SignSafe to review their contracts.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {[
              "AI risk analysis in under 2 minutes",
              "Flag hidden clauses & red flags",
              "Team collaboration & sharing",
              "Export reports in any format",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}>
                  <Check className="w-3 h-3" style={{ color: "#06B6D4" }} />
                </div>
                <span className="text-white/60 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
