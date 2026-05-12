"use client";

import { Upload, Plus } from "lucide-react";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <nav className="h-14 border-b border-border flex items-center justify-between px-6">
      <h1 className="text-lg font-medium text-foreground">{title}</h1>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-medium rounded-lg hover:brightness-110 active:scale-95 transition-all">
          <Upload className="w-4 h-4" />
          Upload New
        </button>

        <button className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center hover:bg-surface-2 active:scale-95 transition-all">
          <Plus className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </nav>
  );
}