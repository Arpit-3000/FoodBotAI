// ai-agent

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const { generateContent } = require('./geminiClient'); // This should return a string response from Gemini

// Function to validate lead data
function validateLeadData(data) {
  const requiredFields = [
    'name',
    'source',
    'contact.email',
    'contact.phone',
    'interestedProducts',
    'status'
  ];

  const missingFields = [];
  
  requiredFields.forEach(field => {
    const parts = field.split('.');
    let value = data;
    
    for (const part of parts) {
      value = value && value[part];
      if (value === undefined || value === null || value === '') break;
    }
    
    if (value === undefined || value === null || value === '') {
      missingFields.push(field);
    } else if (Array.isArray(value) && value.length === 0) {
      missingFields.push(field);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

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

  
  // Validate the parsed command before sending to MCP
  if (parsed.command === 'createLead') {
    const validation = validateLeadData(parsed.data);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: validation.missingFields,
        example: {
          command: 'createLead',
          data: {
            name: 'John Doe',
            source: 'website',
            contact: {
              email: 'john@example.com',
              phone: '1234567890'
            },
            interestedProducts: ['Product A'],
            status: 'New',
            notes: 'Interested in learning more about Product A'
          }
        }
      });
    }
  } 
  // Validate delete command has required ID
  else if (parsed.command === 'deleteLeadById') {
    if (!parsed.id) {
      return res.status(400).json({
        error: 'Lead ID is required',
        message: 'Please provide a lead ID to delete',
        example: {
          command: 'deleteLeadById',
          id: '123'
        }
      });
    }
  } 
  // Validate update command has required ID and data
  else if (parsed.command === 'updateLeadById') {
    const errors = [];
    
    if (!parsed.id) {
      errors.push('Lead ID is required');
    }
    
    if (!parsed.data || typeof parsed.data !== 'object' || Object.keys(parsed.data).length === 0) {
      errors.push('Update data is required');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: errors.join(' and '),
        message: 'Please provide both a lead ID and update data',
        example: {
          command: 'updateLeadById',
          id: '123',
          data: {
            status: 'Contacted',
            notes: 'Updated notes',
            // Other possible fields that can be updated
            source: 'website',
            contact: {
              email: 'new@example.com',
              phone: '9876543210'
            },
            interestedProducts: ['Product A', 'Product B']
          }
        },
        note: 'At least one field must be provided in the data object for update.'
      });
    }
  }

  const mcpRes = await axios.post(mcpURL, parsed);
 

  res.json({ message: "Handled", mcpResponse: mcpRes.data });
} catch (err) {
  console.error("ERROR:", err);
  if (err.response?.data) {
    return res.status(err.response.status || 500).json({
      error: err.response.data.error || 'Failed to process',
      details: err.response.data.details || err.message
    });
  }
  res.status(500).json({ 
    error: 'Failed to process', 
    details: err.message 
  });
}

});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`AI Agent on port ${PORT}`));
