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
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-md bg-white dark:bg-slate-900 rounded-md p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <div className="text-sm">
          <div>Total conversations: <span className="font-medium">{stats.totalConversations}</span></div>
          <div className="mt-3">
            <div className="font-medium">Calls per model:</div>
            <ul className="mt-2 space-y-1">
              {Object.entries(stats.callsByModel).length === 0 && <li className="text-slate-500">No calls yet.</li>}
              {Object.entries(stats.callsByModel).map(([m, c]) => (
                <li key={m} className="flex justify-between">
                  <span>{m.toUpperCase()}</span>
                  <span className="font-semibold">{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500">Selected models for generation:</div>
            <div className="mt-1 text-sm">{selectedModels.length ? selectedModels.join(", ").toUpperCase() : "—"}</div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-3 py-2 rounded-md border">Close</button>
        </div>
      </div>
    </div>
  );
}
