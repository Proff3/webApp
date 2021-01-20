const express = require('express');
const { getChangeRowInfo, updateTable, getTable, deleteRow, addRow, createTransaction, commitTransaction, users } = require('./DataBaseAPI')
//const { users } = require('./userAPI.js');
const { isUserExist, authentification, registration } = require('./UserAPI');
require('dotenv').config();
var cors = require('cors'); //от expressjs почитать в документации
const app = express();
app.use(cors());
app.use(express.json())//ПРОТЕСТИТЬ!!!!!!!!!!!!!!!!!!!!!!!
app.listen(5000);
const config = `mssql://${process.env.login}:${process.env.password}@localhost/ABONENT_MSSQL`;
const sql = require('mssql');

async function DBconnection() {
    try {
        let login = "vasya";
        await sql.connect(config);
        await createTransaction(login);
        let transaction = users[login].transaction;
        await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        const request = new sql.Request(transaction);
        let result;
        try {
            result = await request
                .query(`SELECT * FROM ABONENT`);
        } catch (err) { err => console.log(err) }
        await commitTransaction(login);
        return result;
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
}

app.get('/', async function (req, res) {
    try {
        let result = await DBconnection();
        //await DBconnection();
        //console.log(await isUserExistance("vlad"))
        //await authentification("vlad", "777");
        res.send(result);
    }
    catch (e) {
        console.error(e)
        res.status(500).send(e.message);
    }
});

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
        let result = await getTable(login, table);
        //console.dir(result.recordsets);
        let columns = result.recordset.columns;
        let titles = [];
        for (let [key, value] of Object.entries(columns)) titles.push(key);
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
        let result = await getChangeRowInfo(table);
        res.send(JSON.stringify(result));
    }
    catch (e) {
        console.error(e)
        res.status(500).send(e.message);
    }
})
