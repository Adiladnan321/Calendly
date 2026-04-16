"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
const createEventTypeSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    slug: zod_1.z.string().min(2),
    duration: zod_1.z.number().int().min(5).max(240),
    color: zod_1.z.string().min(4).max(20).optional(),
    isActive: zod_1.z.boolean().optional(),
    scheduleId: zod_1.z.string().optional()
});
const updateEventTypeSchema = createEventTypeSchema.partial();
router.get("/public/:username", async (req, res) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { slug: req.params.username },
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const eventTypes = await prisma_1.prisma.eventType.findMany({
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
    const eventTypes = await prisma_1.prisma.eventType.findMany({
        where: { userId: req.currentUser.id },
        orderBy: { createdAt: "desc" },
        include: {
            schedule: true
        }
    });
    res.json(eventTypes);
});
router.post("/", async (req, res) => {
    const payload = createEventTypeSchema.parse(req.body);
    let targetScheduleId = payload.scheduleId;
    if (!targetScheduleId) {
        const defaultSchedule = await prisma_1.prisma.schedule.findFirst({
            where: { userId: req.currentUser.id, isDefault: true }
        });
        if (defaultSchedule) {
            targetScheduleId = defaultSchedule.id;
        }
    }
    const eventType = await prisma_1.prisma.eventType.create({
        data: {
            userId: req.currentUser.id,
            name: payload.name,
            slug: payload.slug,
            duration: payload.duration,
            color: payload.color,
            isActive: payload.isActive,
            scheduleId: targetScheduleId,
        },
        include: { schedule: true }
    });
    res.status(201).json(eventType);
});
router.put("/:id", async (req, res) => {
    const payload = updateEventTypeSchema.parse(req.body);
    const existing = await prisma_1.prisma.eventType.findFirst({
        where: { id: req.params.id, userId: req.currentUser.id },
    });
    if (!existing) {
        res.status(404).json({ message: "Event type not found" });
        return;
    }
    const eventType = await prisma_1.prisma.eventType.update({
        where: { id: existing.id },
        data: payload,
        include: { schedule: true }
    });
    res.json(eventType);
});
router.delete("/:id", async (req, res) => {
    const existing = await prisma_1.prisma.eventType.findFirst({
        where: { id: req.params.id, userId: req.currentUser.id },
    });
    if (!existing) {
        res.status(404).json({ message: "Event type not found" });
        return;
    }
    await prisma_1.prisma.eventType.delete({ where: { id: existing.id } });
    res.status(204).send();
});
exports.default = router;
