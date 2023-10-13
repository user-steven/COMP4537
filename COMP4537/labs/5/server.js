const http = require('http');
const mysql = require('mysql');
const url = require('url');
const GET = "GET";
const POST = "POST"
const ENDPOINT = "/COMP4537/labs/5/api/";

const commonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST"
};

// DB Connection Configurations
const DB_CONFIG = {
    host: "localhost",
    user: "stevenct_lab5",
    password: "",
    database: "stevenct_lab5"
};

// Table name
const TABLE_NAME = "Patients";

// Create connection to database
const db = mysql.createConnection(DB_CONFIG);

// Connect to database
db.connect(function (err) {
    if (err) {
        console.error("Error connecting to database: ", err);
    } else {
        const sql = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (patientid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), dateOfBirth DATETIME)`;

        db.query(sql, function (err, result) {
            if (err) {
                console.error("Error creating table: ", err);
            } else {
                console.log("Table created!");
            }
        })
    }
})

// Validate query to ensure it is a SELECT or INSERT statement
function validateQuery(statement) {
    const regex = /^(SELECT|INSERT)[\s\S]*$/i;
    return regex.test(statement);
}

// Create server
const server = http.createServer(function (req, res) {

    console.log(`${req.method} request for ${req.url}`);

    if (req.method == GET) {

        urlString = url.parse(req.url, true).pathname;

        mysqlQuery = decodeURIComponent(urlString.substring(urlString.lastIndexOf('/') + 1)).replace(/['"\\]/g, '');

        if (mysqlQuery) {
            console.log(`Received query: ${mysqlQuery}`);
        } else {
            console.log('No query received.');
            res.writeHead(400, commonHeaders);
            res.end(JSON.stringify({ "msg": "No query received." }))
        }

        if (validateQuery(mysqlQuery)) {
            db.query(mysqlQuery, function (err, result) {
                if (err) {
                    res.writeHead(400, commonHeaders);
                    res.end(JSON.stringify({ "msg": err.message }));
                } else {
                    res.writeHead(200, commonHeaders);
                    res.end(JSON.stringify({ "msg": result }));
                }
            });
        } else {
            res.writeHead(400, commonHeaders);
            res.end(JSON.stringify({ "msg": "Request contained operations other than SELECT and INSERT." }))
        }
    }

    if (req.method == POST && req.url == ENDPOINT) {
        let body = "";

        req.on('data', function (chunk) {
            if (chunk != null) {
                body += chunk;

            }
        });

        req.on('end', function () {
            if (validateQuery(body)) {
                console.log("Received query: ", body);

                db.query(body, function (err, result) {
                    if (err) {
                        res.writeHead(400, commonHeaders);
                        res.end(JSON.stringify({ "msg": err.message }));
                    } else {
                        res.writeHead(200, commonHeaders);
                        res.end(JSON.stringify({ "msg": "Successfully inserted data.", "result": result }));
                    }
                });
            } else {
                res.writeHead(400, commonHeaders);
                res.end(JSON.stringify({ "msg": "Request contained operations other than SELECT and INSERT." }));
            }
        });

    }

});

server.listen();
