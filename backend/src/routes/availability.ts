import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

const dayAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const updateAvailabilitySchema = z.object({
  days: z.array(dayAvailabilitySchema),
});

router.get("/", async (req, res) => {
  const data = await prisma.availability.findMany({
    where: { userId: req.currentUser!.id },
    orderBy: { dayOfWeek: "asc" },
  });

  res.json(data);
});

router.put("/", async (req, res) => {
  const { days } = updateAvailabilitySchema.parse(req.body);

  await prisma.$transaction(async (tx) => {
    await tx.availability.deleteMany({ where: { userId: req.currentUser!.id } });

    if (days.length > 0) {
      await tx.availability.createMany({
        data: days.map((day) => ({ ...day, userId: req.currentUser!.id })),
      });
    }
  });

  const updated = await prisma.availability.findMany({
    where: { userId: req.currentUser!.id },
    orderBy: { dayOfWeek: "asc" },
  });

  res.json(updated);
});

export default router;
