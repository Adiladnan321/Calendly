import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // We'll use a functional component wrapper to have usePathname if you prefer,
  // but since it's a layout, we can just use a generic matching approach or make it a Client Component.
  // Wait, layout can't use usePathname if it's a server component.
  // Let's keep it simple for now without active states on the sidebar.
  
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="flex w-full">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 md:pl-[260px]">
          {/* Top navigation header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b border-slate-200 bg-white px-8">
            <div className="flex items-center gap-4">
              <button type="button" className="text-sm font-semibold text-slate-700 hover:underline">
                A
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700"
              >
                A
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-5xl px-8 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
