// ai-agent/index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const { generateContent } = require('./geminiClient'); // This should return a string response from Gemini

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/ai-agent/parse-and-create', async (req, res) => {
  const { conversation } = req.body;
  if (!conversation) return res.status(400).json({ error: 'Conversation required' });
  
const prompt = `
You're an AI CRM assistant. Parse the following conversation and return a valid JSON command.

Respond ONLY in valid JSON like:

{
  "command": "createLead",
  "data": {
    "name": "...",
    "source": "cold_call",
    "contact": {
      "email": null,
      "phone": null
    },
    "interestedProducts": ["..."],
    "status": "New",
    "notes": "..."
  }
}

Or:
{ "command": "getLeads" }

Or:
{ "command": "getLeadById", "id": "123" }

Or:
{
  "command": "updateLeadById",
  "id": "123",
  "data": {
    "status": "Contacted",
    "notes": "Follow-up done."
  }
}

Or:
{ "command": "deleteLeadById", "id": "123" }

Conversation:
${conversation}
`;

  try {
    const response = await generateContent(prompt);
    const cleaned = response.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const mcpURL = process.env.MCP_URL;
    if (!mcpURL) throw new Error("MCP_URL not defined in .env");

    const mcpRes = await axios.post(mcpURL, parsed);
    res.json({ message: "Handled", mcpResponse: mcpRes.data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process', details: err.message });
  }
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`AI Agent on port ${PORT}`));
