import express from "express";
import { testPostController } from "./../controllers/testController.js";
import userAuth from "../middlewares/authMiddleware.js";
// Router Object
const router = express.Router();

//Routes
router.post("/test-post", userAuth, testPostController);

//export
export default router;
