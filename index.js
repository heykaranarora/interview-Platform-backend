import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import questionRoute from "./routes/question.route.js";
import resumeRoute from "./routes/resume.route.js";
import interviewRoute from "./routes/interview.route.js";
import videoRoutes from "./routes/videoRoutes.js";
import MCQTestRoute from "./routes/mcqtest.route.js";
import ForumRoute from "./routes/forum.route.js";
import path from "path";

dotenv.config();



const app = express();



const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));




app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
 "http://192.168.1.6:3000",
 "http://localhost:3000",
  "https://interview-platform-frontend-kyea.vercel.app"
];

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // important for cookies
}));
//app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Welcome to Job Portal API");
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/resume", resumeRoute);
app.use("/api/v1/interview", interviewRoute);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/mcq", MCQTestRoute);
app.use("/api/v1/forum", ForumRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
