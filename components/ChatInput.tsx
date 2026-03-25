"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import useChatStore from "@/context/chatStore";

export default function ChatInput({
  onSend,
  loading,
}: {
  onSend: (prompt: string) => void;
  loading?: boolean;
}) {
  const [prompt, setPrompt] = useState("");
  const selectedModels = useChatStore((s) => s.selectedModels);
  const temperature = useChatStore((s) => s.temperature);
  const selectedCount = selectedModels.length;

  const handleSendClick = () => {
    if (!prompt.trim() || loading) return;
    onSend(prompt.trim());
    setPrompt("");
  };

  return (
    <div className="prompt-card hover:border-purple-500/40 hover:shadow-[0_20px_80px_rgba(139,92,246,0.15)] transition-all duration-300">
      <div className="prompt-label">✦ Your Prompt</div>

      <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Explain how neural networks learn from data in simple terms"
          className="w-full bg-transparent border-0 text-base text-white/80 placeholder:text-white/30 focus:outline-none resize-none min-h-[120px] leading-7"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendClick();
            }
          }}
        />

      <div className="flex flex-col gap-3 border-t border-white/10 pt-4 mt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="prompt-meta">
          {selectedCount} model{selectedCount !== 1 ? "s" : ""} · Temp {temperature.toFixed(1)} · Shift+Enter for newline
        </p>

        <button
          disabled={!prompt.trim() || loading}
          onClick={handleSendClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-sm shadow-lg shadow-purple-500/30 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
