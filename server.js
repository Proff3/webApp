const express = require('express');
const path = require('path');
const { getChangeRowInfo, updateTable, getTable, deleteRow, addRow, createTransaction, commitTransaction } = require('./DataBaseAPI')
const { authentification, registration } = require('./UserAPI');
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
        let result = await authentification(login, pass);
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
        let recordset = await getTable(login, table);
        let result = { recordset };//Like MS SQL Server driver
        let titles = [];
        for (let [key, value] of Object.entries(recordset[0])) titles.push(key);
        res.send(Object.assign({}, result, { titles }));
    }
    catch (err) {
        if (err.code !== "ETIMEOUT") res.send({ message: "В данный момент таблица редактируется!" })
        console.error(err)
        res.status(500).send(err.message);
    }
});

app.post('/registration', async function (req, res) {
    try {
        let { login, pass } = req.body;
        await registration(login, pass);
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
            await updateTable(login, table, item, pkField);
        }
        await commitTransaction(login);
        res.send("all right")
    }
    catch (err) {
        res.status(500).send(JSON.stringify(err));
    }
});

app.post('/delete/:table', async function (req, res) {
    try {
        let { table } = req.params;
        let { pkField, login } = req.body;
        await deleteRow(table, login, pkField.key, pkField.value);
        await commitTransaction(login);
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
        await updateTable(login, table, changingRow[0], newPkField);
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
        await addRow(table, login, changingRow);
        await commitTransaction(login);
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
        if (action === 'create') { await createTransaction(login) }
        else await commitTransaction(login);
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
        let recordset = await getChangeRowInfo(table);
        let result = { recordset }
        res.send(JSON.stringify(result));
    }
    catch (e) {
        console.error(e)
        res.status(500).send(e.message);
    }
})
