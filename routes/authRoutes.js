import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/authController.js";
//Router Object
const router = express.Router();

//Routes
// Register
router.post("/register", registerController);

//Login
router.post("/login", loginController);

//Export
export default router;
