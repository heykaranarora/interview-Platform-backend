import express from "express";
import { uploadVideo, getAllVideos, getRandomQuestions } from "../controllers/video.controller.js";
import isAuthenticated from "../middlewares/isAthenticated.js";
import fileUpload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", isAuthenticated, fileUpload.single("video"), uploadVideo);
router.get("/all", isAuthenticated, getAllVideos);
router.get("/random-questions", isAuthenticated, getRandomQuestions); 
export default router;
