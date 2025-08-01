// Pcackages mports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
// Files Imports
import connectDB from "./config/db.js";
//Routes Import
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";

//dot env configuration
dotenv.config({ silent: true });

// MongoDB Connection
connectDB();

//Rest Objects
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//Routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);

//Port configuration
const PORT = process.env.PORT || 8000;

// listen on port 8000
app.listen(PORT, () => {
  console.log(`Node Server running in ${process.env.DEV_MODE} on port ${PORT}`);
});
