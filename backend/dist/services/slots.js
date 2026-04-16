"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlots = generateSlots;
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
function isOverlap(aStart, aEnd, bStart, bEnd) {
    return !(aEnd <= bStart || aStart >= bEnd);
}
function generateSlots(targetDateStr, // 'YYYY-MM-DD'
hostTimezone, durationMins, availability, existingBookings) {
    const slots = [];
    // Parse candidate days in host timezone to cover the timezone offset window
    const baseDate = (0, date_fns_tz_1.toDate)(`${targetDateStr}T00:00:00`, { timeZone: hostTimezone });
    const candidateDates = [
        (0, date_fns_1.addDays)(baseDate, -1),
        baseDate,
        (0, date_fns_1.addDays)(baseDate, 1)
    ];
    for (const date of candidateDates) {
        const dayOfWeekStr = (0, date_fns_tz_1.formatInTimeZone)(date, hostTimezone, 'i'); // 1=Mon...7=Sun
        // JS getDay is 0=Sun...6=Sat. match to standard.
        const dayOfWeek = parseInt(dayOfWeekStr, 10) % 7;
        const dayAvailability = availability.find((entry) => entry.dayOfWeek === dayOfWeek);
        if (!dayAvailability)
            continue;
        // e.g. date is midnight in host timezone.
        const dateStr = (0, date_fns_tz_1.formatInTimeZone)(date, hostTimezone, 'yyyy-MM-dd');
        let current = (0, date_fns_tz_1.toDate)(`${dateStr}T${dayAvailability.startTime}:00`, { timeZone: hostTimezone });
        const dayEnd = (0, date_fns_tz_1.toDate)(`${dateStr}T${dayAvailability.endTime}:00`, { timeZone: hostTimezone });
        while ((0, date_fns_1.addMinutes)(current, durationMins) <= dayEnd) {
            const slotEnd = (0, date_fns_1.addMinutes)(current, durationMins);
            const alreadyBooked = existingBookings.some((booking) => booking.status === "confirmed" &&
                isOverlap(current, slotEnd, booking.startTime, booking.endTime));
            if (!alreadyBooked) {
                slots.push({
                    start: current,
                    end: slotEnd,
                    startLabel: (0, date_fns_tz_1.formatInTimeZone)(current, hostTimezone, "h:mm a"),
                    endLabel: (0, date_fns_tz_1.formatInTimeZone)(slotEnd, hostTimezone, "h:mm a"),
                });
            }
            current = (0, date_fns_1.addMinutes)(current, durationMins);
        }
    }
    return slots;
}
