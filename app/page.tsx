"use client";
import { useEffect, useState, useRef } from "react";
import ChatInput from "@/components/ChatInput";
import ChatResponseList from "@/components/ChatResponse";
import SelectModelsModal from "@/components/SelectModelsModal";
import HistoryModal from "@/components/HistoryModal";
import StatsModal from "@/components/StatsModal";
import SettingsModal from "@/components/SettingsModal";
import useChatStore from "@/context/chatStore";
import gsap from "gsap";
import { Bot, MessageSquare, BarChart3, Settings } from "lucide-react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const { selectedModels, apiKeys, addOrUpdateConversation, conversations, setTemperature } =
    useChatStore();

  const latestConversation = conversations[0] ?? null;

  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = localStorage.getItem("temperature");
    if (t) setTemperature(Number(t));
  }, [setTemperature]);

  useEffect(() => {
    gsap.from(headerRef.current, { y: -40, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(mainRef.current, { y: 30, opacity: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });
  }, []);

  async function handleSend(prompt: string) {
    if (!selectedModels.length) {
      setOpenSelect(true);
      return;
    }
    setLoading(true);

    const payload = {
      prompt,
      models: Array.from(new Set(selectedModels)), // de-dupe just in case
      keys: apiKeys,
      temperature: Number(localStorage.getItem("temperature") || 0.7),
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();

      addOrUpdateConversation({
        id: Date.now().toString(),
        prompt,
        responses: json.responses,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error(e);
      addOrUpdateConversation({
        id: Date.now().toString(),
        prompt,
        responses: Object.fromEntries(
          payload.models.map((m: string) => [m, "Error calling model"])
        ) as Record<string, string>,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-slate-100 font-sans flex flex-col">
      {/* HEADER */}
      <header
        ref={headerRef}
        className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Bot size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Multi-LLM Chat System
                </h1>
                <p className="text-slate-400 text-sm">Compare AI responses across multiple models</p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setOpenSelect(true)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-medium text-white"
              >
                <Bot className="w-4 h-4" />
                <span>Select Models</span>
              </button>

              <button
                onClick={() => setOpenHistory(true)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-medium text-white"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat History</span>
              </button>

              <button
                onClick={() => setOpenStats(true)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-medium text-white"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Stats</span>
              </button>

              <button
                onClick={() => setOpenSettings(true)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-medium text-white"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main ref={mainRef} className="flex-1 w-full flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* ✅ No selectedCount prop needed now */}
          <ChatInput onSend={handleSend} loading={loading} />
        </div>

        {/* Responses */}
        {latestConversation && (
          <div className="w-full max-w-4xl mt-6">
            <ChatResponseList />
          </div>
        )}
      </main>

      {/* MODALS */}
      <SelectModelsModal open={openSelect} onClose={() => setOpenSelect(false)} />
      <HistoryModal open={openHistory} onClose={() => setOpenHistory(false)} />
      <StatsModal open={openStats} onClose={() => setOpenStats(false)} />
      <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />

      {/* Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
