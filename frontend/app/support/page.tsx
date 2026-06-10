"use client";

import { MessageCircle, Book, Video, Mail, ChevronRight, Search, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/signsafe/DashboardLayout";
import { Navbar } from "@/components/signsafe/Navbar";

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
    href: "mailto:onesattyam@gmail.com",
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
    <DashboardLayout>
      <div className="flex-1 flex flex-col">
        <Navbar title="Support" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-serif text-white mb-1 lg:mb-2">Support</h1>
            <p className="text-sm lg:text-base text-white/60">Get help and find answers to your questions</p>
          </div>

          {/* Search */}
          <div className="relative mb-6 lg:mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search for help articles, tutorials, and more..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 lg:py-4 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
            {supportOptions.map((option) => {
              const Wrapper = (option as any).href ? 'a' : 'button';
              const extraProps = (option as any).href
                ? { href: (option as any).href, target: '_blank', rel: 'noopener noreferrer' }
                : {};
              return (
                <Wrapper
                  key={option.title}
                  {...extraProps}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:p-6 text-left hover:bg-white/10 transition-colors group block"
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${colorClasses[option.color].bg} flex items-center justify-center mb-3 lg:mb-4`}>
                    <option.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${colorClasses[option.color].text}`} />
                  </div>
                  <h3 className="text-white font-semibold text-sm lg:text-base mb-1">{option.title}</h3>
                  <p className="text-white/40 text-xs lg:text-sm mb-3 lg:mb-4">{option.description}</p>
                  <div className="flex items-center gap-2 text-violet-400 text-xs lg:text-sm font-medium">
                    {option.action}
                    <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Wrapper>
              );
            })}
          </div>

          {/* FAQs */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3 lg:space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group border-b border-white/5 last:border-0 pb-3 lg:pb-4 last:pb-0">
                  <summary className="flex items-center justify-between cursor-pointer list-none py-2">
                    <span className="text-white/80 font-medium text-sm lg:text-base pr-4">{faq.question}</span>
                    <ChevronRight className="w-5 h-5 text-white/40 group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <p className="text-white/50 text-sm mt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="mt-6 lg:mt-8 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-white/10 rounded-2xl p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold text-base lg:text-lg mb-1">Still need help?</h3>
              <p className="text-white/60 text-sm">Our support team is available 24/7 to assist you.</p>
            </div>
            <a
              href="mailto:onesattyam@gmail.com"
              className="inline-block px-5 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity shrink-0 no-underline"
            >
              Contact Support
            </a>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
