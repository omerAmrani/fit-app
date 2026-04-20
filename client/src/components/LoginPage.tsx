import { useState } from 'react';

interface Props {
  onLogin: (name: string) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onLogin(trimmed);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20vh' }}>
      <h1>Chat App</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          autoFocus
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={!name.trim()} style={{ padding: '8px 16px', fontSize: 16, borderRadius: 6 }}>
          Join
        </button>
      </form>
    </div>
  );
}
