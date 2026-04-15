import { PublicPayload, PublicSlot } from "./sharedTypes";

export interface BookingCalendarProps {
  currentMonth: Date;
  changeMonth: (offset: number) => void;
  calendarDays: { date: Date; type: "prev" | "current" | "next" }[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  payload: PublicPayload | null;
  setSelectedSlot: (slot: PublicSlot) => void;
}
