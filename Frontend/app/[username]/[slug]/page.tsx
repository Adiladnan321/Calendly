"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, getDay, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { request } from "@/lib/api";
import { toast } from "react-hot-toast";
import BookingSuccess from "@/components/booking/BookingSuccess";
import BookingSidebar from "@/components/booking/BookingSidebar";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingForm from "@/components/booking/BookingForm";
import { PublicPayload, PublicSlot } from "@/components/booking/utils/sharedTypes";
import { PublicBookingSkeleton } from "@/components/SkeletonLoaders";

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

  // Load params
  useEffect(() => {
    void params.then(setRouteParams);
  }, [params]);

  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Load slots for selected date
  useEffect(() => {
    async function loadSlots(): Promise<void> {
      if (!routeParams) {
        return;
      }

      setMessage(null);
      
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      try {
        const data = await request<PublicPayload>(
          `/api/bookings/public/${routeParams.username}/${routeParams.slug}?date=${dateStr}`
        );
        setPayload(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load slots");
      }
    }

    void loadSlots();
  }, [selectedDate, routeParams]);

  async function handleBook(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!payload || !selectedSlot) {
      toast.error("Please choose a slot first.");
      return;
    }

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
      toast.success("Booking confirmed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create booking");
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

  const displayPayload = useMemo(() => {
    if (!payload) return null;
    
    try {
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: selectedTimezone,
      });

      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: selectedTimezone,
      });

      // We only want to display slots that literally fall inside the selected date logic 
      // from the perspective of the invitee's timezone. 
      const targetDateFormatted = format(selectedDate, "yyyy-MM-dd");

      const filteredSlots = payload.slots.reduce((acc, slot) => {
        // Safe extraction of YYYY-MM-DD
        const parts = dateFormatter.formatToParts(new Date(slot.start));
        const ye = parts.find(p => p.type === 'year')?.value;
        const mo = parts.find(p => p.type === 'month')?.value;
        const da = parts.find(p => p.type === 'day')?.value;
        const localDateStr = `${ye}-${mo}-${da}`;

        if (localDateStr === targetDateFormatted) {
          acc.push({
            ...slot,
             startLabel: timeFormatter.format(new Date(slot.start)),
             endLabel: timeFormatter.format(new Date(slot.end)),
          });
        }
        return acc;
      }, [] as PublicSlot[]);

      return {
        ...payload,
        user: { ...payload.user, timezone: selectedTimezone },
        slots: filteredSlots,
      };
    } catch (err) {
      console.error("Timezone formatting error:", err);
      return payload;
    }
  }, [payload, selectedTimezone, selectedDate]);

  // Calculate adjusted selectedSlot with formatted time
  const displaySelectedSlot = useMemo(() => {
    if (!selectedSlot || !displayPayload) return selectedSlot;
    const match = displayPayload.slots.find(s => s.start === selectedSlot.start);
    return match ? { ...selectedSlot, startLabel: match.startLabel, endLabel: match.endLabel } : selectedSlot;
  }, [selectedSlot, displayPayload]);

  if (!displayPayload) {
    return (
      <main className="min-h-screen bg-[#F3F4F5] flex items-center justify-center p-0 md:p-4">
        <PublicBookingSkeleton />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F5] flex items-center justify-center p-0 md:p-4">
      <div className={`relative flex w-full max-w-[1060px] flex-col overflow-hidden md:rounded-lg bg-white md:shadow-[0_1px_8px_0_rgba(0,0,0,0.08)] md:flex-row min-h-screen md:min-h-0 ${!message ? 'md:h-[650px]' : 'md:min-h-[500px]'}`}>
        
        {/* Success Overlay Check */}
        {message ? (
          <BookingSuccess payload={displayPayload} selectedSlot={displaySelectedSlot} />
        ) : (
        <>
        {/* Left Sidebar */}
        <BookingSidebar payload={displayPayload} selectedSlot={displaySelectedSlot} />

        {/* Right Content */}
        <div className="flex w-full flex-col p-4 md:p-8 md:w-7/12 bg-white pb-12 md:pb-8">
          {!selectedSlot ? (
            <BookingCalendar
              currentMonth={currentMonth}
              changeMonth={changeMonth}
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              payload={displayPayload}
              setSelectedSlot={setSelectedSlot}
              selectedTimezone={selectedTimezone}
              onTimezoneChange={setSelectedTimezone}
            />
          ) : (
            <BookingForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              handleBook={handleBook}
              setSelectedSlot={setSelectedSlot}
            />
          )}
        </div>
        </>
      )}
      </div>
    </main>
  );
}


