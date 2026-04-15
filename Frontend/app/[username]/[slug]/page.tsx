"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, getDay, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { request } from "@/lib/api";
import { useRouter } from "next/navigation";

type PublicBookingPageProps = {
  params: Promise<{
    username: string;
    slug: string;
  }>;
};

type PublicSlot = {
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
};

type PublicPayload = {
  user: {
    name: string;
    timezone: string;
  };
  eventType: {
    id: string;
    name: string;
    duration: number;
    color: string;
  };
  slots: PublicSlot[];
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

  const router = useRouter();

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
    setCurrentMonth(prev => addDays(prev, offset > 0 ? 32 : -15)); 
    // ^ simple logic to jump to next/prev month safely
    // Wait, better date-fns usage:
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newDate);
  };

  return (
    <main className="min-h-screen bg-[#F3F4F5] flex items-center justify-center p-4">
      <div className={`relative flex w-full max-w-[1060px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_1px_8px_0_rgba(0,0,0,0.08)] md:flex-row ${!message ? 'md:h-[650px]' : 'md:min-h-[500px]'}`}>
        
        {/* Success Overlay Check */}
        {message ? (
          <div className="flex w-full flex-col items-center justify-center py-20 px-4 mt-8 mb-12 animate-in fade-in duration-500 relative">
            <div className="absolute top-0 right-0 h-16 w-32 overflow-hidden pointer-events-none">
              {/* Calendly powered by ribbon mockup placeholder */}
              <div className="absolute top-4 -right-12 bg-slate-600 text-white text-[10px] font-bold py-1 px-12 rotate-45">POWERED BY<br/>Calendly</div>
            </div>

            <h1 className="flex items-center gap-3 text-[24px] font-bold text-[#0D3823]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D6B3C] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              You are scheduled
            </h1>
            <p className="mt-4 text-[#1A1A1A] font-[500] text-[15px]">
              A calendar invitation has been sent to your email address.
            </p>
            
            <button className="mt-6 flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-[15px] font-bold text-[#1A1A1A] hover:bg-slate-50 transition">
              Open Invitation
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>

            <div className="mt-10 w-full max-w-[500px] rounded-xl border border-slate-300 p-6 text-left shadow-sm">
              <h2 className="text-[20px] font-bold text-slate-500 mb-6">{payload?.eventType?.name || "30 Minute Meeting"}</h2>
              
              <div className="flex flex-col gap-4 text-slate-500 font-bold text-[15px]">
                <div className="flex items-center gap-3 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {payload?.user?.name || "Adil Adnan"}
                </div>
                
                {selectedSlot ? (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {selectedSlot.startLabel} - {selectedSlot.endLabel}, {format(new Date(selectedSlot.start), "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>10:00am - 10:30am, Friday, April 17, 2026</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>India Standard Time</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Web conferencing details to follow.</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-8">
              <a href="#" className="font-bold text-[#0B5FFF] text-sm hover:underline">Cookie settings</a>
            </div>
          </div>
        ) : (
        <>
        {/* Left Sidebar */}
        <div className="flex w-full flex-col p-8 md:w-5/12 border-r border-slate-200">
          <div 
            onClick={() => router.back()} 
            className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0B5FFF] hover:bg-slate-50 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>

          <p className="text-[17px] font-bold text-slate-500">{payload?.user?.name || "Adil Adnan"}</p>
          <h1 className="mt-1 text-3xl font-bold text-[#1A1A1A]">{payload?.eventType?.name || "30 Minute Meeting"}</h1>
          
          <div className="mt-6 flex flex-col gap-[18px] text-slate-600 font-bold text-[15.5px]">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{payload?.eventType?.duration || 30} min</span>
            </div>
            
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v8a2 2 0 002 2z" />
              </svg>
              <span className="leading-snug">Web conferencing details provided upon<br/>confirmation.</span>
            </div>

            {selectedSlot && (
              <div className="flex items-start gap-3 text-[#1A1A1A]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="leading-snug">
                   {selectedSlot.startLabel} - {selectedSlot.endLabel}, {format(new Date(selectedSlot.start), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>India Standard Time</span>
            </div>
          </div>

        </div>

        {/* Right Content */}
        <div className="flex w-full flex-col p-8 md:w-7/12">
          {!selectedSlot ? (
            <div className="w-full">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Select Date & Time</h2>
              
              <div className="flex justify-between">
                <div>
                  {/* Calendar Header */}
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 text-slate-400 hover:text-slate-600 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-base font-semibold text-slate-800 min-w-[120px] text-center">
                      {format(currentMonth, "MMMM yyyy")}
                    </span>
                    <button onClick={() => changeMonth(1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-[#0B5FFF] hover:bg-blue-100 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 mb-2">
                    <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center text-sm font-semibold">
                    {calendarDays.map((dayObj, i) => {
                      const isCurrent = dayObj.type === 'current';
                      const isSelected = isCurrent && isSameDay(dayObj.date, selectedDate);
                      const isTodayDate = isToday(dayObj.date);
                      const isPast = isBefore(dayObj.date, startOfDay(new Date()));
                      const isDisabled = !isCurrent || isPast;
                      const hasDot = isCurrent && !isPast && (isSelected || dayObj.date.getDate() === 16);

                      return (
                        <div key={i} className="w-12 h-12 flex flex-col items-center justify-center">
                          <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setSelectedDate(dayObj.date)}
                            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all relative ${
                              !isCurrent ? "text-transparent cursor-default" :
                              isPast ? "text-slate-300 fontal cursor-default" :
                              isSelected ? "bg-[#0B5FFF] text-white" :
                              isTodayDate ? "text-[#0B5FFF] bg-blue-50 hover:bg-blue-100" :
                              "text-[#0B5FFF] bg-blue-50 hover:bg-blue-100"
                            }`}
                          >
                            {dayObj.date.getDate()}
                            {hasDot && !isSelected && (
                              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-500"></span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Timezone */}
                  <div className="mb-4 mt-6">
                    <p className="text-[14.5px] font-bold text-[#1A1A1A] mb-2">Time zone</p>
                    <div className="flex items-center gap-[6px] text-[15px] text-slate-900 cursor-pointer py-1 px-1 w-fit mt-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {payload?.user?.timezone || "India Standard Time (10:02pm)"}
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Time slots column */}
                <div className="flex flex-col pb-4 ml-[70px] overflow-y-auto max-h-[480px] w-[210px] mt-[-3px]">
                  <p className="text-[17px] text-[#1A1A1A] mb-[20px]">
                    {format(selectedDate, "EEEE, MMMM d")}
                  </p>
                  
                  <div className="flex flex-col gap-[10px] pr-2">
                    {payload && payload.slots && payload.slots.length > 0 ? (
                      payload.slots.map((slot) => {
                        const slotDate = new Date(slot.start);
                        const isPastSlot = isBefore(slotDate, new Date());

                        return (
                          <button
                            key={slot.start}
                            type="button"
                            disabled={isPastSlot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full rounded-lg font-bold text-base py-4 transition ${
                              isPastSlot 
                                ? "border border-slate-200 text-slate-300 cursor-not-allowed" 
                                : "border border-[#0B5FFF]/40 text-[#0B5FFF] hover:border-[#0B5FFF] hover:border-2"
                            }`}
                          >
                            {slot.startLabel}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-base text-slate-500 mt-2">No times available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md animate-in slide-in-from-right-4 fade-in duration-300">
               <div className="mb-6">
                <button onClick={() => setSelectedSlot(null)} className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 text-[#0B5FFF] hover:bg-slate-50 transition mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Enter Details</h2>
               </div>

               <form onSubmit={(e) => void handleBook(e)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1">Name *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-800 focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-800 focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] outline-none transition"
                      required
                    />
                  </div>
                  
                  <div>
                    <button type="button" className="rounded-full border border-[#0B5FFF] px-4 py-1.5 text-sm font-bold text-[#0B5FFF] transition hover:bg-[#0B5FFF]/5">
                      Add Guests
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1">Please share anything that will help prepare for our meeting.</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-800 focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] outline-none transition resize-y"
                    ></textarea>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    By proceeding, you confirm that you have read and agree to{" "}
                    <a href="#" className="font-bold text-[#0B5FFF] hover:underline">Calendly's Invitee Terms</a> and{" "}
                    <a href="#" className="font-bold text-[#0B5FFF] hover:underline">Privacy Notice</a>.
                  </p>

                  <button
                    type="submit"
                    className="rounded-full bg-[#0B5FFF] px-6 py-3 font-bold text-white transition hover:bg-[#004ed1]"
                  >
                    Schedule Event
                  </button>
                </form>

                {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">{error}</p>}
            </div>
          )}
        </div>
        </>
      )}
      </div>
    </main>
  );
}
