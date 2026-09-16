import { createServer } from "node:http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { characterRouter } from "./routes/character";
import { setupRealtime } from "./realtime/socket";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/character", characterRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const httpServer = createServer(app);
setupRealtime(httpServer);

const port = Number(process.env.PORT) || 3001;
httpServer.listen(port, () => {
  console.log(`Server listening on :${port}`);
});
