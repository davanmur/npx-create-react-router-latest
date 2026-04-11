import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// In development, allow requests from the Vite dev server.
// In production, set ALLOWED_ORIGIN to your deployed frontend URL.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: ALLOWED_ORIGIN }));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Proxy endpoint — the frontend posts here instead of directly to Anthropic
app.post("/api/classify", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server." });
  }

  const { plantName } = req.body;
  if (!plantName || typeof plantName !== "string" || plantName.trim().length === 0) {
    return res.status(400).json({ error: "plantName is required." });
  }

  const KNOWN_PARENT_IDS = [
    "viridiplantae","embryophyta","tracheophyta","angiospermae","eudicots",
    "rosids","asterids","monocots","gymnospermae","fabales","fabaceae",
    "rosales","rosaceae","solanales","solanaceae","lamiales","lamiaceae",
    "asterales","asteraceae","poales","poaceae","asparagales","amaryllidaceae",
    "pinales","pinaceae",
  ];

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Classify the plant "${plantName.trim()}" in the plant taxonomy hierarchy.
Return ONLY a JSON object with no markdown, no explanation — just raw JSON. Format:
{
  "valid": true/false,
  "nodeId": "unique_snake_case_id",
  "name": "Scientific name (Genus species)",
  "rank": "species or genus",
  "desc": "One sentence description.",
  "parentId": "id of the parent node — must be one of: ${KNOWN_PARENT_IDS.join(", ")}",
  "invalidReason": "if valid is false, explain why"
}`,
          },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error("Anthropic error:", err);
      return res.status(anthropicRes.status).json({ error: "Anthropic API error.", detail: err });
    }

    const data = await anthropicRes.json();
    const text = data.content?.map((i) => i.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    res.json(result);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Internal server error.", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Plant taxonomy proxy running on http://localhost:${PORT}`);
});
