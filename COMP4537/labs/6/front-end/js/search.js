import { 
    GOOD_STATUS_MSG_COLOR, 
    BAD_STATUS_MSG_COLOR, 
    BAD_WORD_MSG, 
    FORMAT_SERVER_RESPONSE
} from "./common_strings.js";

const SERVER_URL = "https://nandynano.com/COMP4537/labs/6";
// 1. GET: retrieve the definition of a word from the database
const SERVER_URL_POST_DEFINITION = SERVER_URL + "/api/v1/definition";
const GET = "GET";

// Document elements
const FORM_SEARCH = document.getElementById('form_search_word');
const INPUT_SEARCH = document.getElementById('input_search');
const STATUS_MSG = document.getElementById('status_msg');

// Constants
const EMPTY_STRING = "";
const KEY_DEFINITION_LANGUAGE = "definition_language";
const KEY_WORD_LANGUAGE = "word_language";
const KEY_WORD = "word";
const KEY_DEFINITION = "definition";
const KEY_TOTAL = "total";
const KEY_ERROR = "error";
const KEY_MSG = "message";
const KEY_ENTRY = "entry";

const xhttp = new XMLHttpRequest();

function search() {
    const word = INPUT_SEARCH.value;

    if (word === EMPTY_STRING || /\d/.test(word)) {
        // Invalid word
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerText = BAD_WORD_MSG;
    } else {
        xhttp.open(GET, SERVER_URL_POST_DEFINITION + '/' + encodeURIComponent(word), true);

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.response);
                STATUS_MSG.style.color = GOOD_STATUS_MSG_COLOR;
                STATUS_MSG.innerHTML = FORMAT_SERVER_RESPONSE({
                    message : response[KEY_MSG], 
                    definition : response[KEY_ENTRY][0][KEY_DEFINITION], 
                    word_language : response[KEY_ENTRY][0][KEY_WORD_LANGUAGE], 
                    definition_language : response[KEY_ENTRY][0][KEY_DEFINITION_LANGUAGE], 
                    total : response[KEY_TOTAL], 
                    status_code : this.status,
                    entry : JSON.stringify(response[KEY_ENTRY])
                });

            } else if (this.readyState == 4 && this.status != 200) {
                const response = JSON.parse(this.response);
                STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
                STATUS_MSG.innerHTML = FORMAT_SERVER_RESPONSE({
                    error : response[KEY_ERROR], 
                    message : response[KEY_MSG], 
                    status_code : this.status,
                    word: response[KEY_ENTRY][KEY_WORD],
                    total : response[KEY_TOTAL],
                    entry : JSON.stringify(response[KEY_ENTRY])
                });
            }
        }
        xhttp.send();
    }

}

document.addEventListener("DOMContentLoaded", () => {
    FORM_SEARCH.addEventListener('submit', function(event) {
        event.preventDefault();
        search();
    });
});