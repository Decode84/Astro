const User = require('../app/Models/User')
const Project = require('../app/Models/Project')
const { MessageActionRow, MessageButton } = require('discord.js')
// https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=send
/**
 * @function Links a Projecthub Project with Discord. Invoked by CommandHandler
 * @param {Interaction} interaction
 * @returns {Promise<void>}
 */
async function Link (interaction) {
    const guild = interaction.guild
    const client = interaction.client
    const channel = interaction.channel
    const id = client.id
    const userInDB = await User.findOne({ 'services.discord': id }, 'projectIDs')
    if (!userInDB) {
        client.send("Couldn't find your user id: " + id + " in ProjectHub\nPlease retry the Auth button in ProjectHub")
        return
    }
    const projects = userInDB.projectIDs
    const buttonRows = await CreateButtons(projects)
    if (buttonRows.length === 0) {
        const message = `Hello thanks for adding me to ${guild.name} (id:${guild.id})\n
        Unfortunately as of right now, you're not part of any projects in ProjectHub.\n
        Please join a project and call /link in the server to try again`
        await client.reply({ content: message })
        return
    }
    const message = `Hello thanks for adding me to ${guild.name} (id:${guild.id})\nClick to link to project:\n`
    // Send message with string contents and button
    try {
        let sentMessage
        if (interaction) {
            sentMessage = await interaction.reply({ content: message, components: buttonRows, ephemeral: true, fetchReply: true })
        } else {
            sentMessage = await client.send({ content: message, components: buttonRows })
        }
        await CreateCollector(guild, await sentMessage, channel) // eventListener for when the user clicks the button
    } catch (e) {
        console.log('Discord linkError: ' + e)
    }
}
/**
 * @function Creates buttons for the message. One button for each plausible project. A collector will later make the
 * buttons do the linking.
 * @param {int[]} projects
 */
async function CreateButtons (projects) {
    // The buttons can max have 5 rows and 5 buttons in each row for a total of 25 buttons. NO MORE
    // buttons can be added in a single message. This restriction is made by discord
    const buttonRows = []
    if (projects.length > 25) { console.log('Too many projects') }
    let currentRow = new MessageActionRow()
    // Each loop adds 1 button
    for (let i = 0; i < Math.max(projects.length, 25); i++) {
        const project = await Project.findById(projects[i])
        if (!project)
            continue
        currentRow.addComponents(new MessageButton().setCustomId(`${projects[i]}`).setLabel(`${project.name}`).setStyle('PRIMARY'))
        if (i % 5 === 4) {
            buttonRows.push(currentRow)
            currentRow = new MessageActionRow()
        }
    }
    if (projects.length % 5 !== 4) { buttonRows.push(currentRow) }
    return buttonRows
}
/**
 * @function Creates a collector for the buttons. Finds the project based on the button, Creates a webhook and invitelink
 * and updates the project in the database with serverid, invitelink and webhook. This is what links the project and Discord
 * @param {Message<boolean>} sentMessage
 * @param {guild} guild
 */
async function CreateCollector (guild, sentMessage, textChannel) {
    const collector = sentMessage.createMessageComponentCollector({
        componentType: 'BUTTON',
        maxComponents: 1
    })
    collector.on('collect', async messageInteraction => {
        const projectID = messageInteraction.customId
        const project = await Project.findById(projectID)
        await messageInteraction.update({
            content: `You have linked guild ${guild.id} to: ${project.name}`,
            components: []
        })
        if (!textChannel) {
            textChannel = await guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').first()
        }
        const discord = { serverID: `${guild.id}`, webhook: '', inviteLink: '', textChannel: `${textChannel.id}` }
        const web = await CreateWebHook(await textChannel, discord)
        const invite = await CreateInvite(guild, await textChannel, discord)
        await web
        await invite

        // Update DB
        project.categories.messaging.services = { ...project.categories.messaging.services, discord }
        project.markModified('categories.messaging.services')
        project.save()
    })
}
/**
 * @function Creates a Webhook
 * @param {Channel} channel
 * @param {{Webhook: string}} discord
 * @returns {Promise<Webhook | void>} Promise of Webhook written to discord.invitelink.
 */
function CreateWebHook (channel, discord) {
    return channel.createWebhook('ProjectHub Webhook', {
        // Insert options like profilepic etc. here
    }).then(webhook => {
        webhook.send('ProjectHub Integrated')
        discord.webhook = `${webhook.url}`
        // guild.fetchWebhooks().get(webhook.id); maybe need to do it with channel.fetchwebhooks instead?
    })
        .catch(console.error)
}
/**
 * @function Creates a discord invite
 * @param {Guild} guild
 * @param {Channel} channel
 * @param {{inviteLink: string}} discord
 * @returns {Promise<Invite>} Promise of invite written to discord.invitelink.
 */
function CreateInvite (guild, channel, discord) {
    return guild.invites.create(channel, {
        maxAge: 0,
        reason: 'Invite project members from ProjectHub'
    }).then(invite => {
        console.log(`Created invitelink: ${invite.url}`)
        discord.inviteLink = `${invite.url}`
    })
}

module.exports = { Link }
