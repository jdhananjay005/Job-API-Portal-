import express from "express";
import userAuth from "./../middlewares/authMiddleware.js";
import {
  createJobController,
  getAllJobsController,
  updateJobController,
  deleteJobController,
  jobStatsController,
} from "../controllers/jobsController.js";
const router = express.Router();

// Routes
// Create Jobs || Post
router.post("/create-job", userAuth, createJobController);

//GET Jobs
router.get("/get-job", userAuth, getAllJobsController);

//Update Jobs
router.patch("/update-job/:id", userAuth, updateJobController);

//Delete Jobs
router.delete("/delete-job/:id", userAuth, deleteJobController);

// Filters for the job stats and filters
router.get("/job-stats", userAuth, jobStatsController);

export default router;
