"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Step = "request" | "sent" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  /* ── Step 1: Request reset email ── */
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setEmailError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Please enter a valid email"); return; }

    setLoading(true);
    try {
      if (!supabase) throw new Error("Authentication service unavailable");
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      setStep("sent");
    } catch (err: any) {
      setEmailError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify OTP code ── */
  const handleCodeChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    setCodeError("");
    if (value && index < 5) {
      const nextEl = document.getElementById(`otp-${index + 1}`);
      nextEl?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevEl = document.getElementById(`otp-${index - 1}`);
      prevEl?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.some((d) => !d)) { setCodeError("Please enter the full 6-digit code"); return; }

    setLoading(true);
    try {
      if (!supabase) throw new Error("Authentication service unavailable");
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code.join(''),
        type: 'recovery'
      });
      if (error) throw error;
      setStep("reset");
    } catch (err: any) {
      setCodeError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: Set new password ── */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newPassword) errs.newPassword = "Password is required";
    else if (newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) { setPasswordErrors(errs); return; }

    setLoading(true);
    try {
      if (!supabase) throw new Error("Authentication service unavailable");
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      setStep("done");
    } catch (err: any) {
      setPasswordErrors({ global: err.message || "Failed to reset password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none transition-colors text-sm";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: "#08080F" }}>
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

        {/* ── STEP 1: Request ── */}
        {step === "request" && (
          <>
            <div className="mb-8">
              <Link href="/login" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
              <h1 className="text-3xl font-serif text-white mb-2">Forgot your password?</h1>
              <p className="text-white/50 leading-relaxed">
                No worries. Enter your email address and we&apos;ll send you a reset code.
              </p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-5">
              <div>
                <label className="block text-white/60 text-sm mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    placeholder="alex@company.com"
                    className={inputBase}
                    style={{ ...inputStyle, borderColor: emailError ? "#EF4444" : "rgba(255,255,255,0.1)" }}
                    onFocus={e => !emailError && (e.currentTarget.style.borderColor = "#7C3AED")}
                    onBlur={e => !emailError && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                {emailError && <p className="text-red-400 text-xs mt-1.5">{emailError}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold transition-opacity disabled:opacity-50 hover:opacity-90 active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Reset Code <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: Enter OTP ── */}
        {step === "sent" && (
          <>
            <div className="mb-8">
              <button onClick={() => setStep("request")} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <Mail className="w-7 h-7" style={{ color: "#7C3AED" }} />
              </div>
              <h1 className="text-3xl font-serif text-white mb-2">Check your email</h1>
              <p className="text-white/50 leading-relaxed">
                We sent a 6-digit code to <span className="text-white/80">{email}</span>. Enter it below to continue.
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-white/60 text-sm mb-4">Verification Code</label>
                <div className="flex gap-3 justify-between">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-12 h-14 rounded-xl text-center text-white text-xl font-bold focus:outline-none transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${codeError ? "#EF4444" : digit ? "#7C3AED" : "rgba(255,255,255,0.1)"}`,
                      }}
                    />
                  ))}
                </div>
                {codeError && <p className="text-red-400 text-xs mt-3">{codeError}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold transition-opacity disabled:opacity-50 hover:opacity-90 active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify Code <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <p className="text-center text-white/40 text-sm">
                {"Didn't receive it?"}{" "}
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="transition-colors"
                  style={{ color: "#7C3AED" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#06B6D4")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#7C3AED")}
                >
                  Resend code
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === "reset" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-white mb-2">Set new password</h1>
              <p className="text-white/50 leading-relaxed">
                Choose a strong password you haven&apos;t used before.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-white/60 text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors((p) => ({ ...p, newPassword: "" })); }}
                  placeholder="Min. 8 characters"
                  className={inputBase}
                  style={{ ...inputStyle, borderColor: passwordErrors.newPassword ? "#EF4444" : "rgba(255,255,255,0.1)", paddingLeft: "1rem" }}
                  onFocus={e => !passwordErrors.newPassword && (e.currentTarget.style.borderColor = "#7C3AED")}
                  onBlur={e => !passwordErrors.newPassword && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                {passwordErrors.newPassword && <p className="text-red-400 text-xs mt-1.5">{passwordErrors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors((p) => ({ ...p, confirmPassword: "" })); }}
                  placeholder="Re-enter your password"
                  className={inputBase}
                  style={{ ...inputStyle, borderColor: passwordErrors.confirmPassword ? "#EF4444" : "rgba(255,255,255,0.1)", paddingLeft: "1rem" }}
                  onFocus={e => !passwordErrors.confirmPassword && (e.currentTarget.style.borderColor = "#7C3AED")}
                  onBlur={e => !passwordErrors.confirmPassword && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                {passwordErrors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{passwordErrors.confirmPassword}</p>}
              </div>

              <ul className="space-y-1.5">
                {[
                  ["At least 8 characters", newPassword.length >= 8],
                  ["One uppercase letter", /[A-Z]/.test(newPassword)],
                  ["One number", /[0-9]/.test(newPassword)],
                ].map(([rule, met]) => (
                  <li key={rule as string} className="flex items-center gap-2 text-xs" style={{ color: met ? "#06B6D4" : "rgba(255,255,255,0.3)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: met ? "#06B6D4" : "rgba(255,255,255,0.2)" }} />
                    {rule as string}
                  </li>
                ))}
              </ul>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold transition-opacity disabled:opacity-50 hover:opacity-90 active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Reset Password <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
              {passwordErrors.global && <p className="text-red-400 text-xs mt-3 text-center">{passwordErrors.global}</p>}
            </form>
          </>
        )}

        {/* ── STEP 4: Done ── */}
        {step === "done" && (
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: "#10B981" }} />
            </div>
            <h1 className="text-3xl font-serif text-white mb-3">Password reset!</h1>
            <p className="text-white/50 leading-relaxed mb-10">
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
            >
              Back to Login <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
