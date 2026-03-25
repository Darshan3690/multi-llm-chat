"use client";
import useChatStore from "@/context/chatStore";
import { useMemo } from "react";

export default function StatsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { conversations, selectedModels } = useChatStore();

  // Define the Conversation type if not already defined or import it from your types
  type Conversation = {
    responses: Record<string, string>;
    // add other properties if needed
  };

  const stats = useMemo(() => {
    const callsByModel: Record<string, number> = {};
    conversations.forEach((c: Conversation) => {
      Object.keys(c.responses).forEach((m) => {
        callsByModel[m] = (callsByModel[m] || 0) + 1;
      });
    });
    return { totalConversations: conversations.length, callsByModel };
  }, [conversations]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-6 text-slate-100">
        <h3 className="text-xl font-semibold mb-4">Statistics</h3>
        <div className="text-sm space-y-4">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
            <span>Total conversations</span>
            <span className="text-2xl font-semibold text-white">{stats.totalConversations}</span>
          </div>
          <div>
            <div className="font-medium text-slate-200">Calls per model</div>
            <ul className="mt-2 space-y-2">
              {Object.entries(stats.callsByModel).length === 0 && (
                <li className="text-slate-500">No calls yet.</li>
              )}
              {Object.entries(stats.callsByModel).map(([m, c]) => (
                <li
                  key={m}
                  className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 bg-white/5"
                >
                  <span className="tracking-wide text-xs text-slate-300">{m.toUpperCase()}</span>
                  <span className="font-semibold text-white">{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs text-slate-500">Selected models for generation</div>
            <div className="mt-1 text-sm text-white">
              {selectedModels.length ? selectedModels.join(", ").toUpperCase() : "—"}
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
