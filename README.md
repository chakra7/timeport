# TimePort: TimeTravel WebApp 🕰️

A sci-fi themed web application that lets you "travel" through time and space on Earth. Enter any place and time (from 10,000 BC to 10,000 AD), and the app will transport you there with dynamically generated contextual data powered by Groq AI.

## 🚀 Quick Start

1. **Clone the repo**
2. **Setup Environment**:
   ```bash
   cd timetravel
   cp .env.example .env
   # Add your GROQ_API_KEY to .env
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run the App**:
   ```bash
   # Terminal 1: Start Backend
   npm run server
   
   # Terminal 2: Start Frontend
   npm run dev
   ```

## 🛠️ Features

- **Natural Language Parsing**: "Rome 50 BC", "Tokyo 3000 AD", "London 500 years ago".
- **AI-Powered**: Uses Groq's Llama 3.3 70B for realistic historical/future predictions.
- **Dynamic Theming**: 12 era-specific visual styles (Prehistoric to Deep Future).
- **TypeScript**: Built with strict type safety.

## 📁 Project Structure

Detailed documentation can be found in the [timetravel/README.md](./timetravel/README.md) file.

---
License: MIT
