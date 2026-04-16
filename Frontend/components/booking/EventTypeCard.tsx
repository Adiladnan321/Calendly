import Link from "next/link";
import { EventTypeCardProps } from "./utils/EventTypeCard.types";

export default function EventTypeCard({ event, username }: EventTypeCardProps) {
  return (
    <Link 
      href={`/${username}/${event.slug}`}
      className="group block relative overflow-hidden rounded-[12px] md:rounded-[8px] bg-white border border-slate-200 border-t-[5px] md:border-t-[4px] shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] md:shadow-[0_1px_8px_0_rgba(0,0,0,0.04)] transition-all hover:-translate-y-[2px] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08)] h-auto md:h-[200px] min-h-[160px] active:scale-[0.98] sm:active:scale-100"
      style={{ borderTopColor: event.color || "#0B5FFF" }}
    >
      <div className="p-5 md:p-6 h-full flex flex-col justify-between gap-6 md:gap-0">
        <div>
          <h2 className="text-[19px] md:text-[20px] font-bold text-[#0A2540]">{event.name}</h2>
          <p className="mt-1.5 md:mt-2 text-[14.5px] md:text-[15.5px] font-semibold text-[#556A7F] opacity-90">{event.duration} min</p>
        </div>
        <div className="flex items-center gap-1.5 text-[14.5px] font-bold text-[#73899E] group-hover:text-[#0B5FFF] transition-colors">
            View availability
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="opacity-0 -ml-2 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-0 transition-all duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </div>
      </div>
    </Link>
  );
}