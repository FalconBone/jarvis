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
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        // GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.DirectMessageTyping,
        // GatewayIntentBits.DirectMessageReactions
      ]
    });
  }

  async onModuleInit() {
    this.client.on("voiceStateUpdate", (oldState, newState) => {
      //если state.channel null, то до этого user не находился ни в одном канале
      if (!oldState.channel && newState.channel) {
        console.log(
          `${newState.member?.user.username} зашел в голосовой канал "${newState.channel.name}"`
        );
      }

      if (oldState.channel && !newState.channel) {
        console.log(
          `${newState.member?.user.username} вышел из голосового канала "${oldState.channel.name}"`
        );
      }

      if (oldState.channel && newState.channel) {
        console.log(
          `${newState.member?.user.username} перешел из голосового канала "${oldState.channel.name}" в голосовой канал "${newState.channel.name}"`
        );
      }
    });

    this.client.on('messageCreate', (message) => {
      console.log(message.content)
    })

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
