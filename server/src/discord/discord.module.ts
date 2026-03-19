import { Module } from '@nestjs/common';
import { DiscordController } from './discord.controller';
import { DiscrodService } from './discord.service';

@Module({
  imports: [],
  controllers: [DiscordController],
  providers: [DiscrodService],
})
export class DiscordModule {}
