"use client";

import { useState } from "react";
import { Bell, Shield, Eye, Palette, Globe, Key } from "lucide-react";
import { DashboardLayout } from "@/components/signsafe/DashboardLayout";
import { Navbar } from "@/components/signsafe/Navbar";

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
    <DashboardLayout>
      <div className="flex-1 flex flex-col">
        <Navbar title="Settings" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-serif text-white mb-1 lg:mb-2">Settings</h1>
            <p className="text-sm lg:text-base text-white/60">Manage your account preferences and configurations</p>
          </div>

          {/* Quick settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
            <button className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5 lg:w-6 lg:h-6 text-violet-400" />
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium text-sm lg:text-base">Appearance</div>
                <div className="text-white/40 text-xs lg:text-sm">Dark theme active</div>
              </div>
            </button>
            <button className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium text-sm lg:text-base">Language</div>
                <div className="text-white/40 text-xs lg:text-sm">English (US)</div>
              </div>
            </button>
            <button className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium text-sm lg:text-base">API Keys</div>
                <div className="text-white/40 text-xs lg:text-sm">2 active keys</div>
              </div>
            </button>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {settingsSections.map((section) => (
              <div
                key={section.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:p-6"
              >
                <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5 lg:w-6 lg:h-6 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-base lg:text-xl font-semibold text-white">{section.title}</h2>
                    <p className="text-white/40 text-xs lg:text-sm">{section.description}</p>
                  </div>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  {section.settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-4"
                    >
                      <div className="min-w-0">
                        <div className="text-white/80 text-sm">{setting.label}</div>
                        <div className="text-white/40 text-xs lg:text-sm hidden sm:block">{setting.description}</div>
                      </div>
                      <button
                        onClick={() => toggleSetting(setting.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
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
        </main>
      </div>
    </DashboardLayout>
  );
}
