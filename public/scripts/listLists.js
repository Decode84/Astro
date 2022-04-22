async function main() {
    let select_board = document.getElementById("board-select");


    select_board.addEventListener("change", async function () {
        // Display a loading message while the lists are being fetched
        let select_list = document.getElementById("list-select");

        select_list.innerHTML = "";
        let option = document.createElement("option");
        option.text = "Loading...";

        // Get the lists in the selected board
        let url = document.location.origin + '/api/trello/lists' + document.location.search + '&boardId=' + select_board.value;
        let response = await fetch(url, {
            method: 'GET',
            });
        if (response.status === 200) {
            let text = await response.text();
            if (text === 'null') {
                return null;
            }
            let json = JSON.parse(text);
            displayLists(json);
        }
        else {
            return null;
        }
    });
}

async function displayLists(lists) {
    let select_list = document.getElementById("list-select");
    select_list.innerHTML = "";
    let option = document.createElement("option");
    option.text = "Select a list";
    select_list.add(option);
    for (let i = 0; i < lists.length; i++) {
        let option = document.createElement("option");
        option.value = lists[i].id;
        option.text = lists[i].name;
        select_list.add(option);
    }
}

main();