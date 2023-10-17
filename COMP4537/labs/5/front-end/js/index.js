const textareaWord = document.getElementById("textarea_word");
const responseMsg = document.getElementById('div_response');
const queryButton = document.getElementById('button_query');
const postButton = document.getElementById('button_post');

const xhttp = new XMLHttpRequest();
const url = "https://stevenctemp.com/COMP4537/labs/5/api/"

const data = `INSERT INTO Patients (name, dateOfBirth) VALUES
    ("Sara Brown", "1901-01-01"),
    ("John Smith", "1941-01-01"),
    ("Jack Ma", "1961-01-30"),
    ("Elon Musk", "1999-01-01");`;

postButton.addEventListener("click", () => {
    response = makeHttpReq("POST", data, "");
    responseMsg.innerText = 'Posting..'
    responseMsg.style.color = 'green';
});

queryButton.addEventListener("click", () => {

    if (textareaWord.value === ""){
        responseMsg.style.color = 'red';
        responseMsg.innerText = "Please enter a query.";
    } else {
        let tokens = textareaWord.value.split(' ');
        let response;
        if (isValidParam(tokens)){
            if (tokens[0] == "SELECT") {
                response = makeHttpReq("GET", null, textareaWord.value);
            } else if (tokens[0] == "INSERT") {
                makeHttpReq("POST", textareaWord.value, "");
            }
        } else {
            responseMsg.style.color = 'red';
            responseMsg.innerText = "Please enter a valid query.";
        }
        
    }
});

function makeHttpReq(method, body, param){
    let formatted = formatURL(param);
    console.log(`method: ${method}, \nbody:${body} \n${param}`);
    if (param === ""){
        xhttp.open(method, url, true);
    } else {
        console.log(url + formatted);
        xhttp.open(method, url + formatted, true);
    }
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4){
            responseMsg.innerText = xhttp.response;
            responseMsg.style.color = 'green';
            return this.response;
        }
    }
    if (body !== null){
        xhttp.send(body);
    } else {
        xhttp.send();
    }
}

function isValidParam(query){
    if (query.length < 4) {
        return false;
    } else if (query[0] != "SELECT" && query[0] != "INSERT"){
        return false;
    } else {
        return true;
    }
}

function formatURL(param){
    return encodeURIComponent("\"" +param + "\"");
}