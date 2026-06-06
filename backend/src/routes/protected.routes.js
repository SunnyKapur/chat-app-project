import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    try {
        return res.status(200).json({
            message: "This is the authorized user route",
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

export default router;