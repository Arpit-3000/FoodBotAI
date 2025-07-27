require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const commandRouter = require('./commands/commandRouter');
const validateLead = require('./middleware/validateLead');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post('/execute', (req, res, next) => {
  if (req.body.command === 'createLead') {
    validateLead(req, res, next);
  } else {
    next();
  }
}, async (req, res) => {
  try {
    const result = await commandRouter(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Command execution error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ 
      error: message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`MCP running on port ${PORT}`);
});
