import { format } from "date-fns";
import { BookingSuccessProps } from "./utils/BookingSuccess.types";

export default function BookingSuccess({ payload, selectedSlot }: BookingSuccessProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-20 px-4 mt-8 mb-12 animate-in fade-in duration-500 relative">
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
      
      <div className="mt-6 flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-[15px] font-bold text-[#1A1A1A] hover:bg-slate-50 transition cursor-pointer">
        INVITATION DETAILS
      </div>

      <div className="mt-10 w-full max-w-[500px] rounded-xl border border-slate-300 p-6 text-left shadow-sm">
        <h2 className="text-[20px] font-bold text-slate-500 mb-6">{payload?.eventType?.name || "Meeting"}</h2>
        
        <div className="flex flex-col gap-4 text-slate-500 font-bold text-[15px]">
          <div className="flex items-center gap-3 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {payload?.user?.name || "User"}
          </div>
          
          {selectedSlot && (
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {selectedSlot.startLabel} - {selectedSlot.endLabel}, {format(new Date(selectedSlot.start), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{payload?.user?.timezone || "India Standard Time"}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" className="text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Web conferencing details to follow.</span>
          </div>
        </div>
      </div>
    </div>
  );
}