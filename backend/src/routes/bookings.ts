import { addDays, addMinutes, endOfDay, parseISO, startOfDay } from "date-fns";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { attachCurrentUser } from "../middleware/userContext";
import { generateSlots } from "../services/slots";

const router = Router();

const createBookingSchema = z.object({
  eventTypeId: z.string().cuid(),
  inviteeName: z.string().min(2),
  inviteeEmail: z.string().email(),
  startTime: z.string().datetime(),
});

router.get("/public/:username/:slug", async (req, res) => {
  const dateQuery = z
    .object({ date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)) })
    .safeParse(req.query);

  if (!dateQuery.success) {
    res.status(400).json({ message: "Query param 'date' is required" });
    return;
  }

  const dateValue = dateQuery.data.date;
  const targetDate = dateValue.includes("T")
    ? parseISO(dateValue)
    : parseISO(dateValue); // Parse as local date correctly so date.getDay() works relative to the intended string

  const user = await prisma.user.findUnique({
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

  const existingBookings = await prisma.booking.findMany({
    where: {
      eventType: {
        userId: user.id,
      },
      startTime: {
        gte: addDays(startOfDay(targetDate), -1),
        lte: addDays(endOfDay(targetDate), 1),
      },
      status: "confirmed",
    },
    orderBy: { startTime: "asc" },
  });

  // Extract purely the YYYY-MM-DD from the `dateValue`
  const dateStr = dateValue.split("T")[0];

  const slots = generateSlots(dateStr, hostTz, eventType.duration, schedule.availability, existingBookings);

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

  const eventType = await prisma.eventType.findUnique({ where: { id: payload.eventTypeId } });

  if (!eventType || !eventType.isActive) {
    res.status(404).json({ message: "Event type not found" });
    return;
  }

  const start = parseISO(payload.startTime);
  const end = addMinutes(start, eventType.duration);

  const conflicting = await prisma.booking.findFirst({
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

  const booking = await prisma.booking.create({
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

router.get("/", attachCurrentUser, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: {
      eventType: {
        userId: req.currentUser!.id,
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

router.patch("/:id/cancel", attachCurrentUser, async (req, res) => {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, eventType: { userId: req.currentUser!.id } },
  });

  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: "canceled" },
  });

  res.json(updated);
});

export default router;
