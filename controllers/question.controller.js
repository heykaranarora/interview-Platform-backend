import express from "express";
import Question from "../models/question.model.js";
import { evaluateAnswer } from "../utils/evaluation.js";
import mongoose from "mongoose";
import {User} from "../models/user.model.js";

const router = express.Router();

export const getQuestion = async (req, res) => {
    try {
      const { jobRoles, difficulty } = req.body;
      if (!jobRoles || jobRoles.length === 0 || jobRoles.length > 6) {
        return res.status(400).json({ success: false, message: "Select between 1 to 6 job roles." });
      }
      if (!difficulty || !["Easy", "Medium", "Hard"].includes(difficulty)) {
        return res.status(400).json({ success: false, message: "Invalid difficulty level." });
      }
  
      const questions = await Question.aggregate([
        { $match: { jobRole: { $in: jobRoles }, difficulty } },
        { $sample: { size: 5 } }
      ]);
  
      // ✅ Generate a test session ID and send it
      const testSessionId = new mongoose.Types.ObjectId().toString();
  
      res.json({ success: true, questions, testSessionId });
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ success: false, message: "Error fetching questions" });
    }
  };
  

export const evaluate = async (req, res) => {
  try {
      const { answers, testId } = req.body; // Expect an array of 5 answers
      const userId = req.id; // Get user ID from authentication middleware

      if (!answers || answers.length !== 5) {
          return res.status(400).json({ success: false, message: "All 5 questions must be answered." });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found." });
      }

      let totalScore = 0;
      const questionsAttempted = [];

      for (const { questionId, userAnswer } of answers) {
          const question = await Question.findById(questionId);
          if (!question) continue; // Skip if question not found

          const score = evaluateAnswer(userAnswer, question.correctAnswer, question.keywords);
          totalScore += score;

          questionsAttempted.push({
              questionId,
              userAnswer,
              correctAnswer: question.correctAnswer,
              score,
          });
      }

      // Add the test session to testHistory
      user.testHistory.push({
          date: new Date(),
          score: totalScore,
          questionsAttempted,
      });

      await user.save();

      res.json({
          success: true,
          totalScore,
          message: "Test submitted successfully!",
      });
  } catch (error) {
      console.error("Error evaluating answers:", error);
      res.status(500).json({ success: false, message: "Error evaluating answers" });
  }
};


export const getTestResults = async (req, res) => {
  try {
      const userId = req.id; 
      const user = await User.findById(userId).select("testHistory").populate("testHistory.questionsAttempted.questionId");
      if (!user || !user.testHistory.length) {
          return res.status(404).json({ success: false, message: "No test history found." });
      }

      const latestTest = user.testHistory[user.testHistory.length - 1]; 

      res.json({
          success: true,
          testHistory: latestTest,
      });
  } catch (error) {
      console.error("Error fetching test results:", error);
      res.status(500).json({ success: false, message: "Error fetching test results." });
  }
};

