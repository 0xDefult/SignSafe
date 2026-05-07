"use client";

import { useState } from "react";
import { Shield, Zap, FileSearch, ArrowRight, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Risk Analysis",
    description: "AI-powered risk detection identifies potential issues before you sign.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Upload contracts and get detailed analysis in under 60 seconds.",
  },
  {
    icon: FileSearch,
    title: "Clause Detection",
    description: "Automatically identify and flag problematic clauses and terms.",
  },
];

const benefits = [
  "Reduce contract review time by 80%",
  "Identify hidden risks instantly",
  "AI trained on millions of contracts",
  "Enterprise-grade security",
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "#08080F" }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ background: "rgba(8, 8, 15, 0.8)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="text-white font-semibold text-lg">SignSafe</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-white/60 hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="text-white/60 hover:text-white transition-colors">Log In</Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-violet-300 text-sm">AI-Powered Contract Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
            Is it <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">safe</span> to sign?
          </h1>
          
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            SignSafe uses advanced AI to analyze contracts, detect risks, and protect your interests before you commit.
          </p>

          {/* Signup Form */}
          {submitted ? (
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-emerald-300">Thanks! Check your email to get started.</span>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-white/40 text-sm mt-4">No credit card required. 14-day free trial.</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-white/60">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Contract analysis, reimagined
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Our AI understands legal language and identifies risks that humans often miss.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-violet-500/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Ready to sign with confidence?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Join thousands of businesses protecting themselves with AI-powered contract analysis.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <span className="text-white/60 text-sm">SignSafe</span>
          </div>
          <p className="text-white/40 text-sm">© 2026 SignSafe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
