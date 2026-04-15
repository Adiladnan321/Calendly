"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { isAfter, isBefore, isSameDay, parseISO, format } from "date-fns";
import MeetingsHeader from "@/components/meetings/MeetingsHeader";
import MeetingsTabs from "@/components/meetings/MeetingsTabs";
import MeetingsList from "@/components/meetings/MeetingsList";

export default function MeetingsPage() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<"upcoming" | "past" | "date_range">("upcoming");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  async function loadMeetings(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const result = await request<Booking[]>("/api/bookings");
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load meetings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMeetings();
  }, []);

  const now = new Date();
  const filterList = () => {
    return data.filter((item) => {
      const dt = parseISO(item.startTime);
      if (tab === "upcoming") {
        return isAfter(dt, now) || isSameDay(dt, now);
      }
      if (tab === "past") {
        return isBefore(dt, now) && !isSameDay(dt, now);
      }
      if (tab === "date_range" && dateRange.start && dateRange.end) {
        const s = parseISO(dateRange.start);
        const e = parseISO(dateRange.end);
        return (isAfter(dt, s) || isSameDay(dt, s)) && (isBefore(dt, e) || isSameDay(dt, e));
      }
      return isAfter(dt, now) || isSameDay(dt, now);
    });
  };

  const filtered = filterList();

  const grouped = filtered.reduce((acc, item) => {
    const key = format(parseISO(item.startTime), 'yyyy-MM-dd');
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, Booking[]>);

  const sortOrder = tab === "past" ? -1 : 1;
  const groupedBookings = Object.entries(grouped).sort((a, b) => 
    a[0].localeCompare(b[0]) * sortOrder
  );

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded-xl max-w-[1000px] mx-auto">{error}</div>;
  }

  if (loading) {
    return <div className="p-4 text-slate-500 max-w-[1000px] mx-auto">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto px-4 md:px-0">
      <div className="flex items-center justify-between">
        <MeetingsHeader filteredLength={filtered.length} totalLength={data.length} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-visible">
        <MeetingsTabs 
          tab={tab}
          setTab={setTab}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <MeetingsList groupedBookings={groupedBookings} />
      </div>
    </div>
  );
}
