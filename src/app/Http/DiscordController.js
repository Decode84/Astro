const fetch = require('node-fetch');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../Models/User')

const clientID = "959004457205637131"; //bot userid to register on (always the same)
const secret = process.env.DISCORD_APPLICATION_SECRET;
const redirect = "http://localhost:4000/discord";

const AuthLink = "https://discord.com/api/oauth2/authorize?client_id=959004457205637131&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fdiscord&response_type=code&scope=identify%20email";

exports.discordAuth = async (req, res) => {
    const code = req.query.code;
    // ...
    if (code) {
        console.log(`Discord OAuth request with code: ${req.query.code}`);
        try {
            const tokenResult = await GetToken(code);
            //console.log(tokenResult.status);
            const token = await tokenResult.json();
            //console.log(await token);

            const userResult = await GetUserData(token);
            const discordUser = await userResult.json();
            //console.log(discordUser);
            //console.log(discordUser.id);
            putUserInDB(await discordUser, req);
            console.log(`Sucessfully put user ${req.session.user.username}' discord in DB`);
        } catch (error) {
            // NOTE: An unauthorized token will not throw an error;
            // it will return a 401 Unauthorized response in the try block above
            console.error(error);
            //TODO: add proper autherror to user
        }
    }

    res.render('projects/services/discord')
}
function GetToken (code) {
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
function GetUserData (token) {
    return fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });
}
//TODO: handle the usecase where users discord is already linked to another account
function putUserInDB (discordUser, req) {
    const username = req.session.user.username;
    User.findOne({'username': username}, 'discord').then(discordID => {
        discordID = discordUser.id;
        discordID.save();
    })
}