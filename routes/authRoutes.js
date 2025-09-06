import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerController,
  loginController,
} from "../controllers/authController.js";

// IP Limiter

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//Router Object
const router = express.Router();

//Routes
// Register
router.post("/register", limiter, registerController);

//Login
router.post("/login", limiter, loginController);

//Export
export default router;
