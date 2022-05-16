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
 * @function trelloMenu
 * @description Main function
 */
async function trelloMenu () {
    const boards = await getTrelloBoards()
    displayTrelloBoardsLink(boards)
    displayTrelloBoards(boards)

    const selectBoard = document.getElementById('list-board-select')

    // Add event listener that executes when the user changes the selected board
    selectBoard.addEventListener('change', async function () {
        // Display a loading message while the lists are being fetched
        const selectList = document.getElementById('listBtns')

        selectList.innerHTML = ''
        const option = document.createElement('option')
        option.text = 'Loading...'

        // Get the lists in the selected board
        const url = document.location.origin + '/api/trello/lists/' + document.location.href.split('/').pop() + '?boardId=' + selectBoard.value
        const response = await fetch(url, {
            method: 'GET'
        })
        if (response.status === 200) {
            const text = await response.text()
            if (text === 'null') {
                return null
            }
            const json = JSON.parse(text)
            displayTrelloLists(json)
        } else {
            return null
        }
    })
}

/**
 * @function getTrelloBoards
 * @description Get all boards from the web server
 * @returns {Promise<Array<Object>>} The boards in an array of objects
 */
async function getTrelloBoards () {
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
    } else {
        return null                                  // Return null if the response is not 200
    }
}

/**
 * @function getTrelloCards
 * @description Get all cards from the web server
 * @returns {Promise<Array<Object>>} The cards in an array of objects
 */
async function getTrelloCards (listId) {
    // Compose the url
    const url = document.location.origin + '/api/trello/cards/' + document.location.href.split('/').pop() + '?listId=' + listId
    const response = await fetch(url)                  // Send the request and await for the response
    if (response.status === 200) {
        const text = await response.text()
        if (text === 'null') {
            return null
        }
        const json = JSON.parse(text)
        return json                                  // Return the cards if the response is 200
    } else {
        return null                                  // Return null if the response is not 200
    }
}

/**
 * @function displayTrelloBoardsLink
 * @description Display the boards in the HTML
 * @param {Array<Object>} boards
 */
async function displayTrelloBoardsLink (boards) {
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
            board.setAttribute('class', 'mx-1 my-1 rounded-md text-white text-center p-4 w-3/12 cursor-pointer bg-blue-700 hover:bg-blue-500')
            board.setAttribute('href', boards[i].url)
            board.setAttribute('target', '_blank')
            boardSection.append(board)
        }
    }
    const inputProjectId = document.getElementById('projectIdInput')
    inputProjectId.value = new URL(document.location.href).searchParams.get('projectId')
}

/**
 * @function displayTrelloBoards
 * @description Display the boards in the HTML
 * @param {Array<Object>} boards
 */
async function displayTrelloBoards (boards) {
    // If there are no list, display a message
    if (boards === null) {
        const option = document.getElementById('list-select-option')
        option.text = 'No Boards Found'
    } else { // Otherwise, display the boards in a select element
        // Get select element
        const select = document.getElementById('list-board-select')
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

/**
 * @function displayLists
 * @description Display the lists in the HTML
 * @param {Array<Object>} lists
 */
async function displayTrelloLists (lists) {
    const listSection = document.getElementById('listBtns')
    for (let i = 0; i < lists.length; i++) {
        const listBtn = document.createElement('button')
        listBtn.innerHTML = lists[i].name
        listBtn.setAttribute('class', 'mx-auto my-1 rounded-md text-white px-12 py-2 bg-blue-700 hover:bg-blue-500 cursor-pointer focus:bg-blue-500')
        listSection.append(listBtn)
        listBtn.addEventListener('click', async function () {
            const cards = await getTrelloCards(lists[i].id)
            displayTrelloListCards(cards)
        })
    }
}

/**
 * @function showListCards
 * @description Show the cards in the selected list
 * @param {Array<Object} cards
 */
async function displayTrelloListCards (cards) {
    const cardList = document.getElementById('card-list')
    const noCards = document.getElementById('noCards')
    const listCard = document.querySelectorAll('.list-card')

    if (cards.length === 0) {
        if (noCards.innerHTML === '') {
            listCard.forEach((card) => {
                card.remove()
            })
            noCards.style.display = 'block'
            noCards.innerHTML = 'No cards found'
        }
    } else {
        listCard.forEach((card) => {
            card.remove()
        })
        for (let i = 0; i < cards.length; i++) {
            const card = document.createElement('a')
            const cardName = document.createElement('h4')
            const cardDesc = document.createElement('p')
            const hr = document.createElement('hr')

            card.setAttribute('class', 'list-card block rounded-md my-1 mx-auto p-2 w-5/12 bg-gray-100 hover:bg-gray-300 cursor-pointer')
            card.setAttribute('href', cards[i].url)
            card.setAttribute('target', '_blank')

            cardName.innerHTML = cards[i].name
            cardName.setAttribute('class', 'text-xl')

            cardDesc.innerHTML = 'Description: <br>' + cards[i].desc
            // cardDesc.setAttribute('class', 'text-white')

            noCards.innerHTML = ''

            card.append(cardName, hr, cardDesc)
            cardList.append(card)
        }
    }
}

trelloMenu()
