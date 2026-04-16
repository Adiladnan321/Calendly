"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
const dayAvailabilitySchema = zod_1.z.object({
    dayOfWeek: zod_1.z.number().int().min(0).max(6),
    startTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
    endTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
});
const createScheduleSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    timezone: zod_1.z.string().optional(),
    isDefault: zod_1.z.boolean().optional(),
});
const updateScheduleSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    timezone: zod_1.z.string().optional(),
    isDefault: zod_1.z.boolean().optional(),
    days: zod_1.z.array(dayAvailabilitySchema).optional(),
});
router.get("/", async (req, res) => {
    const data = await prisma_1.prisma.schedule.findMany({
        where: { userId: req.currentUser.id },
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
    const { name, timezone, isDefault } = createScheduleSchema.parse(req.body);
    if (isDefault) {
        await prisma_1.prisma.schedule.updateMany({
            where: { userId: req.currentUser.id },
            data: { isDefault: false }
        });
    }
    const schedule = await prisma_1.prisma.schedule.create({
        data: {
            userId: req.currentUser.id,
            name,
            timezone: timezone ?? "Asia/Kolkata",
            isDefault: isDefault ?? false,
        },
        include: { availability: true }
    });
    res.json(schedule);
});
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, timezone, isDefault, days } = updateScheduleSchema.parse(req.body);
    const schedule = await prisma_1.prisma.schedule.findFirst({
        where: { id, userId: req.currentUser.id }
    });
    if (!schedule) {
        res.status(404).json({ error: "Schedule not found" });
        return;
    }
    if (isDefault) {
        await prisma_1.prisma.schedule.updateMany({
            where: { userId: req.currentUser.id, id: { not: id } },
            data: { isDefault: false }
        });
    }
    const updated = await prisma_1.prisma.$transaction(async (tx) => {
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
                timezone: timezone !== undefined ? timezone : schedule.timezone,
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
    const schedule = await prisma_1.prisma.schedule.findFirst({
        where: { id, userId: req.currentUser.id }
    });
    if (!schedule) {
        res.status(404).json({ error: "Schedule not found" });
        return;
    }
    await prisma_1.prisma.schedule.delete({
        where: { id }
    });
    res.json({ success: true });
});
exports.default = router;
