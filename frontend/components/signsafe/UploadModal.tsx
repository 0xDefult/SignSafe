"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Upload, FileText, CheckCircle, Users } from "lucide-react";
import { analyzeContract } from "@/lib/api";
import { useRouter } from "next/navigation";
import PlasmaOrb from "./PlasmaOrb";
import { supabase } from "@/lib/supabase";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchTeams = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;
          const { data } = await supabase
            .from('team_members')
            .select('teams(id, name), team_id')
            .eq('user_id', session.user.id)
            .execute();
          if (data) {
            const formattedTeams = data.map(d => ({
              id: d.team_id,
              name: d.teams?.name || "Unnamed Team"
            }));
            setTeams(formattedTeams);
            if (formattedTeams.length > 0) setSelectedTeamId(formattedTeams[0].id);
          }
        } catch (e) {
          console.error("Error fetching teams for upload:", e);
        }
      };
      fetchTeams();
    }
  }, [isOpen]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 90));
    }, 800);

    try {
      const file = files[0];
      const result = await analyzeContract(file, 50000, "lifestyle");
      clearInterval(interval);
      setProgress(100);

      sessionStorage.setItem("signsafe_analysis", JSON.stringify(result));
      sessionStorage.setItem("signsafe_filename", file.name);

      try {
        if (!supabase) throw new Error("Supabase not initialized");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('analysis_history').insert({
            user_id: user.id,
            team_id: selectedTeamId,
            filename: file.name,
            verdict: result.verdict,
            overall_score: result.overall_score,
            estimated_loss_inr: result.estimated_loss_inr,
            analysis_data: result,
          });
        }
      } catch (saveError) {
        console.error("Error saving analysis to Supabase:", saveError);
      }

      setTimeout(() => {
        router.push("/dashboard");
        onClose();
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Analysis failed. Please try again.");
      setUploading(false);
      setProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {uploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <PlasmaOrb filename={files[0]?.name || "Contract"} progress={progress} />
        </div>
      )}

      <div className="relative bg-[#0D0D14] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Upload Contract</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? "border-violet-500 bg-violet-500/10"
              : "border-white/20 hover:border-white/40"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-violet-400" />
          </div>
          <p className="text-white mb-2">Drag and drop your contract here</p>
          <p className="text-white/40 text-sm mb-4">Supports PDF, DOCX, DOC, TXT (max 50MB)</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm cursor-pointer transition-colors">
            <span>Browse Files</span>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-white text-sm">{file.name}</p>
                    <p className="text-white/40 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <Users className="w-4 h-4" />
            Upload to
          </label>
          <select
            value={selectedTeamId || ""}
            onChange={(e) => setSelectedTeamId(e.target.value || null)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
          >
            <option value="">Personal Space</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Upload & Analyze
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
