A.U.R.A — Agentic Mobility Ecosystem Prototype
EY Techathon 6.0 Submission

Autonomous Understanding & Responsive Assistance

Transforming automotive automation into true autonomy.

🚀 Overview

A.U.R.A is an intelligent agentic mobility system built to bridge the gaps in today’s automotive ecosystem.
Instead of simply displaying data, A.U.R.A thinks, decides, and acts—combining vehicle health, driver wellness, and sustainability into one unified, conversational interface powered by Google Gemini AI.

This prototype demonstrates how Agentic AI solves key “broken links” in mobility, connecting diagnostics, driver safety, and the circular economy.

🌟 The Three Pillars
1. AURA TATVA — The Mind (Intelligence of Truth)

Real-time telemetry monitoring (Voltage, RPM, Engine Temperature).

Predictive diagnostics powered by ML simulation.

Scenario: Alternator-failure prediction with auto-scheduled service.

2. AURA JEEVAH — The Heart (Pulse of Life)

Driver wellness tracking (Heart Rate, Stress, Fatigue).

PERCLOS-based drowsiness simulation.

Scenario: Emergency rest-stop routing + cabin environment adjustment.

3. AURA PRAVAHA — The Flow (Flow of Renewal)

Circular-economy intelligence for material recovery.

Component end-of-life tracking.

Scenario: Brake-pad EoL detection + automated recycling pickup booking.

⚡ Key Features

🧠 Multi-Agent Core:
Real-time visualization of Data, Diagnosis, Master, Engagement, and Scheduling agents.

🗣️ GenAI Voice Assistant:

Speech-to-Text via browser microphone

Text-to-Speech using Gemini 2.5 Flash TTS

Fully bidirectional conversations

📊 Live Driving Simulation:
Dynamic dashboard with component degradation & edge-case triggers.

🤖 Grounded Knowledge:
Uses Google Search grounding for contextual, accurate responses.

📱 Modern UI:
React + Tailwind CSS dashboard-style interface.

🛠️ Tech Stack

Frontend: React.js

Styling: Tailwind CSS, Lucide Icons

AI Models: Gemini 2.5 Flash (Text & TTS)

Speech: Web Speech API (STT) + Gemini Audio (TTS)

🎮 Usage & Demo Scenarios

Trigger edge-case events directly from the dashboard:

Simulate Alternator Failure:
Tatva detects voltage drop → risk assessment → service slot suggestion.

Simulate Driver Fatigue:
Jeevah identifies stress/drowsiness → suggests rest stop.

Simulate Circular Economy Workflow:
Pravah detects worn components → arranges recycling pickup.

📦 Setup
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Add your Gemini API key
# (Update .env or the apiKey variable in App.js)

# Run the development server
npm start

👥 Team Subharambh

Shreejit Saha — Strategy & Innovation

Sushmita Sen — Creative Direction & Concept

Aldrich Punnapuzha Jomon — Technical Architecture & Analytics

📌 Short Description (Sidebar/About Section)

AURA is an Agentic Mobility Ecosystem prototype built for EY Techathon 6.0.
It uses React and Google Gemini AI to create a proactive vehicle interface that manages diagnostics (Tatva), driver health (Jeevah), and circular-economy workflows (Pravah) through a conversational voice assistant.
