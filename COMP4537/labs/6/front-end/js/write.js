const SERVER_URL = "";
// 1. GET: For populating the dropdowns.
const GET_LANGUAGES_URL = SERVER_URL + "/api/v1/languages";
// 1. GET: retrieve the definition of a word from the database
// 2. POST: creating a new dictionary entry
// 3. PATCH: update definition of existing word
const POST_DEFINITION_URL = SERVER_URL + "/api/v1/definition"; 

// Document elements
const INPUT_WORD_LANGUAGE = document.getElementById('input_word_language');
const INPUT_DEFINITION_LANGUAGE = document.getElementById('input_definition_language');
const INPUT_WORD = document.getElementById('input_word');
const INPUT_DEFINTION = document.getElementById('input_definition');
const BUTTON_SUBMIT = document.getElementById('button_add');
const STATUS_MSG = document.getElementById('status_msg');

// Status message
const GOOD_STATUS_MSG_COLOR = "green";
const BAD_STATUS_MSG_COLOR = "red";
const BAD_WORD_MSG = "Please enter a valid word.";
const BAD_DEFINITION_MSG = "Please enter a valid definition.";
const GOOD_SERVER_RESPONSE = "Successful, server response: ";
const BAD_SERVER_RESPONSE = "Something went wrong, status code: ";

function populateDropdown() {
    fetch(SERVER_URL + '/api/v1/languages')
        .then(response => response.json())
        .then(data => {
            INPUT_WORD_LANGUAGE.innerHTML = '<option>Word Language</option>';
            INPUT_DEFINITION_LANGUAGE.innerHTML = '<option>Definition Language</option>';
            
            // Sample response
            // const data = [
            //     {'value': 'en', 'language': 'English'},
            //     {'value': 'es', 'language': 'Spanish'}
            // ];

            data.forEach(item => {
                const option_word = document.createElement('option');
                const option_definition = document.createElement('option');
        
                option_word.value = item.value;
                option_word.text = item.language;
        
                option_definition.value = item.value;
                option_definition.text = item.language;
        
                INPUT_WORD_LANGUAGE.appendChild(option_word);
                INPUT_DEFINITION_LANGUAGE.appendChild(option_definition);
            });
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
}

function postDefintion() {
    const word = INPUT_WORD.value;
    const word_language = INPUT_WORD_LANGUAGE.value;
    const definition = INPUT_DEFINTION.value;
    const definition_language = INPUT_DEFINITION_LANGUAGE.value;

    if (word === "" || /\d/.test(word)){
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerText = BAD_WORD_MSG;
    } else if (definition === "" || /\d/.test(definition)) {
        STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
        STATUS_MSG.innerText = BAD_DEFINITION_MSG;
    } else {
        const params = {
            "word": word,
            "definition": definition,
            "word-language": word_language,
            "definition-language": definition_language
        };

        fetch(POST_DEFINITION_URL, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            STATUS_MSG.style.color = GOOD_STATUS_MSG_COLOR;
            STATUS_MSG.innerText = GOOD_SERVER_RESPONSE + data.msg;
        })
        .catch(error => {
            STATUS_MSG.style.color = BAD_STATUS_MSG_COLOR;
            STATUS_MSG.innerText = BAD_SERVER_RESPONSE + error.status + "\n" + error.msg;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    BUTTON_SUBMIT.addEventListener('click', postDefintion);
});
