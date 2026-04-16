import { MeetingsHeaderProps } from "./utils/Meetings.types";

export default function MeetingsHeader({ filteredLength, totalLength }: MeetingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#0B3558] text-[15px] w-full sm:w-auto">
        <button className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50 transition bg-white w-full sm:w-auto justify-center sm:justify-start">
          My Calendly
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
          <div className="flex items-center gap-2">
            <span>Show buffers</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-[#0B5FFF] sm:ml-1 cursor-pointer">
            <span className="inline-block h-3.5 w-3.5 translate-x-[1.125rem] transform rounded-full bg-white transition" />
          </div>
        </div>
      </div>

      <div className="text-[14.5px] text-slate-500 mt-2 sm:mt-0 font-medium">
        Displaying {filteredLength} of {totalLength} Events
      </div>
    </div>
  );
}
