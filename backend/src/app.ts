import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import availabilityRouter from "./routes/availability";
import bookingsRouter from "./routes/bookings";
import eventTypesRouter from "./routes/eventTypes";
import { attachCurrentUser } from "./middleware/userContext";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/bookings", bookingsRouter);
app.use("/api/event-types", attachCurrentUser, eventTypesRouter);
app.use("/api/availability", attachCurrentUser, availabilityRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
