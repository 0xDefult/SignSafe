"use client";

import { MessageCircle, Book, Video, Mail, ChevronRight, Search, ExternalLink } from "lucide-react";
import { Sidebar } from "@/components/signsafe/Sidebar";

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    action: "Start Chat",
    color: "violet",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message",
    action: "Send Email",
    color: "cyan",
  },
  {
    icon: Book,
    title: "Documentation",
    description: "Browse our comprehensive guides",
    action: "View Docs",
    color: "emerald",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Learn with step-by-step videos",
    action: "Watch Now",
    color: "yellow",
  },
];

const faqs = [
  {
    question: "How does the AI analyze contracts?",
    answer: "SignSafe uses advanced natural language processing to identify key clauses, potential risks, and compliance issues in your contracts.",
  },
  {
    question: "What file formats are supported?",
    answer: "We support PDF, DOCX, DOC, and TXT files. Maximum file size is 50MB per document.",
  },
  {
    question: "How accurate is the risk assessment?",
    answer: "Our AI achieves 94% accuracy in identifying high-risk clauses, validated against expert legal reviews.",
  },
  {
    question: "Can I export analysis reports?",
    answer: "Yes, you can export detailed reports in PDF, Excel, or JSON formats from any contract analysis.",
  },
  {
    question: "Is my data secure?",
    answer: "All documents are encrypted at rest and in transit. We are SOC 2 Type II certified and GDPR compliant.",
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  violet: { bg: "bg-violet-500/20", text: "text-violet-400" },
  cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  emerald: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
};

export default function SupportPage() {
  return (
    <div className="min-h-screen flex" style={{ background: "#08080F" }}>
      <Sidebar />
      <div className="flex-1 p-8" style={{ marginLeft: 240 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Support</h1>
        <p className="text-white/60">Get help and find answers to your questions</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Search for help articles, tutorials, and more..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50"
        />
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {supportOptions.map((option) => (
          <button
            key={option.title}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-xl ${colorClasses[option.color].bg} flex items-center justify-center mb-4`}>
              <option.icon className={`w-6 h-6 ${colorClasses[option.color].text}`} />
            </div>
            <h3 className="text-white font-semibold mb-1">{option.title}</h3>
            <p className="text-white/40 text-sm mb-4">{option.description}</p>
            <div className="flex items-center gap-2 text-violet-400 text-sm font-medium">
              {option.action}
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group border-b border-white/5 last:border-0 pb-4 last:pb-0">
              <summary className="flex items-center justify-between cursor-pointer list-none py-2">
                <span className="text-white/80 font-medium">{faq.question}</span>
                <ChevronRight className="w-5 h-5 text-white/40 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-white/50 mt-2 pl-0">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Card */}
      <div className="mt-8 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg mb-1">Still need help?</h3>
          <p className="text-white/60">Our support team is available 24/7 to assist you.</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
          Contact Support
        </button>
      </div>
      </div>
    </div>
  );
}
