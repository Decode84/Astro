const Linker = require('./DiscordLinker')
// https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=send
async function OnGuildCreate (guild) {
    // TODO: make sure that the bot has all the needed perms
    /* const auditLogs = await guild.fetchAuditLogs() // auditLogs is the discord servers log for everything the admins do
    const user = await auditLogs.entries.first().executor // We know this is the admin who added the bot
    await user
    await Linker.Link(guild, user) */ // TODO: fix so that it sends ephemeral message to user that first prompts channel and then project to link to
}

module.exports = { OnGuildCreate }
