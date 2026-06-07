import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Currently loggedIn user",
    user: req.user,
  });
});

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(200).json({
    message: "User logged out",
  });
});

export default router;
