const fetch = require('node-fetch');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../Models/User')

const clientID = '959004457205637131'; // bot userid to register on (always the same)
const secret = process.env.DISCORD_APPLICATION_SECRET;
const redirect = 'http://localhost:4000/discord';

const AuthLink = 'https://discord.com/api/oauth2/authorize?client_id=959004457205637131&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fdiscord&response_type=code&scope=identify%20email';
const InviteBotLink = 'https://discord.com/api/oauth2/authorize?client_id=959004457205637131&permissions=537119937&scope=bot%20applications.commands';
const CreateServerLink = 'https://discord.new/dQCDNNwCPuhE'

const TEMP_currentproject = '624bfb0bb56cd83f0c16e346'

exports.discordAuth = async (req, res) => {
    const code = req.query.code;
    if (code) {
        await handleAuth(req, code)
    }

    res.render('projects/services/discord', {
        AuthLink: AuthLink, InviteBotLink: InviteBotLink, CreateServerLink: CreateServerLink, ServerInviteLink: '' })
}

async function handleAuth (req, code) {
    //console.log(`Discord OAuth request with code: ${req.query.code}`)
    try {
        const tokenResult = await getToken(code)
        // console.log(tokenResult.status);
        const token = await tokenResult.json()
        // console.log(await token);

        const userResult = await getUserData(token)
        const discordUser = await userResult.json()
        if ((await discordUser).message === '401: Unauthorized')
        {
            console.log('failed to link user with discord because of invalid token')
            return;
        }
        console.log(discordUser);
        // console.log(discordUser.id);
        putUserInDB(discordUser, req)
    } catch (error) {
        console.error(error)
        // TODO: add proper autherror to user
    }
}
function getToken (code) {
    return fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: clientID,
            client_secret: secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirect,
            scope: 'identify',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
}
function getUserData (token) {
    return fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${token.token_type} ${token.access_token}`,
        },
    });
}
// TODO: handle the usecase where users discord is already linked to another account
function putUserInDB (discordUser, req) {
    const username = req.session.user.username;
    User.findOne({ 'username': username}, 'discord').then(user => {
        user.discord = discordUser.id;
        user.save();
        console.log(`Sucessfully linked ${username} with discord account ${discordUser.username} (${discordUser.id})`)
    })
}
