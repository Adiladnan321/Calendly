import { FormEvent } from "react";
import { BookingFormProps } from "./utils/BookingForm.types";

export default function BookingForm({
  name,
  setName,
  email,
  setEmail,
  handleBook,
  setSelectedSlot,
  error,
}: BookingFormProps) {
  return (
    <div className="w-full max-w-md animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="mb-6">
        <button onClick={() => setSelectedSlot(null)} className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 text-[#0B5FFF] hover:bg-slate-50 transition mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Enter Details</h2>
      </div>

      <form onSubmit={(e) => void handleBook(e)} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-800 focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-800 focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] outline-none transition"
            required
          />
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          By proceeding, you confirm that you have read and agree to{" "}
          <a href="#" className="font-bold text-[#0B5FFF] hover:underline">Calendly's Invitee Terms</a> and{" "}
          <a href="#" className="font-bold text-[#0B5FFF] hover:underline">Privacy Notice</a>.
        </p>

        <div className="flex justify-end ">
          <button
            type="submit"
            className=" rounded-full bg-[#0B5FFF] px-6 py-3 font-bold text-white transition hover:bg-[#004ed1]"
          >
            Schedule Event
          </button>
        </div>
      </form>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">{error}</p>}
    </div>
  );
}