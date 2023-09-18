import { updateTime, createNote, renderWriter, intervalUpdateNotes} from "./notes.js";

// Set key to JSON object in localstorage
const key = "notes";

// HTML Element IDs
const writerContainer = "writer-container"
const timeContainer = "update-time"
const backButton = "back-button"
const writeAddButton = "writer-add-button"

/**
 * Initializes page renders for writer.html
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Document is ready.');

    // Set back button to return to index.html
    document.getElementById(backButton).addEventListener("click", function () {
        window.location.href = "index.html";
    })

    updateTime(timeContainer);

    document.getElementById(writeAddButton).addEventListener("click", () => {
        createNote(key, writerContainer);
    });

    renderWriter(key, writerContainer);

    setInterval(function () {
        intervalUpdateNotes(key);
        updateTime(timeContainer);
    }, 2000);
});
