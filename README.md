# TimePort: TimeTravel WebApp 🕰️

A sci-fi themed web application that lets you "travel" through time and space on Earth. Enter any place and time (from 10,000 BC to 10,000 AD), and the app will transport you there with dynamically generated contextual data powered by Groq AI.

Built with **Next.js 14**, **React**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Groq API key (get free at https://console.groq.com/keys)

### Setup

1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Setup environment**:
   ```bash
   cp .env.example .env
   # Add your GROQ_API_KEY to .env
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open http://localhost:3000**

## 🛠️ Features

- **Natural Language Parsing**: "Rome 50 BC", "Tokyo 3000 AD", "London 500 years ago"
- **AI-Powered**: Uses Groq's Llama 3.3 70B for realistic historical/future predictions
- **Dynamic Theming**: 12 era-specific visual styles (Prehistoric to Deep Future)
- **Unified Next.js Architecture**: API routes + frontend in one framework

## 📁 Project Structure

```
timeport/
├── app/                    # Next.js App Router
│   ├── api/predict/        # API route for AI predictions
│   ├── page.tsx            # Main page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── TimeMachine.tsx
│   └── EraDisplay.tsx
├── lib/                    # Utilities and helpers
│   ├── parseTime.ts
│   ├── parsePlace.ts
│   ├── dataGenerator.ts
│   └── themes.ts
├── services/               # API client
│   └── api.ts
├── types/                  # TypeScript types
│   └── index.ts
├── .env                    # Environment variables (git-ignored)
├── .env.example            # Example environment file
└── package.json
```

## 📝 Environment Variables

Create a `.env` file with:
```
GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at https://console.groq.com/keys (1,000,000 tokens/day free tier).

## 🚢 Deployment

This app is optimized for **Vercel** deployment:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📜 License

MIT
