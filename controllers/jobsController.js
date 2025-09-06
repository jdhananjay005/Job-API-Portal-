import mongoose from "mongoose";
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
    // 🔹 First check authorization
    if (!req.user || !req.user.userId) {
      return next(new Error("Unauthorized request"));
    }

    const { status, workType, search, sort } = req.query;

    const queryObject = {
      createdBy: req.user.userId,
    };

    if (status && status !== "all") {
      queryObject.status = status;
    }

    if (workType && workType !== "all") {
      queryObject.workType = workType;
    }

    if (search) {
      queryObject.position = { $regex: search, $options: "i" };
    }

    let queryResult = jobModel.find(queryObject);

    if (sort === "latest") {
      queryResult = queryResult.sort("-createdAt");
    } else if (sort === "oldest") {
      queryResult = queryResult.sort("createdAt");
    } else if (sort === "a-z") {
      queryResult = queryResult.sort("position");
    } else if (sort === "z-a") {
      queryResult = queryResult.sort("-position");
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit; // Remember this formula for future.
    queryResult = queryResult.skip(skip).limit(limit);
    // jobs count
    const totalJobs = await jobModel.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    const jobs = await queryResult;

    res.status(200).json({
      totalJobs: jobs.length,
      jobs,
      numOfPage,
    });
  } catch (error) {
    next(error);
  }
};

// Update Jobs
export const updateJobController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { company, position } = req.body;

    // Validation
    if (!company || !position) {
      next("Please Provide All the Fields");
    }

    //find the job
    const job = await jobModel.findOne({ _id: id });

    // validation
    if (!job) {
      next(`No Job found with this id ${id}`);
    }

    if (!req.user.userId === job.createdBy.toString()) {
      next("You are not authorized to update this job");
      return;
    }

    const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      updateJob,
    });
  } catch (error) {}
};

//Delte job

export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;

  // find the job based on the above Id

  const job = await jobModel.findOne({ _id: id });

  if (!job) {
    next(`No job has found with this ID ${id}`);
  }

  if (!req.user.userId === job.createdBy.toString()) {
    next("You are not authorized to delete this job");
    return;
  }

  await job.deleteOne();
  res.status(200).json({ message: "Success, Job is deleted!" });
};

// Job stats and filters
export const jobStatsController = async (req, res, next) => {
  try {
    const stats = await jobModel.aggregate([
      // search by user jobs
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Default stats
    const defaultStats = {
      pending: stats.pending || 0,
      reject: stats.reject || 0,
      interview: stats.interview || 0,
    };

    res.status(200).json({ Total_Jobs: stats.length, stats });
  } catch (error) {
    next(error);
  }
};
