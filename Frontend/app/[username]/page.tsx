"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { request } from "@/lib/api";
import { toast } from "react-hot-toast";

import EventTypeCard from "@/components/booking/EventTypeCard";
import { EventType } from "@/components/booking/utils/EventTypeCard.types";
import UserHeader from "@/components/booking/UserHeader";
import { PublicProfileSkeleton } from "@/components/SkeletonLoaders";

type PublicUserPageProps = {
  params: Promise<{
    username: string;
  }>;
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
  const [error, setError] = useState<boolean>(false);

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
        setError(true);
        toast.error(err instanceof Error ? err.message : "Could not load user profile");
      }
    }

    void loadEventTypes();
  }, [routeParams]);

  if (error) {
    return (
      <main className="min-h-screen bg-[#F3F4F5] flex items-center justify-center p-4">
        <p className="text-slate-500 font-semibold">User profile unavailable.</p>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="min-h-screen bg-[#F3F4F5]">
        <PublicProfileSkeleton />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F5]">
      <div className="mx-auto max-w-[1040px] pt-8 md:pt-12 px-4 md:px-8 pb-12">
        <UserHeader name={payload.user.name} />

        <div className="grid gap-4 md:gap-[22px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-10">
          {payload.eventTypes.length > 0 ? (
            payload.eventTypes.map((event) => (
              <EventTypeCard key={event.id} event={event} username={payload.user.slug} />
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500 font-semibold py-12">No public event types available.</p>
          )}
        </div>
      </div>
    </main>
  );
}
