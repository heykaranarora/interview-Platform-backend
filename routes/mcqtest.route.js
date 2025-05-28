import express from "express";
import { generateMCQQuestions, submitMCQTest } from "../controllers/mcqtest.controller.js";
import isAthenticated from "../middlewares/isAthenticated.js";

const router = express.Router();

router.post("/generate", isAthenticated, generateMCQQuestions);
router.post("/submit", isAthenticated, submitMCQTest);

export default router;
