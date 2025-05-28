import express from "express";
import { generateResume, uploadResume, getResume } from "../controllers/resume.controller.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/generate-resume", generateResume);
router.post("/upload-resume", upload.single("resume"), uploadResume);
router.get("/get-resume/:userId", getResume);

export default router;
