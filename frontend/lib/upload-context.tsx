"use client";

import React, { createContext, useContext, useState } from "react";

interface UploadContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <UploadContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUploadModal() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploadModal must be used within an UploadProvider");
  }
  return context;
}
