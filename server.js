const express = require('express');
const path = require('path');
const DataBaseAPI = require('./DataBaseAPI');
const UserAPI = require('./UserAPI');
require('dotenv').config();
var cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 5000


app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'abonent-plus', 'build')));
app.listen(port);

app.post('/authentification', async function (req, res) {
    try {
        let { login, pass } = req.body;
        let result = await UserAPI.authentification(login, pass);
        res.send(JSON.stringify(result));
    }
    catch (e) {
        res.status(500).send(JSON.stringify(e.message));
    }
});

app.post('/table/:table', async function (req, res) {
    try {
        let { login } = req.body;
        let { table } = req.params;
        let recordset = await DataBaseAPI.getTable(login, table);
        let result = { recordset };//Like MS SQL Server driver
        let titles = [];
        for (let [key, value] of Object.entries(recordset[0])) titles.push(key);
        res.send(Object.assign({}, result, { titles }));
    }
    catch (err) {
        console.error(err)
        res.status(500).send(err.message);
    }
});

app.post('/registration', async function (req, res) {
    try {
        let { login, pass } = req.body;
        await UserAPI.registration(login, pass);
        res.send(JSON.stringify("Вы успешно зарегистрировались!"));
    }
    catch (e) {
        res.status(500).send(JSON.stringify(e.message));
    }
});

app.post('/change/:table', async function (req, res) {
    try {
        let { table } = req.params;
        let { changingRow, pkField, login } = req.body;
        for (item of changingRow) {
            console.log(`Entered with key ${item.key}`);
            await DataBaseAPI.updateTable(login, table, item, pkField);
        }
        console.log(`server commit`)
        await DataBaseAPI.commitTransaction(login);
        res.send("all right")
    }
    catch (err) {
        console.log(`server catch`);
        console.log(err.message + " message");
        console.log(err);
        res.status(500).send(JSON.stringify(err));
    }
});

app.post('/delete/:table', async function (req, res) {
    try {
        let { table } = req.params;
        let { pkField, login } = req.body;
        await DataBaseAPI.deleteRow(table, login, pkField.key, pkField.value);
        await DataBaseAPI.commitTransaction(login);
        res.send("all right")
    }
    catch (err) {
        res.status(500).send(JSON.stringify(err));
    }
})

app.post('/fakeUpdate/:table', async function (req, res) {
    try {
        let { table } = req.params;
        let { changingRow, pkField, login } = req.body;
        let newPkField = { key: changingRow[0].key, value: pkField }
        await DataBaseAPI.updateTable(login, table, changingRow[0], newPkField);
        res.send("all right")
    }
    catch (err) {
        res.status(500).send(JSON.stringify(err));
    }
})

app.post('/add/:table', async function (req, res) {
    try {
        let { table } = req.params;
        let { changingRow, login } = req.body;
        await DataBaseAPI.addRow(table, login, changingRow);
        await DataBaseAPI.commitTransaction(login);
        res.send("all right");
    }
    catch (err) {
        console.log(err)
        res.status(500).send(JSON.stringify(err));
    }
})

app.post('/transaction/:action', async function (req, res) {
    try {
        let { action } = req.params;
        let { login } = req.body;
        if (action === 'create') { await DataBaseAPI.createTransaction(login) }
        else if (action === 'rollback') { await DataBaseAPI.rollbackTransaction(login) }
        else await DataBaseAPI.commitTransaction(login);
        res.send("all right");
    }
    catch (err) {
        console.log(err);
        res.status(500).send(JSON.stringify(err));
    }
})

app.post('/closeConnection', async function (req, res) {
    try {
        let { login } = req.body;
        await DataBaseAPI.closeConnection(login);
        res.send("all right");
    }
    catch (err) {
        console.log(err);
        res.status(500).send(JSON.stringify(err));
    }
})

app.get('/changeRow/:table', async function (req, res) {
    try {
        let { table } = req.params;
        let recordset = await DataBaseAPI.getChangeRowInfo(table);
        let result = { recordset }
        res.send(JSON.stringify(result));
    }
    catch (e) {
        console.error(e)
        res.status(500).send(e.message);
    }
})
