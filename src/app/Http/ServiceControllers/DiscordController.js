const fetch = require('node-fetch')
const path = require('path')
const User = require('../../Models/User')
const Project = require('../../Models/Project')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const clientID = process.env.DISCORD_CLIENT_ID
const secret = process.env.DISCORD_APPLICATION_SECRET

const AuthLink = 'https://discord.com/api/oauth2/authorize?client_id=959004457205637131' +
    '&permissions=536988673&redirect_uri=http%3A%2F%2F178.128.202.47%2Fdiscord' +
    '&response_type=code&scope=identify%20bot%20applications.commands'

/**
 * @function Handling of the discord service
 */
async function discordWidget (req) {
    if (!secret)
        return null
    const project = await Project.findById(req.params.id)
    let auth = AuthLink
    if (req.session.user.services?.discord)
        auth = ''
    let ServerInviteLink = project?.categories?.messaging?.services?.discord?.inviteLink
    if (!ServerInviteLink)
        ServerInviteLink = ''
    return {
        AuthLink: auth,
        ServerInviteLink: ServerInviteLink
    }
}
async function discordAuth(req, res) {
    const code = req.query.code
    const state = req.query.state.split('::')
    if (code) {
        await handleAuth(req, code)
    }
    res.redirect('/project/' + state[1])
}

/**
 * @function Handling of the discord authentication linking the user in session to discord
 * @param req
 * @param code
 * @returns {Promise<void>}
 */
async function handleAuth (req, code) {
    try {
        const tokenResult = await getToken(code)
        const token = await tokenResult.json()
        const userResult = await getUserData(token)
        const discordUser = await userResult.json()
        if (!req.session.user) {
            console.log('User not logged in before Discord Auth')
            return
        }
        if ((await discordUser).message === '401: Unauthorized') {
            console.log('failed to link user with discord because of invalid token')
            return
        }
        putUserInDB(discordUser, req)
    } catch (error) {
        console.log(error)
        // TODO: add proper autherror to user
    }
}

/**
 * @function Uses a code from the client to fetch a token for reading the users details
 * @param {int} code
 * @returns {*|Promise<Response>} Token
 */
function getToken (code, req) {
    return fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: clientID,
            client_secret: secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://178.128.202.47/discord',
            scope: 'identify'
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
 * @function Puts the discordUser's id in the database
 * @param discordUser
 * @param req
 */
function putUserInDB (discordUser, req) {
    // TODO: handle the usecase where users discord is already linked to another account
    const username = req.session.user.username
    User.findOne({ username: username }).then(user => {
        user.services = { ...user.services, discord: discordUser.id }
        user.save()
        console.log(`Sucessfully linked ${username} with discord account ${discordUser.username} (${discordUser.id})`)
    })
    req.session.user.services.discord = discordUser.id
}
module.exports = { discordAuth, discordWidget }
