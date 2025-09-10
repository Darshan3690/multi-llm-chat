"use client";
import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import useChatStore from "@/context/chatStore";

export default function ChatInput({
  onSend,
  loading,
}: {
  onSend: (prompt: string) => void;
  loading?: boolean;
}) {
  const [prompt, setPrompt] = useState("");
  const selectedModels = useChatStore((s) => s.selectedModels); // ✅ inside
  const selectedCount = selectedModels.length;

  const handleSendClick = () => {
    if (!prompt.trim() || loading) return;
    onSend(prompt.trim());
    setPrompt("");
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 sm:p-6 w-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
        Enter Your Prompt
      </h3>

      <div className="space-y-4">
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-4 bg-white/5 border border-white/10 rounded-lg 
                     focus:border-purple-500 focus:outline-none resize-y 
                     min-h-[100px] text-white placeholder-slate-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendClick();
            }
          }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="text-sm text-slate-400 mb-2">
            {selectedCount} model{selectedCount !== 1 ? "s" : ""} selected
          </div>

          <button
            disabled={!prompt.trim() || loading}
            onClick={handleSendClick}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 
                       hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 
                       px-6 py-3 rounded-lg transition-all flex items-center justify-center font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Responses
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
