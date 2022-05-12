// console.log(window.location) //http://localhost:4000/discord?code=SUysVwZaIztTpdkvVzNe6RCZn3fRqC
const url = new URL(window.location)
const code = url.searchParams.get('code') // SUysVwZaIztTpdkvVzNe6RCZn3fRqC
const state = url.searchParams.get('state')
// before auth
if (!code) {
    const randomString = generateRandomString()
    localStorage.setItem('oauth-state', randomString)
    let href = document.getElementById('login').href
    href = href.replace('localhost%3A4000', encodeURIComponent(url.host))
    href += `&state=${btoa(randomString)}::` + url.pathname.substring(url.pathname.lastIndexOf('/') + 1)
    document.getElementById('login').href = href
    document.getElementById('login-container').classList.remove('hidden')
} else {
    // after auth
    if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
        // May have been clickjacked
        document.getElementById('info').innerText = 'Failed to authenticate. Try again'
    } else {
        document.getElementById('info').innerText = 'Discord account linked'
    }
}
function generateRandomString () {
    let randomString = ''
    const randomNumber = Math.floor(Math.random() * 10)

    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94))
    }

    return randomString
}
