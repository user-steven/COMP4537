const http = require('http');
const url = require('url');
const fs = require('fs');
const utils = require('./modules/utils');


http.createServer((req, res) => {
    const addr = url.parse(req.url, true);
    console.log(addr.host);

    if (addr.pathname == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write("Hello World");
        res.end();
    } else if (addr.pathname == '/getDate/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const name = addr.query.name;
        res.write(`<b><span style="color:DodgerBlue;"> Hello ${name}, What a beautiful day. Server current date and time is ${utils.getDate()} </span></b>`);
        res.end();
    } else if (addr.pathname == '/writeFile/') {
        const text = addr.query.text;
        if (typeof text !== 'undefined') {
            const writeStream = fs.createWriteStream('file.txt', { flags: 'a+' });
            writeStream.write(text);
            writeStream.end();
            res.end("File written");
        }
    } else if (addr.pathname.includes('/readFile/')) {
        const file = addr.pathname.substring(addr.pathname.lastIndexOf('/') + 1);

        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                res.write(`404 File: ${file} not found`)
            }
            res.write(data);
            res.end();
        })
    } else {
        res.end("404 Not found");
    }

}).listen(8080);
