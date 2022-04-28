const Linker = require('./DiscordLinker')

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
        await Linker.Link(interaction.guild, interaction.user, interaction)
        break
    default:
        console.log('Warning: Registered to unhandled command')
        break
    }
}

module.exports.Handlecommand = HandleCommand
