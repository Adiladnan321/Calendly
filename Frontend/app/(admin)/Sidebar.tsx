"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const topNavItems = [
  {
    href: "/event-types",
    label: "Scheduling",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path>
      </svg>
    ),
  },
  {
    href: "/meetings",
    label: "Meetings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <circle cx="9" cy="16" r="1.5" fill="currentColor"></circle>
        <circle cx="15" cy="16" r="1.5" fill="currentColor"></circle>
      </svg>
    ),
  },
  {
    href: "/availability",
    label: "Availability",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-[260px] flex-col border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:z-20 md:flex pb-6 overflow-y-auto custom-scrollbar">
        {/* Header Logo & Collapse */}
      <div className="flex h-[72px] items-center justify-between px-6 pt-2">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="flex items-center justify-center text-[#0B5FFF]">
            <svg viewBox="0 0 40 40" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M19.141 10.605C14.717 10.605 11 14.186 11 18.5c0 4.315 3.717 7.896 8.141 7.896 1.708 0 3.32-.524 4.675-1.455a1 1 0 011.144 1.58C23.23 27.712 21.267 28.396 19.141 28.396 13.568 28.396 9 23.901 9 18.5 9 13.099 13.568 8.604 19.141 8.604c2.179 0 4.186.721 5.869 1.956a1 1 0 01-1.18 1.611 7.6 7.6 0 00-4.689-1.566z" />
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M19.141 12.605C15.822 12.605 13 15.244 13 18.5c0 3.257 2.822 5.895 6.141 5.895a6.002 6.002 0 005.105-3.031 1 1 0 111.758.95A8.002 8.002 0 0119.141 26.4c-4.425 0-8.141-3.582-8.141-7.895 0-4.314 3.716-7.896 8.141-7.896 1.05 0 2.054.195 2.973.548a1 1 0 01-.715 1.868A6.16 6.16 0 0019.14 12.605z" />
              <path fill="#0B5FFF" d="M18.847 5c7.643 0 13.84 6.044 13.84 13.5s-6.197 13.5-13.84 13.5C11.196 32 5 25.956 5 18.5S11.196 5 18.847 5z" fillOpacity=".15" />
            </svg>
          </div>
          <span className="text-[22px] tracking-tight font-bold text-[#0B5FFF]">Calendly</span>
        </div>
        <button type="button" className="text-slate-800 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          </svg>
        </button>
      </div>

      {/* Create Button */}
      <div className="px-5 py-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 py-[10px] text-[15px] font-semibold text-[#0B3558] transition hover:bg-slate-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-[6px] px-[12px] pt-4">
        {topNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-[14px] rounded-lg px-4 py-[10px] text-[15px] font-semibold transition-colors ${
                isActive
                  ? "bg-[#F0F4FF] text-[#0A41CC]"
                  : "text-[#0B3558] hover:bg-slate-50"
              }`}
            >
              {isActive && (
                <div className="absolute left-[-12px] h-[34px] w-1 rounded-r-full bg-[#0B5FFF]" />
              )}
              <span className={isActive ? "text-[#0A41CC]" : "text-[#0B3558]"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-[12px] pt-8 flex flex-col gap-[6px]">
 
        <button
          type="button"
          className="flex items-center justify-between rounded-lg px-4 py-[10px] text-[15px] font-semibold text-[#0B3558] transition-colors hover:bg-slate-50"
        >
          <div className="flex items-center gap-[14px]">
            <span className="text-[#0B3558]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            Profile
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </button>
      </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2 pb-safe md:hidden shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        {topNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl transition ${
                isActive ? "text-[#0B5FFF]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className={`text-[11px] font-medium leading-none ${isActive ? "font-bold text-[#0B5FFF]" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* Profile/Menu Tab Space */}
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
        >
          <div className="p-1.5 rounded-full bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className="text-[11px] font-medium leading-none">Profile</span>
        </button>
      </nav>
    </>
  );
}
