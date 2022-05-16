try { // Primarily only for the first line in case WSS is not running
    const socket = new WebSocket('ws://' + window.location.host + window.location.pathname)
    const messageContainer = document.getElementById('message-container')
    const input = document.getElementById('input')
    input.focus() // move cursor

    // Receive message
    socket.onmessage = function (event) {
        const div = document.createElement('div')
        const user = document.createElement('p')
        const content = document.createElement('p')
        const message = JSON.parse(event.data)

        div.append(user)
        div.append(content)

        div.setAttribute('class', 'flex w-full flex-row')
        user.setAttribute('class', 'text-right w-24 font-semibold text-sm p-1 truncate ...')
        user.setAttribute('style', '')
        content.setAttribute('class', 'flex flex-1 text-sm break-word p-1')

        user.innerText = message.username + ': '
        console.log(event)
        content.innerText = message.message

        messageContainer.append(div)
        div.scrollIntoView()
    }

    // Send message
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            socket.send(input.value)
            input.value = ''
        }
    })
    socket.onclose = (event) => {
        // TODO: remove chat if its not linked properly
        switch (event.code) {
        case 401:
            // No session
            break
        case 1000:
            // no problems
            break
        default:
            // other errors
            break
        }
    }
} catch (e) {
    console.log(e)
}
