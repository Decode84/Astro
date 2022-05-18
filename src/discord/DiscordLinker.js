const User = require('../app/Models/User')
const Project = require('../app/Models/Project')
const { client } = require('./DiscordBot')
const { ChannelType } = require('discord-api-types/v10');
// https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=send
/**
 * @function Links a Projecthub Project with Discord.
 * @returns {Promise<{webhook: *, inviteLink: string, serverID: string, textChannel: string}>}
 * @param guildId
 */
async function LinkFromWeb(guildId) {
    await client.guilds.fetch()
    const guild = client.guilds.cache.get(guildId)
    await guild.channels.fetch()
    let channel = guild.channels.cache.filter(channel => channel.name.includes('general')).first()
    console.log(channel)
    if (!channel)
        channel = guild.channels.cache.filter(channel => channel.type === ChannelType.GUILD_TEXT).first()
    console.log(channel)
    console.log('all channels')
    console.log(guild.channels.cache)
    return await Link(guild, channel)
}
async function Link (guild, channel) {
    return {
        serverID: `${guild.id}`,
        webhook: await CreateWebHook(channel),
        inviteLink: await CreateInvite(guild, channel),
        textChannel: `${channel.id}`
    };
}
async function CreateWebHook (channel) {
    const webhook = await channel.createWebhook('ProjectHub Webhook', {
        // Insert options like profilepic etc. here
    })
    webhook.send('ProjectHub Integrated. to link to another channel type /link')
    return webhook.url
}
async function CreateInvite (guild, channel) {
    const invite = await guild.invites.create(channel, {
        maxAge: 0,
        reason: 'Invite project members from ProjectHub'
    })
    console.log(`Created invitelink: ${invite.url}`)
    return invite.url
}

module.exports = { Link, LinkFromWeb }
