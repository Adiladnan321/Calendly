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
        : (0, date_fns_1.parseISO)(`${dateValue}T00:00:00.000Z`);
    const user = await prisma_1.prisma.user.findUnique({
        where: { slug: req.params.username },
        include: {
            availability: true,
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
    const existingBookings = await prisma_1.prisma.booking.findMany({
        where: {
            eventTypeId: eventType.id,
            startTime: {
                gte: (0, date_fns_1.startOfDay)(targetDate),
                lte: (0, date_fns_1.endOfDay)(targetDate),
            },
            status: "confirmed",
        },
        orderBy: { startTime: "asc" },
    });
    const slots = (0, slots_1.generateSlots)(targetDate, eventType.duration, user.availability, existingBookings);
    res.json({
        eventType,
        user: {
            name: user.name,
            timezone: user.timezone,
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
            eventTypeId: eventType.id,
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
        where: {
            id: req.params.id,
            eventType: {
                userId: req.currentUser.id,
            },
        },
    });
    if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
    }
    const updated = await prisma_1.prisma.booking.update({
        where: { id: booking.id },
        data: { status: "cancelled" },
    });
    res.json(updated);
});
exports.default = router;
