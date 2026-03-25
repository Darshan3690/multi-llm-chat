"use client";
import { CSSProperties, useEffect, useRef } from "react";
import useChatStore from "@/context/chatStore";
import gsap from "gsap";

const MODEL_META: Record<string, { color: string; label: string; badge: string }> = {
  chatgpt: { color: "#34d399", label: "GPT-4o", badge: "Fast" },
  gemini: { color: "#fb923c", label: "Gemini", badge: "Search" },
  claude: { color: "#a78bfa", label: "Claude 3", badge: "Detailed" },
  mistral: { color: "#60a5fa", label: "Mistral", badge: "Open" },
  perplexity: { color: "#f472b6", label: "Perplexity", badge: "Search" },
  cohere: { color: "#facc15", label: "Cohere", badge: "RAG" },
};

export default function ChatResponseList({ loading = false }: { loading?: boolean }) {
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
  const responseModels = latestConversation
    ? Object.keys(latestConversation.responses || {}).filter((m) => allowedModels.includes(m))
    : [];
  const selectedActive = allowedModels.filter((m) => selectedModels.includes(m));
  const activeModels = (responseModels.length ? responseModels : selectedActive.length ? selectedActive : allowedModels).filter(
    (m, idx, arr) => arr.indexOf(m) === idx
  );
  const showSkeleton = loading && activeModels.length > 0;

  useEffect(() => {
    if (latestConversation && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [latestConversation]);

  return (
    <section ref={containerRef} className="space-y-4">
      <p className="text-[11px] tracking-[0.3em] text-white/40 uppercase">✦ Responses</p>

      {(!latestConversation && !showSkeleton) ? (
        <div className="response-card p-6 text-sm text-white/50 text-center">
          Run your first prompt to see multi-model answers side by side.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(showSkeleton ? activeModels : activeModels.filter(() => latestConversation)).map((model, idx) => {
            const meta = MODEL_META[model] ?? {
              color: "#94a3b8",
              label: model,
              badge: "Model",
            };
            const text = latestConversation?.responses?.[model];

            if (loading && !text) {
              return (
                <div
                  key={`skeleton-${model}-${idx}`}
                  className="response-card p-5 space-y-3"
                  style={{ "--model-color": meta.color } as CSSProperties}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
                    <span className="h-3 w-20 rounded bg-white/10 shimmer" />
                    <span className="ml-auto text-[10px] text-white/30">Preparing...</span>
                  </div>
                  {[95, 80, 88, 65].map((w, i) => (
                    <div key={i} className="shimmer-line" style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }} />
                  ))}
                </div>
              );
            }

            if (!text) {
              return (
                <div
                  key={`placeholder-${model}-${idx}`}
                  className="response-card p-5 text-sm text-white/50"
                  style={{ "--model-color": meta.color } as CSSProperties}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: meta.color,
                        boxShadow: `0 0 8px ${meta.color}`,
                      }}
                    />
                    <span className="text-[11px] font-bold tracking-[0.18em]" style={{ color: meta.color }}>
                      {meta.label.toUpperCase()}
                    </span>
                  </div>
                  Waiting for {meta.label}...
                </div>
              );
            }

            return (
              <div
                key={model}
                className="response-card p-5"
                style={{ "--model-color": meta.color } as CSSProperties}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: meta.color,
                      boxShadow: `0 0 8px ${meta.color}`,
                    }}
                  />
                  <span className="text-[11px] font-bold tracking-[0.18em]" style={{ color: meta.color }}>
                    {meta.label.toUpperCase()}
                  </span>
                  <span
                    className="ml-auto text-[9px] px-3 py-1 rounded-full"
                    style={{ background: `${meta.color}22`, color: meta.color }}
                  >
                    {meta.badge}
                  </span>
                </div>

                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/70 font-sans">
                  {text}
                </pre>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs text-white/40">
                  <span>{meta.label}</span>
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText(text);
                      }
                    }}
                    className="px-2 py-1 rounded-md border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
