import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function attachCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const requestedUserId =
    (req.headers["x-user-id"] as string | undefined) ??
    (typeof req.query.userId === "string" ? req.query.userId : undefined) ??
    (typeof req.body?.userId === "string" ? req.body.userId : undefined);

  const user = requestedUserId
    ? await prisma.user.findUnique({ where: { id: requestedUserId } })
    : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

  if (requestedUserId && !user) {
    res.status(404).json({ message: "Requested user not found" });
    return;
  }

  if (!user) {
    const bootstrapUser = await prisma.user.upsert({
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
