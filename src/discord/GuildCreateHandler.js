const User = require('../app/Models/User')
const Project = require('../app/Models/Project')
const { MessageActionRow, MessageButton } = require('discord.js')
// https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=send
async function OnGuildCreate (guild) {
    /* guild.fetchAuditLogs().then(audit => {
        audit.entries.first().executor.send('Hello thanks for adding me')
    }) */
    const auditLogs = await guild.fetchAuditLogs()
    const user = await auditLogs.entries.first().executor
    const userInDB = await User.findOne({ discord: user.id }, 'projectIDs')
    await userInDB
    // console.log("User in DB: " + userInDB)
    const projects = userInDB.projectIDs
    // console.log("User is part of " + projects.length + "projects")
    if (projects.length === 0) {
        const message = `Hello thanks for adding me to ${guild.name} (id:${guild.id})\n
        Unfortunately as of right now, you're not part of any projects in ProjectHub.\n
        Please join a project and call (INSERT COMMAND HERE) to try again` // TODO: the command
        await user.send({ content: message })
        return
    }
    const message = `Hello thanks for adding me to ${guild.name} (id:${guild.id})\nClick to link to project:\n`

    if (projects.length > 25) { console.log('Too many projects') } // TODO: handling of more than 25 projects for a user
    const rowArray = []
    let currentRow = new MessageActionRow()
    for (let i = 0; i < projects.length; i++) { // TODO: Error handling in case projectid is incorrect
        // console.log("Current projectID: " + projects[i])
        const project = await Project.findById(projects[i])
        await project
        // console.log("Project found: " + project)
        currentRow.addComponents(new MessageButton().setCustomId(`${projects[i]}`).setLabel(`${project.name}`).setStyle('PRIMARY'))
        if (i % 5 === 4) {
            rowArray.push(currentRow)
            currentRow = new MessageActionRow()
        }
    }
    if (projects.length % 5 !== 4) { rowArray.push(currentRow) }

    const sentMessage = await user.send({ content: message, components: rowArray })
    const collector = sentMessage.createMessageComponentCollector({
        componentType: 'BUTTON',
        maxComponents: 1
    })
    collector.on('collect', async messageInteraction => {
        const projectID = messageInteraction.customId
        const project = await Project.findById(projectID)

        const discord = { serverID: `${guild.id}`, Webhook: '', invteLink: '' }

        // project.categories.messaging.services.push('Discord Server: ' + guild.id)
        CreateWebHook(guild, discord) //TODO: Fix promises
            .then(CreateInvite(guild, discord))
            .then(() => {
                messageInteraction.update({ content: `You have linked guild ${guild.id} to: ${project.name}`, components: [] })
                project.categories.messaging.services = { ...project.categories.messaging.services, discord }
                console.log(project.categories.messaging.services)
                project.markModified('categories.messaging.services')
                project.save()
            })
    })
}
function CreateWebHook (guild, discord) {
    return guild.channels.fetch()
        .then(channels => {
            channels.first().createWebhook('ProjectHub Webhook', {
                // Insert options like profilepic etc. here
            }).then(webhook => {
                webhook.send('ProjectHub Integrated')
                discord.Webhook = `${webhook.id}`
                // guild.fetchWebhooks().get(webhook.id); maybe need to do it with channel.fetchwebhooks instead?
            })
        })
        .catch(console.error)
}
function CreateInvite (guild, discord) {
    return guild.channels.fetch()
        .then(channels => {
            guild.invites.create(channels.first(), {
                maxAge: 0,
                reason: 'Invite project members from ProjectHub'
            })
                .then(invite => {
                    console.log(`Created invitelink: ${invite.code}`)
                    discord.inviteLink = `${invite.code}`
                })
        })
}

module.exports = { OnGuildCreate }
