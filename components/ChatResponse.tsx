"use client";
import { useEffect, useRef } from "react";
import useChatStore from "@/context/chatStore";
import gsap from "gsap";

export default function ChatResponseList() {
  const latestConversation = useChatStore((s) =>
    s.conversations.length > 0 ? s.conversations[0] : null
  );
  const selectedModels = useChatStore((s) => s.selectedModels); // ✅ get selected models
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Only show models that are actually selected
  const allowedModels = [
    "chatgpt",
    "gemini",
    "perplexity",
    "claude",
    "mistral",
    "cohere",
  ];
  const activeModels = allowedModels.filter((m) => selectedModels.includes(m));

  useEffect(() => {
    if (latestConversation && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [latestConversation]);

  if (!latestConversation) {
    return (
      <div className="p-6 rounded-2xl bg-black/20 border border-purple-400/30 text-slate-300 shadow-lg">
        No conversation yet.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8 w-full">
      {/* User Prompt */}
      <div className="p-6 rounded-xl bg-black/20 backdrop-blur-lg border border-purple-400/30 shadow-lg">
        <div className="text-sm text-slate-400 mb-2">
          {activeModels.length} models selected
        </div>
        <div className="font-medium text-white text-lg">
          {latestConversation.prompt}
        </div>
        <div className="text-xs text-slate-500 mt-3">
          {new Date(latestConversation.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Model Responses */}
      <div className="grid gap-6 sm:grid-cols-2">
        {activeModels.map((model) => {
          const text =
            latestConversation.responses?.[model] ?? "⏳ No response yet";

          return (
            <div
              key={model}
              className="p-5 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-md 
                         hover:border-purple-400/50 hover:shadow-purple-900/40 transition-all duration-300"
            >
              <div className="text-xs font-semibold text-purple-300 mb-3 tracking-wider">
                {model.toUpperCase()}
              </div>
              <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans">
                {text}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
