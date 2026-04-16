import { SchedulesSidebarProps } from "./utils/Availability.types";

export default function SchedulesSidebar({
  schedules,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: SchedulesSidebarProps) {
  return (
    <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-4 shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Schedules</h3>
        <button
          onClick={onCreate}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-[#0B5FFF] hover:text-white transition"
          title="Create Schedule"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {schedules.map((s) => {
          const isActive = s.id === activeId;
          return (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold cursor-pointer transition ${
                isActive 
                  ? "bg-white border text-slate-900 border-slate-200 shadow-sm" 
                  : "text-slate-600 border border-transparent hover:bg-slate-200"
              }`}
            >
              <span className="truncate flex-1">
                {s.name} {s.isDefault && <span className="ml-1.5 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Default</span>}
              </span>
              {!s.isDefault && (
                <button
                  type="button"
                  onClick={(e) => onDelete(s.id, e)}
                  className="ml-2 hidden text-slate-400 hover:text-red-500 group-hover:block transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
        {schedules.length === 0 && (
          <p className="text-xs text-slate-500 italic mt-2">No schedules created yet.</p>
        )}
      </nav>
    </div>
  );
}
