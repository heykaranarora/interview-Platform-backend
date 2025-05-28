import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { User } from "../models/user.model.js";

// Generate Resume & Save to Server
export const generateResume = async (req, res) => {
  try {
    const { userId, name, email, phone, linkedin, summary, skills, education, projects } = req.body;

    const doc = new PDFDocument();
    const filename = `${Date.now()}-resume.pdf`;
    const filePath = path.join("uploads", filename);

    doc.pipe(fs.createWriteStream(filePath));

    // Resume Content
    doc.fontSize(20).text(name, { align: "center" });
    doc.fontSize(12).text(`${email} | ${phone} | ${linkedin}`, { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(12).text(summary);
    doc.moveDown();

    doc.fontSize(14).text("Skills", { underline: true });
    doc.fontSize(12).text(skills.join(", "));
    doc.moveDown();

    doc.fontSize(14).text("Education", { underline: true });
    education.forEach((edu) => {
      doc.fontSize(12).text(`${edu.degree} - ${edu.school} (${edu.year})`);
    });
    doc.moveDown();

    doc.fontSize(14).text("Projects", { underline: true });
    projects.forEach((project, index) => {
      doc.fontSize(12).text(`${index + 1}. ${project.title}: ${project.description}`);
      doc.moveDown();
    });

    doc.end();

    // Update user with resume path
    await User.findByIdAndUpdate(userId, {
      resume: { filePath: filePath, uploadedAt: new Date() },
    });

    res.json({ message: "Resume generated", filePath: `/uploads/${filename}` });
  } catch (error) {
    res.status(500).json({ error: "Error generating resume" });
  }
};

// Upload Existing Resume
export const uploadResume = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(userId, {
      resume: { filePath, uploadedAt: new Date() },
    });

    res.json({ message: "Resume uploaded", filePath });
  } catch (error) {
    res.status(500).json({ error: "Error uploading resume" });
  }
};


// Fetch User Resume
export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.resume.filePath) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json({ resumeUrl: `http://localhost:8000/${user.resume.filePath}` });
  } catch (error) {
    res.status(500).json({ error: "Error fetching resume" });
  }
};
