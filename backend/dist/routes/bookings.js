"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const userContext_1 = require("../middleware/userContext");
const slots_1 = require("../services/slots");
const router = (0, express_1.Router)();
const createBookingSchema = zod_1.z.object({
    eventTypeId: zod_1.z.string().cuid(),
    inviteeName: zod_1.z.string().min(2),
    inviteeEmail: zod_1.z.string().email(),
    startTime: zod_1.z.string().datetime(),
});
router.get("/public/:username/:slug", async (req, res) => {
    const dateQuery = zod_1.z
        .object({ date: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)) })
        .safeParse(req.query);
    if (!dateQuery.success) {
        res.status(400).json({ message: "Query param 'date' is required" });
        return;
    }
    const dateValue = dateQuery.data.date;
    const targetDate = dateValue.includes("T")
        ? (0, date_fns_1.parseISO)(dateValue)
        : (0, date_fns_1.parseISO)(dateValue); // Parse as local date correctly so date.getDay() works relative to the intended string
    const user = await prisma_1.prisma.user.findUnique({
        where: { slug: req.params.username },
        include: {
            schedules: {
                include: { availability: true }
            },
            eventTypes: {
                where: { slug: req.params.slug, isActive: true },
                take: 1,
            },
        },
    });
    if (!user || user.eventTypes.length === 0) {
        res.status(404).json({ message: "Event type not found" });
        return;
    }
    const eventType = user.eventTypes[0];
    let schedule = user.schedules.find(s => s.id === eventType.scheduleId);
    if (!schedule) {
        schedule = user.schedules.find(s => s.isDefault);
    }
    if (!schedule) {
        res.status(404).json({ message: "Schedule not found for event type" });
        return;
    }
    const hostTz = schedule.timezone || user.timezone;
    const existingBookings = await prisma_1.prisma.booking.findMany({
        where: {
            eventType: {
                userId: user.id,
            },
            startTime: {
                gte: (0, date_fns_1.addDays)((0, date_fns_1.startOfDay)(targetDate), -1),
                lte: (0, date_fns_1.addDays)((0, date_fns_1.endOfDay)(targetDate), 1),
            },
            status: "confirmed",
        },
        orderBy: { startTime: "asc" },
    });
    // Extract purely the YYYY-MM-DD from the `dateValue`
    const dateStr = dateValue.split("T")[0];
    const slots = (0, slots_1.generateSlots)(dateStr, hostTz, eventType.duration, schedule.availability, existingBookings);
    res.json({
        eventType,
        user: {
            name: user.name,
            timezone: hostTz,
            slug: user.slug,
        },
        slots: slots.map((slot) => ({
            start: slot.start.toISOString(),
            end: slot.end.toISOString(),
            startLabel: slot.startLabel,
            endLabel: slot.endLabel,
        })),
    });
});
router.post("/", async (req, res) => {
    const payload = createBookingSchema.parse(req.body);
    const eventType = await prisma_1.prisma.eventType.findUnique({ where: { id: payload.eventTypeId } });
    if (!eventType || !eventType.isActive) {
        res.status(404).json({ message: "Event type not found" });
        return;
    }
    const start = (0, date_fns_1.parseISO)(payload.startTime);
    const end = (0, date_fns_1.addMinutes)(start, eventType.duration);
    const conflicting = await prisma_1.prisma.booking.findFirst({
        where: {
            eventType: {
                userId: eventType.userId,
            },
            status: "confirmed",
            NOT: [{ endTime: { lte: start } }, { startTime: { gte: end } }],
        },
    });
    if (conflicting) {
        res.status(409).json({ message: "This slot has already been booked" });
        return;
    }
    const booking = await prisma_1.prisma.booking.create({
        data: {
            eventTypeId: payload.eventTypeId,
            inviteeName: payload.inviteeName,
            inviteeEmail: payload.inviteeEmail,
            startTime: start,
            endTime: end,
            status: "confirmed",
        },
    });
    res.status(201).json(booking);
});
router.get("/", userContext_1.attachCurrentUser, async (req, res) => {
    const bookings = await prisma_1.prisma.booking.findMany({
        where: {
            eventType: {
                userId: req.currentUser.id,
            },
        },
        include: {
            eventType: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    duration: true,
                    color: true,
                },
            },
        },
        orderBy: { startTime: "asc" },
    });
    res.json(bookings);
});
router.patch("/:id/cancel", userContext_1.attachCurrentUser, async (req, res) => {
    const booking = await prisma_1.prisma.booking.findFirst({
        where: { id: req.params.id, eventType: { userId: req.currentUser.id } },
    });
    if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
    }
    const updated = await prisma_1.prisma.booking.update({
        where: { id: req.params.id },
        data: { status: "canceled" },
    });
    res.json(updated);
});
exports.default = router;
