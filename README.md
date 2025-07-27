# FoodBot AI Agent 🚀

FoodBotAI is a semi-CRM AI agent system designed to intelligently manage restaurant leads, communicate via command protocols, and support AI-powered prompt enhancements. It features a modular monorepo architecture with three main services:
- `client/`: React frontend
- `backend-api/`: Node.js backend for lead management
- `api-agent/`: AI agent powered by Gemini
- `mcp-server/`: Message Control Protocol (MCP) server

---

## ✨ Features

- 🎯 **Lead Management System** – Add, list, and manage restaurant leads with proper source tracking.
- 🤖 **AI Prompt Handling** – Gemini-integrated prompt system to generate contextual responses.
- 🗣️ **Speech-to-Text Prompting** – Speak your prompts using microphone and get accurate AI replies via speech-to-text.
- 🧠 **MCP Agent Server** – Lightweight command execution protocol (MCP) for backend automation and decision handling.
- 🌐 **Modular Monorepo** – Structured project for seamless development across services.

---

## 🗂️ Project Structure

```bash
FoodBotAI/
├── client/                      # Frontend React Application
│   ├── public/                 # Static files
│   │   └── assets/             # Images, fonts, etc.
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── chatBot/        # Chat interface components
│   │   │   └── leadsForm/      # Lead management components
│   │   ├── hooks/              # Custom hooks (e.g. for speech-to-text)
│   │   ├── App.jsx             # Main App component
│   │   └── main.jsx            # Entry point
│   ├── .env                    # Frontend env variables
│   ├── package.json
│   └── vite.config.js

├── backend-api/                # Main Backend Service
│   ├── config/                 # Configuration files
│   ├── controllers/            # Route controllers (leads etc.)
│   ├── middleware/             # Express middleware
│   ├── models/                 # Firestore or DB models
│   ├── routes/                 # REST API routes
│   ├── services/               # Business logic
│   ├── .env
│   └── app.js                  # Express server entry

├── api-agent/                  # Gemini AI Agent Service
│   ├── geminiClient.js         # Gemini API wrapper
│   ├── .env
│   └── app.js

├── mcp-server/                 # Message Control Protocol Server
│   ├── commands/               # Command handlers
│   ├── middleware/             # Request pre-processing
│   ├── services/               # Business logic (MCP)
│   ├── .env
│   └── app.js

├── package.json                # Root shared scripts
