async function main() {
    let boards = await getBoards();
    displayBoards(boards);
}

async function getBoards() {
    let url = document.location.origin + '/api/trello/boards' + document.location.search;
    let response = await fetch(url);
    if (response.status === 200) {
        let text = await response.text();
        if (text === 'null') {
            return null;
        }
        let json = JSON.parse(text);
        return json;
    }
    else {
        return null;
    }
}

async function displayBoards(boards) {

    if (boards === null) {
        let option = document.getElementById('select-option');
        option.text = 'No Boards Found';
    }
    else {
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
    inputProjectId = document.getElementById('projectIdInput');
    inputProjectId.value = new URL(document.location.href).searchParams.get('projectId');

}
main();