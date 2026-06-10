"use client";

import { useEffect, useState } from "react";
import { FileText, Search, Filter, MoreVertical, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Sidebar } from "@/components/signsafe/Sidebar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
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
    // Wait for auth to initialise before attempting fetch
    if (authLoading) return;

    const fetchContracts = async () => {
      try {
        if (!supabase || !user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('analysis_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped = (data || []).map(c => ({
          id: c.id,
          name: c.filename,
          project: "General",
          status: "Analyzed",
          risk: c.overall_score === 'red' ? 'High' : c.overall_score === 'yellow' ? 'Medium' : 'Low',
          riskColor: c.overall_score === 'red' ? 'text-red-400' : c.overall_score === 'yellow' ? 'text-yellow-400' : 'text-emerald-400',
          date: new Date(c.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          pages: 'N/A',
        }));
        setContracts(mapped);
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
      <div className="min-h-screen flex" style={{ background: "#08080F" }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: 240 }}>
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#08080F" }}>
      <Sidebar />
      <div className="flex-1 p-8" style={{ marginLeft: 240 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Contracts</h1>
          <p className="text-white/60">Manage and review all your contracts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search contracts..."
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 text-lg mb-2">No contracts yet</p>
          <p className="text-white/40 text-sm">
            {user ? "Upload a contract from the Dashboard to see it here." : "Sign in to view your contracts."}
          </p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Contract Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Project</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Risk Level</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Pages</th>
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
                  <td className="px-6 py-4 text-white/60">{contract.project}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {statusIcon(contract.status)}
                      <span className="text-white/80">{contract.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={contract.riskColor}>{contract.risk}</span>
                  </td>
                  <td className="px-6 py-4 text-white/60">{contract.pages}</td>
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
      )}
      </div>
    </div>
  );
}
