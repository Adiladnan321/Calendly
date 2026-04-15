"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { request } from "@/lib/api";

type PublicUserPageProps = {
  params: Promise<{
    username: string;
  }>;
};

type EventType = {
  id: string;
  name: string;
  slug: string;
  duration: number;
  color: string;
};

type UserData = {
  name: string;
  slug: string;
};

type PublicPayload = {
  user: UserData;
  eventTypes: EventType[];
};

export default function PublicUserPage({ params }: PublicUserPageProps) {
  const [routeParams, setRouteParams] = useState<{ username: string } | null>(null);
  const [payload, setPayload] = useState<PublicPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void params.then(setRouteParams);
  }, [params]);

  useEffect(() => {
    async function loadEventTypes(): Promise<void> {
      if (!routeParams) return;

      try {
        const data = await request<PublicPayload>(`/api/event-types/public/${routeParams.username}`);
        setPayload(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load user profile");
      }
    }

    void loadEventTypes();
  }, [routeParams]);

  if (error) {
    return (
      <main className="min-h-screen bg-[#F3F4F5] flex items-center justify-center p-4">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="min-h-screen bg-[#F3F4F5] flex items-center justify-center p-4">
        <p className="text-slate-500 font-semibold">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F5] p-4 md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-3xl font-bold text-slate-500">
            {payload.user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-slate-800">{payload.user.name}</h1>
          <p className="mt-2 text-slate-600">Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {payload.eventTypes.length > 0 ? (
            payload.eventTypes.map((event) => (
              <Link 
                key={event.id}
                href={`/${payload.user.slug}/${event.slug}`}
                className="group block relative overflow-hidden rounded-xl bg-white border-t-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md h-[180px]"
                style={{ borderColor: event.color || "#0B5FFF" }}
              >
                <div className="p-6 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{event.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{event.duration} min</p>
                  </div>
                  <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-[#0B5FFF] transition-colors">
                     View availability
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500 font-semibold py-12">No public event types available.</p>
          )}
        </div>
      </div>
    </main>
  );
}
