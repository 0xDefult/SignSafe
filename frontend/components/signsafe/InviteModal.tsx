"use client";

import { useState } from "react";
import { X, Mail, Send, UserPlus, Check } from "lucide-react";
import { inviteTeamMember } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useInviteModal } from "@/lib/invite-context";

const roles = [
  { id: "admin", label: "Admin", description: "Full access to all features" },
  { id: "analyst", label: "Legal Analyst", description: "Can review and analyze contracts" },
  { id: "reviewer", label: "Reviewer", description: "Can view and comment on contracts" },
  { id: "viewer", label: "Viewer", description: "Read-only access" },
];

export default function InviteModal() {
  const { isOpen, closeModal } = useInviteModal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("analyst");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email || !name) return;
    setSending(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      const { data: teams } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', session.user.id);

      if (!teams || teams.length === 0) {
        throw new Error("You must create a team before inviting members");
      }

      const teamId = teams[0].team_id;
      await inviteTeamMember(teamId, email, name, selectedRole.toUpperCase(), session.access_token);

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setEmail("");
        setName("");
        closeModal();
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

      <div className="relative bg-[#0D0D14] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Invite Team Member</h2>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {sent ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">Invitation Sent!</h3>
            <p className="text-white/60">An invitation has been sent to {email}</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40">
                  <UserPlus className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white/60 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white/60 text-sm mb-2">Select Role</label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                      selectedRole === role.id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === role.id
                          ? "border-violet-500 bg-violet-500"
                          : "border-white/30"
                      }`}
                    >
                      {selectedRole === role.id && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{role.label}</div>
                      <div className="text-white/40 text-sm">{role.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!email || !name || sending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
