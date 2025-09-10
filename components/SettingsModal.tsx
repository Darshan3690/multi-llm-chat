
"use client";
import { useEffect, useState } from "react";
import useChatStore from "@/context/chatStore";

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const { temperature, setTemperature } = useChatStore();
  const [localTemp, setLocalTemp] = useState<number>(temperature);
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    setLocalTemp(temperature);
    setDark(document.documentElement.classList.contains("dark"));
  }, [temperature]);

  function save() {
    setTemperature(localTemp);
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-md bg-white dark:bg-slate-900 rounded-md p-6">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Temperature: <span className="font-medium">{localTemp.toFixed(2)}</span></label>
            <input type="range" min="0" max="1" step="0.01" value={localTemp} onChange={(e) => setLocalTemp(Number(e.target.value))} />
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
              <span>Dark mode</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md border">Cancel</button>
          <button onClick={save} className="px-3 py-2 rounded-md bg-blue-600 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
