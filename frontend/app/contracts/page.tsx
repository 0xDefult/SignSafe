"use client";

import { useEffect, useState } from "react";
import { FileText, Search, Filter, MoreVertical, CheckCircle, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/signsafe/DashboardLayout";
import { Navbar } from "@/components/signsafe/Navbar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { getLocalHistory, type LocalHistoryEntry } from "@/lib/local-history";
import Link from "next/link";

const statusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case "Flagged":
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-400" />;
  }
};

export default function ContractsPage() {
  const { user, loading: authLoading } = useUser();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const fetchContracts = async () => {
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
            allContracts.push(...data.map(c => ({
              id: c.id,
              name: c.filename,
              status: "Analyzed",
              risk: c.overall_score === 'red' ? 'High' : c.overall_score === 'yellow' ? 'Medium' : 'Low',
              riskColor: c.overall_score === 'red' ? 'text-red-400' : c.overall_score === 'yellow' ? 'text-yellow-400' : 'text-emerald-400',
              date: new Date(c.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
              source: 'supabase' as const,
            })));
          }
        }

        // 2. Merge local history (deduplicate by filename + date)
        const seen = new Set(allContracts.map(c => `${c.name}|${c.date}`));
        const localHistory = getLocalHistory();
        for (const entry of localHistory) {
          const dateStr = new Date(entry.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
          const key = `${entry.filename}|${dateStr}`;
          if (!seen.has(key)) {
            seen.add(key);
            allContracts.push({
              id: entry.id,
              name: entry.filename,
              status: "Analyzed",
              risk: entry.overall_score === 'red' ? 'High' : entry.overall_score === 'yellow' ? 'Medium' : 'Low',
              riskColor: entry.overall_score === 'red' ? 'text-red-400' : entry.overall_score === 'yellow' ? 'text-yellow-400' : 'text-emerald-400',
              date: dateStr,
              source: 'local' as const,
            });
          }
        }

        // Sort by date descending (most recent first)
        allContracts.sort((a, b) => {
          const da = new Date(a.date);
          const db = new Date(b.date);
          return isNaN(db.getTime()) || isNaN(da.getTime()) ? 0 : db.getTime() - da.getTime();
        });

        setContracts(allContracts);
      } catch (e) {
        console.error("Error fetching contracts:", e instanceof Error ? e.message : e);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col">
          <Navbar title="Contracts" />
          <main className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </main>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col">
        <Navbar title="Contracts" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-serif text-white mb-1 lg:mb-2">Contracts</h1>
            <p className="text-sm lg:text-base text-white/60">Manage and review all your contracts</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search contracts..."
                className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {contracts.length === 0 ? (
            <div className="text-center py-16 lg:py-20">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-2">No contracts yet</p>
              <p className="text-white/40 text-sm">
                {user ? "Upload a contract from the Dashboard to see it here." : "Sign in to view your contracts."}
              </p>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {/* Mobile: card layout */}
              <div className="lg:hidden divide-y divide-white/5">
                {contracts.map((contract) => (
                  <Link key={contract.id} href={`/dashboard?id=${contract.id}`} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{contract.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={contract.riskColor + " text-xs"}>{contract.risk} Risk</span>
                        <span className="text-white/40 text-xs">{contract.date}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </Link>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Contract Name</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Risk Level</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Date</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr key={contract.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                          <Link href={`/dashboard?id=${contract.id}`} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-violet-400" />
                            </div>
                            <span className="text-white font-medium">{contract.name}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {statusIcon(contract.status)}
                            <span className="text-white/80">{contract.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={contract.riskColor}>{contract.risk}</span>
                        </td>
                        <td className="px-6 py-4 text-white/60">{contract.date}</td>
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-white/40" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
