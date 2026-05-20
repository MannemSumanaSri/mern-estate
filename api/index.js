import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import uploadRoute from "./routes/upload.route.js";

dotenv.config();

const app = express();

/* ---------------- PATH FIX ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIXED: go ONE LEVEL UP from /api to project root
const clientDistPath = path.join(__dirname, "../client/dist");

/* ---------------- MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://mern-estate-pisr.onrender.com"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ---------------- API ROUTES ---------------- */
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/upload", uploadRoute);

/* ---------------- FRONTEND (SAFE SERVE) ---------------- */
if (fs.existsSync(clientDistPath)) {
  console.log("✅ Serving frontend from:", clientDistPath);

  app.use(express.static(clientDistPath));

  app.get(/.*/, (req, res) => {
    if (req.path.startsWith("/api")) return;
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  console.log("❌ FRONTEND NOT FOUND!");
  console.log("Expected path:", clientDistPath);
  console.log("👉 Run: cd client && npm run build");
}

/* ---------------- DB + SERVER ---------------- */
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB connected!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});