"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#F3F4F5] text-slate-900">
      <div className="flex w-full">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 md:pl-[260px]">
          {/* Top navigation header */}
 

          <div className="mx-auto max-w-5xl px-4 md:px-8 py-6 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
    </QueryClientProvider>
  );
}
