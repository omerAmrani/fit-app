interface TimerTypeToggleProps {
  selectedType: 'EMOM' | 'AMRAP';
  onChange: (type: 'EMOM' | 'AMRAP') => void;
}

export function TimerTypeToggle({ selectedType, onChange }: TimerTypeToggleProps) {
  return (
    <div className="type-toggle">
      <button
        id="btn-emom"
        className={selectedType === 'EMOM' ? 'active' : ''}
        onClick={() => onChange('EMOM')}
      >
        EMOM
      </button>
      <button
        id="btn-amrap"
        className={selectedType === 'AMRAP' ? 'active' : ''}
        onClick={() => onChange('AMRAP')}
      >
        AMRAP
      </button>
    </div>
  );
}
