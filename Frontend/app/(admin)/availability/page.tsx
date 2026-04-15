"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import type { Availability } from "@/lib/types";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type DayForm = {
  enabled: boolean;
  startTime: string;
  endTime: string;
};

function createInitial(): DayForm[] {
  return days.map((_, idx) => ({
    enabled: idx >= 1 && idx <= 5,
    startTime: "09:00",
    endTime: "17:00",
  }));
}

export default function AvailabilityPage() {
  const [form, setForm] = useState<DayForm[]>(createInitial());
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const data = await request<Availability[]>("/api/availability");
        if (data.length === 0) {
          return;
        }
        const next = createInitial();
        for (const item of data) {
          next[item.dayOfWeek] = {
            enabled: true,
            startTime: item.startTime,
            endTime: item.endTime,
          };
        }
        setForm(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load availability");
      }
    }

    void load();
  }, []);

  async function handleSave(): Promise<void> {
    setError(null);
    setSaved(null);
    try {
      const daysPayload = form
        .map((day, dayOfWeek) => ({ ...day, dayOfWeek }))
        .filter((day) => day.enabled)
        .map((day) => ({
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
        }));

      await request<Availability[]>("/api/availability", {
        method: "PUT",
        body: JSON.stringify({ days: daysPayload }),
      });
      setSaved("Availability saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save availability");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Admin</p>
        <h2 className="mt-1 text-2xl font-semibold">Availability</h2>
      </header>

      <div className="space-y-2">
        {form.map((day, idx) => (
          <div key={days[idx]} className="grid items-center gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[180px_1fr_1fr]">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={day.enabled}
                onChange={(e) => {
                  setForm((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], enabled: e.target.checked };
                    return next;
                  });
                }}
              />
              {days[idx]}
            </label>
            <input
              type="time"
              value={day.startTime}
              disabled={!day.enabled}
              onChange={(e) => {
                setForm((prev) => {
                  const next = [...prev];
                  next[idx] = { ...next[idx], startTime: e.target.value };
                  return next;
                });
              }}
              className="rounded-xl border border-slate-300 px-3 py-2 disabled:opacity-50"
            />
            <input
              type="time"
              value={day.endTime}
              disabled={!day.enabled}
              onChange={(e) => {
                setForm((prev) => {
                  const next = [...prev];
                  next[idx] = { ...next[idx], endTime: e.target.value };
                  return next;
                });
              }}
              className="rounded-xl border border-slate-300 px-3 py-2 disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      <button onClick={() => void handleSave()} className="rounded-xl bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700" type="button">
        Save Availability
      </button>

      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{saved}</p>}
    </div>
  );
}
