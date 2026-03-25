"use client";
import { Trash2 } from "lucide-react";
import useChatStore from "@/context/chatStore";

interface Conversation {
  id: string;
  createdAt: string | number | Date;
  prompt: string;
  responses: { [model: string]: string };
}

export default function HistoryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { conversations, clearConversations, deleteConversation } =
    useChatStore() as unknown as {
      conversations: Conversation[];
      clearConversations: () => void;
      deleteConversation: (id: string) => void; // ✅ new function
    };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={onClose}></div>
      <div className="relative z-50 bg-black/70 text-white p-6 rounded-3xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={clearConversations}
              className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-md flex items-center gap-1"
            >
              <Trash2 size={16} />
              Clear All History
            </button>
            <button
              onClick={onClose}
              className="ml-2 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Empty state */}
        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="text-5xl">🕒</span>
            <p className="mt-4">No chat history yet. Start a conversation!</p>
          </div>
        )}

        {/* Conversations */}
        {conversations.map((c: Conversation) => (
          <div
            key={c.id}
            className="p-4 rounded-xl border border-white/10 bg-white/5 mb-4"
          >
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-400">
                {new Date(c.createdAt).toLocaleString()}
              </div>
              {/* ✅ delete single conversation */}
              <button
                onClick={() => deleteConversation(c.id)}
                className="text-red-400 hover:text-red-500 text-xs"
              >
                Delete
              </button>
            </div>

            <div className="font-medium mt-1">{c.prompt}</div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {Object.entries(c.responses).map(([m, r]) => (
                <div key={m} className="p-2 bg-black/40 border border-white/5 rounded">
                  <div className="text-xs text-slate-400">{m.toUpperCase()}</div>
                  <div className="text-sm text-slate-200">{r}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
