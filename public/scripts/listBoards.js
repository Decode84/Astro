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
    const response = await fetch(url)                 // Send the request and await for the response
    if (response.status === 200) {
        const text = await response.text()
        if (text === '') {
            return null
        }
        const json = JSON.parse(text)
        return json                                 // Return the boards if the response is 200
    }
    else {
        return null                                 // Return null if the response is not 200
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
        const option = document.getElementById('select-option')
        option.text = 'No Boards Found'
    } else { // Otherwise, display the boards in a select element
        // Get select element
        const select = document.getElementById('board-select')
        // Add options
        for (let i = 0; i < boards.length; i++) {
            const option = document.createElement('option')
            option.value = boards[i].id
            option.text = boards[i].name
            select.add(option)
        }
    }

    const inputProjectId = document.getElementById('projectIdInput')
    inputProjectId.value = new URL(document.location.href).searchParams.get('projectId')
}
main()
