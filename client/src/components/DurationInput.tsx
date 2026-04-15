interface DurationInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function DurationInput({ value, onChange }: DurationInputProps) {
  return (
    <div className="duration-row">
      <span>Duration</span>
      <input
        id="duration-input"
        type="number"
        value={value}
        min="5"
        max="3600"
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
      <span>seconds</span>
    </div>
  );
}
