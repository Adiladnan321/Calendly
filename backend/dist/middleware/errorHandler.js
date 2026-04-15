"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function notFoundHandler(_req, res) {
    res.status(404).json({ message: "Route not found" });
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            message: "Validation failed",
            issues: err.issues,
        });
        return;
    }
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: "Unexpected server error" });
}
