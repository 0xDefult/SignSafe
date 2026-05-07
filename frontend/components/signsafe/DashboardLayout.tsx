"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import UploadModal from "./UploadModal";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
}

export function DashboardLayout({ children, showRightPanel = false }: DashboardLayoutProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#08080F" }}>
      <Sidebar />
      <main
        className="flex-1 min-h-screen overflow-y-auto"
        style={{ marginLeft: 240, marginRight: showRightPanel ? 300 : 0 }}
      >
        {children}
      </main>
      {showRightPanel && <RightPanel onUploadClick={() => setIsUploadOpen(true)} />}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
