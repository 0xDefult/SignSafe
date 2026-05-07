"use client";

import { TrendingUp, TrendingDown, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Sidebar } from "@/components/signsafe/Sidebar";

const stats = [
  {
    label: "Total Contracts",
    value: "142",
    change: "+12%",
    trend: "up",
    icon: FileText,
  },
  {
    label: "High Risk Flagged",
    value: "23",
    change: "-8%",
    trend: "down",
    icon: AlertTriangle,
  },
  {
    label: "Approved",
    value: "89",
    change: "+15%",
    trend: "up",
    icon: CheckCircle,
  },
  {
    label: "Pending Review",
    value: "30",
    change: "+5%",
    trend: "up",
    icon: Clock,
  },
];

const riskBreakdown = [
  { label: "Low Risk", count: 67, percentage: 47, color: "bg-emerald-500" },
  { label: "Medium Risk", count: 52, percentage: 37, color: "bg-yellow-500" },
  { label: "High Risk", count: 23, percentage: 16, color: "bg-red-500" },
];

const recentActivity = [
  { action: "Contract approved", contract: "NDA - Phoenix", time: "2 hours ago" },
  { action: "New flag added", contract: "MSA v2.1", time: "4 hours ago" },
  { action: "Contract uploaded", contract: "Vendor Agreement", time: "6 hours ago" },
  { action: "Risk score updated", contract: "License Agreement", time: "8 hours ago" },
  { action: "Review completed", contract: "Employment Contract", time: "1 day ago" },
];

export default function AnalyticsPage() {
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
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
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
            {riskBreakdown.map((risk) => (
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
              <span className="text-yellow-400 font-medium">58% (Medium)</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-white/80">{activity.action}</div>
                  <div className="text-white/40 text-sm">{activity.contract}</div>
                </div>
                <span className="text-white/40 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
