import { ApplicationCommandDataResolvable, CommandInteraction, PermissionFlagsBits } from 'discord.js';

import { automaticRelativeDifference } from '../utils/time';
import { serverConfig } from '../config';
import { redis } from '../connectivity/redis';

export const seshCommandData: ApplicationCommandDataResolvable = {
  name: 'sesh',
  description: 'Gather fellow seshers to chat and sesh with.'
};

export async function seshCommand(data: CommandInteraction) {
  const config = serverConfig[data.guildId];
  if (!config) return data.reply({
    embeds: [
      {
        title: 'Error',
        color: 0x213123,
        description: 'That command is not enabled in this server.'
      },
    ],
    ephemeral: true,
  });

  const cond = config.roles.member && !data.channel.permissionsFor(data.guild.id).has(PermissionFlagsBits.ViewChannel) ?
    !data.channel.permissionsFor(config.roles.member).has(PermissionFlagsBits.ViewChannel) :
    !data.channel.permissionsFor(data.guild.id).has(PermissionFlagsBits.ViewChannel)

  if (cond) {
    data.reply({
      embeds: [
        {
          title: 'Error',
          color: 0x213123,
          description: `This command can only be run in public channels, you did want to smoke with people right?\n*Try again in <#${config.channels.general}>*`
        },
      ],
      ephemeral: true,
    });
    return;
  }

  const recentlyRun = await redis.get(`discord/${data.guildId}/sesh`);
  const userCooldown = await redis.get(`discord/${data.guildId}/sesh/${data.user.id}`);

  if (userCooldown) {
    const timeLeft = await redis.ttl(`discord/${data.guildId}/sesh/${data.user.id}`);
    const formatter = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: 'always' });

    const format = automaticRelativeDifference(new Date(Number(userCooldown)));
    const formatLeft = automaticRelativeDifference(new Date(Number(new Date().getTime()) + timeLeft * 1000));

    data.reply({
      embeds: [
        {
          title: 'Error',
          color: 0x213123,
          description: `You've run this command too recently, I don't think you would like to be mentioned that frequently, be considerate.\n\nYou last ran this command ${formatter.format(
            format.duration,
            format.unit,
          )}\nYou can run this command again ${formatter.format(formatLeft.duration, formatLeft.unit)}`
        },
      ],
      ephemeral: true,
    });
    return;
  }

  if (recentlyRun) {
    const timeLeft = await redis.ttl(`discord/${data.guildId}/sesh`);
    const formatter = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: 'always' });

    const format = automaticRelativeDifference(new Date(Number(recentlyRun)));
    const formatLeft = automaticRelativeDifference(new Date(Number(new Date().getTime()) + timeLeft * 1000));

    data.reply({
      embeds: [
        {
          title: 'Error',
          color: 0x213123,
          description: `This command has been run too recently.\n\nSomeone ran this command ${formatter.format(
            format.duration,
            format.unit,
          )}\nYou can run this command again ${formatter.format(formatLeft.duration, formatLeft.unit)}`
        },
      ],
      ephemeral: true,
    });
    return;
  }

  const member = await data.guild.members.fetch(data.user.id);
  if (!member) return;

  if (!member.roles.resolve(config.roles.seshAlerts)) {
    data.reply({
      embeds: [
        {
          title: 'Error',
          color: 0x213123,
          description: `You lack the <@&${config.roles.seshAlerts}> role, so how do I know you're actually a sesher?\n\n*head to <#${config.channels.roles}> to get the role*`
        },
      ],
      ephemeral: true,
    });
    return;
  }

  if (!member.voice.channel || !config.channels.seshVoice.includes(member.voice.channel.id)) {
    data.reply({
      embeds: [
        {
          title: 'Error',
          color: 0x213123,
          description: `You must be in one of the voice channels for seshing to use this command and call to your fellow smokers.\n\n${config.channels.seshVoice.map(
            (id) => `<#${id}>`,
          ).join('\n')}`
        },
      ],
      ephemeral: true,
    });
    return;
  }

  const displayRole = member.roles.color.color;
  const color = displayRole ?? 0xbac221;

  (await data.deferReply()).delete();
  await data.channel.send({
    embeds: [
      {
        color,
        title: 'Time to sesh!',
        author: { name: data.user.displayName, icon_url: member.displayAvatarURL() },
        description: `${data.user.displayName} is tryna to smoke, hop on in!\n<#${member.voice.channel.id}>`,
        timestamp: new Date().toISOString(),
      },
    ],
    content: `<@&${config.roles.seshAlerts}>: <@${data.user.id}> is tryna smoke`,
    allowedMentions: {
      roles: [config.roles.seshAlerts],
      users: [data.user.id]
    }
  });

  const time = new Date().getTime();
  redis.set(`discord/${data.guildId}/sesh`, time, 'EX', config.cooldown.global);
  redis.set(`discord/${data.guildId}/sesh/${data.user.id}`, time, 'EX', config.cooldown.perUser);
}
