import { Injectable } from '@nestjs/common';
import { Client, Events, GatewayIntentBits } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

@Injectable()
export class DiscrodService {
  private client: Client

  constructor() {
    this.client = new Client({ 
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
      ]
    });

    console.log(process.env.DISCORD_TOKEN)
  }

  async onModuleInit() {
    this.client.on("voiceStateUpdate", (oldState, newState) => {

      if (!oldState.channel && newState.channel) {

        console.log(
          `${newState.member?.user.username} зашел в ${newState.channel.name}`
        );

      }

    });

    this.client.on(Events.ClientReady, readyClient => {
      console.log(`Logged in as ${readyClient.user.tag}!`);
    });

    this.client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
      }
    });

    await this.client.login(process.env.DISCORD_TOKEN);
  }
}
