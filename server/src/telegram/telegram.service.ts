import { Injectable } from '@nestjs/common';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { Telegraf } from 'telegraf';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

@Injectable()
export class TelegramService {
  private bot: Telegraf

  constructor() {
    this.bot = new Telegraf(String(process.env.TELEGRAM_KLUV_TOKEN))
  }

  async onModuleInit() {

  }

  sendMessage(text : string) {
    this.bot.telegram.sendMessage('-5237515299', text)
  }
}
