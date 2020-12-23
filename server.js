const express = require('express');
const { getChangeRowInfo, updateTable, getTable, deleteRow, addRow, createTransaction, commitTransaction } = require('./DataBaseAPI')
//const { users } = require('./userAPI.js');
const { isUserExist, authentification, registration } = require('./UserAPI');
require('dotenv').config();
var cors = require('cors'); //от expressjs почитать в документации
const app = express();
app.use(cors());
app.use(express.json())//ПРОТЕСТИТЬ!!!!!!!!!!!!!!!!!!!!!!!
app.listen(5000);
const config = `mssql://${process.env.login}:${process.env.password}@localhost/AbonentPlus`;
const sql = require('mssql');


async function DBconnection() {
    try {
        await sql.connect(config)
        const transaction = new sql.Transaction();
        await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        const request = new sql.Request(transaction);
        await request
            .input('Fio', sql.NVarChar, "Пронин В.Е.")
            .query(`UPDATE Executor SET Fio = @fio WHERE ExecutorCD = ${18}`);
        console.log("Transaction committed");
        //await transaction.commit();
        //console.log(result.recordset + "ah");
    } catch (err) {
        if (err) throw (err);
        console.log(err);
        console.log(err.number);
    } finally { }
}

app.get('/', async function (req, res) {
    try {
        await DBconnection();
        //await DBconnection();
        //console.log(await isUserExistance("vlad"))
        //await authentification("vlad", "777");
        res.send('result');
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
    catch (e) {
        console.error(e)
        res.status(500).send(e.message);
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
            console.log(item);
            await updateTable(login, table, item, pkField);
        }
        console.log("Table is updated")
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
        console.log(table, login, pkField.key, pkField.value);
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
        await updateTable(login, table, changingRow[0], pkField);
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
        let { login, table } = req.body;
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
