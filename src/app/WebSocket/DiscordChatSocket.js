const Project = require('../Models/Project')
const WebSocketServer = require('websocket').server
const ChatHandler = require('../../discord/ChatHandler')
const { WebhookClient } = require('discord.js')
const { addChatCollector } = require('../../discord/ChatHandler')

exports.StartDiscordWebSocket = function (server, session, bot) {
    const wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false // Recommended by websocket to be false
    })
    const projects = []

    wsServer.on('request', function (request) {
        if (!originIsAllowed(request.origin)) {
            request.reject()
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
            return
        }
        session(request.httpRequest, {}, async function (err) {
            if (err) { return }
            const session = request.httpRequest.session
            if (!session.user) {
                request.reject(401, 'No session') // 401 Unauthorized
                return
            }
            const connection = request.accept(null, request.origin)
            // TODO: Get current project from url instead
            let currentProject = projects.find(project => project.projectID === session.user.projectIDs[0])
            if (!currentProject) {
                currentProject = await OpenNewProject(bot, session)
                projects.push(currentProject)
            }
            // push user to project such that it is subscribed to others messages
            currentProject.connections.push(connection)
            // send latest discord messages to client
            currentProject.latestMessages.forEach(message => connection.send(JSON.stringify(message)))
            // socket message
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    // Send message in Discord
                    currentProject.webhook.send({ content: message.utf8Data, username: session.user.username })
                    // Send message to other webSockets
                    for (const user of currentProject.connections) {
                        /* if (user === connection) // TODO: optimise later?
                            continue */
                        const sendMessage = { username: session.user.username, message: message.utf8Data, discord: false }
                        user.sendUTF(JSON.stringify(sendMessage))
                        currentProject.latestMessages.push(sendMessage)
                    }
                }
            })
            // connection.on close remove user from project and maybe remove project
            connection.on('close', function (reasonCode, description) {
                // console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
                currentProject.connections.splice(currentProject.connections.indexOf(connection), 1)
                if (currentProject.connections.length === 0) {
                    projects.splice(projects.indexOf(currentProject), 1)
                    currentProject.collector.stop()
                }
            })
        })
    })
}
function originIsAllowed (origin) {
    // TODO: put logic here to detect whether the specified origin is allowed. (DOS security etc)
    return true
}
async function OpenNewProject (bot, session) {
    const dbProject = await Project.findById(session.user.projectIDs[0])
    if (!(await dbProject)) {
        console.log('Websocket: failed to get project ' + session.user.projectIDs[0])
        return
    }
    const discord = await dbProject.categories.messaging.services.discord
    const currentProject = {
        projectID: session.user.projectIDs[0],
        webhook: new WebhookClient({ url: discord.webhook }),
        collector: await addChatCollector(bot, discord.serverID),
        connections: [],
        latestMessages: []
    }
    // get previous messages in discord
    const messages = await ChatHandler.readLatestMessages(bot, discord.serverID) // Guaranteed 10 messages
    messages.forEach(m => {
        const message = { username: m.author.username, message: m.content, discord: !(m.system || m.webhookId) }
        currentProject.latestMessages.push(message)
    })
    // Listen for new discord messages
    currentProject.collector.on('collect', m => {
        // There's already filter on the collector
        const message = { username: m.author.username, message: m.content, discord: true }
        currentProject.latestMessages.shift().push(message)
        for (const user of currentProject.connections) {
            user.sendUTF(JSON.stringify(message))
        }
    })
    return currentProject
}
