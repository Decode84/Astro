async function main() {
    let boards = await getBoards();
    //displayBoards(boards);
}

async function getBoards() {
    let url = document.location.origin + '/api/trello/boards' + document.location.search;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
        let boards;
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            boards = JSON.parse(xhr.responseText);
            return boards;
        }
        else {
            boards = null;
            return boards;
        }
        /*
        let json = await response.json();
    
        let boardArray = [];
        for (let i = 0; i < json.length; i++) {
            boardArray.push({
                id: json[i].id,
                name: json[i].name,
            });
        }
        return boardArray;
        */
    }
}

async function displayBoards(boards) {

    if (boards === null) {
        let option = document.getElementById('select-option');
        option.text = 'No Boards Found';
    }
    // Get select element
    let select = document.getElementById('board-select');
    // Add options
    for (let i = 0; i < boards.length; i++) {
        let option = document.createElement('option');
        option.value = boards[i].id;
        option.text = boards[i].name;
        select.add(option);
    }
}

main();