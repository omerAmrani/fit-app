import { Module } from '@nestjs/common';
import { TimerGateway } from './timer.gateway';
import { TimerService } from './timer.service';

@Module({
  providers: [TimerGateway, TimerService],
})
export class TimerModule {}
