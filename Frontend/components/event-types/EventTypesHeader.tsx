import { EventTypesHeaderProps } from "./utils/EventTypes.types";

export default function EventTypesHeader({ query, onQueryChange, onCreateClick }: EventTypesHeaderProps) {
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-3xl font-semibold text-slate-900">
            Scheduling
            <div className="group relative flex items-center">
              <span className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-slate-300 text-xs text-slate-600 transition-colors group-hover:bg-slate-100">
                ?
              </span>
              <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-lg bg-slate-800 p-3 text-xs font-normal leading-relaxed text-white shadow-xl">
                  Scheduling allows you to create different event types, set your availability, and share booking links so invitees can seamlessly find a time to meet with you.
                </div>
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-slate-800" />
              </div>
            </div>
          </h2>
          <nav className="mt-8 flex gap-7 border-b border-slate-200 text-sm font-semibold text-slate-500">
            <button type="button" className="border-b-2 border-[#0B5FFF] pb-3 text-[#0B5FFF]">
              Event types
            </button>
          </nav>
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 rounded-full bg-[#0B5FFF] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004ed1] shadow-sm"
        >
          <span className="text-base leading-none">+</span>
          Create scheduling type
        </button>
      </header>

      <div className="max-w-md mt-6">
        <label className="relative block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search event types"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none ring-[#0B5FFF]/30 transition placeholder:text-slate-400 focus:ring-4 focus:border-[#0B5FFF]"
          />
        </label>
      </div>

      <div className="flex items-center justify-between pb-2 pt-4">
        <div className="inline-flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
            A
          </span>
          <span className="font-semibold text-slate-900">Adil Adnan</span>
        </div>
        <a 
          href="/demo-user" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-sm font-semibold text-[#0B5FFF] hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View landing page
        </a>
      </div>
    </>
  );
}
