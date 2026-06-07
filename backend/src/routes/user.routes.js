import express from "express"
import { getAllUsers } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

let router = express.Router()

router.get('/', authMiddleware,getAllUsers)

export default router