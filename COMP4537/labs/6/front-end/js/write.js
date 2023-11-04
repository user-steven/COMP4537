import {
    GOOD_STATUS_MSG_COLOR,
    BAD_STATUS_MSG_COLOR,
    BAD_WORD_MSG,
    BAD_DEFINITION_MSG,
    WORD_EXISTS_PROMPT,
    SUCCESS_MESSAGE,
    FAILURE_MESSAGE,
    FORMAT_PARAMS
} from "./common_strings.js";

const SERVER_URL = "https://nandynano.com/COMP4537/labs/6";
// 1. GET: For populating the dropdowns.
const SERVER_URL_GET_LANGUAGES = SERVER_URL + "/api/v1/languages";
// 1. GET: retrieve the definition of a word from the database
// 2. POST: creating a new dictionary entry
// 3. PATCH: update definition of existing word
const SERVER_URL_POST_DEFINITION = SERVER_URL + "/api/v1/definition";

// AJAX
const GET = "GET";
const POST = "POST";
const PATCH = "PATCH";
const DELETE = "DELETE";
const xhttp = new XMLHttpRequest();

// Document elements
const INPUT_WORD_LANGUAGE = document.getElementById('input_word_language');
const INPUT_DEFINITION_LANGUAGE = document.getElementById('input_definition_language');
const INPUT_WORD = document.getElementById('input_word');
const INPUT_DEFINiTION = document.getElementById('input_definition');
const INPUT_DELETE = document.getElementById('input_delete');
const FORM_DELETE = document.getElementById('form_delete_word');
const FORM_ADD = document.getElementById('form_add_word');
const STATUS_MSG = document.getElementById('status_msg');

// Constants
const ENGLISH = "English";
const ENGLISH_VALUE = "en"
const EMPTY_STRING = "";
const KEY_DEFINITION_LANGUAGE = "definition_language";
const KEY_WORD_LANGUAGE = "word_language";
const KEY_WORD = "word";
const KEY_DEFINITION = "definition";
const KEY_TOTAL = "total";
const KEY_ERROR = "error";
const KEY_MSG = "message";
const KEY_ENTRY = "entry";

function populateDropdown() {
    xhttp.open(GET, SERVER_URL_GET_LANGUAGES, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const languages = JSON.parse(xhttp.response).languages;

            languages.forEach(item => {
                const word_option = document.createElement('option');
                word_option.value = item.code;
                word_option.text = item.name;
                const definition_option = document.createElement('option');
                definition_option.value = item.code;
                definition_option.text = item.name;

                INPUT_WORD_LANGUAGE.appendChild(word_option);
                INPUT_DEFINITION_LANGUAGE.appendChild(definition_option);
            });

        } else if (this.readyState == 4 && this.status != 200) {
            // If languages are not received, fallback to English.
            const word_option = document.createElement('option');
            word_option.value = ENGLISH_VALUE;
            word_option.text = ENGLISH;

            const definition_option = document.createElement('option');
            definition_option.value = ENGLISH_VALUE;
            definition_option.text = ENGLISH;

            INPUT_WORD_LANGUAGE.appendChild(word_option);
            INPUT_DEFINITION_LANGUAGE.appendChild(definition_option);
            console.log(ERROR, this.status);
        }
    };
    xhttp.send();
}

async function wordExists(word) {
    return new Promise((resolve) => {
      xhttp.open(GET, SERVER_URL_POST_DEFINITION + '/' + encodeURIComponent(word), true);
  
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          resolve(this.status === 200 ? true : false);
        }
      };
  
      xhttp.send();
    });
  }
  
  
