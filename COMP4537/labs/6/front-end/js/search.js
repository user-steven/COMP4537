const SERVER_URL = "";
// 1. GET: retrieve the definition of a word from the database
const SERVER_URL_POST_DEFINITION = SERVER_URL + "/api/v1/definition";
const GET = "GET";

// Document elements
const FORM_SEARCH = document.getElementById('form_search_word');
const INPUT_WORD = document.getElementById('input_search');
const STATUS_MSG = document.getElementById('status_msg');

// Constants
const EMPTY_STRING = "";

// Status messages
const GOOD_STATUS_MSG_COLOR = "green";
const BAD_STATUS_MSG_COLOR = "red";
const BAD_WORD_MSG = "Please enter a valid word.";
const ERROR = "Error: ";

const xhttp = new XMLHttpRequest();

function search() {
    const word = INPUT_WORD.value;

    if (word === EMPTY_STRING || /\d/.test(word)) {
        // Invalid word
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerText = BAD_WORD_MSG;
    } else {
        xhttp.open(GET, SERVER_URL_POST_DEFINITION + '/' + word, true);

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(xhttp.response);

                STATUS_MSG.style.color = GOOD_STATUS_MSG_COLOR;
                STATUS_MSG.value = response.msg;

            } else if (this.readyState == 4 && this.status != 200) {
                const response = JSON.parse(xhttp.response);

                STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
                STATUS_MSG.value = response.msg;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    FORM_SEARCH.addEventListener('submit', function(event) {
        event.preventDefault();
        search();
    });
});