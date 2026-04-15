"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlots = generateSlots;
const date_fns_1 = require("date-fns");
function parseTimeForDate(value, date) {
    const parsed = (0, date_fns_1.parse)(value, "HH:mm", (0, date_fns_1.startOfDay)(date));
    return parsed;
}
function isOverlap(aStart, aEnd, bStart, bEnd) {
    return !(aEnd <= bStart || aStart >= bEnd);
}
function generateSlots(date, durationMins, availability, existingBookings) {
    const dayOfWeek = date.getDay();
    const dayAvailability = availability.find((entry) => entry.dayOfWeek === dayOfWeek);
    if (!dayAvailability) {
        return [];
    }
    const slots = [];
    let current = parseTimeForDate(dayAvailability.startTime, date);
    const dayEnd = parseTimeForDate(dayAvailability.endTime, date);
    while ((0, date_fns_1.addMinutes)(current, durationMins) <= dayEnd) {
        const slotEnd = (0, date_fns_1.addMinutes)(current, durationMins);
        const alreadyBooked = existingBookings.some((booking) => booking.status === "confirmed" &&
            isOverlap(current, slotEnd, booking.startTime, booking.endTime));
        if (!alreadyBooked) {
            slots.push({
                start: current,
                end: slotEnd,
                startLabel: (0, date_fns_1.format)(current, "h:mm a"),
                endLabel: (0, date_fns_1.format)(slotEnd, "h:mm a"),
            });
        }
        current = (0, date_fns_1.addMinutes)(current, durationMins);
    }
    return slots;
}
