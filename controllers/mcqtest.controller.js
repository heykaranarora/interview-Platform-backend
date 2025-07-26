import { MCQTest } from "../models/mcqtest.model.js";
import { User } from "../models/user.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PREDEFINED_TOPICS = ["JavaScript", "Python", "React.js", "Node.js", "MongoDB", "Data Structures"];

export const generateMCQQuestions = async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic || (!PREDEFINED_TOPICS.includes(topic) && topic.trim() === "")) {
      return res.status(400).json({ message: "Invalid topic selection." });
    }

    const geminiPrompt = `Generate exactly 5 multiple-choice questions on ${topic}.
    Each question should have 4 options (A, B, C, D) and 1 correct answer.
    Respond in JSON format:
    [
      {
        "question": "What is React?",
        "options": ["Library", "Framework", "Language", "Database"],
        "correctAnswer": "Library"
      }
    ]`;

    const response = await model.generateContent(geminiPrompt);
    const textResponse = await response.response.text();
    
    const extractedJson = textResponse.match(/\[.*\]/s);
    if (!extractedJson) throw new Error("Failed to extract valid JSON from Gemini API response.");

    const mcqQuestions = JSON.parse(extractedJson[0]);
    if (!Array.isArray(mcqQuestions) || mcqQuestions.length !== 5) {
      return res.status(400).json({ message: "Invalid response format from Gemini API." });
    }

    
    return res.status(200).json({ questions: mcqQuestions });
  } catch (error) {
    console.error("Error fetching MCQs:", error);
    res.status(500).json({ message: "Failed to generate questions." });
  }
};

export const submitMCQTest = async (req, res) => {
  try {
    const userId = req.id;
    const { topic, userAnswers, correctAnswers } = req.body;

    if (!userId || !userAnswers || !correctAnswers || userAnswers.length !== correctAnswers.length) {
      return res.status(400).json({ message: "Invalid request format." });
    }

    let correctCount = 0;
    
    userAnswers.forEach((answer, index) => {
      const correctAnswer = correctAnswers[index]?.trim().toLowerCase();
      const userAnswer = answer?.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    await MCQTest.create({ userId, topic, score: correctCount });

    let badge = null;
    if (correctCount >= 4) {
      badge = `${topic} Expert`;
      await User.findByIdAndUpdate(userId, { $addToSet: { badges: badge } });
    }

    return res.status(200).json({
      message: "Test submitted successfully!",
      correctCount,
      badgeEarned: badge,
    });
  } catch (error) {
    console.error("Error submitting MCQ test:", error);
    res.status(500).json({ message: "Failed to submit test." });
  }
};
