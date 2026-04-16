"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/api";
import { toast } from "react-hot-toast";
import type { Booking } from "@/lib/types";
import { isAfter, isBefore, isSameDay, parseISO, format } from "date-fns";
import MeetingsHeader from "@/components/meetings/MeetingsHeader";
import MeetingsTabs from "@/components/meetings/MeetingsTabs";
import MeetingsList from "@/components/meetings/MeetingsList";
import { MeetingsSkeleton } from "@/components/SkeletonLoaders";

export default function MeetingsPage() {
  const { data: data = [], isLoading: loading, error } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => request<Booking[]>("/api/bookings"),
  });

  const [tab, setTab] = useState<"upcoming" | "past" | "date_range">("upcoming");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

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

  const handleExport = () => {
    if (!filtered.length) {
      toast.error("No meetings to export in the current view.");
      return;
    }

    const headers = ["Invitee Name", "Invitee Email", "Event Type", "Start Time", "End Time", "Status"];
    const rows = filtered.map((booking) => [
      booking.inviteeName,
      booking.inviteeEmail,
      booking.eventType.name,
      format(parseISO(booking.startTime), "yyyy-MM-dd HH:mm:ss"),
      format(parseISO(booking.endTime), "yyyy-MM-dd HH:mm:ss"),
      isAfter(parseISO(booking.endTime), new Date()) ? "Upcoming" : "Past",
    ]);

    const csvContent =
      [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `calendly_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Meetings exported successfully");
  };

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Could not load meetings");
    }
  }, [error]);

  if (loading) {
    return <MeetingsSkeleton />;
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
          onExport={handleExport}
        />

        <MeetingsList groupedBookings={groupedBookings} />
      </div>
    </div>
  );
}
