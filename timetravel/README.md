# TimeTravel 🕰️

A sci-fi themed web application that lets you "travel" through time and space on Earth. Enter any place and time (from 10,000 BC to 10,000 AD), and the app will transport you there with dynamically generated contextual data powered by Groq AI.

## Features

- **Natural Language Input**: Type destinations like "Ancient Rome 100 BC", "Tokyo 3000 AD", or "London 500 years ago"
- **AI-Powered Predictions**: Uses Groq's Llama 3.3 70B model (free tier) to generate realistic historical and future data
- **Dynamic Era Themes**: The UI automatically adapts its visual style to match the historical period you're visiting
- **Smart Fallback**: If the API is unavailable, falls back to local algorithmic generation
- **Generated Data**:
  - Current weather conditions
  - Language spoken
  - Population estimates
  - Life expectancy
  - Contextual narrative about the time/place

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express + TypeScript
- **AI**: Groq (Llama 3.3 70B) via AI SDK - Free tier!
- **Styling**: CSS-in-JS with dynamic theming

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- Groq API key (get one free at https://console.groq.com/keys)

### Installation

```bash
cd timetravel
npm install
```

### Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

### Running the App

You need to run both the backend server and frontend:

**Option 1: Run both (recommended for development)**
```bash
# Terminal 1 - Start the backend server
npm run server

# Terminal 2 - Start the frontend dev server
npm run dev
```

**Option 2: Run just the server (for API testing)**
```bash
npm run server
```
The server will be available at http://localhost:3000

**Option 3: Run just the frontend**
```bash
npm run dev
```
The frontend will be available at http://localhost:5173

### Production Build

```bash
npm run build
```

## How to Use

1. Make sure the server is running (port 3000)
2. Open the frontend at http://localhost:5173
3. Enter a location and time in the input field
4. Examples:
   - "Athens 400 BC"
   - "London 1850"
   - "Tokyo 3000 AD"
   - "Cairo 5000 years ago"
   - "New York 100 years in the future"
5. Click "Travel" or press Enter
6. The AI will generate realistic predictions for that time/place
7. The theme will change to match the era you're visiting

## AI-Powered Predictions

The app uses Groq's Llama 3.3 70B model to generate predictions. The AI receives:
- Location name and type (city, region, terrain)
- Year (from 10,000 BC to 10,000 AD)
- Era classification

And returns:
- **Weather**: Realistic climate conditions for that location and era
- **Language**: Primary language(s) spoken with historical/future context
- **Population**: Population estimates or descriptions
- **Life Expectancy**: Average lifespan with medical/technological context
- **Context**: A vivid narrative description of life in that time/place

## Era Themes

Each time period has its own visual identity:
- **Prehistoric**: Earth tones, cave-art aesthetic
- **Ancient**: Stone/marble, hieroglyph patterns
- **Classical**: Bronze and gold, Greek column aesthetic
- **Medieval**: Dark wood, illuminated manuscript style
- **Renaissance**: Rich browns and golds, ornate patterns
- **Industrial**: Steel grays and copper, steam-age aesthetic
- **Early Modern**: Art deco styling
- **Modern**: Clean blues and cyans
- **Near Future**: Deep space blues with cyan accents
- **Future**: Cyberpunk purples and magentas
- **Far Future**: Neon greens on deep space
- **Deep Future**: Matrix-style terminal aesthetic

## API Endpoints

### POST /api/predict

Generate predictions for a time and place.

**Request Body:**
```json
{
  "place": {
    "name": "Ancient Rome",
    "region": "europe",
    "terrain": "urban",
    "isCoastal": true,
    "isUrban": true,
    "latitude": 42
  },
  "year": -100
}
```

**Response:**
```json
{
  "weather": "Warm Mediterranean breeze with clear skies",
  "language": "Classical Latin, the lingua franca of the Republic",
  "population": "Over 1 million inhabitants in the metropolitan area",
  "lifeExpectancy": "35-40 years, though wealthy patricians often lived longer",
  "context": "You stand in the bustling Forum Romanum..."
}
```

## Project Structure

```
timetravel/
├── server.ts                      # Express server with Groq API
├── .env                           # Environment variables (API keys)
├── .env.example                   # Example environment file
├── src/
│   ├── components/
│   │   ├── TimeMachine.tsx       # Input interface
│   │   └── EraDisplay.tsx        # Results with dynamic theming
│   ├── services/
│   │   └── api.ts                # API client
│   ├── utils/
│   │   ├── parseTime.ts          # Natural language time parser
│   │   ├── parsePlace.ts         # Location classifier
│   │   └── dataGenerator.ts      # Fallback data algorithms
│   ├── themes/
│   │   └── eraThemes.ts          # Visual theme definitions
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── App.tsx                   # Main app component
└── README.md
```

## Free Tier Limits

Using Groq's free tier:
- **Rate limit**: 1,000,000 tokens per day
- **Model**: Llama 3.3 70B Versatile (70 billion parameters!)
- **Speed**: Very fast inference
- **Cost**: **FREE** forever!

That's enough for thousands of predictions per day at no cost.

## Fallback Behavior

If the Groq API is unavailable or returns an error:
1. The app automatically falls back to local algorithmic generation
2. You'll still see predictions, just with simpler patterns
3. Check the browser console for API error messages

## Security Notes

- **Never commit your `.env` file** - it contains your API key
- The API key is only used server-side (in `server.ts`)
- Frontend never sees the API key
- CORS is configured to allow local development

## License

MIT
