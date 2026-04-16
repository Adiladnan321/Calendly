import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

const dayAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const createScheduleSchema = z.object({
  name: z.string().min(1),
  isDefault: z.boolean().optional(),
});

const updateScheduleSchema = z.object({
  name: z.string().optional(),
  isDefault: z.boolean().optional(),
  days: z.array(dayAvailabilitySchema).optional(),
});

router.get("/", async (req, res) => {
  const data = await prisma.schedule.findMany({
    where: { userId: req.currentUser!.id },
    include: {
      availability: {
        orderBy: { dayOfWeek: "asc" }
      }
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(data);
});

router.post("/", async (req, res) => {
  const { name, isDefault } = createScheduleSchema.parse(req.body);

  if (isDefault) {
    await prisma.schedule.updateMany({
      where: { userId: req.currentUser!.id },
      data: { isDefault: false }
    });
  }

  const schedule = await prisma.schedule.create({
    data: {
      userId: req.currentUser!.id,
      name,
      isDefault: isDefault ?? false,
    },
    include: { availability: true }
  });

  res.json(schedule);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, isDefault, days } = updateScheduleSchema.parse(req.body);

  const schedule = await prisma.schedule.findFirst({
    where: { id, userId: req.currentUser!.id }
  });

  if (!schedule) {
    res.status(404).json({ error: "Schedule not found" });
    return;
  }

  if (isDefault) {
    await prisma.schedule.updateMany({
      where: { userId: req.currentUser!.id, id: { not: id } },
      data: { isDefault: false }
    });
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (days !== undefined) {
      await tx.availability.deleteMany({ where: { scheduleId: id } });
      if (days.length > 0) {
        await tx.availability.createMany({
          data: days.map(d => ({ ...d, scheduleId: id })),
        });
      }
    }

    return tx.schedule.update({
      where: { id },
      data: {
        name: name !== undefined ? name : schedule.name,
        isDefault: isDefault !== undefined ? isDefault : schedule.isDefault,
      },
      include: {
        availability: { orderBy: { dayOfWeek: "asc" } }
      }
    });
  });

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const schedule = await prisma.schedule.findFirst({
    where: { id, userId: req.currentUser!.id }
  });

  if (!schedule) {
    res.status(404).json({ error: "Schedule not found" });
    return;
  }

  await prisma.schedule.delete({
    where: { id }
  });

  res.json({ success: true });
});

export default router;
