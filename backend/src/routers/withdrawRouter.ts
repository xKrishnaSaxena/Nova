import express from "express";
import { protect } from "../middlewares/auth";
import { initiateWithdrawal } from "../controllers/withdrawController";

const router = express.Router();

router.use(protect);

router.post("/", initiateWithdrawal);

export default router;
