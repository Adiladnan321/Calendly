import { EventTypeItemProps } from "./utils/EventTypes.types";

export default function EventTypeItem({
  item,
  isActive,
  menuOpenFor,
  copiedId,
  onToggleActive,
  onMenuToggle,
  onCopyLink,
  onEdit,
  onDelete,
}: EventTypeItemProps) {
  return (
    <article
      className={`relative flex items-start gap-4 rounded-xl border p-5 shadow-sm transition ${
        isActive ? "border-slate-200 bg-white hover:shadow-md" : "border-slate-100 bg-slate-50 opacity-80"
      }`}
    >
      <div className={`absolute inset-y-0 left-0 w-2 rounded-l-xl ${isActive ? 'bg-[#8a42ff]' : 'bg-slate-300'}`} />

      <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-4">
        <div className={`w-full sm:w-auto ${!isActive ? "opacity-70" : ""}`}>
          <div className="flex justify-between items-start w-full">
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{item.name}</h3>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {item.duration} min • Google Meet • One-on-One
          </p>
          <a href={`/demo-user/${item.slug}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#0B5FFF] hover:underline break-all">
            /demo-user/{item.slug}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-sm font-medium text-slate-400 mt-2">Schedule: {item.schedule?.name || "Default Schedule"}</p>
        </div>

        <div className="flex items-center w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0 gap-3 justify-between sm:justify-end">
          {isActive ? (
            <>
              <button
                type="button"
                onClick={() => onCopyLink(item.id, item.slug)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  copiedId === item.id
                    ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {copiedId === item.id ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Copy link
                  </>
                )}
              </button>
              
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={() => onToggleActive(item.id, isActive)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition mr-1"
                >
                  Off
                </button>
                <button 
                  type="button" 
                  onClick={() => onEdit?.(item)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => onDelete?.(item.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => onToggleActive(item.id, isActive)}
                className="rounded-full bg-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 mr-1"
              >
                Turn on
              </button>
              <button 
                type="button" 
                onClick={() => onEdit?.(item)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                type="button" 
                onClick={() => onDelete?.(item.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
