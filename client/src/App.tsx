import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { LoginPage } from './components/LoginPage';
import { ChatPage } from './components/ChatPage';

const SERVER_URL = 'http://localhost:3001';

export function App() {
  const [myName, setMyName] = useState<string | null>(null);
  const { users, messages, join, sendMessage } = useChat(SERVER_URL);

  const handleLogin = (name: string) => {
    join(name);
    setMyName(name);
  };

  if (!myName) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ChatPage
      myName={myName}
      users={users}
      messages={messages}
      onSend={sendMessage}
    />
  );
}
