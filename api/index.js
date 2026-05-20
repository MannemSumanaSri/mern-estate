import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import uploadRoute from "./routes/upload.route.js";

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/upload", uploadRoute);

app.use(express.static(path.join(__dirname, "client", "dist")));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB connected!");

    app.listen(3000, () => {
      console.log("Server is running on port 3000!");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});