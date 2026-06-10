"use client";

import { Menu, Upload, Plus, UserPlus } from "lucide-react";
import { useUploadModal } from "@/lib/upload-context";
import { useInviteModal } from "@/lib/invite-context";
import { useMobileSidebar } from "@/lib/mobile-sidebar-context";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const { openModal: openUpload } = useUploadModal();
  const { openModal: openInvite } = useInviteModal();
  const { toggle } = useMobileSidebar();

  return (
    <nav className="h-14 border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggle}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors -ml-1"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-[15px] lg:text-base font-semibold text-foreground tracking-[-0.01em]">{title}</h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={openInvite}
          className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-white/5 border border-white/10 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-white/10 active:scale-95 transition-all tracking-[-0.005em]"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Invite</span>
        </button>
        <button
          onClick={openUpload}
          className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-xs lg:text-sm font-medium rounded-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload New</span>
        </button>

        <button className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center hover:bg-surface-2 active:scale-95 transition-all">
          <Plus className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </nav>
  );
}
