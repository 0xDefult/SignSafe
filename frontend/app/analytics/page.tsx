"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/signsafe/DashboardLayout";
import { Navbar } from "@/components/signsafe/Navbar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { getLocalHistory } from "@/lib/local-history";

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const fetchAnalytics = async () => {
      try {
        const allContracts: any[] = [];

        // 1. Load from Supabase if authenticated
        if (supabase && user) {
          const { data, error } = await supabase
            .from('analysis_history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            allContracts.push(...data);
          }
        }

        // 2. Merge local history (deduplicate by filename)
        const seenFilenames = new Set(allContracts.map(c => c.filename));
        const localHistory = getLocalHistory();
        for (const entry of localHistory) {
          if (!seenFilenames.has(entry.filename)) {
            seenFilenames.add(entry.filename);
            allContracts.push({
              filename: entry.filename,
              overall_score: entry.overall_score,
              created_at: entry.created_at,
              // minimal shape for stats
            });
          }
        }

        const total = allContracts.length;
        const red = allContracts.filter(c => c.overall_score === 'red').length;
        const yellow = allContracts.filter(c => c.overall_score === 'yellow').length;
        const green = allContracts.filter(c => c.overall_score === 'green').length;

        const avgScore = total === 0 ? 0 :
          Math.round(((red * 80) + (yellow * 50) + (green * 20)) / total);

        setStats({
          totals: {
            total,
            highRisk: red,
            approved: green,
            pending: 0,
          },
          breakdown: [
            { label: "Low Risk", count: green, percentage: total === 0 ? 0 : Math.round((green / total) * 100), color: "bg-emerald-500" },
            { label: "Medium Risk", count: yellow, percentage: total === 0 ? 0 : Math.round((yellow / total) * 100), color: "bg-yellow-500" },
            { label: "High Risk", count: red, percentage: total === 0 ? 0 : Math.round((red / total) * 100), color: "bg-red-500" },
          ],
          recent: allContracts.slice(0, 5).map(c => ({
            action: "Contract analyzed",
            contract: c.filename,
            time: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          })),
          avgScore
        });
      } catch (e) {
        console.error("Error fetching analytics:", e instanceof Error ? e.message : e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col">
          <Navbar title="Analytics" />
          <main className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </main>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col">
          <Navbar title="Analytics" />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-2">No analytics data available yet</p>
              <p className="text-white/40 text-sm">
                {user ? "Analyze some contracts to see your stats here." : "Sign in to view analytics."}
              </p>
            </div>
          </main>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col">
        <Navbar title="Analytics" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-serif text-white mb-1 lg:mb-2">Analytics</h1>
            <p className="text-sm lg:text-base text-white/60">Track contract performance and risk metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
            {[
              { label: "Total Contracts", value: stats.totals.total, icon: FileText },
              { label: "High Risk", value: stats.totals.highRisk, icon: AlertTriangle },
              { label: "Approved", value: stats.totals.approved, icon: CheckCircle },
              { label: "Pending", value: stats.totals.pending, icon: Clock },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-violet-400" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-xs lg:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Risk Breakdown */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">Risk Breakdown</h2>
              <div className="space-y-3 lg:space-y-4">
                {stats.breakdown.map((risk) => (
                  <div key={risk.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">{risk.label}</span>
                      <span className="text-white/60 text-xs lg:text-sm">{risk.count} ({risk.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${risk.color} rounded-full transition-all duration-500`}
                        style={{ width: `${risk.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs lg:text-sm">
                  <span className="text-white/60">Average Risk Score</span>
                  <span className="text-yellow-400 font-medium">{stats.avgScore}% ({stats.avgScore > 60 ? 'High' : stats.avgScore > 40 ? 'Medium' : 'Low'})</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">Recent Activity</h2>
              {stats.recent.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-white/40 text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3 lg:space-y-4">
                  {stats.recent.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-violet-400" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="text-white/80 text-sm truncate">{activity.action}</div>
                          <div className="text-white/40 text-xs truncate">{activity.contract}</div>
                        </div>
                      </div>
                      <span className="text-white/40 text-xs shrink-0 ml-2">{activity.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
