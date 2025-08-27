import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required. "],
    },
    position: {
      type: String,
      required: [true, "Position is required."],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["Pending", "Reject", "Interview Scheduled"],
      default: "Pending",
    },
    workType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
      default: "Full-Time",
    },
    workLocation: {
      type: String,
      default: "Mumbai",
      required: [true, "Location is required."],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);
