async function readMessages () {
    const webhookDashboard = document.getElementById('webhook-dashboard')
    const projectURL = new URL(window.location)
    const messages = await fetch('/api/github/webhook?projectID=' +
        projectURL.pathname.substring(projectURL.pathname.lastIndexOf('/') + 1), {
        method: 'GET',
        cache: 'no-cache'
    })
        .then(response => response.json())

    for (const message of messages) {
        const div = document.createElement('div')
        div.setAttribute('class', 'flex w-full flex-row')
        const user = document.createElement('p')
        user.setAttribute('class', 'w-28 font-semibold text-sm truncate ...')
        user.setAttribute('style', '')
        const userLink = document.createElement('a')
        userLink.setAttribute('href', message.user.url)
        userLink.setAttribute('target', '_blank')
        userLink.innerText = message.user.login + ':'
        user.append(userLink)
        div.append(user)
        const content = document.createElement('p')
        content.setAttribute('class', 'flex flex-1 text-sm break-word p-1')
        if (message.push) {
            const pushLink = document.createElement('a')
            pushLink.setAttribute('href', message.push.url)
            pushLink.setAttribute('target', '_blank')
            pushLink.innerHTML = 'Pushed ' + message.push.ref + ' with the message: ' + message.push.message
            content.append(pushLink)
        } else if (message.pull_request) {
            const prLink = document.createElement('a')
            prLink.setAttribute('href', message.pull_request.url)
            prLink.innerHTML = message.pull_request.action + ' pull request for ' +
                message.pull_request.head + ' -> ' + message.pull_request.base + ': ' + message.pull_request.title +
                '<br>' + message.pull_request.body
            content.append(prLink)
        }
        div.append(content)
        const date = document.createElement('p')
        content.setAttribute('class', 'flex flex-1 text-sm break-word p-1 text-sm')
        const convertedDate = new Date(message.timestamp)
        date.innerText = convertedDate.toLocaleString()
        div.append(date)

        webhookDashboard.append(div)
        div.scrollIntoView()
    }
}
readMessages()
