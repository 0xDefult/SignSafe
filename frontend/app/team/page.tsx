"use client";

import { useState, useEffect } from "react";
import { UserPlus, Mail, MoreVertical, Shield, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/signsafe/DashboardLayout";
import { Navbar } from "@/components/signsafe/Navbar";
import { getTeamMembers, updateMemberRole } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useInviteModal } from "@/lib/invite-context";

const roleColors: Record<string, string> = {
  ADMIN: "bg-violet-500/20 text-violet-400",
  MEMBER: "bg-cyan-500/20 text-cyan-400",
  VIEWER: "bg-white/10 text-white/60",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500",
  Away: "bg-yellow-500",
  Inactive: "bg-white/30",
};

export default function TeamPage() {
  const { openModal } = useInviteModal();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        setUserId(session.user.id);

        const { data: myTeams, error: teamsError } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', session.user.id);

        if (teamsError || !myTeams || myTeams.length === 0) {
          setLoading(false);
          return;
        }

        const teamId = myTeams[0].team_id;
        setCurrentTeamId(teamId);
        const membersData = await getTeamMembers(teamId, session.access_token);

        const me = membersData.find((m: any) => m.user_id === session.user.id);
        setUserRole(me?.role);

        setMembers(membersData);
      } catch (e) {
        console.error("Error fetching team:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !currentTeamId) return;

      await updateMemberRole(currentTeamId, userId, newRole, session.access_token);

      const membersData = await getTeamMembers(currentTeamId, session.access_token);
      setMembers(membersData);
    } catch (e) {
      toast.error("Failed to update role");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col">
          <Navbar title="Team" />
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
        <Navbar title="Team" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif text-white mb-1 lg:mb-2">Team</h1>
              <p className="text-sm lg:text-base text-white/60">Manage team members and permissions</p>
            </div>
            {userRole === 'ADMIN' && (
              <button
                onClick={openModal}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 active:scale-95 transition-all text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Invite Member
              </button>
            )}
          </div>

          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 lg:py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white/40" />
              </div>
              <h2 className="text-xl text-white mb-2">No team members found</h2>
              <p className="text-white/60 mb-6">You are currently the only member of this team.</p>
              {userRole === 'ADMIN' && (
                <button
                  onClick={openModal}
                  className="px-6 py-2 bg-violet-500 rounded-lg text-white active:scale-95 transition-all"
                >
                  Invite Your First Member
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{members.length}</div>
                  <div className="text-white/60 text-xs lg:text-sm">Total Members</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="text-2xl lg:text-3xl font-bold text-emerald-400 mb-1">
                    {members.filter(m => m.status === 'Active').length}
                  </div>
                  <div className="text-white/60 text-xs lg:text-sm">Active Now</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="text-2xl lg:text-3xl font-bold text-violet-400 mb-1">
                    {members.reduce((acc, m) => acc + (m.contracts || 0), 0)}
                  </div>
                  <div className="text-white/60 text-xs lg:text-sm">Contracts Reviewed</div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                {/* Mobile: card layout */}
                <div className="lg:hidden divide-y divide-white/5">
                  {members.map((member) => (
                    <div key={member.user_id} className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                            {member.email?.substring(0, 2).toUpperCase() || "??"}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[member.status || 'Active']} rounded-full border-2 border-[#08080F]`} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-medium text-sm truncate">{member.email}</div>
                          <div className="text-white/40 text-xs">{member.status || 'Active'} · {member.contracts || 0} contracts</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${roleColors[member.role] || 'bg-white/10 text-white/60'}`}>
                          {member.role === "ADMIN" && <Shield className="w-3 h-3" />}
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr className="border-b border-white/10">
                        <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Member</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Role</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Contracts</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-white/60">Last Active</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.user_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                                  {member.email?.substring(0, 2).toUpperCase() || "??"}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[member.status || 'Active']} rounded-full border-2 border-[#08080F]`} />
                              </div>
                              <div className="flex flex-col">
                                <div className="text-white font-medium">{member.email}</div>
                                <div className="text-white/40 text-sm flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${roleColors[member.role] || 'bg-white/10 text-white/60'}`}>
                              {member.role === "ADMIN" && <Shield className="w-3 h-3" />}
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white/80">{member.status || 'Active'}</span>
                          </td>
                          <td className="px-6 py-4 text-white/60">{member.contracts || 0}</td>
                          <td className="px-6 py-4 text-white/60">{member.lastActive || 'Recently'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {userRole === 'ADMIN' && member.user_id !== userId && (
                                <button
                                  onClick={() => {
                                    const newRole = prompt("Enter new role (ADMIN, MEMBER, VIEWER):");
                                    if (newRole) handleUpdateRole(member.user_id, newRole.toUpperCase());
                                  }}
                                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-white/40" />
                                </button>
                              )}
                              {userRole === 'ADMIN' && member.user_id !== userId && (
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4 text-white/40" />
                                </button>
                              )}
                              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4 text-white/40" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
