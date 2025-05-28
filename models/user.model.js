import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    profile: {
      bio: {
        type: String,
      },
      skills: [
        {
          type: String,
        },
      ],
    },
    testHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        score: {
          type: Number,
          default: 0,
        },
        questionsAttempted: [
          {
            questionId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Question",
            },
            userAnswer: {
              type: String,
            },
            correctAnswer: {
              type: String,
            },
            score: {
              type: Number,
            },
          },
        ],
      },
    ],
    mcqTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MCQTest",
      },
    ],
    badges: [
      {
        type: String,
      },
    ],
    resume: {
      filePath: {
        type: String,
        default: "",
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    videos: [
      {
        url: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,

          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
