"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import type { EventType } from "@/lib/types";

export default function EventTypesPage() {
  const [items, setItems] = useState<EventType[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createPayload, setCreatePayload] = useState({ name: "", slug: "", duration: 30, color: "#8a42ff" });
  const [createLoading, setCreateLoading] = useState(false);

  async function loadEventTypes(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const data = await request<EventType[]>("/api/event-types");
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load event types");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEventTypes();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleItemActive = (id: string, currentStatus: boolean | undefined) => {
    // Determine active safely since it might be undefined originally
    const newStatus = typeof currentStatus !== "undefined" ? !currentStatus : false;
    
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, isActive: newStatus } : it
      )
    );
    setMenuOpenFor(null);
  };

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setError(null);
    try {
      const newItem = await request<EventType>("/api/event-types", {
        method: "POST",
        body: JSON.stringify(createPayload),
      });
      // Add to list and close modal
      setItems((prev) => [newItem, ...prev]);
      setIsCreateModalOpen(false);
      setCreatePayload({ name: "", slug: "", duration: 30, color: "#8a42ff" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create scheduling type");
    } finally {
      setCreateLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-3xl font-semibold text-slate-900">
            Scheduling
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-600">
              ?
            </span>
          </h2>
          <nav className="mt-8 flex gap-7 border-b border-slate-200 text-sm font-semibold text-slate-500">
            <button type="button" className="border-b-2 border-[#0B5FFF] pb-3 text-[#0B5FFF]">
              Event types
            </button>
            <button type="button" className="pb-3 hover:text-slate-700">
              Single-use links
            </button>
            <button type="button" className="pb-3 hover:text-slate-700">
              Meeting polls
            </button>
          </nav>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
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
            onChange={(e) => setQuery(e.target.value)}
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
          href="/adil-adnan" 
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

      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <section className="space-y-4 pb-20">
          {filteredItems.map((item) => {
            // Default isActive to true if undefined. 
            const isActive = item.isActive !== false;

            return (
              <article
                key={item.id}
                className={`relative flex items-start gap-4 rounded-xl border p-5 shadow-sm transition ${
                  isActive ? "border-slate-200 bg-white hover:shadow-md" : "border-slate-100 bg-slate-50 opacity-80"
                }`}
              >
                <div className={`absolute inset-y-0 left-0 w-2   rounded-l-xl ${isActive ? 'bg-[#8a42ff]' : 'bg-slate-300'}`} />


                <div className="flex flex-1 flex-wrap items-center justify-between gap-4 pl-4">
                  <div className={!isActive ? "opacity-70" : ""}>
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{item.name}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {item.duration} min • Google Meet • One-on-One
                    </p>
                    <a href={`/adil-adnan/${item.slug}`} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm font-medium text-[#0B5FFF] hover:underline">
                      /adil-adnan/{item.slug}
                    </a>
                    <p className="text-sm font-medium text-slate-400 mt-2">Weekdays, 9 am - 5 pm</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const url = `${window.location.origin}/adil-adnan/${item.slug}`;
                            navigator.clipboard.writeText(url);
                            setCopiedId(item.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
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
                        <button type="button" className="text-slate-400 hover:text-slate-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                        
                        {/* 3-dash Option Menu wrapper */}
                        <div className="relative">
                          <button 
                            type="button" 
                            className="p-1 text-slate-400 hover:text-slate-700 transition"
                            onClick={() => setMenuOpenFor(menuOpenFor === item.id ? null : item.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 6h16M4 18h16" />
                            </svg>
                          </button>

                          {menuOpenFor === item.id && (
                            <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg shadow-slate-200/50 ring-1 ring-slate-950/5 z-20">
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                                onClick={() => toggleItemActive(item.id, isActive)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Turn off
                              </button>
                              {/* Future actions could go here */}
                              <button type="button" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                              </button>
                              <button type="button" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleItemActive(item.id, isActive)}
                        className="rounded-full bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                      >
                        Turn on
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {filteredItems.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
              No matching event types found. You can fake create one to see it list here.
            </p>
          )}
        </section>
      )}

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Create new scheduling type</h2>
              <button 
                type="button" 
                className="text-slate-400 hover:text-slate-600 transition"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={createPayload.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setCreatePayload(p => ({ ...p, name: val, slug }));
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#0B5FFF]/20"
                  placeholder="e.g. 15 Minute Meeting" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                <div className="flex rounded-lg border border-slate-300 transition-within focus-within:border-[#0B5FFF] focus-within:ring-2 focus-within:ring-[#0B5FFF]/20">
                  <span className="flex items-center rounded-l-lg border-r border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                    /adil-adnan/
                  </span>
                  <input 
                    required
                    type="text" 
                    value={createPayload.slug}
                    onChange={(e) => setCreatePayload(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    className="w-full rounded-r-lg border-none px-3 py-2 text-sm outline-none"
                    placeholder="15-minute-meeting" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                <select 
                  value={createPayload.duration}
                  onChange={(e) => setCreatePayload(p => ({ ...p, duration: Number(e.target.value) }))}
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
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading || !createPayload.name || !createPayload.slug}
                  className="rounded-full bg-[#0B5FFF] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#004ed1] disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Save & Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
