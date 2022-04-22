// Take care of some UI details
let nick = prompt("Enter your nickname"); // Get user's nickname
let input = document.getElementById("input"); // Find the input field
input.focus(); // Set keyboard focus
// Register for notification of new messages using EventSource

let chatSocket = new WebSocket('ws://localhost:8080');

chatSocket.onmessage = function (event) {
    let div = document.createElement("div"); // Create a <div>
    div.append(event.data); // Add text from the message
    input.before(div); // And add div before input
    input.scrollIntoView(); // Ensure input elt is visible
    console.log(event.data);
}

// Post the user's messages to the server using fetch
input.addEventListener("change", () => { // When the user strikes return
    chatSocket.send(nick + ":" + input.value);
    console.log("message sent: " + input.value);
    input.value = ""; // Clear the input
});
