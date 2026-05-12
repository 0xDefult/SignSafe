"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/signsafe/Sidebar";
import { Navbar } from "@/components/signsafe/Navbar";
import { ClauseCards } from "@/components/signsafe/ClauseCards";
import { RiskGauge } from "@/components/signsafe/RiskGauge";
import { RightPanel } from "@/components/signsafe/RightPanel";
import { formatINR } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>(null);
  const [filename, setFilename] = useState("");

  useEffect(() => {
    const data = sessionStorage.getItem("signsafe_analysis");
    if (!data) {
      router.push("/");
      return;
    }
    setAnalysis(JSON.parse(data));
    setFilename(sessionStorage.getItem("signsafe_filename") || "Contract");
  }, [router]);

  if (!analysis) return null;

  const riskScore = Math.min((analysis.red_count * 35) + (analysis.yellow_count * 15), 100);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar title="Contract Analysis" />

        <main className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-serif text-white mb-2">
                  {filename}
                </h1>
                <p className="text-white/60">AI-powered risk assessment results</p>
              </div>

              <ClauseCards clauses={analysis.clauses} />
            </div>
          </div>

          {/* Right Panel - Risk Summary */}
          // @ts-ignore
          <RightPanel
            verdict={analysis.verdict}
            overallScore={analysis.overall_score}
            redCount={analysis.red_count}
            yellowCount={analysis.yellow_count}
            greenCount={analysis.green_count}
            estimatedLoss={analysis.estimated_loss_inr}
            riskScore={riskScore}
          />
        </main>
      </div>
    </div>
  );
}
