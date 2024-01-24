import {
  Client,
  IntentsBitField,
  CommandInteraction,
  ActivityType,
  Guild,
} from 'discord.js';

import { env } from './env';
import { serverConfig } from './config';

import { seshCommand, seshCommandData } from './commands/sesh';

export const client = new Client({
  intents:
    IntentsBitField.Flags.GuildMembers |
    IntentsBitField.Flags.GuildVoiceStates |
    IntentsBitField.Flags.Guilds
});

function presence() {
  client.user.setPresence({
    status: 'online',
    activities: [{ name: 'the sesh', type: ActivityType.Watching }],
  });
}

async function processGuild(guild: Guild) {
  console.log(`Commands > Registering/updating commands in ${guild.name}`);

  const commands = await guild.commands.fetch();
  if (commands.find(cmd => cmd.name == 'sesh'))
    await guild.commands.edit(commands.find(cmd => cmd.name == 'sesh'), seshCommandData);
  else
    await guild.commands.create(seshCommandData)
}

client.on('ready', async () => {
  console.log(`Discord > Connected as ${client.user.username}`);

  const configuredGuilds = Object.keys(serverConfig);
  for await (const id of configuredGuilds) {
    try {
      const guild = await client.guilds.fetch(id);
      processGuild(guild);
    } catch (error) { }
  }

  setInterval(presence, 30_000);
  presence();
});

client.on('interactionCreate', async (data) => {
  if (data instanceof CommandInteraction) {
    switch (data.commandName) {
      case 'sesh':
      case 'smokesquad':
        seshCommand(data);
        break;
    }
  }
});

client.on('guildCreate', (guild) => processGuild(guild));

client.login(env.DISCORD_TOKEN);
