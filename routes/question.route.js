import express from "express";
import { evaluate, getQuestion, getTestResults } from "../controllers/question.controller.js";
import isAthenticated from "../middlewares/isAthenticated.js";

const router = express.Router();

router.post("/get-question", isAthenticated, getQuestion);
router.post("/evaluate", isAthenticated, evaluate);
router.get("/get-test-results", isAthenticated, getTestResults);

export default router;
