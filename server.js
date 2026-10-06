import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Check whether the Tavily key is loaded — never shows the actual key
app.get("/api/check-key", (req, res) => {
  const key = process.env.TAVILY_API_KEY;

  res.json({
    keyLoaded: Boolean(key),
    keyLength: key ? key.length : 0
  });
});

// Test Tavily
app.get("/api/test-tavily", async (req, res) => {
  try {
    const key = process.env.TAVILY_API_KEY;

    if (!key) {
      return res.status(500).json({
        error: "TAVILY_API_KEY was not loaded."
      });
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: "2024 Mercedes-AMG G 63 specifications",
        search_depth: "basic",
        max_results: 3,
        include_answer: true
      })
    });

    const contentType = response.headers.get("content-type");
    const rawText = await response.text();

    console.log("Tavily HTTP status:", response.status);
    console.log("Tavily content type:", contentType);
    console.log("Tavily raw response:", rawText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Tavily request failed",
        status: response.status,
        contentType,
        response: rawText.slice(0, 1000)
      });
    }

    try {
      const data = JSON.parse(rawText);
      return res.json(data);
    } catch {
      return res.status(500).json({
        error: "Tavily returned a non-JSON response",
        status: response.status,
        contentType,
        response: rawText.slice(0, 1000)
      });
    }

  } catch (error) {
    console.error("Connection error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});
// Research a specific vehicle through Tavily
app.post("/api/vehicle-search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: "A vehicle research query is required."
      });
    }

    const key = process.env.TAVILY_API_KEY;

    if (!key) {
      return res.status(500).json({
        error: "TAVILY_API_KEY was not loaded."
      });
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        max_results: 5,
        include_answer: true
      })
    });

    const contentType = response.headers.get("content-type");
    const rawText = await response.text();

    console.log("Vehicle research status:", response.status);

    if (!response.ok) {
      console.error("Tavily error:", rawText);

      return res.status(response.status).json({
        error: "Tavily research request failed."
      });
    }

    const data = JSON.parse(rawText);

    res.json(data);

  } catch (error) {
    console.error("Vehicle research error:", error);

    res.status(500).json({
      error: "Unable to research this vehicle right now."
    });
  }
  app.use(express.static(path.join(__dirname, "dist")));

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AUREX MOTORS API server running on http://localhost:${PORT}`);
});