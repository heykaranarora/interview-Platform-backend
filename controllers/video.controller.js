import cloudinary from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import Question from '../models/question.model.js'


export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "user_videos" },
      async (error, cloudinaryResult) => {
        if (error) return res.status(500).json({ message: "Upload failed", error });

        const user = await User.findById(req.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.videos.push({ url: cloudinaryResult.secure_url });
        await user.save();

        res.status(201).json({ message: "Video uploaded successfully", url: cloudinaryResult.secure_url });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const  userId  = req.id;
    const user = await User.findById(userId).select("videos");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res.status(200).json(user.videos);
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res.status(500).json({ message: "Server error fetching videos" });
  }
};



export const getRandomQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]) // fetch 5 random
    res.status(200).json({ success: true, questions })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch questions", error })
  }
}
