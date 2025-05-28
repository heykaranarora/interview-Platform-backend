import express from "express"
import { register,login,updateProfile,logout,saveTestResult,getTestHistory, getUserProfile} from "../controllers/user.controller.js";
import isAthenticated from "../middlewares/isAthenticated.js";
const router=express.Router();

router.post("/register",register);
router.post("/login", login);
router.get("/logout", isAthenticated, logout);
router.post("/profile/update", isAthenticated, updateProfile);
router.post("/save-test",isAthenticated, saveTestResult); 
router.get("/history/:userId",isAthenticated, getTestHistory)
router.get("/profile/:userId",isAthenticated,getUserProfile);



export default router;