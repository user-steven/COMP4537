const Word = require('../classes/Word');

// Add words to dictionary
exports.addWord = (word, definition, array) => {
    const newWord = new Word(word.toLowerCase(), definition);
    array.push(newWord);
}

// Find index of word in dictionary
exports.indexOfWord = (word, array) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].word == word) {
            return i;
        }
    }
    return null;
}

// Validate word
exports.wordValidation = (word) => {
    // Regex for alpha characters and spaces
    const regex = /^[a-zA-Z ]+$/;
    return regex.test(word) && word.length > 0;
}

// Validate definition for non-empty string
exports.definitionValidation = (definition) => {
    return definition.length > 0;
}
