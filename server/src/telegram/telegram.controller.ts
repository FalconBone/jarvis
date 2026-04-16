import { Body, Controller, Get, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';



@Controller()
export class TelegramController {

  constructor(private telegramService: TelegramService) {
    
  }

  @Post()
  async sendMessage(@Body() {text} : {text: string}) {
    this.telegramService.sendMessage(text)
  }
}
