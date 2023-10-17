const textareaWord = document.getElementById("textarea_word");
const textareaDef = document.getElementById("textarea_def");
const statusMsg = document.getElementById('status_msg');
const addButton = document.getElementById('button_add')
const xhttp = new XMLHttpRequest();
const url = "https://stevenctemp.com/COMP4537/labs/4/api/definitions/"

addButton.addEventListener("click", () => {

    if (textareaWord.value === "" || /\d/.test(textareaWord.value)){
        statusMsg.style.color = 'red';
        statusMsg.innerText = "Please enter a valid word.";
    } else if (textareaDef.value === "" || /\d/.test(textareaDef.value)) {
        statusMsg.style.color = 'red';
        statusMsg.innerText = "Please enter a valid definition.";
    } else {
        
        const params = "?word=" + textareaWord.value + "&definition=" + textareaDef.value;
        xhttp.open("POST", url, true);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                statusMsg.style.color = 'green';
                statusMsg.innerText = "Successful, server response: " + JSON.parse(xhttp.response).msg;
            } else if (xhttp.readyState == 4 && xhttp.status != 200){
                statusMsg.style.color = 'red';
                statusMsg.innerText = "Something went wrong, status code: " + xhttp.status + "\n" + JSON.parse(xhttp.response).msg;
            }
        }
        xhttp.send(params);
    }
});

function formatURL(line){
    console.log(url + line.replace(" ", "%20"));
    return line.replace(" ", "%20");
}