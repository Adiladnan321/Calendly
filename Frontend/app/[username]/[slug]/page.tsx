"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, getDay, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { request } from "@/lib/api";
import BookingSuccess from "@/components/booking/BookingSuccess";
import BookingSidebar from "@/components/booking/BookingSidebar";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingForm from "@/components/booking/BookingForm";
import { PublicPayload, PublicSlot } from "@/components/booking/utils/sharedTypes";

type PublicBookingPageProps = {
  params: Promise<{
    username: string;
    slug: string;
  }>;
};

export default function PublicBookingPage({ params }: PublicBookingPageProps) {
  const [routeParams, setRouteParams] = useState<{ username: string; slug: string } | null>(null);
  
  // Date selection state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [payload, setPayload] = useState<PublicPayload | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PublicSlot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load params
  useEffect(() => {
    void params.then(setRouteParams);
  }, [params]);

  // Load slots for selected date
  useEffect(() => {
    async function loadSlots(): Promise<void> {
      if (!routeParams) {
        return;
      }

      setError(null);
      setMessage(null);
      
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      try {
        const data = await request<PublicPayload>(
          `/api/bookings/public/${routeParams.username}/${routeParams.slug}?date=${dateStr}`
        );
        setPayload(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load slots");
      }
    }

    void loadSlots();
  }, [selectedDate, routeParams]);

  async function handleBook(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!payload || !selectedSlot) {
      setError("Please choose a slot first.");
      return;
    }

    setError(null);
    setMessage(null);
    try {
      await request("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          eventTypeId: payload.eventType.id,
          inviteeName: name,
          inviteeEmail: email,
          startTime: selectedSlot.start,
        }),
      });
      setMessage("Booking confirmed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create booking");
    }
  }

  // Calendar generation logic
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStartDay = getDay(monthStart); // 0 = Sunday, 1 = Monday
    
    // Adjust to Monday start
    const startDayIndex = calendarStartDay === 0 ? 6 : calendarStartDay - 1; 

    let days: { date: Date; type: 'prev' | 'current' | 'next' }[] = [];

    // Previous month padding
    for (let i = startDayIndex; i > 0; i--) {
      days.push({ date: addDays(monthStart, -i), type: 'prev' });
    }

    // Current month days
    let curr = monthStart;
    while (curr <= monthEnd) {
      days.push({ date: curr, type: 'current' });
      curr = addDays(curr, 1);
    }

    // Next month padding to fill 42 cells (6 rows)
    let remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: addDays(monthEnd, i), type: 'next' });
    }

    // Return exact rows
    // Only keeping enough rows to fit the current month
    const totalRows = Math.ceil(days.filter(d => d.type === 'current' || d.type === 'prev').length / 7) === 5 ? 35 : 42;
    return days.slice(0, totalRows);
  }, [currentMonth]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newDate);
  };

  return (
    <main className="min-h-screen bg-[#F3F4F5] flex items-center justify-center p-0 md:p-4">
      <div className={`relative flex w-full max-w-[1060px] flex-col overflow-hidden md:rounded-lg bg-white md:shadow-[0_1px_8px_0_rgba(0,0,0,0.08)] md:flex-row min-h-screen md:min-h-0 ${!message ? 'md:h-[650px]' : 'md:min-h-[500px]'}`}>
        
        {/* Success Overlay Check */}
        {message ? (
          <BookingSuccess payload={payload} selectedSlot={selectedSlot} />
        ) : (
        <>
        {/* Left Sidebar */}
        <BookingSidebar payload={payload} selectedSlot={selectedSlot} />

        {/* Right Content */}
        <div className="flex w-full flex-col p-4 md:p-8 md:w-7/12 bg-white pb-12 md:pb-8">
          {!selectedSlot ? (
            <BookingCalendar
              currentMonth={currentMonth}
              changeMonth={changeMonth}
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              payload={payload}
              setSelectedSlot={setSelectedSlot}
            />
          ) : (
            <BookingForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              handleBook={handleBook}
              setSelectedSlot={setSelectedSlot}
              error={error}
            />
          )}
        </div>
        </>
      )}
      </div>
    </main>
  );
}


