import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "/event-types", label: "Scheduling", icon: "🔗" },
  { href: "/meetings", label: "Meetings", icon: "📅" },
  { href: "/availability", label: "Availability", icon: "🕒" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  // We'll use a functional component wrapper to have usePathname if you prefer,
  // but since it's a layout, we can just use a generic matching approach or make it a Client Component.
  // Wait, layout can't use usePathname if it's a server component.
  // Let's keep it simple for now without active states on the sidebar.
  
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:z-20 md:flex">
          <div className="flex h-16 items-center px-6">
            <span className="text-xl font-bold text-[#0B5FFF]">Calendly</span>
          </div>

          <div className="px-4 py-4">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#0B5FFF] py-2 text-sm font-semibold text-[#0B5FFF] transition hover:bg-slate-50"
            >
              <span className="text-lg leading-none">+</span>
              Create
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="text-slate-400">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:pl-64">
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
