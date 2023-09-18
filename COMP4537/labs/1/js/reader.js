import { updateTime, renderReader } from "./notes.js";

// Set key to JSON object in localstorage
const key = "notes";

// HTML Element IDs
const backButton = "back-button"
const timeContainer = "update-time"
const readerContainer = "reader-container"

/**
 * Initializes page renders for reader.html
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Document is ready.');

    // Set back button to return to index.html
    document.getElementById(backButton).addEventListener("click", function () {
        window.location.href = "index.html";
    })

    updateTime(timeContainer);

    renderReader(key, readerContainer);

    setInterval(function () {
        renderReader(key, readerContainer);
        updateTime(timeContainer);
    }, 2000);

});
