import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Battery,
  Thermometer,
  Cpu,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Settings,
  Truck,
  RefreshCw,
  Wind,
  User,
  MapPin,
  Calendar,
  Mic,
  Send,
  Gauge,
  Heart,
  Leaf,
  Recycle,
  X,
  CheckSquare,
  Square,
  Brain,
  Volume2,
  Clock
} from 'lucide-react';
import { AgentNode } from './components/AgentNode';
import { generateAuraResponse, generateTtsAudio } from './services/gemini';
import { base64ToArrayBuffer, pcmToWav } from './utils/audio';
import { Telemetry, ComponentHealth, ActiveAgents, ChatMessage, SystemLog, AlertState, BookingStep, PravahComponent } from './types';

export default function App() {
  // --- State Management ---
  const [telemetry, setTelemetry] = useState<Telemetry>({
    voltage: 13.5,
    temp: 90,
    rpm: 2500,
    speed: 65,
    emissionScore: 95,
    fatigueLevel: 10, // 0-100
    heartRate: 72,
    stressLevel: 15, // New: 0-100
    cabinTemp: 22, // New: Celsius
    ecoScore: 92,
  });

  // Track health of individual components (0-100)
  const [componentHealth, setComponentHealth] = useState<ComponentHealth>({
    brakePads: 98,
    battery: 96,
    tires: 94,
    engineOil: 92,
    catalyticConverter: 99
  });

  // Pravah Selection State
  const [showPravahModal, setShowPravahModal] = useState(false);
  const [selectedPravahComponents, setSelectedPravahComponents] = useState<PravahComponent[]>([]);

  const [activeAgents, setActiveAgents] = useState<ActiveAgents>({
    data: false,
    diagnosis: false,
    master: false,
    engagement: false,
    scheduling: false,
    jeevah: false,
    pravaha: false
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'aura', text: "Hello! AURA is monitoring your vehicle. All systems nominal.", time: "09:00 AM" }
  ]);

  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('prompt'); // 'prompt' | 'slots'
  const [alertState, setAlertState] = useState<AlertState>(null); // 'alternator', 'fatigue', 'pravah', null

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null); // Ref to store the speech recognition instance

  // --- Helpers ---
  const addLog = (agent: string, action: string) => {
    setSystemLogs(prev => [{ agent, action, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
  };

  const addMessage = (text: string, sender: 'aura' | 'user' = 'aura') => {
    setChatHistory(prev => [...prev, { sender, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // --- Voice Output Logic (TTS) ---
  useEffect(() => {
    const lastMsg = chatHistory[chatHistory.length - 1];
    // Only speak if the last message was from Aura and it hasn't been spoken yet (simple check)
    if (lastMsg && lastMsg.sender === 'aura') {
      speakMessage(lastMsg.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatHistory]);

  const speakMessage = async (text: string) => {
    if (!text) return;
    // Don't interrupt if already speaking, unless urgent? 
    // Ideally we queue, but for now simple check.
    
    setIsSpeaking(true);
    try {
      const audioContent = await generateTtsAudio(text);

      if (audioContent) {
        const pcmBuffer = base64ToArrayBuffer(audioContent);
        const wavBuffer = pcmToWav(pcmBuffer);
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
    }
  };

  // --- Simulation Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgents(prev => ({ ...prev, data: true }));

      setTelemetry(prev => {
        const voltageNoise = (Math.random() - 0.5) * 0.2;
        const tempNoise = (Math.random() - 0.5) * 0.5;

        // --- Speed Logic ---
        let targetSpeed = 65;
        if (alertState) {
          targetSpeed = 20;
        }
        const speedDiff = targetSpeed - prev.speed;
        let newSpeed = prev.speed + (speedDiff * 0.1) + ((Math.random() - 0.5) * 2);

        // --- RPM Logic ---
        let targetRpm = 800 + (newSpeed * 40);
        const rpmDiff = targetRpm - prev.rpm;
        let newRpm = prev.rpm + (rpmDiff * 0.1) + ((Math.random() - 0.5) * 50);

        // --- Voltage Logic ---
        let newVoltage = prev.voltage;
        if (alertState === 'alternator') {
          newVoltage = Math.max(11.2, prev.voltage - 0.05);
        } else {
          newVoltage = Math.max(11.0, Math.min(14.5, 13.5 + voltageNoise));
        }

        // --- Temperature Logic ---
        let targetTemp = 90;
        if (alertState === 'alternator') {
          targetTemp = 105;
        } else if (alertState === 'fatigue') {
          targetTemp = 85;
        }
        const tempDiff = targetTemp - prev.temp;
        let newTemp = prev.temp + (tempDiff * 0.05) + tempNoise;

        // --- Fatigue & Health Logic ---
        let newFatigue = prev.fatigueLevel;
        let newHeartRate = prev.heartRate;
        let newStress = prev.stressLevel;
        let newCabinTemp = prev.cabinTemp;
        let newEcoScore = prev.ecoScore;

        if (alertState === 'fatigue') {
          newFatigue = Math.min(100, prev.fatigueLevel + 1.5);
          newHeartRate = Math.min(110, prev.heartRate + 0.5);
          newStress = Math.min(85, prev.stressLevel + 0.8); // Stress increases with fatigue
          newEcoScore = Math.max(60, prev.ecoScore - 0.5);
        } else if (alertState === 'pravah') {
          newEcoScore = Math.max(65, prev.ecoScore - 0.8);
          // Normal recovery for others
          newFatigue = Math.max(10, prev.fatigueLevel - 0.2);
          newStress = Math.max(15, prev.stressLevel - 0.5);
        } else {
          newFatigue = Math.max(10, prev.fatigueLevel - 0.5);
          newHeartRate = Math.max(72, prev.heartRate - 0.5) + (Math.random() - 0.5) * 2;
          newStress = Math.max(15, prev.stressLevel - 0.5);
          newEcoScore = Math.min(98, prev.ecoScore + 0.2);
        }

        // Subtle Cabin Temp Fluctuation
        newCabinTemp = 22 + (Math.random() - 0.5) * 0.5;

        return {
          ...prev,
          voltage: parseFloat(newVoltage.toFixed(2)),
          temp: Math.round(newTemp),
          rpm: Math.round(newRpm),
          speed: Math.max(0, Math.round(newSpeed)),
          fatigueLevel: Math.round(newFatigue),
          heartRate: Math.round(newHeartRate),
          stressLevel: Math.round(newStress),
          cabinTemp: parseFloat(newCabinTemp.toFixed(1)),
          ecoScore: Math.round(newEcoScore),
        };
      });

      // --- Component Life Simulation ---
      if (alertState === 'pravah') {
        setComponentHealth(prev => {
          const updated = { ...prev };
          // Degrade only selected components
          selectedPravahComponents.forEach(key => {
            updated[key] = Math.max(10, prev[key] - 2.5); // Rapid degradation
          });
          return updated;
        });
      }

      setTimeout(() => setActiveAgents(prev => ({ ...prev, data: false })), 500);

    }, 1000);

    return () => clearInterval(interval);
  }, [alertState, selectedPravahComponents]);

  // --- Agent Intelligence Logic ---
  useEffect(() => {
    const checkDiagnostics = async () => {
      if (telemetry.voltage < 11.8 && alertState === 'alternator' && chatHistory.length < 3) {
        triggerDiagnosisAgent("Low Voltage Detected (11.8V). Battery drainage signature matches 'Alternator Failure'.");
      }

      if (telemetry.fatigueLevel > 80 && alertState === 'fatigue' && chatHistory.length < 3) {
        triggerJeevahAgent("Driver eye-closure rate (PERCLOS) critical. Biometric stress detected.");
      }

      // Pravah Logic: Check for ANY selected component failing
      if (alertState === 'pravah' && chatHistory.length < 3) {
        // Find components that have just become critical (<30)
        const failingComponents = selectedPravahComponents.filter(key => componentHealth[key] < 30);

        if (failingComponents.length > 0) {
          // Map keys to readable names
          const names = failingComponents.map(k => {
            if (k === 'brakePads') return 'Brake Pads';
            if (k === 'battery') return 'HV Battery';
            if (k === 'tires') return 'Tires';
            if (k === 'engineOil') return 'Engine Oil';
            if (k === 'catalyticConverter') return 'Cat. Converter';
            return k;
          }).join(', ');

          triggerPravahLifecycleSequence(`End-of-Life: ${names}. Recycling Loop Active.`);
        }
      }
    };
    checkDiagnostics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telemetry.voltage, telemetry.fatigueLevel, componentHealth, alertState, selectedPravahComponents]);


  // --- Agent Trigger Functions ---
  const triggerDiagnosisAgent = (issue: string) => {
    setActiveAgents(prev => ({ ...prev, diagnosis: true }));
    addLog("Diagnosis Agent", `Identified Pattern: ${issue}`);
    setTimeout(() => {
      setActiveAgents(prev => ({ ...prev, diagnosis: false }));
      triggerMasterAgent(issue, "High", "Critical");
    }, 1500);
  };

  const triggerJeevahAgent = (issue: string) => {
    setActiveAgents(prev => ({ ...prev, jeevah: true }));
    addLog("AURA JEEVAH", `Health Alert: ${issue}`);
    setTimeout(() => {
      setActiveAgents(prev => ({ ...prev, jeevah: false }));
      triggerMasterAgent(issue, "Medium", "Safety");
    }, 1500);
  }

  const triggerPravahLifecycleSequence = (issue: string) => {
    // Only trigger once per scenario run
    if (activeAgents.pravaha) return;

    setActiveAgents(prev => ({ ...prev, pravaha: true }));
    addLog("AURA PRAVAHA", `Lifecycle Alert: ${issue}`);

    const materialsMap: Record<string, string> = {
      brakePads: "Ceramic Composite",
      battery: "Lithium & Cobalt",
      tires: "Vulcanized Rubber",
      engineOil: "Synthetic Hydrocarbons",
      catalyticConverter: "Platinum Group Metals"
    };

    const materials = selectedPravahComponents.map(k => materialsMap[k]).join(', ');

    setTimeout(() => {
      addMessage(`♻️ Alert: Components have reached end-of-lifecycle. Efficiency compromised. Material: ${materials}. Would you like to initiate the circular economy protocol?`);
      setBookingStep('prompt'); // Ensure we start at prompt
      setShowBookingModal(true); // ASK CONFIRMATION
      setActiveAgents(prev => ({ ...prev, pravaha: false })); // Deactivate "thinking" state
    }, 1500);
  };

  const confirmPravahAction = (slot: string) => {
    setShowBookingModal(false); // Close modal
    setActiveAgents(prev => ({ ...prev, pravaha: true }));
    const materialsMap: Record<string, string> = {
      brakePads: "Ceramic Composite",
      battery: "Lithium & Cobalt",
      tires: "Vulcanized Rubber",
      engineOil: "Synthetic Hydrocarbons",
      catalyticConverter: "Platinum Group Metals"
    };
    const materials = selectedPravahComponents.map(k => materialsMap[k]).join(', ');

    addMessage(`Pickup scheduled for ${slot}.`, 'user');

    setTimeout(() => {
      addLog("AURA PRAVAHA", `Tagged for recovery: ${materials}.`);
      addMessage(`✅ Confirmed. 'GreenCycle Partners' will pick up the parts on ${slot}. Material recovery estimated at 92%.`);
      setActiveAgents(prev => ({ ...prev, pravaha: false }));
      setAlertState(null); // Resolve
      // Reset Health
      setComponentHealth(prev => ({
        ...prev,
        brakePads: 98, battery: 96, tires: 94, engineOil: 92, catalyticConverter: 99
      }));
      setTelemetry(prev => ({ ...prev, ecoScore: 95 }));
    }, 2000);
  }

  const triggerMasterAgent = (issue: string, confidence: string, priority: string) => {
    setActiveAgents(prev => ({ ...prev, master: true }));
    addLog("Master Agent", `Assessing Risk: ${priority}. Confidence: ${confidence}.`);
    setTimeout(() => {
      setActiveAgents(prev => ({ ...prev, master: false }));
      if (priority === "Critical") {
        triggerEngagementAgent("alternator_warning");
      } else if (priority === "Safety") {
        triggerEngagementAgent("fatigue_warning");
      }
    }, 1500);
  };

  const triggerEngagementAgent = (scenario: string) => {
    setActiveAgents(prev => ({ ...prev, engagement: true }));
    addLog("Engagement Agent", "Constructing personalized message context...");
    setTimeout(() => {
      if (scenario === 'alternator_warning') {
        addMessage("⚠️ Hi Shreya, I've detected your vehicle's alternator is weakening. You have about 4 days before failure. Would you like to book a diagnostic at Andheri Center?");
        setBookingStep('prompt');
        setShowBookingModal(true);
      } else if (scenario === 'fatigue_warning') {
        addMessage("🛑 Attention: I've detected signs of high fatigue. Reaction times are slowing. Would you like me to find the nearest rest stop?");
        setBookingStep('prompt');
        setShowBookingModal(true);
      }
      setActiveAgents(prev => ({ ...prev, engagement: false }));
    }, 1000);
  };

  const handleUserResponse = (response: string) => {
    // If we are in 'prompt' stage and user says Yes
    if (bookingStep === 'prompt') {
      if (response === "Yes, proceed.") {
        // For Fatigue, act immediately
        if (alertState === 'fatigue') {
          addMessage(response, 'user');
          setShowBookingModal(false);
          setActiveAgents(prev => ({ ...prev, engagement: true }));
          setTimeout(() => {
            addMessage("✅ Route updated to Starbucks (2km away). Cabin temp lowered to 20°C to assist alertness.");
            setActiveAgents(prev => ({ ...prev, engagement: false }));
            setAlertState(null);
          }, 1500);
        }
        // For Pravah and Alternator, show slots
        else {
          setBookingStep('slots');
          // Don't close modal, just switch view
        }
      } else {
        // User said Later
        addMessage(response, 'user');
        setShowBookingModal(false);
        setActiveAgents(prev => ({ ...prev, engagement: true }));
        setTimeout(() => {
          addMessage("Understood. I'll keep monitoring the systems.");
          setActiveAgents(prev => ({ ...prev, engagement: false }));
          setAlertState(null);
        }, 1000);
      }
    }
  };

  const handleSlotSelection = (slot: string) => {
    if (alertState === 'pravah') {
      confirmPravahAction(slot);
    } else {
      // Alternator/Default
      addMessage(`Book for ${slot}`, 'user');
      setShowBookingModal(false);
      triggerSchedulingAgent(slot);
    }
  };

  const triggerSchedulingAgent = (slot: string) => {
    setActiveAgents(prev => ({ ...prev, scheduling: true }));
    addLog("Scheduling Agent", "Querying workshop APIs for availability...");
    setTimeout(() => {
      setActiveAgents(prev => ({ ...prev, scheduling: false }));
      addMessage(`✅ Confirmed. Your appointment is set for ${slot}. Parts have been reserved.`);
      setTimeout(() => {
        if (alertState === 'alternator') {
          triggerPravahLogOnly();
        }
      }, 1500);
    }, 2000);
  };

  const triggerPravahLogOnly = () => {
    setActiveAgents(prev => ({ ...prev, pravaha: true }));
    addLog("AURA PRAVAHA", "Logged alternator for recycling (Batch: ALB2025-07). Updating circular loop.");
    setTimeout(() => {
      setActiveAgents(prev => ({ ...prev, pravaha: false }));
      setAlertState(null);
      setTelemetry(prev => ({ ...prev, voltage: 13.5 }));
    }, 2500);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userText = inputText;
    addMessage(userText, 'user');
    setInputText("");

    // Set Engagement Agent Active while processing
    setActiveAgents(prev => ({ ...prev, engagement: true }));

    const reply = await generateAuraResponse(userText, telemetry, componentHealth);

    addMessage(reply, 'aura');
    setActiveAgents(prev => ({ ...prev, engagement: false }));
  };

  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback for browsers without support
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputText("Run system diagnostics");
      }, 2000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // --- Scenarios ---
  const startAlternatorScenario = () => {
    setAlertState('alternator');
    setChatHistory([{ sender: 'aura', text: "Monitoring systems...", time: "09:30 AM" }]);
    addLog("System", "Manual Fault Injection: Alternator Degradation");
  };

  const startFatigueScenario = () => {
    setAlertState('fatigue');
    setChatHistory([{ sender: 'aura', text: "Monitoring driver biometrics...", time: "11:00 PM" }]);
    addLog("System", "Manual Fault Injection: Driver Drowsiness");
  };

  const openPravahModal = () => {
    setShowPravahModal(true);
    setSelectedPravahComponents([]);
  };

  const togglePravahComponent = (key: PravahComponent) => {
    setSelectedPravahComponents(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const confirmPravahSimulation = () => {
    setShowPravahModal(false);
    if (selectedPravahComponents.length === 0) return;

    setAlertState('pravah');
    setChatHistory([{ sender: 'aura', text: "Analyzing component lifecycles...", time: "02:00 PM" }]);
    addLog("System", `Manual Event: Component End-of-Life (${selectedPravahComponents.length} items)`);
  };

  // Helper to determine button text
  const getButtonText = () => {
    if (alertState === 'pravah') return "Yes, Initiate Recycle";
    if (alertState === 'fatigue') return "Yes, Find Rest Stop";
    return "Yes, Book Diagnostic";
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden relative">

      {/* Header */}
      <header className="bg-[#1e293b] text-white p-4 shadow-lg flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">A.U.R.A</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Agentic Mobility Ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className={`flex items-center gap-1 ${isSpeaking ? 'text-green-400' : 'text-slate-500'}`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <span className="bg-slate-700 px-3 py-1 rounded-full border border-slate-600 text-xs">Live Prototype</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">

        {/* Left Column: Telematics (Input) */}
        <section className="col-span-1 md:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <h2 className="font-semibold flex items-center gap-2 text-slate-700">
              <Activity className="w-4 h-4 text-blue-500" /> Live Telematics
            </h2>
          </div>
          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
            {/* Speed & RPM Combined Card */}
            <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-500">Powertrain</span>
                <Gauge className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold text-slate-800">{telemetry.speed}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold">km/h</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-slate-600">{telemetry.rpm}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold">RPM</div>
                </div>
              </div>
              <div className="mt-3 flex gap-1 h-1.5">
                <div className="bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${(telemetry.speed / 120) * 100}%` }}></div>
                <div className="bg-slate-200 flex-1 rounded-full"></div>
              </div>
              {alertState && (
                <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 font-medium animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Limp Mode Active (Limit: 20km/h)
                </div>
              )}
            </div>

            {/* Voltage & Temp Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${telemetry.voltage < 12 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'} transition-colors duration-500`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-medium text-slate-500">Voltage</span>
                  <Battery className={`w-4 h-4 ${telemetry.voltage < 12 ? 'text-red-500' : 'text-green-500'}`} />
                </div>
                <div className="text-xl font-bold">{telemetry.voltage.toFixed(1)}V</div>
              </div>
              <div className="p-3 rounded-lg border bg-slate-50 border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-medium text-slate-500">Temp</span>
                  <Thermometer className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-xl font-bold">{telemetry.temp}°C</div>
              </div>
            </div>

            {/* Component Life List (NEW) */}
            <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-500">Component Health</span>
                <Recycle className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                {Object.entries(componentHealth).map(([key, val]) => {
                  const value = val as number;
                  let label = key;
                  if (key === 'brakePads') label = 'Brake Pads';
                  if (key === 'battery') label = 'HV Battery';
                  if (key === 'tires') label = 'Tires';
                  if (key === 'engineOil') label = 'Engine Oil';
                  if (key === 'catalyticConverter') label = 'Cat. Converter';

                  const isCritical = value < 30;

                  return (
                    <div key={key} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-medium text-slate-600">
                        <span>{label}</span>
                        <span className={isCritical ? 'text-red-600 font-bold animate-pulse' : ''}>{Math.round(value)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${isCritical ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Driver Wellness Card */}
            <div className={`p-4 rounded-lg border ${telemetry.fatigueLevel > 75 ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'} transition-colors duration-500`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  Driver Wellness
                </span>
                <Heart className={`w-5 h-5 ${telemetry.heartRate > 100 ? 'text-red-500 animate-ping' : 'text-purple-500'}`} />
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Fatigue Index</span>
                  <span className="font-bold">{telemetry.fatigueLevel}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${telemetry.fatigueLevel > 75 ? 'bg-red-500' : 'bg-purple-500'}`}
                    style={{ width: `${telemetry.fatigueLevel}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white/50 p-2 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase">Heart Rate</div>
                  <div className="text-lg font-bold text-slate-700">{telemetry.heartRate} <span className="text-[10px] font-normal text-slate-400">BPM</span></div>
                </div>
                <div className="bg-white/50 p-2 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">Eco Score <Leaf className="w-3 h-3 text-green-500" /></div>
                  <div className="text-lg font-bold text-green-600">{telemetry.ecoScore} <span className="text-[10px] font-normal text-slate-400">/100</span></div>
                </div>
                <div className="bg-white/50 p-2 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">Stress <Brain className="w-3 h-3 text-purple-400" /></div>
                  <div className="text-lg font-bold text-purple-600">{telemetry.stressLevel} <span className="text-[10px] font-normal text-slate-400">/100</span></div>
                </div>
                <div className="bg-white/50 p-2 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">Cabin Temp <Wind className="w-3 h-3 text-blue-400" /></div>
                  <div className="text-lg font-bold text-blue-600">{telemetry.cabinTemp}° <span className="text-[10px] font-normal text-slate-400">C</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Middle Column: The Agentic Brain (Processing) */}
        <section className="col-span-1 md:col-span-5 flex flex-col gap-4 overflow-hidden">
          {/* Brain Visualizer */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg flex-1 p-6 relative flex flex-col min-h-[400px]">
            <h2 className="text-white/90 font-semibold flex items-center gap-2 mb-4 z-10 shrink-0">
              <Cpu className="w-5 h-5 text-yellow-400" /> Multi-Agent Core
            </h2>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Scrollable Agent Area */}
            <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 pb-4">
                {/* Data Agent */}
                <AgentNode
                  name="Data Agent"
                  icon={RefreshCw}
                  isActive={activeAgents.data}
                  desc="Structuring IoT Stream"
                  color="blue"
                />

                {/* Diagnosis Agent */}
                <AgentNode
                  name="Diagnosis Agent"
                  icon={Activity}
                  isActive={activeAgents.diagnosis}
                  desc="Predictive ML Models"
                  color="purple"
                />

                {/* Master Agent */}
                <div className="col-span-2 flex justify-center sticky top-0 z-20 py-2">
                  <AgentNode
                    name="Master Agent"
                    icon={Settings}
                    isActive={activeAgents.master}
                    desc="Risk Evaluation & Orchestration"
                    color="yellow"
                    isMaster={true}
                  />
                </div>

                {/* Engagement Agent */}
                <AgentNode
                  name="Engagement Agent"
                  icon={MessageSquare}
                  isActive={activeAgents.engagement}
                  desc="User Interaction"
                  color="green"
                />

                {/* Scheduling Agent */}
                <AgentNode
                  name="Scheduling Agent"
                  icon={Calendar}
                  isActive={activeAgents.scheduling}
                  desc="Service Logistics"
                  color="orange"
                />

                {/* AURA JEEVAH Agent */}
                <AgentNode
                  name="AURA JEEVAH"
                  icon={Heart}
                  isActive={activeAgents.jeevah}
                  desc="Driver Health & Safety"
                  color="purple"
                />

                {/* AURA PRAVAHA Agent */}
                <AgentNode
                  name="AURA PRAVAHA"
                  icon={Recycle}
                  isActive={activeAgents.pravaha}
                  desc="The Flow of Renewal"
                  color="green"
                />
              </div>
            </div>
          </div>

          {/* System Log */}
          <div className="h-48 bg-black/90 rounded-xl p-4 font-mono text-xs text-green-400 overflow-hidden flex flex-col shadow-inner border border-slate-700 shrink-0">
            <div className="text-slate-500 border-b border-slate-800 pb-1 mb-2 shrink-0">SYSTEM LOG // AURA OS v1.0</div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {systemLogs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-slate-500">[{log.time}]</span> <span className="text-yellow-500">{log.agent}:</span> {log.action}
                </div>
              ))}
              {systemLogs.length === 0 && <span className="text-slate-700 italic">Waiting for event triggers...</span>}
            </div>
          </div>
        </section>

        {/* Right Column: User Experience (Output) */}
        <section className="col-span-1 md:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-slate-100 bg-[#1e293b] text-white shrink-0">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-yellow-400" /> A.U.R.A Assistant
            </h2>
            <p className="text-xs text-slate-300 mt-1">Vehicle ID: MH12AB1234</p>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user'
                  ? 'bg-[#1e293b] text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                  }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Simulated Typing Indicator */}
            {(activeAgents.engagement || activeAgents.scheduling) && (
              <div className="flex items-start gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
              </div>
            )}

            {/* Action Buttons (Booking Modal) */}
            {showBookingModal && (
              <div className="flex flex-col gap-2 mt-2 animate-in fade-in zoom-in duration-300">
                {/* Prompt Step: Yes/No */}
                {bookingStep === 'prompt' && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUserResponse("Yes, proceed.")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
                    >
                      {getButtonText()}
                    </button>
                    <button
                      onClick={() => handleUserResponse("Later")}
                      className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      Later
                    </button>
                  </div>
                )}

                {/* Slot Selection Step */}
                {bookingStep === 'slots' && (
                  <div className="bg-slate-100 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase">
                      <Clock className="w-3 h-3" /> Select a {alertState === 'pravah' ? 'Pickup' : 'Service'} Slot:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Today, 4:00 PM', 'Today, 5:30 PM', 'Tomorrow, 9:00 AM', 'Tomorrow, 1:00 PM'].map(slot => (
                        <button
                          key={slot}
                          onClick={() => handleSlotSelection(slot)}
                          className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 py-2 px-3 rounded-lg text-xs font-medium transition-all"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <button
                onClick={handleVoiceCommand}
                className={`p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-200'}`}
                title="Voice Command"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={isListening ? "Listening..." : inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? "" : "Ask A.U.R.A..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 outline-none"
                disabled={isListening}
              />

              <button
                onClick={handleSendMessage}
                className={`p-1.5 rounded-full transition-colors ${inputText.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-300'}`}
                disabled={!inputText.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </section>

      </main>

      {/* Control Panel (Demo Triggers) */}
      <footer className="bg-white border-t border-slate-200 p-4 shrink-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">System Status: ONLINE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider self-center hidden md:inline">Scenarios:</span>

            <button
              onClick={startAlternatorScenario}
              disabled={alertState !== null}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <AlertTriangle className="w-4 h-4" /> Simulate Alternator Fail (Tatva)
            </button>

            <button
              onClick={startFatigueScenario}
              disabled={alertState !== null}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <User className="w-4 h-4" /> Simulate Driver Fatigue (Jeevah)
            </button>

            <button
              onClick={openPravahModal}
              disabled={alertState !== null}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Recycle className="w-4 h-4" /> Simulate Circular Econ (Pravah)
            </button>

            <button
              onClick={() => {
                setAlertState(null);
                setTelemetry(prev => ({ ...prev, voltage: 13.5, fatigueLevel: 10, speed: 65, heartRate: 72, stressLevel: 15, cabinTemp: 22, ecoScore: 92 }));
                setComponentHealth({ brakePads: 98, battery: 96, tires: 94, engineOil: 92, catalyticConverter: 99 });
                setChatHistory([]);
                setBookingStep('prompt');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      </footer>

      {/* Pravah Selection Modal */}
      {showPravahModal && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Recycle className="w-5 h-5 text-green-600" /> Select Components
              </h3>
              <button onClick={() => setShowPravahModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4">Choose which components to simulate for End-of-Life (EOL) degradation and recycling workflow.</p>

            <div className="space-y-2 mb-6">
              {[
                { key: 'brakePads', label: 'Brake Pads (Ceramic/Composite)' },
                { key: 'battery', label: 'HV Battery (Lithium/Cobalt)' },
                { key: 'tires', label: 'Tires (Vulcanized Rubber)' },
                { key: 'engineOil', label: 'Engine Oil (Hydrocarbons)' },
                { key: 'catalyticConverter', label: 'Catalytic Converter (Platinum)' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => togglePravahComponent(item.key as PravahComponent)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${selectedPravahComponents.includes(item.key as PravahComponent)
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-green-300'
                    }`}
                >
                  {selectedPravahComponents.includes(item.key as PravahComponent) ? <CheckSquare className="w-5 h-5 text-green-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={confirmPravahSimulation}
              disabled={selectedPravahComponents.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Recycle className="w-4 h-4" /> Initiate Pravah Simulation
            </button>
          </div>
        </div>
      )}

    </div>
  );
}