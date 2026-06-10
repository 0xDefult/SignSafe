"use client";

import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import UploadModal from "./UploadModal";
import { UploadProvider, useUploadModal } from "@/lib/upload-context";
import { useEffect } from "react";

interface RightPanelProps {
  verdict: string;
  overallScore: string;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  estimatedLoss: number;
  riskScore: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
  rightPanelProps?: RightPanelProps;
}

function LayoutContent({
  children,
  showRightPanel,
  rightPanelProps,
}: {
  children: React.ReactNode;
  showRightPanel?: boolean;
  rightPanelProps?: RightPanelProps;
}) {
  const { isOpen, closeModal, openModal } = useUploadModal();

  useEffect(() => {
    const handleOpenModal = () => openModal();
    window.addEventListener('open-upload-modal', handleOpenModal);
    return () => window.removeEventListener('open-upload-modal', handleOpenModal);
  }, [openModal]);

  return (
    <div className="flex min-h-screen" style={{ background: "#08080F" }}>
      <Sidebar />

      {/* Main content — responsive margins: no margin on mobile (sidebar is overlay), full margins on desktop */}
      <main
        className="flex-1 min-h-screen overflow-y-auto ml-0 lg:ml-60 transition-all duration-300"
        style={{ marginRight: showRightPanel ? undefined : 0 }}
      >
        <div className={showRightPanel ? "lg:mr-[300px]" : ""}>
          {children}
        </div>
      </main>

      {/* RightPanel — hidden on mobile, visible on lg+ */}
      {showRightPanel && rightPanelProps && (
        <div className="hidden lg:block">
          <RightPanel
            {...rightPanelProps}
            onUploadClick={openModal}
          />
        </div>
      )}

      <UploadModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}

export function DashboardLayout({
  children,
  showRightPanel = false,
  rightPanelProps,
}: DashboardLayoutProps) {
  return (
    <UploadProvider>
      <LayoutContent
        children={children}
        showRightPanel={showRightPanel}
        rightPanelProps={rightPanelProps}
      />
    </UploadProvider>
  );
}
