import { addMinutes, format, parse, startOfDay } from "date-fns";

export type TimeRange = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type ExistingBooking = {
  startTime: Date;
  endTime: Date;
  status: string;
};

export type Slot = {
  start: Date;
  end: Date;
  startLabel: string;
  endLabel: string;
};

function parseTimeForDate(value: string, date: Date): Date {
  const parsed = parse(value, "HH:mm", startOfDay(date));
  return parsed;
}

function isOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return !(aEnd <= bStart || aStart >= bEnd);
}

export function generateSlots(
  date: Date,
  durationMins: number,
  availability: TimeRange[],
  existingBookings: ExistingBooking[]
): Slot[] {
  const dayOfWeek = date.getDay();
  const dayAvailability = availability.find((entry) => entry.dayOfWeek === dayOfWeek);

  if (!dayAvailability) {
    return [];
  }

  const slots: Slot[] = [];
  let current = parseTimeForDate(dayAvailability.startTime, date);
  const dayEnd = parseTimeForDate(dayAvailability.endTime, date);

  while (addMinutes(current, durationMins) <= dayEnd) {
    const slotEnd = addMinutes(current, durationMins);
    const alreadyBooked = existingBookings.some(
      (booking) =>
        booking.status === "confirmed" &&
        isOverlap(current, slotEnd, booking.startTime, booking.endTime)
    );

    if (!alreadyBooked) {
      slots.push({
        start: current,
        end: slotEnd,
        startLabel: format(current, "h:mm a"),
        endLabel: format(slotEnd, "h:mm a"),
      });
    }

    current = addMinutes(current, durationMins);
  }

  return slots;
}
