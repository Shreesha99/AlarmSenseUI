::: {align="center"}
`<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />`{=html}
:::

# AlarmSense AI

### Industrial Root Cause Investigation Interface

AlarmSense AI is a Siemens Energy styled industrial analytics interface
for alarm root cause investigation, built using React, TypeScript, Vite,
TailwindCSS, and RxJS.

------------------------------------------------------------------------

## Architecture Overview

AlarmSenseUI/ ├─ components/ ├─ pages/ ├─ services/ ├─ types.ts ├─
App.tsx ├─ index.tsx ├─ vite.config.ts

------------------------------------------------------------------------

## Design System

### Brand Colors

-   Siemens Purple: #2d1653
-   Siemens Petrol: #00646c
-   Background Gray: #f4f7f9
-   Border Gray: #dee2e6

### Typography

Primary UI Font: Inter\
Monospace Data Font: JetBrains Mono

------------------------------------------------------------------------

## Features

-   Site and Asset filtering
-   Time window selection
-   Intelligent alarm search
-   Priority filtering
-   Duration filtering
-   CSV export
-   Custom enterprise components
-   Industrial status monitoring

------------------------------------------------------------------------

## Run Locally

### Prerequisites

-   Node.js v18+

### Install Dependencies

npm install

### Start Development Server

npm run dev

App runs at:

http://localhost:5173

------------------------------------------------------------------------

## Production Build

npm run build\
npm run preview

------------------------------------------------------------------------

## Tech Stack

-   React 19
-   TypeScript
-   Vite
-   TailwindCSS
-   RxJS
-   Lucide Icons

------------------------------------------------------------------------

## Environment Variables

If future AI integration is added:

Create .env.local

Example:

GEMINI_API_KEY=your_key_here

------------------------------------------------------------------------

## License

Internal enterprise prototype.
