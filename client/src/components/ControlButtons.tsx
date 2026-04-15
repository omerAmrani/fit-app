interface ControlButtonsProps {
  joined: boolean;
  running: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function ControlButtons({ joined, running, onStart, onPause, onReset }: ControlButtonsProps) {
  return (
    <div className="controls">
      <button
        id="btn-start"
        disabled={!joined || running}
        onClick={onStart}
      >
        Start
      </button>
      <button
        id="btn-pause"
        disabled={!joined || !running}
        onClick={onPause}
      >
        Pause
      </button>
      <button
        id="btn-reset"
        disabled={!joined}
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
