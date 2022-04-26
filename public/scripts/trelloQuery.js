/**
 * @function main
 * @description A simple function that converts hash to query string
 */
function main() {
    let hash;

    // Get the hash from the url
    if(window.location.hash)
    {
        hash = window.location.hash.substring(1);
        console.log(window.location);
    }
    else
    {
        hash = "token=none";
    }

    // Redirect to a new page
    window.location = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + hash;

}

main();