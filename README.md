# CoachEasy AI MVP

AI-powered sports coaching marketplace demo built with Next.js, React, Tailwind CSS, and Claude AI.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.local.example .env.local
   ```

3. Add your Anthropic API key to `.env.local`:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Coach Portal** (`/coach`) — AI-powered session creation from natural language descriptions
- **Athlete Portal** (`/athlete`) — Conversational AI assistant (Coach Danielle) for finding sessions
- **Mock Data** — 12 realistic coaching sessions across hockey, basketball, power skating, and fitness

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Anthropic Claude API (claude-sonnet-4-20250514)
