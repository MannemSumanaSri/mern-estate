import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);


console.log("MONGO URI:", process.env.MONGO);

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
app.use((err,req,res,next) =>{
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error';
  return res.status(statusCode).json({
    success : false,
    statusCode,
    message,
  });
});