import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  jobRole: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  keywords: [
    {
      type: String,
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
