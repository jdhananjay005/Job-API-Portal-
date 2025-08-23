import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { updateUserController } from "../controllers/userController.js";
//Router Object
const router = express.Router();

//Routes

router.put("/update-user", userAuth, updateUserController);

export default router;
