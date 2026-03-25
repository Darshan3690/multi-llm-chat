"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Conversation = {
  id: string;
  prompt: string;
  responses: Record<string, string>;
  createdAt: string;
};

type ChatState = {
  conversations: Conversation[];
  selectedModels: string[];
  apiKeys: Record<string, string>;
  temperature: number;

  // actions
  addOrUpdateConversation: (c: Conversation) => void;
  deleteConversation: (id: string) => void;
  clearConversations: () => void;
  setSelectedModels: (m: string[]) => void;
  clearSelectedModels: () => void;
  toggleModel: (model: string) => void;
  setApiKey: (provider: string, key: string) => void;
  removeApiKey: (provider: string) => void;
  setTemperature: (t: number) => void;
};

const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      selectedModels: [],
      apiKeys: {},
      temperature: 0.7,

      addOrUpdateConversation: (c) =>
        set((s) => {
          const exists = s.conversations.find((x) => x.id === c.id);
          if (exists) {
            return {
              conversations: s.conversations.map((x) =>
                x.id === c.id ? { ...x, ...c } : x
              ),
            };
          }
          return {
            conversations: [c, ...s.conversations].slice(0, 200),
          };
        }),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
        })),

      clearConversations: () => set({ conversations: [] }),

      // ✅ Ensures unique models when setting
      setSelectedModels: (m) =>
        set({ selectedModels: Array.from(new Set(m)) }),

      clearSelectedModels: () => set({ selectedModels: [] }),

      // ✅ Toggle add/remove a single model
      toggleModel: (model) =>
        set((s) => {
          const exists = s.selectedModels.includes(model);
          return {
            selectedModels: exists
              ? s.selectedModels.filter((m) => m !== model) // remove
              : [...s.selectedModels, model],              // add
          };
        }),

      setApiKey: (provider, key) =>
        set((s) => ({ apiKeys: { ...s.apiKeys, [provider]: key } })),

      removeApiKey: (provider) =>
        set((s) => {
          const next = { ...s.apiKeys };
          delete next[provider];
          return { apiKeys: next };
        }),

      setTemperature: (t) => {
        localStorage.setItem("temperature", String(t));
        set({ temperature: t });
      },
    }),
    {
      name: "multi-llm-chat-store",
      partialize: (state) => ({
        conversations: state.conversations,
        selectedModels: state.selectedModels,
        apiKeys: state.apiKeys,
        temperature: state.temperature,
      }),
    }
  )
);

export type { Conversation };
export default useChatStore;
