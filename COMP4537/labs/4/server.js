const Word = require('./classes/Word');
const http = require('http');
const url = require('url');
const GET = "GET";
const POST = "POST";
const endPoint = "/COMP4537/labs/4/api/definitions/";
const PORT = process.env.PORT || 3000;

const hello = new Word("hello", "a greeting");
const dictionary = [hello];


function addWord(word, definition) {
    const newWord = new Word(word, definition);
    dictionary.push(newWord);
}

function indexOfWord(word) {
    for (let i = 0; i < dictionary.length; i++) {
        if (dictionary[i].word == word) {
            return i;
        }
    }
    return null;
}

http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST"
        });

    console.log(`${req.method} request for ${req.url}`);

    if (req.method == GET) {
        const query = url.parse(req.url, true).query;
        const word = query.word.toLowerCase();
        const index = indexOfWord(word);
        if (index != null) {
            res.end(JSON.stringify({ word: dictionary[index].word, definition: dictionary[index].definition }));
        } else {
            res.end(JSON.stringify({ msg: `${word} not found in dictionary.` }));
        }
    }

    if (req.method == POST && req.url == endPoint) {
        let body = "";
        req.on('data', function(chunk) {
            if (chunk != null) {
                body += chunk;
            }
        });

        req.on('end', function() {
            // const query = url.parse(body, true).query;
            const query = JSON.parse(body);
            console.log(query);
            const word = query.word.toLowerCase();
            const definition = query.definition;
            const index = indexOfWord(word);

            if (index != null) {
                res.end(JSON.stringify({ msg: `${word} already exists in dictionary.` }));
            } else {
                addWord(word, definition);
                res.end(JSON.stringify({ msg: `${word} added to dictionary.` }));
            }
        });
    }

}).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});