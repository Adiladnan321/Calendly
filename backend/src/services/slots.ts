import { addMinutes, addDays } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

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

function isOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return !(aEnd <= bStart || aStart >= bEnd);
}

export function generateSlots(
  targetDateStr: string, // 'YYYY-MM-DD'
  hostTimezone: string,
  durationMins: number,
  availability: TimeRange[],
  existingBookings: ExistingBooking[]
): Slot[] {
  const slots: Slot[] = [];

  // Parse candidate days in host timezone to cover the timezone offset window
  const baseDate = toDate(`${targetDateStr}T00:00:00`, { timeZone: hostTimezone });
  const candidateDates = [
    addDays(baseDate, -1),
    baseDate,
    addDays(baseDate, 1)
  ];

  for (const date of candidateDates) {
    const dayOfWeekStr = formatInTimeZone(date, hostTimezone, 'i'); // 1=Mon...7=Sun
    // JS getDay is 0=Sun...6=Sat. match to standard.
    const dayOfWeek = parseInt(dayOfWeekStr, 10) % 7; 

    const dayAvailability = availability.find((entry) => entry.dayOfWeek === dayOfWeek);
    if (!dayAvailability) continue;

    // e.g. date is midnight in host timezone.
    const dateStr = formatInTimeZone(date, hostTimezone, 'yyyy-MM-dd');

    let current = toDate(`${dateStr}T${dayAvailability.startTime}:00`, { timeZone: hostTimezone });
    const dayEnd = toDate(`${dateStr}T${dayAvailability.endTime}:00`, { timeZone: hostTimezone });

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
          startLabel: formatInTimeZone(current, hostTimezone, "h:mm a"),
          endLabel: formatInTimeZone(slotEnd, hostTimezone, "h:mm a"),
        });
      }

      current = addMinutes(current, durationMins);
    }
  }

  return slots;
}
