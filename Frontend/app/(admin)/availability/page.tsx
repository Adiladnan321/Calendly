"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import type { Schedule } from "@/lib/types";
import type { DayForm } from "@/components/availability/utils/Availability.types";
import SchedulesSidebar from "@/components/availability/SchedulesSidebar";
import AvailabilityEditor from "@/components/availability/AvailabilityEditor";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function createInitial(): DayForm[] {
  return days.map((_, idx) => ({
    enabled: idx >= 1 && idx <= 5,
    startTime: "09:00",
    endTime: "17:00",
  }));
}

export default function AvailabilityPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [form, setForm] = useState<DayForm[]>(createInitial());
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const data = await request<Schedule[]>("/api/availability");
        setSchedules(data);
        if (data.length > 0) {
          const defaultSchedule = data.find((d) => d.isDefault) || data[0];
          selectSchedule(defaultSchedule);
        } else {
          setActiveId(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load availability");
      }
    }

    void load();
  }, []);

  const selectSchedule = (s: Schedule) => {
    setActiveId(s.id);
    const next = createInitial();
    // Default to false and only map enabled ones
    for (let i = 0; i < 7; i++) next[i].enabled = false;

    for (const item of s.availability) {
      next[item.dayOfWeek] = {
        enabled: true,
        startTime: item.startTime,
        endTime: item.endTime,
      };
    }
    setForm(next);
    setError(null);
    setSaved(null);
  };

  const handleSelect = (id: string) => {
    const s = schedules.find((x) => x.id === id);
    if (s) selectSchedule(s);
  };

  const handleCreate = async () => {
    try {
      const newSchedule = await request<Schedule>("/api/availability", {
        method: "POST",
        body: JSON.stringify({ name: "New Schedule", isDefault: false }),
      });
      setSchedules([...schedules, newSchedule]);
      selectSchedule(newSchedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create schedule");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await request(`/api/availability/${id}`, { method: "DELETE" });
      const nextSchedules = schedules.filter((s) => s.id !== id);
      setSchedules(nextSchedules);
      if (activeId === id) {
        if (nextSchedules.length > 0) {
          selectSchedule(nextSchedules[0]);
        } else {
          setActiveId(null);
          setForm(createInitial());
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete schedule");
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!activeId) return;
    setLoading(true);
    setError(null);
    setSaved(null);
    try {
      const schedule = schedules.find((s) => s.id === activeId);
      if (!schedule) return;

      const daysPayload = form
        .map((day, dayOfWeek) => ({ ...day, dayOfWeek }))
        .filter((day) => day.enabled)
        .map((day) => ({
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
        }));

      const updated = await request<Schedule>(`/api/availability/${activeId}`, {
        method: "PUT",
        body: JSON.stringify({ 
          name: schedule.name,
          isDefault: schedule.isDefault,
          days: daysPayload 
        }),
      });
      
      setSchedules((prev) => prev.map((s) => (s.id === activeId ? updated : s)));
      setSaved("Availability saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save availability");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (name: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, name } : s))
    );
  };

  const handleSetDefault = async () => {
    setSchedules((prev) =>
      prev.map((s) => ({ ...s, isDefault: s.id === activeId }))
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Availability</h2>
      </header>

      <div className="flex h-[calc(100vh-140px)] min-h-[600px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <SchedulesSidebar
          schedules={schedules}
          activeId={activeId}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />

        {activeId ? (
          <AvailabilityEditor
            schedule={schedules.find((s) => s.id === activeId)!}
            form={form}
            setForm={setForm}
            onSave={handleSave}
            loading={loading}
            error={error}
            saved={saved}
            onUpdateName={handleUpdateName}
            onSetDefault={handleSetDefault}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-lg font-semibold text-slate-700">No active schedule</p>
            <p className="mb-6 mt-1 text-sm max-w-sm">Create a schedule to define when you're available for your different event types.</p>
            <button onClick={handleCreate} className="rounded-full bg-[#0B5FFF] px-6 py-2.5 font-bold text-white shadow-sm hover:bg-[#004ed1] transition">
              Create your first schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
