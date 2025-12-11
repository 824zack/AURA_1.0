A.U.R.A (Autonomous Understanding & Responsive Assistance)

Agentic Mobility Ecosystem Prototype | EY Techathon 6.0 Submission

    Transforming Automotive Automation into Autonomy.

🚀 Overview

AURA is an intelligent, multi-agent system designed to bridge the gaps in the current automotive ecosystem. Unlike traditional dashboards that simply display data, AURA thinks, decides, and acts. It integrates vehicle health, driver wellness, and sustainability into a unified, conversational interface powered by Google Gemini AI.

This prototype demonstrates how Agentic AI can solve the "broken links" in mobility—connecting diagnostics, driver safety, and the circular economy.
🌟 The Three Pillars

This project is built upon three core agentic philosophies:

    AURA TATVA (The Mind): The Intelligence of Truth.

        Real-time telemetry analysis (Voltage, RPM, Engine Temp).

        Predictive diagnostics using ML simulation.

        Scenario Implemented: Alternator failure prediction and auto-scheduling repairs.

    AURA JEEVAH (The Heart): The Pulse of Life.

        Driver wellness monitoring (Heart Rate, Stress Levels).

        Fatigue and drowsiness detection via PERCLOS simulation.

        Scenario Implemented: Emergency rest stop routing and cabin environment adjustment.

    AURA PRAVAHA (The Flow): The Flow of Renewal.

        Circular economy integration.

        Tracking component end-of-life and material recovery.

        Scenario Implemented: Brake pad end-of-life detection and seamless recycling pickup scheduling.

⚡ Key Features

    🧠 Multi-Agent Core: Visual representation of active agents (Data, Diagnosis, Master, Engagement, Scheduling) working in real-time.

    🗣️ GenAI Voice Assistant: Full bidirectional voice interaction.

        Speech-to-Text: Give voice commands via the browser microphone.

        Text-to-Speech: Instant audio responses using Gemini 2.5 Flash TTS.

    📊 Live Simulation: Interactive dashboard simulating varying driving conditions and component degradation.

    🤖 Grounded Knowledge: The assistant uses Google Search grounding to answer general queries while maintaining context of the vehicle's status.

    📱 Responsive UI: Built with React and Tailwind CSS for a modern, dashboard-style experience.

🛠️ Tech Stack

    Frontend: React.js

    Styling: Tailwind CSS, Lucide Icons

    AI Model: Google Gemini API (gemini-2.5-flash-preview & gemini-2.5-flash-preview-tts)

    Speech: Web Speech API (STT) & Gemini Audio (TTS)

📸 Usage & Scenarios

The dashboard allows you to manually trigger specific edge cases to demonstrate the Agentic workflow:

    Click "Simulate Alternator Fail": Watch Tatva detect the voltage drop, analyze the risk, and offer a service slot.

    Click "Simulate Driver Fatigue": Watch Jeevah detect elevated heart rate/fatigue and suggest a coffee stop.

    Click "Simulate Circular Econ": Watch Pravah identify worn components and schedule a recycling pickup.

📦 Setup

    Clone the repository:
    Bash

git clone https://github.com/your-username/aura-mobility-ecosystem.git

Install dependencies:
Bash

npm install

Important: Create a .env file or update the apiKey variable in App.js with your Google Gemini API Key.

Run the application:
Bash

    npm start

👥 Team Subharambh

    Shreejit Saha: Strategy & Innovation

    Sushmita Sen: Creative Direction & Concept

    Aldrich Punnapuzha Jomon: Technical Architecture & Analytics

Short Description (For Sidebar/About Section):

AURA is an Agentic Mobility Ecosystem prototype built for the EY Techathon 6.0. It utilizes React and Google Gemini AI to create a vehicle interface that proactively manages diagnostics (Tatva), driver health (Jeevah), and component recycling (Pravah) through a conversational voice assistant.
