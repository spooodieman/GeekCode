# GeekCode

A real-time collaborative coding platform with AI assistance.

## Stack
- **Client**: React + Vite + TypeScript + Tailwind CSS
- **Server**: Python FastAPI
- **AI**: Google Gemini

## Getting Started
\\\ash
npm install
npm run dev
\\\
"@
Write-Src ".env.example" @"
VITE_API_URL=http://localhost:8000
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=mongodb://localhost:27017/geekcode
JWT_SECRET=change_me_in_production