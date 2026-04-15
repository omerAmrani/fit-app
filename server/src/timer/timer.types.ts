export interface TimerState {
  remaining: number;
  totalDuration: number;
  type: string;
  running: boolean;
  interval?: NodeJS.Timeout;
}

export interface TimerTick {
  remaining: number;
  type: string;
}

export interface SessionData {
  sessionId: string;
}

export interface StartTimerData {
  type: string;
  durationSecs: number;
}

export interface PublicTimerState {
  running: boolean;
  remaining: number;
  type?: string;
}
