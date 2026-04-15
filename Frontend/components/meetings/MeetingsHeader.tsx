import { MeetingsHeaderProps } from "./utils/Meetings.types";

export default function MeetingsHeader({ filteredLength, totalLength }: MeetingsHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6">
      <div className="flex items-center gap-6 text-[#0B3558] text-[15px]">
        <button className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50 transition bg-white">
          My Calendly
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span>Show buffers</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-[#0B5FFF] ml-1 cursor-pointer">
            <span className="inline-block h-3.5 w-3.5 translate-x-[1.125rem] transform rounded-full bg-white transition" />
          </div>
        </div>
      </div>

      <div className="text-[14.5px] text-[#0B3558] mt-4 sm:mt-0">
        Displaying {filteredLength} of {totalLength} Events
      </div>
    </div>
  );
}
