import { MeetingsTabsProps } from "./utils/Meetings.types";

export default function MeetingsTabs({
  tab,
  setTab,
  dateRange,
  setDateRange,
  onExport,
}: MeetingsTabsProps & { onExport?: () => void }) {
  const hasDateRange = Boolean(dateRange.start || dateRange.end);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap sm:items-end justify-between border-b border-slate-200 mt-2 gap-4 bg-white px-4 sm:px-6">
      <div className="flex flex-row overflow-x-auto custom-scrollbar flex-nowrap items-center gap-6 text-[15px] font-semibold text-slate-600 w-full sm:w-auto border-b sm:border-b-0 border-slate-100 sm:pb-0 mb-2 sm:mb-0">
        <button
          type="button"
          onClick={() => {
            setDateRange({ start: "", end: "" });
            setTab("upcoming");
          }}
          className={`pb-4 border-b-[3px] transition-colors duration-200 ${
            tab === "upcoming" && !hasDateRange
              ? "border-[#0B5FFF] text-[#0B5FFF] font-bold"
              : "border-transparent hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => {
            setDateRange({ start: "", end: "" });
            setTab("past");
          }}
          className={`pb-4 border-b-[3px] transition-colors duration-200 ${
            tab === "past" && !hasDateRange
              ? "border-[#0B5FFF] text-[#0B5FFF] font-bold"
              : "border-transparent hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          Past
        </button>

        {/* Date Range Dropdown Tab */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTab(tab === "date_range" ? "upcoming" : "date_range")}
            className={`pb-4 border-b-[3px] flex items-center gap-1.5 transition-colors duration-200 ${
              tab === "date_range" || hasDateRange
                ? "border-[#0B5FFF] text-[#0B5FFF] font-bold"
                : "border-transparent hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            {hasDateRange ? "Filtered Date Range" : "Date Range"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`mt-[3px] transition-transform duration-200 ${
                tab === "date_range" ? "rotate-180" : ""
              }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {tab === "date_range" && (
            <div className="absolute left-0 top-full z-20 mt-2 w-[calc(100vw-2rem)] sm:w-[340px] max-w-[340px] rounded-xl border border-slate-200 bg-white p-5 shadow-xl ring-1 ring-slate-900/5">
              <h4 className="text-[15px] font-bold text-slate-800 mb-4">Filter by Date</h4>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, start: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[14.5px] outline-none transition focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#0B5FFF]/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    End date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-[14.5px] outline-none transition focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#0B5FFF]/20"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setDateRange({ start: "", end: "" });
                      setTab("upcoming");
                    }}
                    className="rounded-full px-5 py-2 text-[14px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
                  >
                    Clear Filter
                  </button>
                  <button
                    onClick={() => setTab("upcoming")}
                    disabled={!dateRange.start && !dateRange.end}
                    className="rounded-full bg-[#0B5FFF] px-5 py-2 text-[14px] font-bold text-white transition hover:bg-[#004ed1] shadow-sm disabled:opacity-50 disabled:hover:bg-[#0B5FFF]"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pb-4 w-full sm:w-auto flex justify-end">
        <button 
          onClick={onExport}
          className="group flex items-center justify-center gap-2 w-full sm:w-auto rounded-full border border-slate-300 bg-white px-5 py-2 text-[14.5px] font-semibold text-[#0B3558] hover:bg-slate-50 transition shadow-sm active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-slate-400 group-hover:text-slate-600 transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Export
        </button>
      </div>
    </div>
  );
}
