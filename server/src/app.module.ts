import { Module } from '@nestjs/common';
import { TimerModule } from './timer/timer.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [TimerModule, ChatModule],
})
export class AppModule {}
