require('dotenv').config()
const User = require('./User.js');
const config = `mssql://${process.env.login}:${process.env.password}@localhost/AbonentPlus`;
const sql = require('mssql');

let users = {};
//sql.connect(config);

async function updateTable(login, table, item, pkField) {
    try {
        await sql.connect(config);
        //await createTransaction(login);
        let transaction = users[login];
        //await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        const request = new sql.Request(transaction);
        //console.log(`UPDATE ${table} SET ${item.key} = ${item.value} WHERE ${pkField.key} = ${pkField.value}`)
        try {
            await request
                .input('value', item.value)
                .query(`UPDATE ${table} SET ${item.key} = @value WHERE ${item.key} = @value`);
        } catch (err) {
            err.key = item.key;
            err.value = item.value;
            console.log(err);
            throw (err);
        }
        //await commitTransaction(login);
    } catch (err) {
        throw (err);
    }
}

async function getTable(login, table) {
    try {
        console.log(sql.ISOLATION_LEVEL.REPEATABLE_READ);
        await sql.connect(config);
        await createTransaction(login);
        let transaction = users[login];
        await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        const request = new sql.Request(transaction);
        let result = await request
            .query(`SELECT * FROM ${table}`);
        await commitTransaction(login);
        return result;
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
}

async function deleteRow(table, login, key, value) {
    try {
        await sql.connect(config);
        //await createTransaction(login);
        let transaction = users[login];
        //await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        const request = new sql.Request(transaction);
        //console.log(`DELETE FROM ${table} WHERE ${key} = '${value}'`);
        let result = await request
            .input('value', value)
            .query(`DELETE FROM ${table} WHERE ${key} = '${value}'`);
        //await commitTransaction(login);
        return result;
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
}

async function addRow(table, login, changingRow) {
    try {
        await sql.connect(config);
        //await createTransaction(login);
        let transaction = users[login];
        //await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        const request = new sql.Request(transaction);
        let sqlRow = ``;
        changingRow.forEach((entry, idx) => {
            if (entry.value === null) {
                request.input(`value${idx}`, entry.value)
                sqlRow += `@value${idx},`
            } else {
                sqlRow += `'${entry.value}',`
            }
        });
        sqlRow = sqlRow.slice(0, -1);
        try {
            await request
                .query(`INSERT INTO ${table} VALUES(${sqlRow})`);
        } catch (err) {
            console.log(err);
            throw (err);
        }
        //await commitTransaction(login);
    } catch (err) {
        throw (err);
    }
}

async function commitTransaction(login) {
    try {
        console.log("commit " + login)
        //console.log(users[login].commit)
        await new Promise(resolve => users[login].commit(resolve));
        //users[login].commit();
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
};

async function createTransaction(login) {
    console.log("create " + login)
    await sql.connect(config);
    let transaction = new sql.Transaction();
    await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promis
    users[login] = transaction;
    //let transaction = users[login].transaction;
    //console.log(transaction + "create");

};

async function getChangeRowInfo(table) {
    try {
        await sql.connect(config);
        await createTransaction(table);
        let transaction = users[table];
        await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        let request = new sql.Request(transaction);
        let result = await request
            .query(`SELECT * FROM ${table}`)
        await commitTransaction(table);
        return result;
    } catch (err) {
        if (err) throw (err);
        console.log(err);
    }
}

module.exports.createTransaction = createTransaction;
module.exports.commitTransaction = commitTransaction;
module.exports.getTable = getTable;
module.exports.updateTable = updateTable;
module.exports.createTransaction = createTransaction;
module.exports.getChangeRowInfo = getChangeRowInfo;
module.exports.deleteRow = deleteRow;
module.exports.addRow = addRow;
