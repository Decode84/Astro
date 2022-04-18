// Discord bot invite link: https://discord.com/api/oauth2/authorize?client_id=959004457205637131&permissions=537119937&scope=bot%20applications.commands
const path = require('path');
const { Client, Intents } = require('discord.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const guildCreateHandler = require('./GuildCreateHandler');

//token is the bots login credentials and needs to be kept confident
const token = process.env.DISCORD_BOT_TOKEN;
if (!token)
{
    console.log("Couldn't find Discord token. Disabling Discord bot");
    return;
}

// Create a new client instance (log into discord)
// Intents(intentions/what do we wanna do): //https://discord.com/developers/docs/topics/gateway#list-of-intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_MESSAGES] });
client.once('ready', () => {
    console.log('Discord Ready!');
});

//commandHandler doesn't register commands. Only handles commands when they come in from discord
const commandHandler = require('./CommandHandler');
//Register commands to the discord bot. Only needs to be done once, but nice keep commands updated
require('./RegCommands')

//Listen for the commands
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand())
        await commandHandler.Handlecommand(interaction);
    //else if(interaction.is) add other interaction than commands here
});
client.on("guildCreate", async guild => {
    //whenever the bot is added to a new discord server
    await guildCreateHandler.OnGuildCreate(guild);

})

// Login to Discord with the client's token
client.login(token);
