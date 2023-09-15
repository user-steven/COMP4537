class Note {
    constructor(key, id = new Date().getTime().toString(), value = "") {
        this.id = id;
        this.value = value;
        this.key = key;
    }

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

    createWriterNoteElement() {
        // Create outter div, textarea and remove button
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

        // Add textarea and remove button to outter div
        noteContainer.appendChild(textArea);
        noteContainer.appendChild(removeButton);

        // Removes specified note and instantly updates localstorage JSON
        removeButton.addEventListener("click", () => {
            this.remove();
        });

        return noteContainer;
    }

    createReaderNoteElement() {
        const noteContainer = document.createElement("div");
        noteContainer.innerHTML = this.value;
        noteContainer.className = "ReaderTextbox";

        return noteContainer;
    }

}

function createNote(key) {
    const writerContainer = document.getElementById("writer-container");
    const note = new Note(key);
    pushNote(key, note);
    writerContainer.appendChild(note.createWriterNoteElement());
}

function getDataFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function intervalUpdateNotes(key) {
    const notesArr = getDataFromLocalStorage(key);
    notesArr.forEach((note) => {
        const noteContainer = document.getElementById(`${note.key}-${note.id}`);
        const textAreaElem = noteContainer.querySelector("textarea");
        const currNoteValue = textAreaElem.value;
        if (note.value != currNoteValue) {
            note.value = currNoteValue;
        }
    });
    localStorage.setItem(key, JSON.stringify(notesArr));
}

function pushNote(key, note) {
    const notesArr = getDataFromLocalStorage(key);
    notesArr.push(note);
    localStorage.setItem(key, JSON.stringify(notesArr));
}

function renderReader(key) {
    // Empty current view of reader container
    const readerContainer = document.getElementById("reader-container");
    readerContainer.innerHTML = "";

    // Retrieve serialized object from localstorage and deserialize bac into note[]
    const notesArr = getDataFromLocalStorage(key);

    // Generate and append reader note element
    notesArr.forEach(note => {
        const noteObj = new Note(key, note.id, note.value);
        readerContainer.appendChild(noteObj.createReaderNoteElement());
    });
}

function renderWriter(key) {
    const writerContainer = document.getElementById("writer-container");
    writerContainer.innerHTML = "";
    const notesArr = getDataFromLocalStorage(key);
    notesArr.forEach((note) => {
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
    let key = "notes";
    let bodyId = document.body.id;

    if (bodyId === 'writer') {
        document.getElementById("writer-add-button").addEventListener("click", () => {
            console.log("New note added.")
            createNote(key);
        });

        renderWriter(key);

        setInterval(function () {
            intervalUpdateNotes(key)
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
