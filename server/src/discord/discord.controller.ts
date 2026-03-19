import { Controller, Get } from '@nestjs/common';
import { DiscrodService } from './discord.service';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';



@Controller()
export class DiscordController {

  constructor(private readonly discordService: DiscrodService) {
    
  }
}
