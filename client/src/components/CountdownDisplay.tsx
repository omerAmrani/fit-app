interface CountdownDisplayProps {
  remaining: number;
  type?: string;
  phaseMessage: string;
}

function fmt(secs: number): string {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function CountdownDisplay({ remaining, type, phaseMessage }: CountdownDisplayProps) {
  const displayText = remaining > 0 ? fmt(remaining) : '--:--';
  const labelText = remaining > 0 ? (type ?? '') : phaseMessage;

  return (
    <>
      <div id="countdown">{displayText}</div>
      <div id="phase-label">{labelText}</div>
    </>
  );
}
