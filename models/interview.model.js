import mongoose from "mongoose";
import { User } from "./user.model.js";

const { Schema, model } = mongoose;

const interviewSchema = new Schema(
    {
        candidate: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        mentor: {
            type: String,
            required: true
        },
        jobRole: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true,
            min: 15
        },
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled"
        },
        meetingLink: {
            type: String
        }
    },
    { timestamps: true }
);

export const Interview = model("Interview", interviewSchema);
