const SERVER_URL = "";
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
const xhttp = new XMLHttpRequest();

// Document elements
const INPUT_WORD_LANGUAGE = document.getElementById('input_word_language');
const INPUT_DEFINITION_LANGUAGE = document.getElementById('input_definition_language');
const INPUT_WORD = document.getElementById('input_word');
const INPUT_DEFINiTION = document.getElementById('input_definition');
const BUTTON_SUBMIT = document.getElementById('button_add');
const STATUS_MSG = document.getElementById('status_msg');

// Constants
const ENGLISH = "English";
const ENGLISH_VALUE = "en"
const WORD_LANGUAGE_DROPDOWN_OPTION = "Word Language";
const DEFINITION_LANGUAGE_DROPDOWN_OPTION = "Definition Language";
const EMPTY_STRING = "";

// Status messages
const GOOD_STATUS_MSG_COLOR = "green";
const BAD_STATUS_MSG_COLOR = "red";
const BAD_WORD_MSG = "Please enter a valid word.";
const BAD_DEFINITION_MSG = "Please enter a valid definition.";
const GOOD_SERVER_RESPONSE = "Successful, server response: ";
const BAD_SERVER_RESPONSE = "Something went wrong, status code: ";
const BAD_WORD_LANGUAGE_MSG = "Please select a word language.";
const BAD_DEFINITION_LANGUAGE_MSG = "Please select a definition language.";
const ERROR = "Error: ";

// Prompt messages
const WORD_EXISTS_PROMPT = "Word exists, do you want to update?";

// Format params
function formatParams(word_language, word, definition_language, definition) {
    return {
        "word": word,
        "definition": definition,
        "word-language": word_language,
        "definition-language": definition_language
    }
}

function populateDropdown() {
    xhttp.open(GET, SERVER_URL_GET_LANGUAGES, true);

    INPUT_WORD_LANGUAGE.innerHTML = '<option>' + WORD_LANGUAGE_DROPDOWN_OPTION + '</option>';
    INPUT_DEFINITION_LANGUAGE.innerHTML = '<option>' + DEFINITION_LANGUAGE_DROPDOWN_OPTION + '</option>';

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

function wordExists(word) {
    xhttp.open(GET, SERVER_URL_POST_DEFINITION + "/" + word, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            return true;
        } else {
            return false;
        }
    }
    xhttp.send();
}

function postDefinition(params) {
    xhttp.open(POST, SERVER_URL_POST_DEFINITION, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);

            STATUS_MSG.style.color = GOOD_STATUS_MSG_COLOR;
            STATUS_MSG.innerText = GOOD_SERVER_RESPONSE + JSON.stringify(response.json);
        } else if (this.readyState == 4 && this.status != 200) {
            const response = JSON.parse(this.response);

            STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
            STATUS_MSG.innerText = BAD_SERVER_RESPONSE + this.status + "\n" + response;
        }
    }

    xhttp.send(JSON.stringify(params));
}

function patchDefinition(params) {
    xhttp.open(PATCH, SERVER_URL_POST_DEFINITION + params.word, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);

            STATUS_MSG.style.color = GOOD_STATUS_MSG_COLOR;
            STATUS_MSG.innerText = GOOD_SERVER_RESPONSE + JSON.stringify(response.json);
        } else if (this.readyState == 4 && this.status != 200) {
            const response = JSON.parse(this.response);

            STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
            STATUS_MSG.innerText = BAD_SERVER_RESPONSE + this.status + "\n" + response;
        }
    }

    xhttp.send(JSON.stringify(params));
}

function addNewDefinition() {
    const word = INPUT_WORD.value;
    const word_language = INPUT_WORD_LANGUAGE.value;
    const definition = INPUT_DEFINiTION.value;
    const definition_language = INPUT_DEFINITION_LANGUAGE.value;

    if (word === EMPTY_STRING || /\d/.test(word)) {
        // Invalid word
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerText = BAD_WORD_MSG;
    } else if (definition === EMPTY_STRING || /\d/.test(definition)) {
        // Invalid definition
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerText = BAD_DEFINITION_MSG;
    } else if (word_language === WORD_LANGUAGE_DROPDOWN_OPTION) {
        // Invalid word language
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerText = BAD_WORD_LANGUAGE_MSG;
    } else if (definition_language === DEFINITION_LANGUAGE_DROPDOWN_OPTION) {
        // Invalid definition language
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerText = BAD_DEFINITION_LANGUAGE_MSG;
    }
    else {
        // If work exists, prompt user if they want to update entry.
        const params = formatParams(word_language, word, definition_language, definition);

        if (wordExists(word)) {
            const user_response = window.confirm(WORD_EXISTS_PROMPT);
            if (user_response) { patchDefinition(params); }
        } else {
            postDefinition(params);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    BUTTON_SUBMIT.addEventListener('click', addNewDefinition);
});
