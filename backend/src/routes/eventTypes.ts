import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

const createEventTypeSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  duration: z.number().int().min(5).max(240),
  color: z.string().min(4).max(20).optional(),
  isActive: z.boolean().optional(),
});

const updateEventTypeSchema = createEventTypeSchema.partial();

router.get("/public/:username", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { slug: req.params.username },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const eventTypes = await prisma.eventType.findMany({
    where: { userId: user.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    user: {
      name: user.name,
      slug: user.slug,
    },
    eventTypes,
  });
});

router.get("/", async (req, res) => {
  const eventTypes = await prisma.eventType.findMany({
    where: { userId: req.currentUser!.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(eventTypes);
});

router.post("/", async (req, res) => {
  const payload = createEventTypeSchema.parse(req.body);

  const eventType = await prisma.eventType.create({
    data: {
      userId: req.currentUser!.id,
      name: payload.name,
      slug: payload.slug,
      duration: payload.duration,
      color: payload.color,
      isActive: payload.isActive,
    },
  });

  res.status(201).json(eventType);
});

router.put("/:id", async (req, res) => {
  const payload = updateEventTypeSchema.parse(req.body);

  const existing = await prisma.eventType.findFirst({
    where: { id: req.params.id, userId: req.currentUser!.id },
  });

  if (!existing) {
    res.status(404).json({ message: "Event type not found" });
    return;
  }

  const eventType = await prisma.eventType.update({
    where: { id: existing.id },
    data: payload,
  });

  res.json(eventType);
});

router.delete("/:id", async (req, res) => {
  const existing = await prisma.eventType.findFirst({
    where: { id: req.params.id, userId: req.currentUser!.id },
  });

  if (!existing) {
    res.status(404).json({ message: "Event type not found" });
    return;
  }

  await prisma.eventType.delete({ where: { id: existing.id } });
  res.status(204).send();
});

export default router;
