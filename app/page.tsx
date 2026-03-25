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

const MODEL_COLORS: Record<string, string> = {
  chatgpt: "#34d399",
  claude: "#a78bfa",
  gemini: "#fb923c",
  mistral: "#60a5fa",
  perplexity: "#f472b6",
  cohere: "#facc15",
};

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
    <div className="relative min-h-screen bg-[#05030d] text-slate-100 font-sans overflow-hidden">
      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>
      {/* HEADER */}
      <header
        ref={headerRef}
        className="bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-20"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl animate-[glow-pulse_3s_ease-in-out_infinite]">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">Multi-LLM Chat</h1>
              <p className="text-xs text-white/50">Compare AI across models</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="nav-pill active" onClick={() => setOpenSelect(true)}>
              Models
            </button>
            <button className="nav-pill" onClick={() => setOpenHistory(true)}>
              History
            </button>
            <button className="nav-pill" onClick={() => setOpenStats(true)}>
              Stats
            </button>
            <button className="nav-pill" onClick={() => setOpenSettings(true)}>
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main
        ref={mainRef}
        className="relative z-10 max-w-5xl mx-auto w-full px-6 py-10 space-y-6"
      >
        <section className="flex flex-wrap items-center gap-2">
          {selectedModels.length > 0 ? (
            selectedModels.map((m) => {
              const color = MODEL_COLORS[m] ?? "#94a3b8";
              return (
                <span
                  key={m}
                  className="model-chip"
                  style={{
                    borderColor: `${color}55`,
                    background: `${color}18`,
                    color,
                  }}
                >
                  <span
                    className="model-chip-dot"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                  {m.toUpperCase()}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-white/40">Select models to start comparing outputs.</span>
          )}
          <button
            onClick={() => setOpenSelect(true)}
            className="model-chip border-dashed border-white/30 text-white/60 hover:text-white hover:border-white/60"
          >
            + Add model
          </button>
        </section>

        <ChatInput onSend={handleSend} loading={loading} />

        <ChatResponseList loading={loading} />

        <div className="status-bar">
          <span className="status-dot" />
          <span>All models connected</span>
          <span className="status-sep" />
          <span>
            {selectedModels.length} model{selectedModels.length !== 1 ? "s" : ""} active
          </span>
          <span className="status-sep" />
          <span>
            Session: {conversations.length} prompt{conversations.length !== 1 ? "s" : ""}
          </span>
        </div>
      </main>

      {/* MODALS */}
      <SelectModelsModal open={openSelect} onClose={() => setOpenSelect(false)} />
      <HistoryModal open={openHistory} onClose={() => setOpenHistory(false)} />
      <StatsModal open={openStats} onClose={() => setOpenStats(false)} />
      <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
    </div>
  );
}
