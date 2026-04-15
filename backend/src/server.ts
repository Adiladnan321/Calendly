import app from "./app";
import { ensureBootstrapData } from "./lib/bootstrap";

const port = Number(process.env.PORT ?? 4000);

async function startServer(): Promise<void> {
  await ensureBootstrapData();

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

void startServer();
