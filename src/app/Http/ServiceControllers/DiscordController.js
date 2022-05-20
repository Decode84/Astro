const fetch = require('node-fetch')
const path = require('path')
const User = require('../../Models/User')
const Project = require('../../Models/Project')
const { Link,
    LinkFromWeb
} = require('../../../discord/DiscordLinker');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const clientID = process.env.DISCORD_CLIENT_ID
const secret = process.env.DISCORD_APPLICATION_SECRET

/**
 * @function Handling of the discord service
 */
async function discordWidget (req) {
    if (!secret)
        return null
    const project = await Project.findById(req.params.id)
    let ServerInviteLink = project?.categories?.messaging?.services?.discord?.inviteLink
    return ServerInviteLink ? ServerInviteLink : ''
}

/**
 * @function Handling of the discord authentication linking the user in session to discord
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function discordAuth (req, res) {
    try {
        const state = req.query.state.split('::')
        const guild = req.query.guild_id
        const code = req.query.code
        const permissions = req.query.permissions
        
    
        const discord = await LinkFromWeb(guild)
        await ConnectDiscordWithProject(state[1], discord)
        res.redirect('/project/' + state[1])
    } catch (error) {
        console.log(error)
        res.redirect('/projects')
    }
}

/**
 * @function Uses a code from the client to fetch a token for reading the users details
 * @param {int} code
 * @returns {*|Promise<Response>} Token
 */
function getToken (code) {
    return fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: clientID,
            client_secret: secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'https://www.theprojecthub.xyz/discord',
            scope: 'identify bot applications.commands'
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

/**
 * @function gets userdata from discord
 * @param token
 * @returns {*|Promise<Response>} Userdata object
 */
function getUserData (token) {
    return fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${token.token_type} ${token.access_token}`
        }
    })
}

/**
 * @function
 * @param projectID
 * @param guild
 */
async function ConnectDiscordWithProject (projectID, discord) {
    const project = await Project.findById(projectID)
    project.categories.messaging.services = { ...project.categories.messaging.services, discord }
    project.markModified('categories.messaging.services')
    project.save()
}
module.exports = { discordAuth, discordWidget }
