console.log("Server file started...");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const redis = require("redis");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/devops_tasks";
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

let redisClient;

async function connectRedis() {
  try {
    redisClient = redis.createClient({
      url: REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message);
    });

    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error("Redis connection failed:", error.message);
  }
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

connectRedis();

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

app.get("/", (req, res) => {
  res.json({
    message: "Dockerized MERN Backend API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "backend",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/api/visits", async (req, res) => {
  try {
    const visits = await redisClient.incr("visits");
    res.json({ visits });
  } catch (error) {
    res.status(500).json({
      message: "Redis error",
      error: error.message,
    });
  }
});

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Task title is required",
    });
  }

  const task = await Task.create({ title });
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json({
    message: "Task deleted successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});