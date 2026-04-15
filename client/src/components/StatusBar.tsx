interface StatusBarProps {
  connected: boolean;
  joined: boolean;
  sessionId: string;
}

export function StatusBar({ connected, joined, sessionId }: StatusBarProps) {
  let statusText = 'Not connected';
  let statusClass = '';

  if (connected && joined) {
    statusText = `Session: ${sessionId}`;
    statusClass = 'connected';
  } else if (connected) {
    statusText = 'Connected — join a session to start';
    statusClass = 'connected';
  }

  return <div id="status" className={statusClass}>{statusText}</div>;
}
