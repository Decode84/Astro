const githubUrl = new URL(window.location)
const randomString = generateRandomString()

let githref = document.getElementById('githubLogin').href
githref += `&state=${btoa(randomString)}::` + githubUrl.pathname.substring(githubUrl.pathname.lastIndexOf('/') + 1)
document.getElementById('githubLogin').href = githref

document.getElementById('githubLogin').style.display = 'block'

function generateRandomString () {
    let randomString = ''
    const randomNumber = Math.floor(Math.random() * 10)
    
    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94))
    }
    
    return randomString
}
