import jobModel from "../models/jobModel.js";

//Create Job
export const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company || !position) {
      return next("Please Provide All Fields. ");
    }
    // Fix userId reference (assuming req.user.userId)
    req.body.createdBy =
      req.user && req.user.userId ? req.user.userId : undefined;
    const job = await jobModel.create(req.body);
    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
};

// Get All Jobs
export const getAllJobsController = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return next("Unauthorized request");
    }
    const jobs = await jobModel.find({ createdBy: req.user.userId });
    res.status(200).json({
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};
