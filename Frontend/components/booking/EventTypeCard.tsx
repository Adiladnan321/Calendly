import Link from "next/link";
import { EventTypeCardProps } from "./utils/EventTypeCard.types";

export default function EventTypeCard({ event, username }: EventTypeCardProps) {
  return (
    <Link 
      href={`/${username}/${event.slug}`}
      className="group block relative overflow-hidden rounded-[8px] bg-white border border-slate-200 border-t-[4px] shadow-[0_1px_8px_0_rgba(0,0,0,0.04)] transition-all hover:-translate-y-[2px] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08)] h-[200px]"
      style={{ borderTopColor: event.color || "#0B5FFF" }}
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0A2540]">{event.name}</h2>
          <p className="mt-2 text-[15.5px] font-semibold text-[#556A7F]">{event.duration} min</p>
        </div>
        <div className="text-[14.5px] font-bold text-[#73899E] group-hover:text-[#0B5FFF] transition-colors">
            View availability
        </div>
      </div>
    </Link>
  );
}