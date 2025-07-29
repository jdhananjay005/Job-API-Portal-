import userModel from "../models/userModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validation
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Please Provide Name. " });
    }
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Please Provide email. " });
    }
    if (!password) {
      return res
        .status(400)
        .send({ success: false, message: "Please Provide password. " });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      res.status(200).send({
        message: "user is already registered.",
        success: false,
      });
    }

    // Create a User
    const user = await userModel.create({ name, email, password });
    res.status(201).send({
      message: "User is created Successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error In Register Controller",
      success: false,
      error,
    });
  }
};
