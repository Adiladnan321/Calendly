import { CreateEventTypeModalProps } from "./utils/EventTypes.types";

export default function CreateEventTypeModal({
  isOpen,
  payload,
  loading,
  onClose,
  onChange,
  onSubmit,
}: CreateEventTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Create new scheduling type</h2>
          <button 
            type="button" 
            className="text-slate-400 hover:text-slate-600 transition"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
            <input 
              autoFocus
              required
              type="text" 
              value={payload.name}
              onChange={(e) => {
                const val = e.target.value;
                const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                onChange({ ...payload, name: val, slug });
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#0B5FFF]/20"
              placeholder="e.g. 15 Minute Meeting" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
            <div className="flex rounded-lg border border-slate-300 transition-within focus-within:border-[#0B5FFF] focus-within:ring-2 focus-within:ring-[#0B5FFF]/20">
              <span className="flex items-center rounded-l-lg border-r border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                /demo-user/
              </span>
              <input 
                required
                type="text" 
                value={payload.slug}
                onChange={(e) => onChange({ ...payload, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                className="w-full rounded-r-lg border-none px-3 py-2 text-sm outline-none"
                placeholder="15-minute-meeting" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
            <select 
              value={payload.duration}
              onChange={(e) => onChange({ ...payload, duration: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#0B5FFF]/20"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>1 hour 30 minutes</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !payload.name || !payload.slug}
              className="rounded-full bg-[#0B5FFF] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#004ed1] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
