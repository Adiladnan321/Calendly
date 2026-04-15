import { format, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { BookingCalendarProps } from "./utils/BookingCalendar.types";

export default function BookingCalendar({
  currentMonth,
  changeMonth,
  calendarDays,
  selectedDate,
  setSelectedDate,
  payload,
  setSelectedSlot,
}: BookingCalendarProps) {
  return (
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
              {payload?.user?.timezone || "India Standard Time"}
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
  );
}