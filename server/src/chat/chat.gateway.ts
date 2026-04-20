import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface SendMessageData {
  to: string;
  text: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly users = new Map<string, string>(); // socketId → name

  private broadcastUsers(): void {
    const names = Array.from(this.users.values());
    this.server.emit('users:updated', names);
  }

  @SubscribeMessage('user:join')
  handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() name: string,
  ): void {
    this.users.set(socket.id, name);
    this.broadcastUsers();
  }

  @SubscribeMessage('message:send')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: SendMessageData,
  ): void {
    const from = this.users.get(socket.id);
    if (!from) return;

    const targetSocketId = Array.from(this.users.entries()).find(
      ([, name]) => name === data.to,
    )?.[0];

    if (!targetSocketId) return;

    this.server.to(targetSocketId).emit('message:receive', { from, text: data.text, to: data.to });
    socket.emit('message:receive', { from, text: data.text, to: data.to, isMine: true });
  }

  handleDisconnect(socket: Socket): void {
    this.users.delete(socket.id);
    this.broadcastUsers();
  }
}
