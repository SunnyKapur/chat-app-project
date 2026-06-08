import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let isUserExist = await UserModel.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    let hashPassword = await bcrypt.hash(password, 10);

    let newUser = await UserModel.create({
      username,
      email,
      password: hashPassword,
    });

    let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const isUserExist = await UserModel.findOne({ email });

    if (!isUserExist) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const comparePassword = await bcrypt.compare(
      password,
      isUserExist.password,
    );

    if (!comparePassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    let token = jwt.sign({ id: isUserExist._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: isUserExist._id,
        username: isUserExist.username,
        email: isUserExist.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

