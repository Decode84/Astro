const discordUrl = new URL(window.location)
const randomString = generateRandomString()

localStorage.setItem('oauth-state', randomString)
let href = document.getElementById('login').href
href += `&state=${btoa(randomString)}::` + discordUrl.pathname.substring(discordUrl.pathname.lastIndexOf('/') + 1)
document.getElementById('login').href = href
document.getElementById('login-container').classList.remove('hidden')

function generateRandomString () {
    let randomString = ''
    const randomNumber = Math.floor(Math.random() * 10)

    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94))
    }

    return randomString
}
