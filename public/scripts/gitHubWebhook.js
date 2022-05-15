async function readMessages() {
    const webhookDashboard = document.getElementById("webhook-dashboard")
    const projectURL = new URL(window.location)
    const messages = await fetch('/api/github/webhook?projectID=' +
        projectURL.pathname.substring(projectURL.pathname.lastIndexOf('/') + 1), {
            method: 'GET',
            cache: 'no-cache'
        })
        .then(response => response.json())
    console.log(messages)
    
    for (const message of messages) {
        const div = document.createElement('div')
        div.setAttribute('class', 'flex w-full flex-row')
            const user = document.createElement('p')
            user.setAttribute('class', 'text-right w-24 font-semibold text-sm p-1 truncate ...')
            user.setAttribute('style', '')
                const userLink = document.createElement('a')
                userLink.setAttribute('href', message.user.url)
                userlink.innerText = message.user.login
            user.append(userLink)
            user.innerText += ': ' + message.push ? 'push' : 'Pull Request ' + message.pull_request.action
        div.append(user)
            const content = document.createElement('p')
            content.setAttribute('class', 'flex flex-1 text-sm break-word p-1')
            if (message.push) {
                const pushLink = document.createElement('a')
                pushLink.setAttribute('href', message.push.url)
                pushLink.innerHTML = 'Pushed ' + message.push.ref + ' with the message: ' + message.push.message
                content.append(pushLink)
            } else if (message.pull_request) {
                const prLink = document.createElement('a')
                prLink.setAttribute('href', message.pull_request.url)
                prLink.innerHTML = message.pull_request.head + ' -> ' + message.pull_request.base
                content.append(prLink)
                const pull = document.createElement('h3')
                pull.innerText = message.pull_request.title
                content.append(pull)
                const pullBody = document.createElement('p')
                pullBody.innerText = message.pull_request.body
                content.append(pullBody)
            }
        div.append(content)
        
        webhookDashboard.append(div)
        div.scrollIntoView()
    }
}
readMessages()
