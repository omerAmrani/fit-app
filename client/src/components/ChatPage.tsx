import { useEffect, useRef, useState } from 'react';
import type { Message } from '../hooks/useChat';

interface Props {
  myName: string;
  users: string[];
  messages: Record<string, Message[]>;
  onSend: (to: string, text: string) => void;
}

export function ChatPage({ myName, users, messages, onSend }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const otherUsers = users.filter((u) => u !== myName);
  const conversation = selected ? (messages[selected] ?? []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !draft.trim()) return;
    onSend(selected, draft.trim());
    setDraft('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 200, borderRight: '1px solid #ddd', padding: 16, overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 12px' }}>Online ({otherUsers.length})</h3>
        {otherUsers.length === 0 && <p style={{ color: '#999', fontSize: 13 }}>No one else online</p>}
        {otherUsers.map((user) => (
          <div
            key={user}
            onClick={() => setSelected(user)}
            style={{
              padding: '8px 10px',
              borderRadius: 6,
              cursor: 'pointer',
              background: selected === user ? '#e0f0ff' : 'transparent',
              fontWeight: selected === user ? 600 : 400,
              marginBottom: 4,
            }}
          >
            {user}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #ddd', fontWeight: 600 }}>
          {selected ? `Chat with ${selected}` : 'Select a user to start chatting'}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {conversation.map((msg, i) => {
            const isMe = !!msg.isMine;
            return (
              <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 2, textAlign: isMe ? 'right' : 'left' }}>
                  {isMe ? 'You' : msg.from}
                </div>
                <div
                  style={{
                    background: isMe ? '#0084ff' : '#f0f0f0',
                    color: isMe ? '#fff' : '#000',
                    padding: '8px 12px',
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {selected && (
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #ddd' }}>
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${selected}…`}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 20, border: '1px solid #ccc', fontSize: 14 }}
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: '#0084ff', color: '#fff', cursor: 'pointer' }}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
