const Project = require('../Models/Project');
const WebSocketServer = require('websocket').server
const Discord = require('../../discord/DiscordBot')

exports.StartDiscordWebSocket = function (server, session) {
    let wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false // Recommended by websocket to be false
    });
    let projects = []
    
    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
        const connection = request.accept(null, request.origin)
        
        session(request.httpRequest, {}, async function (err) {
            if (err) { return }
            let session = request.httpRequest.session;
            if (!session.user) {
                connection.sendUTF('You are not logged in')
                return
            }
            // TODO: Get current project from session instead
            // push project id if not available to memory
            // console.log(session.user)
            let currentProject = projects.find(project => project.projectID === session.user.projectIDs[0])
            if (!currentProject)
                currentProject = projects[projects.push({ projectID: session.user.projectIDs[0], connections: [] }) - 1]
            // TODO: Consider the very special case that someone tries to create 100 websockets
            /* currentProject.connections.push({ Socket:connection, user:session.user })*/
            // push user to project such that it is subscribed to others messages
            currentProject.connections.push(connection)
            // console.log((new Date()) + ' Connection accepted.');
            // console.log(projects)
            // Discord.client.guilds().guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').first().
            // send latest discord messages to client
            // connection.on utf8 message send that message in discord
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    // console.log('Received Message: ' + message.utf8Data);
                    for (const user of currentProject.connections) {
                        if (user === connection)
                            continue
                        user.sendUTF(message.utf8Data);
                    }
                } // TODO: make discord messages better integrated
                // TODO: Send said message to discord webhook
            })
            // connection.on close remove user from project and remove project
            connection.on('close', function (reasonCode, description) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
                currentProject.connections.splice(currentProject.connections.indexOf(connection), 1)
                if (currentProject.connections.isEmpty)
                    projects.splice(projects.indexOf(currentProject), 1)
            })
            
            // Example code of connection
            /*
            clients.push(connection)
            console.log((new Date()) + ' Connection accepted.');
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    console.log('Received Message: ' + message.utf8Data);
                    for (const client of clients) {
                        client.sendUTF(message.utf8Data);
                    }
                } else if (message.type === 'binary') {
                    console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                    for (const client of clients) {
                        client.sendBytes(message.binaryData);
                    }
                }
            });
            connection.on('close', function (reasonCode, description) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
                clients.splice(clients.indexOf(connection), 1)
            });*/
        })
    });
}
function originIsAllowed(origin) {
    // TODO: put logic here to detect whether the specified origin is allowed. (DOS security etc)
    return true;
}
