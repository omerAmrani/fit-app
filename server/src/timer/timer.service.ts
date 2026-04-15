import { Injectable } from '@nestjs/common';
import { TimerState, TimerTick, PublicTimerState } from './timer.types';

@Injectable()
export class TimerService {
  private readonly sessions = new Map<string, TimerState>();

  start(
    sessionId: string,
    type: string,
    durationSecs: number,
    onTick: (tick: TimerTick) => void,
    onDone: () => void,
  ): void {
    const existing = this.sessions.get(sessionId);
    if (existing?.running) return;

    const state: TimerState = existing ?? {
      remaining: durationSecs,
      totalDuration: durationSecs,
      type,
      running: false,
    };
    state.running = true;
    state.type = type;
    if (!existing) state.totalDuration = durationSecs;

    state.interval = setInterval(() => {
      state.remaining -= 1;
      onTick({ remaining: state.remaining, type: state.type });

      if (state.remaining <= 0) {
        clearInterval(state.interval);
        state.running = false;
        state.remaining = 0;
        onDone();
      }
    }, 1000);

    this.sessions.set(sessionId, state);
  }

  pause(sessionId: string): void {
    const state = this.sessions.get(sessionId);
    if (!state || !state.running) return;
    clearInterval(state.interval);
    state.running = false;
  }

  reset(sessionId: string): void {
    const state = this.sessions.get(sessionId);
    if (!state) return;
    clearInterval(state.interval);
    state.running = false;
    state.remaining = state.totalDuration;
  }

  getState(sessionId: string): PublicTimerState {
    const state = this.sessions.get(sessionId);
    if (!state) return { running: false, remaining: 0 };
    return { running: state.running, remaining: state.remaining, type: state.type };
  }

  clear(sessionId: string): void {
    const state = this.sessions.get(sessionId);
    if (state?.interval) clearInterval(state.interval);
    this.sessions.delete(sessionId);
  }
}
