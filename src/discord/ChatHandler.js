// Note: if these functions are run before DiscordBot prints "Discord Ready!" this script might
// have errors but only possible within first second

async function addChatCollector (client, guildID, channelID) {
    // `m` is a message object that will be passed through the filter function
    const guild = await client.guilds.cache.get(guildID)
    const channel = await guild.channels.cache.get(channelID)

    const filter = m => !(m.system || m.webhookId) // no system messages or webhook messages
    return channel.createMessageCollector({ filter, dispose: true, time: 150000 })
}
async function readLatestMessages (client, guildID, channelID) {
    const guild = await client.guilds.cache.get(guildID)
    const channel = await guild.channels.cache.get(channelID)
    const messages = await channel.messages.fetch({ limit: 100 })
    return messages.reverse()
}

module.exports = { readLatestMessages, addChatCollector }
