const utils = require('./modules/utils');
const http = require('http');
const url = require('url');
const GET = "GET";
const POST = "POST";
const endPoint = "/COMP4537/labs/4/api/definitions/";
const PORT = process.env.PORT || 3000;

// Testing GET request
// const hello = new Word("hello", "a greeting");
const dictionary = [];

// Counter for number of requests
let requestCount = 0;


http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST"
        });

    console.log(`${req.method} request for ${req.url}`);

    if (req.method == GET) {
        const query = url.parse(req.url, true).query;
        const word = query.word;
        const index = utils.indexOfWord(word.toLowerCase(), dictionary);

        if (utils.wordValidation(word) && index !== null) {
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
                console.log(body);
            }
        });

        req.on('end', function() {
            const query = url.parse(body, true).query; // Query string/Raw Text
            // const query = JSON.parse(body); // Raw JSON
            console.log(query);
            const word = query.word;
            const definition = query.definition;
            const index = utils.indexOfWord(word.toLowerCase(), dictionary);

            if (index === null && utils.wordValidation(word) && utils.definitionValidation(definition)) {
                requestCount++;
                utils.addWord(word, definition, dictionary);
                res.end(JSON.stringify({ msg: `Request #${requestCount}: ${word} added to dictionary.` }));
            } else if (!utils.wordValidation(word) || !utils.definitionValidation(definition)) {
                res.end(JSON.stringify({ msg: `Word: ${word} and/or definition is invalid.` }));
            } else {
                res.end(JSON.stringify({ msg: `${word} already exists in dictionary.` }));
            }
        });
    }

}).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});