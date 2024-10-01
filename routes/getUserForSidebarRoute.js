import express from "express";

import { getUserForSidebar } from "../controllers/getUserforSidebar.js";
import {authMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get('/getAllUsers', authMiddleware, getUserForSidebar)
export default router;