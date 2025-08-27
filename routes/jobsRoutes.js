import express from "express";
import userAuth from "./../middlewares/authMiddleware.js";
import {
  createJobController,
  getAllJobsController,
} from "../controllers/jobsController.js";
const router = express.Router();

// Routes
// Create Jobs || Post
router.post("/create-job", userAuth, createJobController);

//GET Jobs
router.get("/get-job", userAuth, getAllJobsController);

export default router;
