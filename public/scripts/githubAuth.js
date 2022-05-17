// console.log(window.location) //http://localhost:4000/discord?code=SUysVwZaIztTpdkvVzNe6RCZn3fRqC

const githubUrl = new URL(window.location)
const githubCode = githubUrl.searchParams.get('code') // SUysVwZaIztTpdkvVzNe6RCZn3fRqC
// before auth
if (!githubCode) {
    const randomString = generateRandomString()
    localStorage.setItem('oauth-state', randomString)
    let githref = document.getElementById('githubLogin').href
    githref += `&state=${btoa(randomString)}::` + githubUrl.pathname.substring(githubUrl.pathname.lastIndexOf('/') + 1)
    document.getElementById('githubLogin').href = githref
    
    document.getElementById('githubLogin').style.display = 'block'
}
function generateRandomString () {
    let randomString = ''
    const randomNumber = Math.floor(Math.random() * 10)
    
    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94))
    }
    
    return randomString
}
