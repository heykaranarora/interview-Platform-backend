import express from "express";

import { scheduleInterview, getInterviews, updateInterview, cancelInterview } from "../controllers/interview.controller.js";
import isAuthenticated from "../middlewares/isAthenticated.js";
const router = express.Router();

router.post("/schedule", isAuthenticated,scheduleInterview);  
router.get("/get",isAuthenticated, getInterviews);  
router.put("/:id",isAuthenticated, updateInterview);  
router.delete("/:id",isAuthenticated, cancelInterview);  
export default router;
