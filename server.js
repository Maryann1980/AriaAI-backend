// Import the required packages
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize express
const app = express();
const port = 5000;

// Your API key for Google Generative AI (ensure to secure it properly)
const apiKey = 'AIzaSyC3t7RBc0H4_MvwKY5RsF7wtOU3-O9kuvk';

// Initialize the Google Generative AI instance
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Enable CORS for all origins (you can restrict to specific origins if needed)
app.use(cors({
  origin: 'https://aria-ai-beige.vercel.app'  // Allow requests only from your front-end URL
}));
// Middleware to parse JSON requests
app.use(express.json());

// Define a route to interact with the AI
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body; // Expecting a 'prompt' field in the body

    // Validate that prompt exists
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    
    // Send back the generated response as a JSON object
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while generating content" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
