A.U.R.A — Agentic Mobility Ecosystem
Autonomous Understanding & Responsive Assistance
EY Techathon 6.0 | Team Subharambh
<p align="center"> <img src="https://img.shields.io/badge/Framework-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" /> <img src="https://img.shields.io/badge/Google-Gemini_API-4285F4?style=for-the-badge&logo=google" /> <img src="https://img.shields.io/badge/Agentic-AI-6A0DAD?style=for-the-badge" /> <img src="https://img.shields.io/badge/Status-Prototype-blue?style=for-the-badge" /> </p>
🚀 Overview

A.U.R.A is an agentic automotive intelligence system that goes beyond dashboards.
It thinks, predicts, and acts, enabling a vehicle to understand its environment, protect the driver, and contribute to sustainability.

With Google Gemini AI, multi-agent orchestration, and a real-time simulation engine, A.U.R.A demonstrates how autonomous ecosystems can reshape mobility.

🧩 High-Level Architecture
                ┌──────────────────────────────┐
                │        A.U.R.A SYSTEM        │
                └──────────────────────────────┘
                           │
     ┌─────────────────────┼────────────────────────┐
     │                     │                        │
┌──────────────┐    ┌─────────────┐         ┌───────────────┐
│ AURA TATVA    │    │ AURA JEEVAH │         │ AURA PRAVAHA   │
│ (THE MIND)    │    │ (THE HEART) │         │ (THE FLOW)     │
└──────────────┘    └─────────────┘         └───────────────┘
     │                     │                        │
Telemetry, ML       Driver Vital Data         Component Lifecycle
Diagnostics          Fatigue Detection        Circular Economy
     │                     │                        │
     └──────────────┬──────┴──────────────┬────────┘
                    │                     │
                ┌──────────┐       ┌────────────┐
                │  MASTER  │       │ SCHEDULING │
                └──────────┘       └────────────┘
                    │                     │
                    └──────────┬──────────┘
                               │
                        ┌────────────┐
                        │   UI/UX    │
                        │  React.js  │
                        └────────────┘
        

🔱 The Three Pillars of A.U.R.A
1. AURA TATVA — The Mind 🧠

The Intelligence of Truth

Real-time telemetry (voltage, RPM, temperature).

Predictive diagnostics using ML simulation.

Scenario: Alternator-failure prediction + automatic service slot scheduling.

2. AURA JEEVAH — The Heart ❤️

The Pulse of Life

Driver health + wellness monitoring.

PERCLOS-based fatigue detection.

Scenario: Suggests emergency rest stop and adjusts cabin settings.

3. AURA PRAVAHA — The Flow 🔄

The Flow of Renewal

Circular economy intelligence.

Tracks component end-of-life and material recovery.

Scenario: Brake-pad end-of-life → schedules recycling pickup.

✨ Key Capabilities
🔧 Multi-Agent Core

Real-time visualization of:

Data Agent

Diagnosis Agent

Master Agent

Engagement Agent

Scheduling Agent

🎙️ GenAI Voice Assistant

Speech-to-Text (Web Speech API)

Text-to-Speech (Gemini 2.5 Flash TTS)

Context-aware bidirectional conversations

📊 Live Driving Simulation

Varying driving conditions

Progressive component degradation

Trigger-based failure simulations

🌐 Grounded Knowledge

Integrated Google Search grounding for accurate contextual answers

📱 Responsive UI

React.js + Tailwind CSS

Real-time charts, gauges, and agent activity panels

⚙️ Tech Stack
Frontend     : React.js
Styling      : Tailwind CSS, Lucide Icons
AI Models    : Gemini 2.5 Flash (Text + TTS)
Speech       : Web Speech API + Gemini Audio TTS
Simulation   : Custom Agentic Workflow Engine

🎮 How to Use the Prototype
Trigger Scenarios

Simulate Alternator Failure
Tatva detects voltage drop → predicts failure → books service.

Simulate Driver Fatigue
Jeevah detects stress → recommends rest stop → adjusts cabin.

Simulate Circular Economy Event
Pravah detects worn brake pads → schedules recycling pickup.

📦 Setup & Installation
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Add your Gemini API key (via .env or App.js)
REACT_APP_GEMINI_API_KEY=your_key_here

# Run the app
npm start

👥 Team Subharambh
Member	Role
Shreejit Saha	Strategy & Innovation
Sushmita Sen	Creative Direction & Concept
Aldrich Punnapuzha Jomon	Technical Architecture & Analytics
📌 Short Description (For Sidebar / About Section)

AURA is an Agentic Mobility Ecosystem prototype built for EY Techathon 6.0.
It integrates React and Gemini AI to deliver proactive diagnostics (Tatva), driver wellness support (Jeevah), and circular economy workflows (Pravah) through a unified conversational interface.
