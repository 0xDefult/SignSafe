"use client";

import React, { createContext, useContext, useState } from "react";

interface InviteContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const InviteContext = createContext<InviteContextType | undefined>(undefined);

export function InviteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <InviteContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </InviteContext.Provider>
  );
}

export function useInviteModal() {
  const context = useContext(InviteContext);
  if (!context) {
    throw new Error("useInviteModal must be used within an InviteProvider");
  }
  return context;
}
