# Architecture

## Overview

Learning project for backend communication patterns (WebSockets, Pub/Sub, Message Queues, Events) applied to a fitness app. Stack: NestJS + Socket.io (server), React + Vite (client), MongoDB (planned).

---

## Stack

| Layer    | Tech                  |
| -------- | --------------------- |
| Server   | NestJS, TypeScript    |
| Realtime | Socket.io             |
| Client   | React, Vite           |
| Database | MongoDB (planned)     |

---

## Module
s
### Timer (`server/src/timer/`)

Real-time shared workout timer using WebSockets. Multiple clients can join the same named session and stay in sync.

**Pattern: WebSockets**

| Event (client → server) | Description                        |
| ------------------------ | ---------------------------------- |
| `join_session`           | Join a named timer session         |
| `start_timer`            | Start countdown with type/duration |
| `pause_timer`            | Pause the running timer            |
| `reset_timer`            | Reset to initial state             |

| Event (server → client) | Description                     |
| ------------------------ | ------------------------------- |
| `session_state`          | Full timer state snapshot       |
| `timer_tick`             | Countdown tick broadcast        |
| `timer_done`             | Timer completed notification    |

- `TimerGateway` — handles socket events, manages per-socket → session mapping
- `TimerService` — owns timer intervals and session state
- Sessions are rooms in Socket.io; state is cleared when the last client leaves

---

### Chat (`server/src/chat/`)

Real-time direct messaging between connected users using WebSockets.

**Pattern: WebSockets**

| Event (client → server) | Description                    |
| ------------------------ | ------------------------------ |
| `user:join`              | Register username on connect   |
| `message:send`           | Send DM `{ to, text }`         |

| Event (server → client) | Description                        |
| ------------------------ | ---------------------------------- |
| `users:updated`          | Broadcast current online user list |
| `message:receive`        | Deliver message to sender/recipient|

- `ChatGateway` — maps socket IDs to usernames, routes messages, cleans up on disconnect
- In-memory user store (no persistence)

---

## Planned Patterns (Roadmap)

| Phase | Pattern       | Use Case                                      | Tech           |
| ----- | ------------- | --------------------------------------------- | -------------- |
| 3     | Message Queue | Background PDF/CSV report generation         | BullMQ         |
| 4     | Pub/Sub       | Emit events (e.g. PR logged) to many services | Redis Pub/Sub  |

---

## Project Structure

```
fit-app/
├── server/
│   └── src/
│       ├── app.module.ts
│       ├── main.ts           # Port 3001
│       ├── timer/            # WebSocket timer module
│       └── chat/             # WebSocket chat module
├── client/
│   └── src/
│       ├── App.tsx
│       ├── components/
│       └── hooks/
└── docs/
    └── architecture.md       # this file
```
