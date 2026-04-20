import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
  from: string;
  text: string;
  isMine?: boolean;
}

interface ServerMessage {
  from: string;
  to: string;
  text: string;
  isMine?: boolean;
}

export function useChat(serverUrl: string) {
  const socketRef = useRef<Socket | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.on('users:updated', (names: string[]) => {
      setUsers(names);
    });

    socket.on('message:receive', (msg: ServerMessage) => {
      // Key by the "other" person in the conversation
      const key = msg.isMine ? msg.to : msg.from;
      setMessages((prev) => ({
        ...prev,
        [key]: [...(prev[key] ?? []), { from: msg.from, text: msg.text, isMine: msg.isMine }],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  const join = (name: string) => {
    socketRef.current?.emit('user:join', name);
  };

  const sendMessage = (to: string, text: string) => {
    socketRef.current?.emit('message:send', { to, text });
  };

  return { users, messages, join, sendMessage };
}
