import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 p-4">
      <main className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Calendly Clone
        </h1>
        <p className="text-slate-500 mb-8 text-sm">
          Welcome to the demo. Where would you like to go?
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/event-types"
            className="flex items-center justify-center rounded-full bg-[#0B5FFF] px-6 py-3 font-semibold text-white transition hover:bg-[#004ed1] shadow-sm"
          >
            Admin Dashboard
          </Link>
          
          <Link
            href="/demo-user"
            className="flex items-center justify-center rounded-full border border-[#0B5FFF] bg-white px-6 py-3 font-semibold text-[#0B5FFF] transition hover:bg-slate-50 shadow-sm"
          >
            Public Booking Page
          </Link>
        </div>
      </main>
    </div>
  );
}
