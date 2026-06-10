import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createGroup, getGroupMessages, getMyGroups, sendGroupMessage } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createGroup);
router.get("/", authMiddleware, getMyGroups);
router.post("/:groupId/messages", authMiddleware, sendGroupMessage);
router.get("/:groupId/messages", authMiddleware, getGroupMessages)


export default router;
