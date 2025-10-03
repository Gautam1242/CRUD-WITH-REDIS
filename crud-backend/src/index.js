// src/index.js
import express from "express";
import clientRoutes from "./routes/clientRoute.js";
import db from "./models/index.js";
import cors from "cors";
import Redis from "ioredis";

const app = express();
export const redis = new Redis({
  host: "redis-17243.c9.us-east-1-2.ec2.redns.redis-cloud.com",
  port: 17243,
  password: "3J3h3TvqMoG5NxEg805yNYoZf03mcEGu",
});

redis.on("connect", () => {
  console.log("Redis Connected");
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api", clientRoutes);

app.get("/data", async (req, res) => {
  let calculatedData = 0;
  for (let i = 0; i < 100000000; i++) {
    calculatedData += i;
  }
  const cacheKey = "data";

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    return res.status(200).json({
      success: true,
      data: parsed,
      message: "Redis",
    });
  }
  await redis.set(cacheKey, JSON.stringify(calculatedData), "EX", 60);
  return res.status(200).json({
    success: true,
    data: calculatedData,
    message: "DB",
  });
});

// Sync DB
db.sequelize.sync().then(() => {
  console.log("Database synced ");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
