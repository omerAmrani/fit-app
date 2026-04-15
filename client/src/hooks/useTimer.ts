import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export interface TimerState {
  running: boolean;
  remaining: number;
  type?: string;
}

export interface UseTimerReturn {
  connected: boolean;
  joined: boolean;
  sessionId: string;
  timerState: TimerState;
  phaseMessage: string;
  joinSession: (sessionId: string) => void;
  startTimer: (type: string, durationSecs: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setSessionId: (id: string) => void;
}

export function useTimer(): UseTimerReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [sessionId, setSessionId] = useState('room1');
  const [timerState, setTimerState] = useState<TimerState>({ running: false, remaining: 0 });
  const [phaseMessage, setPhaseMessage] = useState('');

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => {
      setConnected(false);
      setJoined(false);
    });

    socket.on('session_state', (state: TimerState) => {
      setTimerState(state);
      setJoined(true);
      setPhaseMessage('');
    });

    socket.on('timer_tick', ({ remaining, type }: { remaining: number; type: string }) => {
      setTimerState((prev) => ({ ...prev, remaining, type, running: true }));
    });

    socket.on('timer_done', ({ message }: { message: string }) => {
      setTimerState((prev) => ({ ...prev, running: false, remaining: 0 }));
      setPhaseMessage(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinSession = useCallback((id: string) => {
    socketRef.current?.emit('join_session', { sessionId: id });
    setSessionId(id);
  }, []);

  const startTimer = useCallback((type: string, durationSecs: number) => {
    socketRef.current?.emit('start_timer', { type, durationSecs });
  }, []);

  const pauseTimer = useCallback(() => {
    socketRef.current?.emit('pause_timer');
  }, []);

  const resetTimer = useCallback(() => {
    socketRef.current?.emit('reset_timer');
  }, []);

  return {
    connected,
    joined,
    sessionId,
    timerState,
    phaseMessage,
    joinSession,
    startTimer,
    pauseTimer,
    resetTimer,
    setSessionId,
  };
}