function deleteDefinition() {
    const word = INPUT_DELETE.value;

    if (word === EMPTY_STRING || /\d/.test(word)) {
        // Invalid word
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerHTML = BAD_WORD_MSG;
    } else {
        xhttp.open(DELETE, SERVER_URL_POST_DEFINITION + '/' + encodeURIComponent(word), true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.response);

                STATUS_MSG.style.color = GOOD_STATUS_MSG_COLOR;
                STATUS_MSG.innerHTML = SUCCESS_MESSAGE(
                    response[KEY_MSG], 
                    response[KEY_ENTRY][KEY_WORD], 
                    response[KEY_ENTRY][KEY_DEFINITION], 
                    response[KEY_ENTRY][KEY_WORD_LANGUAGE], 
                    response[KEY_ENTRY][KEY_DEFINITION_LANGUAGE], 
                    response[KEY_TOTAL], 
                    this.status);
                    
            } else if (this.readyState == 4 && this.status != 200) {
                const response = JSON.parse(this.response);

                STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
                STATUS_MSG.innerHTML = FAILURE_MESSAGE(
                    response[KEY_ERROR], 
                    response[KEY_MSG], 
                    this.status);
            }
        }
        xhttp.send(JSON.stringify({ [KEY_WORD] : word }));
    }
}

function postDefinition(params) {
    xhttp.open(POST, SERVER_URL_POST_DEFINITION + '/' + encodeURIComponent(params.word), true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            const response = JSON.parse(this.response);

            STATUS_MSG.style.color = GOOD_STATUS_MSG_COLOR;
            STATUS_MSG.innerHTML = SUCCESS_MESSAGE(
                response[KEY_MSG], 
                response[KEY_ENTRY][KEY_WORD], 
                response[KEY_ENTRY][KEY_DEFINITION], 
                response[KEY_ENTRY][KEY_WORD_LANGUAGE], 
                response[KEY_ENTRY][KEY_DEFINITION_LANGUAGE], 
                response[KEY_TOTAL], 
                this.status);
        
        } else if (this.readyState == 4 && this.status != 201) {
            const response = JSON.parse(this.response);

            STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
            STATUS_MSG.innerHTML = FAILURE_MESSAGE(
                response[KEY_ERROR], 
                response[KEY_MSG], 
                this.status);
        }
    }

    xhttp.send(JSON.stringify(params));
}

function patchDefinition(params) {
    xhttp.open(PATCH, SERVER_URL_POST_DEFINITION + '/' + encodeURIComponent(params.word), true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);

            STATUS_MSG.style.color = GOOD_STATUS_MSG_COLOR;
            STATUS_MSG.innerHTML = SUCCESS_MESSAGE(
                response[KEY_MSG], 
                response[KEY_ENTRY][KEY_WORD], 
                response[KEY_ENTRY][KEY_DEFINITION], 
                response[KEY_ENTRY][KEY_WORD_LANGUAGE], 
                response[KEY_ENTRY][KEY_DEFINITION_LANGUAGE], 
                response[KEY_TOTAL], 
                this.status);

        } else if (this.readyState == 4 && this.status != 200) {
            const response = JSON.parse(this.response);

            STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
            STATUS_MSG.innerHTML = FAILURE_MESSAGE(
                response[KEY_ERROR], 
                response[KEY_MSG], 
                this.status);
        }
    }

    xhttp.send(JSON.stringify(params));
}

async function addNewDefinition() {
    const word = INPUT_WORD.value;
    const word_language = INPUT_WORD_LANGUAGE.value;
    const definition = INPUT_DEFINiTION.value;
    const definition_language = INPUT_DEFINITION_LANGUAGE.value;

    if (word === EMPTY_STRING || /\d/.test(word)) {
        // Invalid word
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerHTML = BAD_WORD_MSG;
    } else if (definition === EMPTY_STRING || /\d/.test(definition)) {
        // Invalid definition
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerHTML = BAD_DEFINITION_MSG;
    } else {
        // If work exists, prompt user if they want to update entry.
        const params = FORMAT_PARAMS(word_language, word, definition_language, definition);
        if (await wordExists(word)) {
            const user_response = window.confirm(WORD_EXISTS_PROMPT);
            if (user_response) { 
                patchDefinition(params);
            }
        } else {
            postDefinition(params);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    FORM_ADD.addEventListener('submit', function(event) {
        event.preventDefault();
        addNewDefinition();
    });
    FORM_DELETE.addEventListener('submit', function(event) {
        event.preventDefault();
        deleteDefinition();
    });
});
