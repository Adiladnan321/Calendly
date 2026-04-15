"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureBootstrapData = ensureBootstrapData;
const prisma_1 = require("./prisma");
async function ensureBootstrapData() {
    const demoUser = await prisma_1.prisma.user.upsert({
        where: { email: "demo@calendly.local" },
        update: {},
        create: {
            name: "Demo User",
            email: "demo@calendly.local",
            slug: "demo-user",
            timezone: "Asia/Kolkata",
        },
    });
    await prisma_1.prisma.eventType.upsert({
        where: {
            userId_slug: {
                userId: demoUser.id,
                slug: "intro-call",
            },
        },
        update: {
            name: "Intro Call",
            duration: 30,
            color: "#0069ff",
            isActive: true,
        },
        create: {
            userId: demoUser.id,
            name: "Intro Call",
            slug: "intro-call",
            duration: 30,
            color: "#0069ff",
            isActive: true,
        },
    });
    const weekdays = [1, 2, 3, 4, 5];
    for (const dayOfWeek of weekdays) {
        await prisma_1.prisma.availability.upsert({
            where: {
                userId_dayOfWeek: {
                    userId: demoUser.id,
                    dayOfWeek,
                },
            },
            update: {
                startTime: "09:00",
                endTime: "17:00",
            },
            create: {
                userId: demoUser.id,
                dayOfWeek,
                startTime: "09:00",
                endTime: "17:00",
            },
        });
    }
}
