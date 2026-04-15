interface SessionPanelProps {
  sessionId: string;
  onSessionIdChange: (id: string) => void;
  onJoin: () => void;
}

export function SessionPanel({ sessionId, onSessionIdChange, onJoin }: SessionPanelProps) {
  return (
    <div className="join-row">
      <input
        id="session-input"
        type="text"
        placeholder="Session code"
        value={sessionId}
        onChange={(e) => onSessionIdChange(e.target.value)}
      />
      <button id="btn-join" onClick={onJoin}>Join</button>
    </div>
  );
}
