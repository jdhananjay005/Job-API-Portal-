import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

//userSchema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Password Length should be more than 6 characters."],
    },
    location: {
      type: String,
      default: "India",
    },
  },
  {
    timestamps: true,
  }
);

// creating middleware to for password hashing.

userSchema.pre("save", async function () {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Password Comparisons
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatched = await bcrypt.compare(userPassword, this.password);
  return isMatched;
};

// JSON WebToken
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export default mongoose.model("User", userSchema);
