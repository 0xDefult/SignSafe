"use client";

import { useState } from "react";
import { Bell, Shield, Eye, Palette, Globe, Key } from "lucide-react";
import { Sidebar } from "@/components/signsafe/Sidebar";

const settingsSections = [
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Manage how you receive alerts and updates",
    settings: [
      { id: "email", label: "Email notifications", description: "Receive contract updates via email", enabled: true },
      { id: "push", label: "Push notifications", description: "Get instant alerts in your browser", enabled: true },
      { id: "risk", label: "Risk alerts", description: "Immediate alerts for high-risk flags", enabled: true },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    description: "Protect your account and data",
    settings: [
      { id: "2fa", label: "Two-factor authentication", description: "Add an extra layer of security", enabled: false },
      { id: "session", label: "Session timeout", description: "Auto logout after 30 minutes of inactivity", enabled: true },
    ],
  },
  {
    id: "privacy",
    icon: Eye,
    title: "Privacy",
    description: "Control your data and visibility",
    settings: [
      { id: "analytics", label: "Usage analytics", description: "Help improve SignSafe with anonymous data", enabled: true },
      { id: "share", label: "Share contract insights", description: "Allow team members to view your analysis", enabled: true },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    risk: true,
    "2fa": false,
    session: true,
    analytics: true,
    share: true,
  });

  const toggleSetting = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#08080F" }}>
      <Sidebar />
      <div className="flex-1 p-8" style={{ marginLeft: 240 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Settings</h1>
        <p className="text-white/60">Manage your account preferences and configurations</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <button className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Palette className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <div className="text-white font-medium">Appearance</div>
            <div className="text-white/40 text-sm">Dark theme active</div>
          </div>
        </button>
        <button className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Globe className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="text-white font-medium">Language</div>
            <div className="text-white/40 text-sm">English (US)</div>
          </div>
        </button>
        <button className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Key className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-white font-medium">API Keys</div>
            <div className="text-white/40 text-sm">2 active keys</div>
          </div>
        </button>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <section.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                <p className="text-white/40 text-sm">{section.description}</p>
              </div>
            </div>
            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <div className="text-white/80">{setting.label}</div>
                    <div className="text-white/40 text-sm">{setting.description}</div>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings[setting.id] ? "bg-violet-500" : "bg-white/20"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        settings[setting.id] ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
