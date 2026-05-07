"use client";

import { useState } from "react";
import { UserPlus, Mail, MoreVertical, Shield, Edit, Trash2 } from "lucide-react";
import { Sidebar } from "@/components/signsafe/Sidebar";
import InviteModal from "@/components/signsafe/InviteModal";

const teamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex.chen@company.com",
    role: "Admin",
    status: "Active",
    avatar: "AC",
    contracts: 45,
    lastActive: "2 minutes ago",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Legal Analyst",
    status: "Active",
    avatar: "SJ",
    contracts: 32,
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Michael Park",
    email: "m.park@company.com",
    role: "Reviewer",
    status: "Active",
    avatar: "MP",
    contracts: 28,
    lastActive: "3 hours ago",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@company.com",
    role: "Legal Analyst",
    status: "Away",
    avatar: "ED",
    contracts: 19,
    lastActive: "1 day ago",
  },
  {
    id: 5,
    name: "James Wilson",
    email: "j.wilson@company.com",
    role: "Viewer",
    status: "Inactive",
    avatar: "JW",
    contracts: 0,
    lastActive: "1 week ago",
  },
];

const roleColors: Record<string, string> = {
  Admin: "bg-violet-500/20 text-violet-400",
  "Legal Analyst": "bg-cyan-500/20 text-cyan-400",
  Reviewer: "bg-emerald-500/20 text-emerald-400",
  Viewer: "bg-white/10 text-white/60",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500",
  Away: "bg-yellow-500",
  Inactive: "bg-white/30",
};

export default function TeamPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#08080F" }}>
      <Sidebar />
      <div className="flex-1 p-8" style={{ marginLeft: 240 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-white mb-2">Team</h1>
            <p className="text-white/60">Manage team members and permissions</p>
          </div>
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">5</div>
            <div className="text-white/60 text-sm">Total Members</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold text-emerald-400 mb-1">3</div>
            <div className="text-white/60 text-sm">Active Now</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold text-violet-400 mb-1">124</div>
            <div className="text-white/60 text-sm">Contracts Reviewed</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
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
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                          {member.avatar}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[member.status]} rounded-full border-2 border-[#08080F]`} />
                      </div>
                      <div>
                        <div className="text-white font-medium">{member.name}</div>
                        <div className="text-white/40 text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${roleColors[member.role]}`}>
                      {member.role === "Admin" && <Shield className="w-3 h-3" />}
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/80">{member.status}</span>
                  </td>
                  <td className="px-6 py-4 text-white/60">{member.contracts}</td>
                  <td className="px-6 py-4 text-white/60">{member.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-white/40" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-white/40" />
                      </button>
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

      {/* Invite Modal */}
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
}
