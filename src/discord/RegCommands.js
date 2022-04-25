// Build on this with https://discordjs.guide/interactions/slash-commands.html#registering-slash-commands
const path = require("path");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const clientID = process.env.DISCORD_CLIENT_ID; // Bot userid to register on (always the same)
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) // Should never happen
{
    console.log("Couldn't find discord token and therefore can't add commands");
    return;
}
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'link',
        description: 'links this discord server to a ProjectHub project',
    }
]
const rest = new REST({ version: '10' }).setToken(token);
rest.put(Routes.applicationCommands(clientID), { body: commands })
    .catch(error => console.log(error))
