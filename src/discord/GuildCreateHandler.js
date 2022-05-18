const Linker = require('./DiscordLinker')
const { Permissions } = require('discord.js');
const { ChannelType } = require('discord-api-types/v10');
// https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=send
async function OnGuildCreate (guild) {
    const randomChannel = guild.channels.cache().filter(channel => channel.type === ChannelType.GUILD_TEXT).first()
    if (!guild.me.permissions.has(new Permissions(536988865)))
    {
        randomChannel.send('Issuficient permissions. Please add the bot again')
        return
    }
    const auditLogs = await guild.fetchAuditLogs() // auditLogs is the discord servers log for everything the admins do
    const user = await auditLogs.entries.first().executor // We know this is the admin who added the bot
    await user
    randomChannel.send('Hello, thanks for adding me.\nPlease type /link in the discordChannel you want to link to projectHub')
}

module.exports = { OnGuildCreate }
