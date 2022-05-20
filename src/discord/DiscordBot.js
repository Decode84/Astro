// Discord bot invite link: https://discord.com/api/oauth2/authorize?client_id=959004457205637131&permissions=536988673&redirect_uri=http%3A%2F%2Fwww.theprojecthub.xyz%2Fdiscord&response_type=code&scope=identify%20bot%20applications.commands
const path = require('path')
const { Client, Intents } = require('discord.js')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const commandHandler = require('./CommandHandler');

// token is the bots login credentials and needs to be kept confident
const token = process.env.DISCORD_BOT_TOKEN
const client = new Client({
    intents: [Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
})
client.once('ready', () => {
    console.log('Discord Ready!')
})
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) { await commandHandler.Handlecommand(interaction) }
    // else if(interaction.is) add other interaction than commands here
})

function StartBot() {
    try {
        require('./RegCommands')
        client.login(token)
        return client
    } catch (e) {
        console.log('failed to start bot: ' + e)
    }
}
module.exports = { StartBot, client }

// Create a new client instance (log into discord)
// Intents(intentions/what do we wanna do): //https://discord.com/developers/docs/topics/gateway#list-of-intents
