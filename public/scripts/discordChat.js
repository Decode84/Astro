try { // Primarily only for the first line in case WSS is not running
    const socket = new WebSocket('ws://localhost:4000' + window.location.pathname)
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

        div.classList.add('flex')
        user.classList.add('text-blue-500', 'font-semibold', 'text-sm', 'p-1')
        content.classList.add('text-black', 'text-left', 'text-sm', 'p-1', 'leading-relaxed')

        user.innerText = message.username + ': '
        content.innerText = message.message

        input.before(div)
        input.scrollIntoView()
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
