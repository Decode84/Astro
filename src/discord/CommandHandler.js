const { Link } = require('./DiscordLinker')
const Project = require('../app/Models/Project')
const { client } = require('./DiscordBot')
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) { await HandleCommand(interaction) }
    // else if(interaction.is) add other interaction than commands here
})

async function HandleCommand (interaction) {
    const { commandName } = interaction
    switch (commandName) {
    case 'ping':
        await interaction.reply('Pong!')
        break
    case 'link':
        if (!interaction.inGuild()) {
            await interaction.reply('This command only works in Guild servers')
            break
        }
        const project = await Project.findOne({ 'categories.messaging.services.discord.serverID': interaction.guildId })
        if (!project) {
            interaction.reply('This discordServer is not linked with ProjectHub')
            break
        }
        const newLink = await Link(interaction.guild, interaction.channel)
        project.messaging.services.discord = newLink
        project.save()
        interaction.reply('Sucessfully relinked ProjectHub to this channel')
        break
    default:
        console.log('Warning: Registered to unhandled command')
        break
    }
}
