import { useState } from 'react';
import { useTimer } from './hooks/useTimer';
import { SessionPanel } from './components/SessionPanel';
import { TimerTypeToggle } from './components/TimerTypeToggle';
import { DurationInput } from './components/DurationInput';
import { CountdownDisplay } from './components/CountdownDisplay';
import { ControlButtons } from './components/ControlButtons';
import { StatusBar } from './components/StatusBar';

export function App() {
  const {
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
  } = useTimer();

  const [selectedType, setSelectedType] = useState<'EMOM' | 'AMRAP'>('EMOM');
  const [duration, setDuration] = useState(60);

  const handleJoin = () => {
    if (sessionId.trim()) {
      joinSession(sessionId);
    }
  };

  const handleStart = () => {
    startTimer(selectedType, duration);
  };

  return (
    <>
      <h1>Live Workout Timer</h1>
      <SessionPanel
        sessionId={sessionId}
        onSessionIdChange={setSessionId}
        onJoin={handleJoin}
      />
      <TimerTypeToggle
        selectedType={selectedType}
        onChange={setSelectedType}
      />
      <DurationInput
        value={duration}
        onChange={setDuration}
      />
      <CountdownDisplay
        remaining={timerState.remaining}
        type={timerState.type}
        phaseMessage={phaseMessage}
      />
      <ControlButtons
        joined={joined}
        running={timerState.running}
        onStart={handleStart}
        onPause={pauseTimer}
        onReset={resetTimer}
      />
      <StatusBar
        connected={connected}
        joined={joined}
        sessionId={sessionId}
      />
    </>
  );
}
