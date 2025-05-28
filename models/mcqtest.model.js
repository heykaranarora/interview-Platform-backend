import mongoose from "mongoose";

const mcqTestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const MCQTest = mongoose.model("MCQTest", mcqTestSchema);

