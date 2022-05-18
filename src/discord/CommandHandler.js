const Linker = require('./DiscordLinker')
const Project = require('../app/Models/Project')

async function HandleCommand (interaction) {
    const { commandName } = interaction
    switch (commandName) {
    case 'ping':
        await interaction.reply('Pong!')
        break
    case 'link':
        if (!interaction.inGuild()) {
            await interaction.reply({ content: 'This command only works in Guild servers', ephemeral: true })
            break
        }
        const newLink = await Linker.Link(interaction.guild, interaction.channel)
        const project = await Project.findOne({ 'categories.messaging.services.discord.serverID': interaction.guildId })
        project.messaging.services.discord = newLink
        project.save()
        break
    default:
        console.log('Warning: Registered to unhandled command')
        break
    }
}

module.exports.Handlecommand = HandleCommand
