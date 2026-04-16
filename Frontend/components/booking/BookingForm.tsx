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
    <div className="w-full max-w-md mx-auto animate-in fade-in duration-300 pt-2 md:pt-0">
      <div className="mb-4 md:mb-6">
        <button onClick={() => setSelectedSlot(null)} className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 text-[#0B5FFF] hover:bg-slate-50 transition mb-3 md:mb-4 bg-white shadow-sm active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-[22px] md:text-2xl font-bold text-[#1A1A1A]">Enter Details</h2>
      </div>

      <form onSubmit={(e) => void handleBook(e)} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-[13.5px] md:text-sm font-bold text-slate-800 mb-1.5 md:mb-1">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl md:rounded-lg border border-slate-300 px-4 md:px-3 py-3.5 md:py-3 text-[15px] md:text-[14px] text-slate-800 focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] outline-none transition bg-white"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-[13.5px] md:text-sm font-bold text-slate-800 mb-1.5 md:mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl md:rounded-lg border border-slate-300 px-4 md:px-3 py-3.5 md:py-3 text-[15px] md:text-[14px] text-slate-800 focus:border-[#0B5FFF] focus:ring-1 focus:ring-[#0B5FFF] outline-none transition bg-white"
            placeholder="john@example.com"
            required
          />
        </div>

        <p className="text-[13px] md:text-sm text-slate-600 leading-relaxed pt-2">
          By proceeding, you confirm that you have read and agree to{" "}
          <a href="#" className="font-bold text-[#0B5FFF] hover:underline">Calendly's Invitee Terms</a> and{" "}
          <a href="#" className="font-bold text-[#0B5FFF] hover:underline">Privacy Notice</a>.
        </p>

        <div className="flex justify-end pt-4 pb-8 md:pb-0">
          <button
            type="submit"
            className="w-full md:w-auto rounded-full bg-[#0B5FFF] px-6 py-3.5 md:py-3 font-bold text-[15px] text-white shadow-md transition hover:bg-[#004ed1] active:scale-[0.98]"
          >
            Schedule Event
          </button>
        </div>
      </form>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">{error}</p>}
    </div>
  );
}