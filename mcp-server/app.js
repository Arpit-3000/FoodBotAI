require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const commandRouter = require('./commands/commandRouter');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/execute', async (req, res) => {
  try {
    const result = await commandRouter(req.body);
    res.status(200).json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`MCP running on port ${PORT}`);
});
