"use client";

import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { request } from "@/lib/api";
import type { Booking } from "@/lib/types";

export default function MeetingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [error, setError] = useState<string | null>(null);

  async function loadBookings(): Promise<void> {
    setError(null);
    try {
      const data = await request<Booking[]>("/api/bookings");
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load meetings");
    }
  }

  useEffect(() => {
    void loadBookings();
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    return bookings.filter((booking) => {
      const start = new Date(booking.startTime).getTime();
      return tab === "upcoming" ? start >= now : start < now;
    });
  }, [bookings, tab]);

  async function cancelBooking(id: string): Promise<void> {
    setError(null);
    try {
      await request<Booking>(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel booking");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Admin</p>
        <h2 className="mt-1 text-2xl font-semibold">Meetings</h2>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("upcoming")}
          className={`rounded-xl px-3 py-2 text-sm ${
            tab === "upcoming" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => setTab("past")}
          className={`rounded-xl px-3 py-2 text-sm ${
            tab === "past" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          Past
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <ul className="space-y-2">
        {filtered.map((booking) => {
          const start = new Date(booking.startTime);
          return (
            <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-medium">{booking.inviteeName}</p>
                <p className="text-sm text-slate-500">
                  {booking.inviteeEmail} • {booking.eventType.name}
                </p>
                <p className="text-sm text-slate-600">{format(start, "EEE, MMM d • h:mm a")}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs ${booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                  {booking.status}
                </span>
                {booking.status === "confirmed" && tab === "upcoming" && (
                  <button
                    type="button"
                    onClick={() => void cancelBooking(booking.id)}
                    className="rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
