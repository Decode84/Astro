const User = require('../app/Models/User')
const Project = require('../app/Models/Project')
const { MessageActionRow, MessageButton } = require('discord.js')
// https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=send
async function OnGuildCreate (guild) {
    // TODO: make sure that the bot has all the needed perms
    const auditLogs = await guild.fetchAuditLogs() // auditLogs is the discord servers log for everything the admins do
    const user = await auditLogs.entries.first().executor // We know this is the admin who added the bot
    const userInDB = await User.findOne({ discord: user.id }, 'projectIDs')
    await userInDB
    const projects = userInDB.projectIDs
    if (projects.length === 0) {
        const message = `Hello thanks for adding me to ${guild.name} (id:${guild.id})\n
        Unfortunately as of right now, you're not part of any projects in ProjectHub.\n
        Please join a project and call (INSERT COMMAND HERE) to try again` // TODO: the command
        await user.send({ content: message })
        return
    }
    const message = `Hello thanks for adding me to ${guild.name} (id:${guild.id})\nClick to link to project:\n`
    
    const buttonRows = await CreateButtons(projects)
    // Send message with string contents and button
    const sentMessage = await user.send({ content: message, components: buttonRows })
    await CreateCollector(guild, sentMessage) // eventListener for when the user clicks the button
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
    if (projects.length > 25) { console.log('Too many projects') } // TODO: handling of more than 25 projects for a user
    let currentRow = new MessageActionRow()
    // Each loop adds 1 button
    for (let i = 0; i < projects.length; i++) {
        const project = await Project.findById(projects[i]) // TODO: Error handling in case projectid is incorrect
        await project
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
async function CreateCollector (guild, sentMessage) {
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
        // TODO: handle the usecase where project is already linked or make already linked projects not display
        
        const discord = { serverID: `${guild.id}`, Webhook: '', inviteLink: '' }
        const textChannel = await guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').first();
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
 * @function Creates a discord invite
 * @param {Channel} channel
 * @param {{Webhook: string}} discord
 * @returns {Promise<Webhook | void>} Promise of Webhook written to discord.invitelink.
 */
function CreateWebHook (channel, discord) {
    return channel.createWebhook('ProjectHub Webhook', {
        // Insert options like profilepic etc. here
    }).then(webhook => {
        webhook.send('ProjectHub Integrated')
        discord.Webhook = `${webhook.id}`
        // guild.fetchWebhooks().get(webhook.id); maybe need to do it with channel.fetchwebhooks instead?
    })
        .catch(console.error)
}
/**
 * @function Creates a discord invite
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

module.exports = { OnGuildCreate }
