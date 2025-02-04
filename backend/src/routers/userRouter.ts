import express from "express";
import { protect } from "../middlewares/auth";
import { getUser } from "../controllers/userController";

const router = express.Router();
router.use(protect);
router.get("/", getUser);

export default router;
