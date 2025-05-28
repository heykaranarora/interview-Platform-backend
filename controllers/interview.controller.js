import { Interview } from "../models/interview.model.js";
import { User } from "../models/user.model.js";
import mjml from "mjml";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const MEETING_LINK = "https://zoom.us/j/your-meeting-id";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateEmailTemplate = (candidate, mentor, jobRole, date) => {
    return mjml(`
        <mjml>
            <mj-head>
                <mj-preview>Interview Confirmation</mj-preview>
                <mj-style inline="inline">
                    .button { background-color: #007BFF; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; }
                </mj-style>
            </mj-head>
            <mj-body>
                <mj-section background-color="#f4f4f4" padding="20px">
                    <mj-column>
                        <mj-text font-size="20px" font-weight="bold">📅 Interview Scheduled</mj-text>
                        <mj-divider border-color="#007BFF" />
                        <mj-text>Dear ${candidate.name},</mj-text>
                        <mj-text>Your interview for the <b>${jobRole}</b> position has been scheduled.</mj-text>
                        <mj-text><b>Mentor:</b> ${mentor}</mj-text>
                        <mj-text><b>Date & Time:</b> ${new Date(date).toLocaleString()}</mj-text>
                        <mj-button background-color="#007BFF" color="white" href="${MEETING_LINK}">
                            Join Zoom Meeting
                        </mj-button>
                    </mj-column>
                </mj-section>
            </mj-body>
        </mjml>
    `).html;
};

export const scheduleInterview = async (req, res) => {
    try {
        const userId = req.id;
        const { mentor, jobRole, date, duration } = req.body;

        const candidate = await User.findById(userId);
        if (!candidate) {
            return res.status(404).json({ message: "User not found" });
        }

        // Convert date string to proper Date object
        const interviewDate = new Date(date);
        if (isNaN(interviewDate)) {
            return res.status(400).json({ message: "Invalid date format. Please provide a valid date." });
        }

        const interview = new Interview({
            candidate: candidate._id,
            mentor,
            jobRole,
            date: interviewDate,
            duration,
            meetingLink: MEETING_LINK,
        });

        await interview.save();

        const emailContent = generateEmailTemplate(candidate, mentor, jobRole, interviewDate);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: candidate.email,
            subject: `📅 Interview Confirmation - ${jobRole}`,
            html: emailContent,
        });

        res.status(201).json({ message: "Interview scheduled and email sent!", interview });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getInterviews = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const interviews = await Interview.find({ candidate: userId });
        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInterview = await Interview.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInterview) return res.status(404).json({ message: "Interview not found" });

        res.status(200).json(updatedInterview);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const cancelInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInterview = await Interview.findByIdAndDelete(id);
        if (!deletedInterview) return res.status(404).json({ message: "Interview not found" });

        res.status(200).json({ message: "Interview cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
