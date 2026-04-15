# Fit App — WebSocket Implementation Plan
**Scope: Live Workout Timer (Phase 2)**

---

## Stack

| Layer | Choice |
|:---|:---|
| Backend | **Node.js + Express** (lightweight, no framework overhead) |
| WebSockets | **Socket.io** |
| Frontend | **Vanilla HTML/JS** (single page) |

---

## Project Structure

```
fit-app/
├── server/
│   ├── index.js             # Express + Socket.io server entry
│   ├── timer.js             # Timer state manager
│   └── package.json
│
└── client/
    └── workout.html         # Live timer UI + Socket.io client
```

---

## Socket.io Events

| Direction | Event | Payload | Description |
|:---|:---|:---|:---|
| Client → Server | `join_session` | `{ sessionId }` | Join a workout room |
| Client → Server | `start_timer` | `{ type: 'EMOM'\|'AMRAP', durationSecs }` | Start timer in the room |
| Client → Server | `pause_timer` | — | Pause running timer |
| Client → Server | `reset_timer` | — | Reset timer to zero |
| Server → Client | `timer_tick` | `{ remaining, phase: 'work'\|'rest' }` | Broadcast every second |
| Server → Client | `timer_done` | `{ message }` | Emitted when timer hits zero |
| Server → Client | `session_state` | `{ running, remaining }` | Sent on join to sync late joiners |

---

## `timer.js` — Session State Manager

Holds in-memory state per session:

```js
// Map<sessionId, { interval, remaining, running, type }>

start(sessionId, durationSecs, onTick, onDone)
pause(sessionId)
reset(sessionId)
getState(sessionId)
clear(sessionId)   // called on disconnect if room is empty
```

---

## `index.js` — Server Logic

```
on connection:
  on join_session  → socket.join(sessionId), emit session_state back
  on start_timer   → timer.start(...), broadcast timer_tick every 1s to room
  on pause_timer   → timer.pause(sessionId)
  on reset_timer   → timer.reset(sessionId), broadcast updated state to room
  on disconnect    → if room empty: timer.clear(sessionId)
```

---

## `workout.html` — Client

- Input field for **session code** + Join button
- **EMOM / AMRAP** toggle
- Duration input (seconds)
- **Start / Pause / Reset** buttons
- Large countdown display
- Status line (e.g. "Work", "Rest", "Done")

---

## Implementation Steps

- [ ] `npm init` + install `express`, `socket.io`
- [ ] Write `timer.js` — start/pause/reset/clear logic
- [ ] Write `index.js` — Express server + Socket.io event handlers
- [ ] Write `client/workout.html` — connect, join session, render tick events
- [ ] Test: open two browser tabs with same session code, verify both sync
