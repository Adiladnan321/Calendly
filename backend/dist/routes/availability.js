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
const updateAvailabilitySchema = zod_1.z.object({
    days: zod_1.z.array(dayAvailabilitySchema),
});
router.get("/", async (req, res) => {
    const data = await prisma_1.prisma.availability.findMany({
        where: { userId: req.currentUser.id },
        orderBy: { dayOfWeek: "asc" },
    });
    res.json(data);
});
router.put("/", async (req, res) => {
    const { days } = updateAvailabilitySchema.parse(req.body);
    await prisma_1.prisma.$transaction(async (tx) => {
        await tx.availability.deleteMany({ where: { userId: req.currentUser.id } });
        if (days.length > 0) {
            await tx.availability.createMany({
                data: days.map((day) => ({ ...day, userId: req.currentUser.id })),
            });
        }
    });
    const updated = await prisma_1.prisma.availability.findMany({
        where: { userId: req.currentUser.id },
        orderBy: { dayOfWeek: "asc" },
    });
    res.json(updated);
});
exports.default = router;
