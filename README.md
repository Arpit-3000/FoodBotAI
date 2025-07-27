# FoodBot AI Agent 🎙️🤖

This project is a semi-CRM backend system for managing restaurant leads, enhanced with AI agent capabilities and **speech-to-text input** support for interacting via voice commands.

---

## 🚀 Features

- 🔧 **Command-Based Router**: Supports `createLead`, `getLeads`, `updateLead`, `deleteLead`, and `getLeadById`.
- 🧠 **AI Agent Integration**: Easily pluggable AI-based logic for intelligent interactions.
- 🎤 **Speech-to-Text Prompt Input**: Users can now speak their prompts, which are converted to text and processed as commands.
- 📦 **Modular Code Structure**: Clean separation of concerns between command routing, lead services, and API interaction.
- 📡 **Axios-Driven Backend Communication**: Smooth communication with backend API for lead management.
- ✅ **.env Config Support**: Secure and configurable deployment with `.env` variables.

---

## 📁 Folder Structure
FoodBotAI/
├── client/                      # Frontend React Application
│   ├── public/                 # Static files
│   │   ├── index.html
│   │   └── assets/             # Images, fonts, etc.
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── chatBot/          # Chat interface components
│   │   │   └── leadsForm/         # Lead management components
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   ├── .env                   # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
│
├── backend-api/                # Main Backend Service
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Express middleware
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── .env                  # Environment variables
│   └── app.js             # Server entry point
│
├── api-agent/                 # AI Agent Service
│   ├── geminiClient.js/                
│   ├── .env
│   └── app.js
│
├── mcp-server/               # Message Control Protocol Server
│   ├── commands/            # Command handlers
│   ├── middleware/          # Request middleware
│   ├── services/               # services 
│   ├── .env
│   └── app.js
│
└── package.json             # Root package.json for shared scripts

### 🎙️ Speech Prompt Flow

1. User speaks through microphone.
2. `speechToText.js` uses browser's Web Speech API or `speech-recognition` to transcribe.
3. Transcribed text is passed to MCP as a prompt.
4. MCP parses the prompt, extracts command, and forwards to backend API via `leadService`.
