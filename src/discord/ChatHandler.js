// Note: if these functions are run before DiscordBot prints "Discord Ready!" this script might
// have errors but only possible within first second

async function addChatCollector (client, guildID, currentProject) {
    // `m` is a message object that will be passed through the filter function
    const guild = await client.guilds.cache.get(guildID)
    const channel = await guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').first()

    const filter = m => !(m.system || m.webhookId) // no system messages or webhook messages
    return channel.createMessageCollector({ filter, dispose: true, time: 150000 })
}
async function readLatestMessages (client, guildID) {
    const guild = await client.guilds.cache.get(guildID)
    const channel = await guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').first()
    const messages = await channel.messages.fetch({ limit: 10 })
    return messages.reverse()
}

module.exports = { readLatestMessages, addChatCollector }
