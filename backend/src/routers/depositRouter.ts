import express from "express";
import { protect } from "../middlewares/auth";
import {
  generateDepositAddress,
  getDepositAddress,
} from "../controllers/depositController";

const router = express.Router();

router.use(protect);

router.post("/generate", generateDepositAddress);
router.get("/address", getDepositAddress);

export default router;
