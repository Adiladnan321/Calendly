"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/api";
import { toast } from "react-hot-toast";
import type { Schedule } from "@/lib/types";
import type { DayForm } from "@/components/availability/utils/Availability.types";
import SchedulesSidebar from "@/components/availability/SchedulesSidebar";
import AvailabilityEditor from "@/components/availability/AvailabilityEditor";
import { AvailabilitySkeleton } from "@/components/SkeletonLoaders";

function createInitial(): DayForm[] {
  const arr: DayForm[] = [];
  for (let i = 0; i < 7; i++) {
    arr.push({ enabled: i >= 1 && i <= 5, startTime: "09:00", endTime: "17:00" });
  }
  return arr;
}

export default function AvailabilityPage() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const [form, setForm] = useState<DayForm[]>(createInitial());

  const { data: schedules = [], isLoading } = useQuery<Schedule[]>({
    queryKey: ["availability"],
    queryFn: () => request("/api/availability"),
  });

  const selectSchedule = (s: Schedule) => {
    setActiveId(s.id);
    const next = createInitial();
    for (let i = 0; i < 7; i++) next[i].enabled = false;

    for (const item of s.availability) {
      next[item.dayOfWeek] = {
        enabled: true,
        startTime: item.startTime,
        endTime: item.endTime,
      };
    }
    setForm(next);
  };

  useEffect(() => {
    if (schedules.length > 0 && !activeId && !isLoading) {
      const defaultSchedule = schedules.find((d) => d.isDefault) || schedules[0];
      selectSchedule(defaultSchedule);
    }
  }, [schedules, activeId, isLoading]);

  const handleSelect = (id: string) => {
    const s = schedules.find((x) => x.id === id);
    if (s) selectSchedule(s);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      request<Schedule>("/api/availability", {
        method: "POST",
        body: JSON.stringify({ name: "New Schedule", isDefault: false }),
      }),
    onSuccess: (newSchedule) => {
      queryClient.setQueryData<Schedule[]>(["availability"], (old = []) => [...old, newSchedule]);
      selectSchedule(newSchedule);
      toast.success("Schedule created successfully");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create schedule");
    },
  });

  const handleCreate = () => createMutation.mutate();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => request(`/api/availability/${id}`, { method: "DELETE" }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Schedule[]>(["availability"], (old = []) => {
        const nextSchedules = old.filter((s) => s.id !== id);
        if (activeId === id) {
          if (nextSchedules.length > 0) {
            selectSchedule(nextSchedules[0]);
          } else {
            setActiveId(null);
            setForm(createInitial());
          }
        }
        return nextSchedules;
      });
      toast.success("Schedule deleted completely");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete schedule");
    },
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, schedule, payload }: { id: string, schedule: Schedule, payload: { dayOfWeek: number, startTime: string, endTime: string }[] }) => {
      return request<Schedule>(`/api/availability/${id}`, {
        method: "PUT",
        body: JSON.stringify({ 
          name: schedule.name,
          timezone: schedule.timezone,
          isDefault: schedule.isDefault,
          days: payload 
        }),
      });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Schedule[]>(["availability"], (old = []) => 
        old.map((s) => (s.id === updated.id ? updated : s))
      );
      toast.success("Availability saved successfully");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not save availability");
    },
  });

  const handleSave = async (): Promise<void> => {
    if (!activeId) return;
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

    updateMutation.mutate({ id: activeId, schedule, payload: daysPayload });
  };

  const handleUpdateName = async (name: string): Promise<void> => {
    queryClient.setQueryData<Schedule[]>(["availability"], (old = []) =>
      old.map((s) => (s.id === activeId ? { ...s, name } : s))
    );
  };

  const handleUpdateTimezone = async (timezone: string): Promise<void> => {
    queryClient.setQueryData<Schedule[]>(["availability"], (old = []) =>
      old.map((s) => (s.id === activeId ? { ...s, timezone } : s))
    );
  };

  const handleSetDefault = async (): Promise<void> => {
    queryClient.setQueryData<Schedule[]>(["availability"], (old = []) =>
      old.map((s) => ({ ...s, isDefault: s.id === activeId }))
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Availability</h2>
      </header>

      {isLoading ? (
        <AvailabilitySkeleton />
      ) : (
        <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-150 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                loading={updateMutation.isPending}
                onUpdateName={handleUpdateName}
                onUpdateTimezone={handleUpdateTimezone}
                onSetDefault={handleSetDefault}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-lg font-semibold text-slate-700">No active schedule</p>
                <p className="mb-6 mt-1 text-sm max-w-sm">Create a schedule to define when you&apos;re available for your different event types.</p>
                <button onClick={handleCreate} disabled={createMutation.isPending} className="rounded-full bg-[#0B5FFF] px-6 py-2.5 font-bold text-white shadow-sm hover:bg-[#004ed1] disabled:opacity-50 transition">
                  Create your first schedule
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
