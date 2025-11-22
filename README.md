AI Document Rule Checker

A full-stack web application that analyzes PDF documents against user-defined rules using LLM logic (OpenAI GPT-4o-mini). Built for the NIYAMR AI Full-Stack Developer Assignment.

Features:
PDF Upload: Validates and processes PDF documents (2-10 pages).
Custom Rules: Users can define 3 specific criteria (e.g., "Must have a date," "Must mention specific terms").
AI Analysis: Extracts text and uses OpenAI to determine PASS/FAIL status with evidence and confidence scores.
Responsive UI: "Stunning" dark-mode interface built with React & Tailwind CSS.

Tech Stack:
Frontend: React, Vite, Tailwind CSS, Lucide React
Backend: Node.js, Express, Multer (Memory Storage), PDF-Parse
AI Integration: OpenAI API (GPT-4o-mini)
Deployment: Vercel (Serverless)

Install Dependencies
This installs both frontend and backend packages.

npm install

Setup Environment Variables
Create a .env file in the root directory:

# Backend Keys

OPENAI_API_KEY=your_openai_api_key_here

# Frontend Keys (Leave empty for local proxy to work)

VITE_BACKEND_URL=

Run the App

You need two terminals to run the full stack locally:

Terminal 1 (Backend):

npm run server

Terminal 2 (Frontend):

npm run dev

Access the App
Open http://localhost:5173 in your browser.
