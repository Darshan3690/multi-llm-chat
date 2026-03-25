"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Key } from "lucide-react";
import useChatStore from "@/context/chatStore";

export default function SelectModelsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { selectedModels, apiKeys, setSelectedModels, setApiKey, removeApiKey } =
    useChatStore();

  const [localSelected, setLocalSelected] = useState<string[]>(selectedModels || []);
  const [localKeys, setLocalKeys] = useState<Record<string, string>>(apiKeys || {});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalSelected(selectedModels);
    setLocalKeys(apiKeys);
  }, [selectedModels, apiKeys]);

  // ✅ 6 Models (IDs aligned with callLLMs)
  const models = [
    { id: "chatgpt", name: "ChatGPT (GPT-4o)", provider: "OpenAI", color: "bg-green-500" },
    { id: "gemini", name: "Gemini Pro", provider: "Google", color: "bg-orange-500" },
    { id: "perplexity", name: "Perplexity LLM", provider: "Perplexity", color: "bg-indigo-500" },
    { id: "claude", name: "Claude-3 Opus", provider: "Anthropic", color: "bg-purple-500" },
    { id: "mistral", name: "Mistral Large", provider: "Mistral", color: "bg-pink-500" },
    { id: "cohere", name: "Cohere Command R+", provider: "Cohere", color: "bg-yellow-500" },
  ];

  function save() {
    setSelectedModels(localSelected);
    Object.entries(localKeys).forEach(([k, v]) => {
      if (v) setApiKey(k, v);
      else removeApiKey(k);
    });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-2xl rounded-3xl bg-black/60 border border-white/10 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Select Models</h3>
            <p className="text-sm text-slate-400">Pick the providers you want active for the next prompt.</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {localSelected.length} active
          </span>
        </div>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {models.map((m) => (
            <div key={m.id} className="space-y-2">
              {/* Model Card */}
              <div
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  localSelected.includes(m.id)
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${m.color}`}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-white">{m.name}</div>
                    <div className="text-xs text-gray-400">{m.provider}</div>
                  </div>
                </div>

                {/* Toggle */}
                <input
                  type="checkbox"
                  checked={localSelected.includes(m.id)}
                  onChange={(e) =>
                    setLocalSelected((prev) =>
                      e.target.checked ? [...prev, m.id] : prev.filter((x) => x !== m.id)
                    )
                  }
                  className="w-4 h-4 accent-purple-500 cursor-pointer"
                />
              </div>

              {/* API Key Input */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/10">
                <Key className="w-4 h-4 text-gray-400" />
                <input
                  type={showKeys[m.id] ? "text" : "password"}
                  placeholder="Enter API key..."
                  value={localKeys[m.id] ?? ""}
                  onChange={(e) =>
                    setLocalKeys((s) => ({ ...s, [m.id]: e.target.value }))
                  }
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowKeys((prev) => ({ ...prev, [m.id]: !prev[m.id] }))
                  }
                >
                  {showKeys[m.id] ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 
                       text-sm text-gray-200 border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 
                       text-white text-sm font-medium shadow-md shadow-purple-500/30"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
