import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Validation
    if (!name) {
      next("Name is required.");
    }
    if (!email) {
      next("Email is required.");
    }
    if (!password) {
      next("Password is required & it must be greater than 6 characters.");
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      next("user is already registered.");
    }

    // Create a User
    const user = await userModel.create({ name, email, password });
    res.status(201).send({
      message: "User is created Successfully",
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
