import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/audit", async (req, res) => {
  const { query } = req.body;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a sales opportunity auditor. Based on the company or opportunity name provided, generate a realistic opportunity audit.

Company/Opportunity: ${query}

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "companyName": "string",
  "riskLevel": "LOW" or "MODERATE" or "HIGH",
  "riskSummary": "one sentence summary of the deal status",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "risks": ["risk 1", "risk 2", "risk 3"],
  "nextSteps": {
    "immediate": ["action 1", "action 2"],
    "thisWeek": ["action 1", "action 2"],
    "nextTwoWeeks": ["action 1", "action 2"]
  },
  "gapAnalysis": {
    "complete": ["item 1", "item 2"],
    "partial": ["item 1"],
    "missing": ["item 1", "item 2"]
  },
  "crmLinks": {
    "salesforce": null,
    "hubspot": null
  }
}`,
        },
      ],
    });

    const content = message.content[0].text;
    const auditData = JSON.parse(content);
    res.json(auditData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});