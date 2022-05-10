try { // Primarily only for the first line in case WSS is not running
    const socket = new WebSocket('ws://localhost:4000/' + window.location.pathname)
    const input = document.getElementById('input')
    input.focus() // move cursor

    // Receive message
    socket.onmessage = function (event) {
        // TODO: Make this look nicer and more discordy
        const div = document.createElement('div')
        const message = JSON.parse(event.data)
        // message.discord: Boolean - true if it's discord, false if other WS
        div.append(message.username + ': ' + message.message)
        input.before(div)
        input.scrollIntoView()
    }
    // Send message
    input.addEventListener('change', () => {
        socket.send(input.value)
        input.value = ''
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
