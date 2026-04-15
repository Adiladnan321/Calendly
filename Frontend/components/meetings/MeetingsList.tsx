import { format, isToday } from "date-fns";
import { MeetingsListProps } from "./utils/Meetings.types";

export default function MeetingsList({ groupedBookings }: MeetingsListProps) {
  return (
    <div className="flex flex-col bg-[#F9FAFB]/50 min-h-[400px]">
      {groupedBookings.length > 0 ? (
        groupedBookings.map(([dateStr, dateBookings]) => {
          const dateObj = new Date(dateStr + "T00:00:00");
          return (
            <div key={dateStr} className="flex flex-col">
              {/* Date Header */}
              <div className="flex items-center border-b border-slate-200 bg-white px-6 py-4">
                <span className="text-[15.5px] text-slate-800 mr-2">
                  {format(dateObj, "EEEE, d MMMM yyyy")}
                </span>
                {isToday(dateObj) && (
                  <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
                    TODAY
                  </span>
                )}
              </div>

              {/* Date Items */}
              {dateBookings.map((booking) => {
                const start = new Date(booking.startTime);
                const endObj = new Date(booking.endTime);
                const formattedTime = `${format(start, "h:mm a")} - ${format(
                  endObj,
                  "h:mm a"
                )}`.toLowerCase();

                return (
                  <div
                    key={booking.id}
                    className="group flex items-center border-b border-slate-200 bg-white px-6 py-5 hover:bg-slate-50 transition w-full"
                  >
                    {/* Time & Circle */}
                    <div className="flex items-center gap-[40px] w-1/4 min-w-[220px]">
                      <div className="h-9 w-9 rounded-full bg-[#8a42ff] flex-shrink-0" />
                      <span className="text-[15px] font-medium text-slate-600 whitespace-nowrap">
                        {formattedTime}
                      </span>
                    </div>

                    {/* Title & Type */}
                    <div className="flex flex-col justify-center w-5/12 min-w-[280px] pl-4">
                      <p className="text-[15.5px] font-bold text-[#0B3558]">
                        {booking.inviteeName}
                      </p>
                      <p className="text-[14.5px] text-slate-600 mt-0.5">
                        Event type{" "}
                        <span className="font-bold text-[#0B3558]">
                          {booking.eventType.name}
                        </span>
                      </p>
                    </div>

                    {/* Attributes */}
                    <div className="text-[14.5px] text-[#0B3558] w-1/4">
                      1 host | 0 non-hosts
                    </div>

                    {/* Actions */}
                    <div className="w-[120px] flex justify-end">
                      <button className="flex items-center gap-1.5 text-[14.5px] font-semibold text-slate-400 hover:text-[#0B3558] transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })
      ) : (
        <div className="py-20 text-center text-slate-500">No events found.</div>
      )}

      {/* End Footer */}
      <div className="py-4 text-center text-[14.5px] text-slate-500 bg-white mt-auto border-t border-slate-200">
        You've reached the end of the list
      </div>
    </div>
  );
}
