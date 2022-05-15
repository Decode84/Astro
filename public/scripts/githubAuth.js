// console.log(window.location) //http://localhost:4000/discord?code=SUysVwZaIztTpdkvVzNe6RCZn3fRqC

const githubUrl = new URL(window.location)
const githubCode = githubUrl.searchParams.get('code') // SUysVwZaIztTpdkvVzNe6RCZn3fRqC
console.log("awdawd")
// before auth
if (!githubCode) {
    const randomString = generateRandomString()
    localStorage.setItem('oauth-state', randomString)

    document.getElementById('githubLogin').href += `&state=${btoa(randomString)}::`
        + githubUrl.pathname.substring(githubUrl.pathname.lastIndexOf('/') + 1)

    document.getElementById('githubLogin').style.display = 'block'
}
else {
    // after auth
    const state = githubUrl.searchParams.get('state')
    if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
        // May have been clickjacked
        document.getElementById('githubInfo').innerText = 'Failed to authenticate. Try again'
    }
    else
        document.getElementById('githubInfo').innerText = 'Github account linked'
}
function generateRandomString () {
    let randomString = ''
    const randomNumber = Math.floor(Math.random() * 10)
    
    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94))
    }
    
    return randomString
}
