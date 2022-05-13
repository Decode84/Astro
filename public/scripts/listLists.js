/**
 * @function main
 * @description Main function
 */
async function main () {
    const selectBoard = document.getElementById('board-select')

    // Add event listener that executes when the user changes the selected board
    selectBoard.addEventListener('change', async function () {
        // Display a loading message while the lists are being fetched
        const selectList = document.getElementById('list-select')

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
            displayLists(json)
        } else {
            return null
        }
    })
}

/**
 * @function displayLists
 * @description Display the lists in the HTML
 * @param {Array<Object>} lists
 */
async function displayLists (lists) {
    const selectList = document.getElementById('list-select')
    selectList.innerHTML = ''
    const option = document.createElement('option')
    option.text = 'Select a list'
    selectList.add(option)
    for (let i = 0; i < lists.length; i++) {
        const option = document.createElement('option')
        option.value = lists[i].id
        option.text = lists[i].name
        selectList.add(option)
    }
}

main()
