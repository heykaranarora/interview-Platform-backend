import express from "express";
import { createPost, getAllPosts, addComment } from "../controllers/forum.controller.js";
import isAuthenticated from "../middlewares/isAthenticated.js";
const router = express.Router();

router.post("/",isAuthenticated, createPost);
router.get("/", getAllPosts);
router.post("/:postId/comments",isAuthenticated, addComment);

export default router;
