import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ Missing GOOGLE_API_KEY in environment variables");
  process.exit(1);
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Allow multiple origins
const allowedOrigins = [
  'https://aria-ai-beige.vercel.app', 
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Ensure Express responds to OPTIONS preflight requests
app.options('*', cors());

// Middleware to parse JSON requests
app.use(express.json());

// Define AI generation route
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("Invalid response from AI model");
    }

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("❌ Error generating content:", error.message);
    res.status(500).json({ error: "An error occurred while generating content" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
