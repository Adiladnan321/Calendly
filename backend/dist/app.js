"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const availability_1 = __importDefault(require("./routes/availability"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const eventTypes_1 = __importDefault(require("./routes/eventTypes"));
const userContext_1 = require("./middleware/userContext");
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});
app.use("/api/bookings", bookings_1.default);
app.use("/api/event-types", userContext_1.attachCurrentUser, eventTypes_1.default);
app.use("/api/availability", userContext_1.attachCurrentUser, availability_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
