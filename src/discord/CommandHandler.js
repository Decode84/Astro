const { Link } = require('./DiscordLinker')
const Project = require('../app/Models/Project')

async function HandleCommand (interaction) {
    switch (interaction.commandName) {
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
        project.categories.messaging.services.discord = newLink
        project.markModified('categories.messaging.services')
        project.save()
        interaction.reply('Sucessfully relinked ProjectHub to this channel')
        break
    default:
        console.log('Warning: Registered to unhandled command')
        break
    }
}
module.exports = { HandleCommand }
