/**
 * Initializes page renders for reader.html and writer.html
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Document is ready.');

    // Set back button to return to index.html
    document.getElementById("back-button").addEventListener("click", function () {
        window.location.href = "index.html";
    })

    updateTime();

    // Set key to JSON object in localstorage
    const key = "notes";
    const bodyId = document.body.id;

    if (bodyId === 'writer') {
        document.getElementById("writer-add-button").addEventListener("click", () => {
            createNote(key);
        });

        renderWriter(key);

        setInterval(function () {
            intervalUpdateNotes(key);
            updateTime();
        }, 2000);
    } else if (bodyId == "reader") {
        renderReader(key);

        setInterval(function () {
            renderReader(key);
            updateTime();
        }, 2000);
    }
});

/**
 * A class that represents a Note object.
 */
class Note {
    // Constructor for creating a Note object
    // Parameters:
    //   key: Identifier for the group of notes
    //   id: Unique identifier for the individual note (default: current timestamp)
    //   value: The content of the note (default: empty string)
    constructor(key, id = new Date().getTime().toString(), value = "") {
        this.id = id;
        this.value = value;
        this.key = key;
    }

    // Method to remove a note from both the DOM and local storage
    remove() {
        // Remove note from DOM
        const noteContainer = document.getElementById(`${this.key}-${this.id}`);
        if (noteContainer) {
            noteContainer.remove();
        }

        // Remove note from localstorage
        const notesArr = getDataFromLocalStorage(this.key);
        const updatedNotesArr = notesArr.filter(note => note.id !== this.id);
        localStorage.setItem(this.key, JSON.stringify(updatedNotesArr));
    }

    // Method to create a note element for editing
    createWriterNoteElement() {
        // Create outer div, textarea and remove button
        const noteContainer = document.createElement("div");
        const textArea = document.createElement("textarea");
        const removeButton = document.createElement("button");

        // Set class names for textarea and remove button, and id for remove button
        noteContainer.className = "WriterTextbox";
        noteContainer.id = `${this.key}-${this.id}`;
        removeButton.className = "RemoveButton";

        // Set content of remove button
        removeButton.textContent = "Remove";

        // Set attributes to note textarea
        textArea.rows = 4;
        textArea.cols = 50;
        textArea.value = this.value;
        textArea.placeholder = `Textbox`;

        // Add textarea and remove button to outer div
        noteContainer.appendChild(textArea);
        noteContainer.appendChild(removeButton);

        // Add a click event listener to the remove button to delete the note
        removeButton.addEventListener("click", () => {
            this.remove();
        });

        return noteContainer;
    }

    // Method to create a note element for reading (non-editable)
    createReaderNoteElement() {
        const noteContainer = document.createElement("div");
        noteContainer.innerHTML = this.value;
        noteContainer.className = "ReaderTextbox";

        return noteContainer;
    }

}

/**
 * Creates a Note object and adds it to localstorage and appends writer element to DOM.
 * 
 * @param {string} key The identifier for the group of notes.
 */
function createNote(key) {
    const writerContainer = document.getElementById("writer-container");
    const note = new Note(key);
    pushNote(key, note);
    writerContainer.appendChild(note.createWriterNoteElement());
}

/**
 * Returns the current Object of Notes from local storage, else an empty array.
 * 
 * @param {string} key The identifier for the group of Notes.
 * @returns group of Notes
 */
function getDataFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * Updates the localstorage of group of Notes with values on screen.
 * 
 * @param {string} key The identifier for the group of Notes.
 */
function intervalUpdateNotes(key) {
    const notesArr = getDataFromLocalStorage(key);
    // Iterate through each onscreen note and if values differ from localstorage, update.
    notesArr.forEach((note) => {
        const noteContainer = document.getElementById(`${note.key}-${note.id}`);
        const textAreaElem = noteContainer.querySelector("textarea");
        const currNoteValue = textAreaElem.value;
        if (note.value !== currNoteValue) {
            note.value = currNoteValue;
        }
    });
    localStorage.setItem(key, JSON.stringify(notesArr));
}

/**
 * Pushed Note object to localstorage.
 * 
 * @param {string} key The identifier for group of Notes.
 * @param {Note} note Note object.
 */
function pushNote(key, note) {
    const notesArr = getDataFromLocalStorage(key);
    notesArr.push(note);
    localStorage.setItem(key, JSON.stringify(notesArr));
}

/**
 * Renders reader view.
 * 
 * @param {string} key The identifier for group of Notes.
 */
function renderReader(key) {
    // Empty current view of reader container
    const readerContainer = document.getElementById("reader-container");
    readerContainer.innerHTML = "";

    // Retrieve serialized object from localstorage and deserialize bac into note[]
    const notesArr = getDataFromLocalStorage(key);

    // Generate and append reader note element
    notesArr.forEach(note => {
        // Get note properties and recreate the Note object in order to use createWriterNoteElement().
        const noteObj = new Note(key, note.id, note.value);
        readerContainer.appendChild(noteObj.createReaderNoteElement());
    });
}

/**
 * Renders writer view.
 * 
 * @param {string} key The identifier for group of Notes.
 */
function renderWriter(key) {
    const writerContainer = document.getElementById("writer-container");
    writerContainer.innerHTML = "";
    const notesArr = getDataFromLocalStorage(key);
    notesArr.forEach((note) => {
        // Get note properties and recreate the Note object in order to use createWriterNoteElement().
        const noteObj = new Note(key, note.id, note.value);
        writerContainer.appendChild(noteObj.createWriterNoteElement());
    });
}

/**
 * Returns current time.
 * 
 * @returns current time in 00:00:00 AM format
 */
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

    return currentTime;
}

/**
 * Updates update-time span with the current time.
 */
function updateTime() {
    const updateTime = document.getElementById("update-time");
    updateTime.innerHTML = getCurrentTime();
}
