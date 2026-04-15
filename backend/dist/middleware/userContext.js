"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCurrentUser = attachCurrentUser;
const prisma_1 = require("../lib/prisma");
async function attachCurrentUser(req, res, next) {
    const requestedUserId = req.headers["x-user-id"] ??
        (typeof req.query.userId === "string" ? req.query.userId : undefined) ??
        (typeof req.body?.userId === "string" ? req.body.userId : undefined);
    const user = requestedUserId
        ? await prisma_1.prisma.user.findUnique({ where: { id: requestedUserId } })
        : await prisma_1.prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
    if (requestedUserId && !user) {
        res.status(404).json({ message: "Requested user not found" });
        return;
    }
    if (!user) {
        const bootstrapUser = await prisma_1.prisma.user.upsert({
            where: { email: "demo@calendly.local" },
            update: {},
            create: {
                name: "Demo User",
                email: "demo@calendly.local",
                slug: "demo-user",
                timezone: "Asia/Kolkata",
            },
        });
        req.currentUser = bootstrapUser;
        next();
        return;
    }
    req.currentUser = user;
    next();
}
