"use client";

import { useState } from "react";
import { X, Mail, Send, UserPlus, Check } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roles = [
  { id: "admin", label: "Admin", description: "Full access to all features" },
  { id: "analyst", label: "Legal Analyst", description: "Can review and analyze contracts" },
  { id: "reviewer", label: "Reviewer", description: "Can view and comment on contracts" },
  { id: "viewer", label: "Viewer", description: "Read-only access" },
];

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("analyst");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email) return;
    setSending(true);
    // Simulate sending invitation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail("");
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#0D0D14] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Invite Team Member</h2>
          </div>
          <button
            onClick={onClose}
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
            {/* Email Input */}
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

            {/* Role Selection */}
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

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!email || sending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
