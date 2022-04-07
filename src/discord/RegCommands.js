//Build on this with https://discordjs.guide/interactions/slash-commands.html#registering-slash-commands
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
//const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

//Discord settings -> Advanced Page -> enable developer mode. Then right-click the guild(discordServer), copy ID and
// parse in the guildID string
const clientID = "959004457205637131"; //bot userid to register on (always the same)
const guildID = "677180947677970458"; //Server to register on
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) //Should never happen
{
    console.log("Couldn't find discord token and therefore can't add commands");
    return;
}

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();