import { AvailabilityEditorProps } from "./utils/Availability.types";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AvailabilityEditor({
  schedule,
  form,
  setForm,
  onSave,
  loading,
  onUpdateName,
  onSetDefault,
}: AvailabilityEditorProps) {
  return (
    <div className="flex-1 flex flex-col pt-4 md:pt-6 pb-20 px-4 md:px-8 overflow-y-auto">
      <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 pb-4 md:pb-6 border-b border-slate-200">
        <div className="flex-1">
          <input
            type="text"
            value={schedule.name}
            onChange={(e) => onUpdateName?.(e.target.value)}
            onBlur={(e) => onUpdateName?.(e.target.value)}
            className="w-full truncate text-2xl font-bold text-slate-900 outline-none placeholder:text-slate-300 border-b-2 border-transparent transition focus:border-slate-300 bg-transparent hover:bg-slate-50 p-1 -ml-1 rounded"
            placeholder="Schedule Name"
          />
          <p className="mt-1 text-sm font-medium text-slate-500">
            Define the weekly hours when you're available for this schedule.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap shrink-0 gap-3 text-sm font-bold">
          {!schedule.isDefault && (
            <button
              onClick={() => onSetDefault && void onSetDefault()}
              className="rounded-full border border-slate-300 px-5 py-2 text-slate-600 transition hover:bg-slate-50 shadow-sm"
              type="button"
            >
              Set as Default
            </button>
          )}
          <button
            onClick={() => void onSave()}
            disabled={loading}
            className="rounded-full bg-[#0B5FFF] px-6 py-2 text-white transition hover:bg-[#004ed1] shadow-sm disabled:opacity-50"
            type="button"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {form.map((day, idx) => (
          <div key={days[idx]} className="flex flex-col md:grid md:items-center md:justify-between gap-3 md:gap-4 rounded-xl border border-slate-200 bg-white p-4 py-4 md:py-3 hover:border-slate-300 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] md:grid-cols-[200px_1fr_auto] w-full">
            <label className="flex cursor-pointer select-none items-center gap-3 text-[14.5px] font-bold text-slate-700">
              <input
                type="checkbox"
                checked={day.enabled}
                onChange={(e) => {
                  setForm((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], enabled: e.target.checked };
                    return next;
                  });
                }}
                className="h-4 w-4 rounded border-slate-300 text-[#0B5FFF] focus:ring-[#0B5FFF] active:bg-[#0B5FFF] checked:bg-[#0B5FFF] checked:border-transparent transition"
              />
              {days[idx]}
            </label>

            {day.enabled ? (
              <>
                <div className="flex items-center gap-3 ">
                  <input
                    type="time"
                    value={day.startTime}
                    onChange={(e) => {
                      setForm((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], startTime: e.target.value };
                        return next;
                      });
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none transition focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] cursor-pointer"
                  />
                  <span className="text-slate-400 font-bold">-</span>
                  <input
                    type="time"
                    value={day.endTime}
                    onChange={(e) => {
                      setForm((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], endTime: e.target.value };
                        return next;
                      });
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none transition focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] cursor-pointer"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2 text-[14px] font-medium text-slate-400">Unavailable</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
