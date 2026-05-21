"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { joinTeam } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function JoinTeamPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing invitation token.");
    } else {
      handleJoin();
    }
  }, [token]);

  const handleJoin = async () => {
    setStatus("loading");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If not logged in, redirect to login first
        router.push(`/login?redirect=/team/join?token=${token}`);
        return;
      }

      await joinTeam(token, session.access_token);
      setStatus("success");
      setMessage("You have successfully joined the team!");
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to join team. The invitation may have expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#08080F" }}>
      <div className="bg-[#0D0D14] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {status === "idle" || status === "loading" ? (
          <>
            <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-serif text-white mb-2">Joining Team...</h1>
            <p className="text-white/60">Validating your invitation token.</p>
          </>
        ) : status === "success" ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-serif text-white mb-2">Welcome aboard!</h1>
            <p className="text-white/60 mb-6">{message}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl text-white font-semibold"
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-serif text-white mb-2">Invitation Invalid</h1>
            <p className="text-white/60 mb-6">{message}</p>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold"
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
