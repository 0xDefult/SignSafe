"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Sidebar } from "@/components/signsafe/Sidebar";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: contracts, error } = await supabase
          .from('analysis_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const total = contracts.length;
        const red = contracts.filter(c => c.overall_score === 'red').length;
        const yellow = contracts.filter(c => c.overall_score === 'yellow').length;
        const green = contracts.filter(c => c.overall_score === 'green').length;

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
          recent: contracts.slice(0, 5).map(c => ({
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ background: "#08080F" }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: 240 }}>
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex" style={{ background: "#08080F" }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: 240 }}>
          <p className="text-white/60">No analytics data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#08080F" }}>
      <Sidebar />
      <div className="flex-1 p-8" style={{ marginLeft: 240 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Analytics</h1>
        <p className="text-white/60">Track contract performance and risk metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Contracts", value: stats.totals.total, icon: FileText, trend: stats.totals.total > 0 ? "up" : "neutral", change: "0%" },
          { label: "High Risk Flagged", value: stats.totals.highRisk, icon: AlertTriangle, trend: "down", change: "0%" },
          { label: "Approved", value: stats.totals.approved, icon: CheckCircle, trend: "up", change: "0%" },
          { label: "Pending Review", value: stats.totals.pending, icon: Clock, trend: "neutral", change: "0%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-emerald-400" : stat.trend === "down" ? "text-red-400" : "text-white/40"}`}>
                {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : stat.trend === "down" ? <TrendingDown className="w-4 h-4" /> : null}
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-white/60 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Risk Breakdown */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Risk Breakdown</h2>
          <div className="space-y-4">
            {stats.breakdown.map((risk) => (
              <div key={risk.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">{risk.label}</span>
                  <span className="text-white/60">{risk.count} contracts ({risk.percentage}%)</span>
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
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Average Risk Score</span>
              <span className="text-yellow-400 font-medium">{stats.avgScore}% ({stats.avgScore > 60 ? 'High' : stats.avgScore > 40 ? 'Medium' : 'Low'})</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recent.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-white/80 text-sm">{activity.action}</div>
                    <div className="text-white/40 text-xs">{activity.contract}</div>
                  </div>
                </div>
                <span className="text-white/40 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
