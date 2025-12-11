export interface Telemetry {
  voltage: number;
  temp: number;
  rpm: number;
  speed: number;
  emissionScore: number;
  fatigueLevel: number;
  heartRate: number;
  stressLevel: number;
  cabinTemp: number;
  ecoScore: number;
}

export interface ComponentHealth {
  brakePads: number;
  battery: number;
  tires: number;
  engineOil: number;
  catalyticConverter: number;
  [key: string]: number;
}

export interface ActiveAgents {
  data: boolean;
  diagnosis: boolean;
  master: boolean;
  engagement: boolean;
  scheduling: boolean;
  jeevah: boolean;
  pravaha: boolean;
}

export interface ChatMessage {
  sender: 'aura' | 'user';
  text: string;
  time: string;
}

export interface SystemLog {
  agent: string;
  action: string;
  time: string;
}

export type AlertState = 'alternator' | 'fatigue' | 'pravah' | null;

export type BookingStep = 'prompt' | 'slots';

export type PravahComponent = 'brakePads' | 'battery' | 'tires' | 'engineOil' | 'catalyticConverter';
