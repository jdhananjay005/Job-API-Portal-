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

    // Token Created.
    const token = user.createJWT();

    res.status(201).send({
      message: "User is created Successfully",
      success: true,
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  // validations
  if (!email || !password) {
    next("Please Provide all fields.");
  }
  // find the user by email
  const user = await userModel.findOne({ email });
  console.log(user);
  if (!user) {
    next("Invalid Username and Password");
  }

  //compare password
  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    next("Invalid Username & Password");
  }
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};
