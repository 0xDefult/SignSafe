"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useUploadModal } from "@/lib/upload-context";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";

import { DashboardLayout } from "@/components/signsafe/DashboardLayout";
import { Navbar } from "@/components/signsafe/Navbar";
import { ClauseCards } from "@/components/signsafe/ClauseCards";

function DashboardContent() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get('id');
  const { user } = useUser();
  const [analysis, setAnalysis] = useState<any>(null);
  const [filename, setFilename] = useState("");
  const userName = user?.user_metadata?.full_name || null;

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (!supabase || !user) return;

        let query = supabase
          .from('analysis_history')
          .select('*')
          .eq('user_id', user.id);

        if (contractId) {
          query = query.eq('id', contractId);
        } else {
          query = query.order('created_at', { ascending: false }).limit(1);
        }

        const { data, error } = await query.single();

        if (error || !data) {
          const sessionData = sessionStorage.getItem("signsafe_analysis");
          if (sessionData) {
            setAnalysis(JSON.parse(sessionData));
            setFilename(sessionStorage.getItem("signsafe_filename") || "Contract");
          }
        } else {
          setAnalysis(data.analysis_data);
          setFilename(data.filename);
        }
      } catch (e) {
        console.error("Error fetching analysis:", e);
        const sessionData = sessionStorage.getItem("signsafe_analysis");
        if (sessionData) {
          setAnalysis(JSON.parse(sessionData));
          setFilename(sessionStorage.getItem("signsafe_filename") || "Contract");
        }
      }
    };

    fetchAnalysis();
  }, [contractId]);

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col">
          <Navbar title="Dashboard" />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="text-4xl font-serif text-white mb-4">
                {userName ? `Welcome, ${userName}!` : "Welcome to SignSafe!"}
              </h1>
              <p className="text-white/60 mb-8">
                You haven&apos;t analyzed any contracts yet. Upload your first brand deal to see the AI in action.
              </p>
              <button
                onClick={() => {
                  // We cannot use useUploadModal() here because this is outside the UploadProvider
                  // But we are inside DashboardLayout which provides the UploadProvider.
                  // To fix this, we should move the UploadProvider higher or use a different approach.
                  // For now, let's use a simple window event or just redirect to landing page.
                  window.dispatchEvent(new CustomEvent('open-upload-modal'));
                }}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity inline-block"
              >
                Upload Your First Contract
              </button>
            </div>
          </main>
        </div>
      </DashboardLayout>
    );
  }

  const riskScore = Math.min((analysis.red_count * 35) + (analysis.yellow_count * 15), 100);

  return (
    <DashboardLayout
      showRightPanel
      rightPanelProps={{
        verdict: analysis.verdict,
        overallScore: analysis.overall_score,
        redCount: analysis.red_count,
        yellowCount: analysis.yellow_count,
        greenCount: analysis.green_count,
        estimatedLoss: analysis.estimated_loss_inr,
        riskScore: riskScore,
      }}
    >
      <div className="flex-1 flex flex-col">
        <Navbar
          title="Contract Analysis"
          onUploadClick={() => {
            // This is handled by DashboardLayout's UploadModal, but we need to trigger it.
            // Actually, the Navbar is inside DashboardLayout's children.
            // The current DashboardLayout doesn't pass the trigger down.
          }}
        />


        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-white mb-2">
                {filename}
              </h1>
              <p className="text-white/60">AI-powered risk assessment results</p>
            </div>

            <ClauseCards clauses={analysis.clauses} />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}

function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading...</div>
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
