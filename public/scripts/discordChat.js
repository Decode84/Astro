const socket = new WebSocket('ws://localhost:4000/');
socket.addEventListener('error', function (event) {
    // TODO: remove chat because its not linked properly
    console.log('WebSocket error: ', event);
});
let input = document.getElementById("input");
input.focus(); // Set keyboard focus

socket.onmessage = function (event) {
    //TODO: Make this look nicer and more discordy
    let div = document.createElement("div")
    const message = JSON.parse(event.data)
    div.append(message.username + ": " + message.message)
    input.before(div)
    input.scrollIntoView()
}
// Post the user's messages to the server using fetch
input.addEventListener("change", () => { // When the user strikes enter
    socket.send(input.value);
    input.value = ""; // Clear the input
});
