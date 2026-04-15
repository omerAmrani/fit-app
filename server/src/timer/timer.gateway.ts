import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TimerService } from './timer.service';
import { SessionData, StartTimerData } from './timer.types';

@WebSocketGateway({ cors: { origin: '*' } })
export class TimerGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  // Per-socket session tracking: socket.id → sessionId
  private readonly socketSessions = new Map<string, string>();

  constructor(private readonly timerService: TimerService) {}

  @SubscribeMessage('join_session')
  handleJoinSession(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: SessionData,
  ): void {
    const { sessionId } = data;
    const current = this.socketSessions.get(socket.id);
    if (current) socket.leave(current);

    this.socketSessions.set(socket.id, sessionId);
    socket.join(sessionId);

    const state = this.timerService.getState(sessionId);
    socket.emit('session_state', state);
    console.log(`[join] ${socket.id} → session "${sessionId}"`);
  }

  @SubscribeMessage('start_timer')
  handleStartTimer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: StartTimerData,
  ): void {
    const currentSession = this.socketSessions.get(socket.id);
    if (!currentSession) return;

    const { type, durationSecs } = data;
    this.timerService.start(
      currentSession,
      type,
      durationSecs,
      (tick) => this.server.to(currentSession).emit('timer_tick', tick),
      () => this.server.to(currentSession).emit('timer_done', { message: `${type} complete!` }),
    );
    console.log(`[start] session "${currentSession}" — ${type} ${durationSecs}s`);
  }

  @SubscribeMessage('pause_timer')
  handlePauseTimer(@ConnectedSocket() socket: Socket): void {
    const currentSession = this.socketSessions.get(socket.id);
    if (!currentSession) return;
    this.timerService.pause(currentSession);
    this.server.to(currentSession).emit('session_state', this.timerService.getState(currentSession));
    console.log(`[pause] session "${currentSession}"`);
  }

  @SubscribeMessage('reset_timer')
  handleResetTimer(@ConnectedSocket() socket: Socket): void {
    const currentSession = this.socketSessions.get(socket.id);
    if (!currentSession) return;
    this.timerService.reset(currentSession);
    this.server.to(currentSession).emit('session_state', this.timerService.getState(currentSession));
    console.log(`[reset] session "${currentSession}"`);
  }

  handleDisconnect(socket: Socket): void {
    const currentSession = this.socketSessions.get(socket.id);
    this.socketSessions.delete(socket.id);
    console.log(`[disconnect] ${socket.id}`);
    if (!currentSession) return;

    const room = this.server.sockets.adapter.rooms.get(currentSession);
    if (!room || room.size === 0) {
      this.timerService.clear(currentSession);
      console.log(`[clear] session "${currentSession}" — no clients left`);
    }
  }
}
