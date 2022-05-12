// Get the modals
const boardModal = document.getElementById('boardModal')
const cardModal = document.getElementById('cardModal')

// Get the buttons that opens the modal
const boardBtn = document.getElementById('boardBtn')
const cardBtn = document.getElementById('cardBtn')

// Get the button that closes the modal
const boardClose = document.getElementById('boardClose')
const cardClose = document.getElementById('cardClose')

boardModal.style.display = 'none'
cardModal.style.display = 'none'

// When the user clicks on the button, open the modal
boardBtn.addEventListener('click', () => {
    boardModal.style.display = 'block'
})
cardBtn.addEventListener('click', () => {
    cardModal.style.display = 'block'
})

boardClose.addEventListener('click', () => {
    boardModal.style.display = 'none'
})
cardClose.addEventListener('click', () => {
    cardModal.style.display = 'none'
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === boardModal) {
        boardModal.style.display = 'none'
    } else if (event.target === cardModal) {
        cardModal.style.display = 'none'
    }
}

/**
 * @function main
 * @description Main function
 */
async function main () {
    const boards = await getBoards()
    displayBoards(boards)
}

/**
 * @function getBoards
 * @description Get all boards from the web server
 * @returns {Promise<Array<Object>>} The boards in an array of objects
 */
async function getBoards () {
    // Compose the url
    const url = document.location.origin + '/api/trello/boards/' + document.location.href.split('/').pop()
    const response = await fetch(url)                  // Send the request and await for the response
    if (response.status === 200) {
        const text = await response.text()
        if (text === 'null') {
            return null
        }
        const json = JSON.parse(text)
        return json                                  // Return the boards if the response is 200
    }
    else {
        return null                                  // Return null if the response is not 200
    }
}

/**
 * @function displayBoards
 * @description Display the boards in the HTML
 * @param {Array<Object>} boards
 */
async function displayBoards (boards) {
    // If there are no boards, display a message
    if (boards === null) {
        const boardSection = document.getElementById('boardSection')
        boardSection.text = 'No Boards Found'
    } else { // Otherwise, display the boards in a select element
        // Add boards
        for (let i = 0; i < boards.length; i++) {
            const boardSection = document.getElementById('boardSection')
            const board = document.createElement('a')
            board.innerHTML = boards[i].name
            board.setAttribute('class', 'mx-1 my-1 rounded-md text-white px-6 py-4 w-3/12')
            board.setAttribute('style', 'background-color: var(--acc-color);')
            board.setAttribute('href', boards[i].url)
            boardSection.append(board)
        }
    }
    const inputProjectId = document.getElementById('projectIdInput')
    inputProjectId.value = new URL(document.location.href).searchParams.get('projectId')

    console.log(inputProjectId.value)
}
main()
