import { format } from "date-fns";
import { BookingSidebarProps } from "./utils/BookingSidebar.types";
import { useRouter } from "next/navigation";

export default function BookingSidebar({ payload, selectedSlot }: BookingSidebarProps) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col p-6 md:p-8 md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 bg-white z-10 relative mt-14">
 

      <p className="text-[17px] font-bold text-slate-500">{payload?.user?.name || "Demo User"}</p>
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
          <span>{payload?.user?.timezone || "India Standard Time"}</span>
        </div>
      </div>
    </div>
  );
}