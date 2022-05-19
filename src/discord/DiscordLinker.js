// https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=send
/**
 * @function Links a Projecthub Project with Discord.
 * @returns {Promise<{webhook: *, inviteLink: string, serverID: string, textChannel: string}>}
 * @param guild
 * @param channel
 */
async function Link (guild, channel) {
    return {
        serverID: `${guild.id}`,
        webhook: await CreateWebHook(channel),
        inviteLink: await CreateInvite(guild, channel),
        textChannel: `${channel.id}`,
        messages: []
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
