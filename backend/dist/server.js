"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const bootstrap_1 = require("./lib/bootstrap");
const port = Number(process.env.PORT ?? 4000);
async function startServer() {
    await (0, bootstrap_1.ensureBootstrapData)();
    app_1.default.listen(port, () => {
        console.log(`Backend listening on http://localhost:${port}`);
    });
}
void startServer();
