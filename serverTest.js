const express = require('express');
require('dotenv').config();
const { createUserConnection, isUserExistance } = require('./UserAPI.js')
const isolation = require('tedious').ISOLATION_LEVEL;
var bodyParser = require('body-parser')//от expressjs почитать в документации
var cors = require('cors'); //от expressjs почитать в документации
const { User } = require('./User.js');
const app = express();
app.use(cors());
var Connection = require('tedious').Connection;
var TYPES = require('tedious').TYPES;
var Request = require('tedious').Request;
var config = {
    server: 'localhost',    //the IP of the machine where SQL Server runs
    authentication: {
        type: 'default',
        options: {
            userName: process.env.login, // update me
            password: process.env.password, // update me
        }
    },
    options: {
        encrypt: false,
        database: 'AbonentPlus',  //the username above should have granted permissions in order to access this DB.
    }
}


//app.use(bodyParser.json());
app.use(express.json())//ПРОТЕСТИТЬ!!!!!!!!!!!!!!!!!!!!!!!
app.listen(5000);
var result = [];
var connection = new Connection(config);

app.post('/executor/POST', postExecutors);

app.post('/executor/DELETE', function (req, res) {
    connection.transaction((err) => {
        if (err) console.log(err);
        let body = req.body;
        body.forEach(row => {
            let id = row.EXECUTORCD;
            let request = new Request('DELETE FROM Executor WHERE ExecutorCD = @id',
                function (err) {
                    if (err) {
                        return (err);
                    }
                });
            request.addParameter('id', TYPES.Int, id);
            connection.execSql(request);
        })
    }, 4)
});

connection.on('connect', function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Connected');
    }
})

app.get('/', async (req, res) => {
    let result = await isUserExistance({ login: "vlad", password: "777" }, connection);
    console.log("get before");
    await async function () { setTimeout(() => { console.log("in") }, 0) }()
    console.log("get after");
    res.send(result);
});

app.get('/executor', beginExsecutorsTransaction, getExecutors, function (req, res) {
    res.send(JSON.stringify(result));
    result = [];
});

app.get('/abonent', getAbonents, function (req, res) {
    res.send(JSON.stringify(result));
    result = [];
});

function beginExsecutorsTransaction(req, res, next) {
    connection.beginTransaction((err) => {
        if (err) console.log(err);
        next();
    });
}

function getExecutors(req, res, next) {
    connection.transaction((err) => {
        if (err) console.log(err);
        let request = new Request('SELECT * FROM Executor',
            function (err) {
                if (err) {
                    return (err);
                }
            });
        request.on("row", pushRows)
        request.on('requestCompleted', next);
        connection.execSql(request);
    }, 4);
};

function getAbonents(req, res, next) {
    let request = new Request('SELECT * FROM Abonent',
        function (err) {
            if (err) {
                return (err);
            }
        });
    request.on("row", pushRows)
    request.on('requestCompleted', next);
    connection.execSql(request);
};

function pushRows(columns) {
    let row = {};
    columns.forEach(column => {
        row[column.metadata.colName] = column.value;
    })
    result.push(row);
}

function postExecutors(req, res, next) {
    connection.transaction((err) => {
        if (err) console.log(err);
        let body = req.body;
        body.forEach(row => {
            let id = row.EXECUTORCD;
            let fio = row.Fio;
            let request = new Request('UPDATE Executor SET Fio = @fio WHERE ExecutorCD = @id',
                function (err) {
                    if (err) {
                        return (err);
                    }
                });
            request.addParameter('id', TYPES.Int, id);
            request.addParameter('fio', TYPES.NVarChar, fio);
            request.on('requestCompleted', next);
            connection.execSql(request);
        });
    }, 4)
}

function commitTransaction() {
    connection.commitTransaction(err => { if (err) console.log(err) })
}

async function checkUser(req, res) {
    return
}