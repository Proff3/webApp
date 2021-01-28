require('dotenv').config()
const User = require('./User.js');
const config = `mssql://${process.env.login}:${process.env.password}@localhost/AbonentPlus`;
const sql = require('mssql');

let users = {};

async function updateTable(login, table, item, pkField) {
    try {
        let localSql = users[login].localSql;
        let transaction = users[login].transaction;
        const request = new localSql.Request(transaction);
        try {
            await request
                .input('value', item.value)
                .query(`UPDATE ${table} SET ${item.key} = @value WHERE ${pkField.key} = ${pkField.value}`);
        } catch (err) {
            err.key = item.key;
            err.value = item.value;
            console.log(err);
            throw (err);
        }
    } catch (err) {
        throw (err);
    }
}

async function getTable(login, table) {
    try {
        await createTransaction(login);
        let localSql = users[login].localSql;
        let transaction = users[login].transaction;
        await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        const request = new localSql.Request(transaction);
        let result
        try {
            result = await request
                .query(`SELECT * FROM ${table}`);
        } catch (err) {
            if (err.code !== "ETIMEOUT") {
                console.log(err);
                throw (err);
            }
        }
        await commitTransaction(login);
        return result;
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
}

async function deleteRow(table, login, key, value) {
    try {
        let localSql = users[login].localSql;
        let transaction = users[login].transaction;
        const request = new localSql.Request(transaction);
        let result = await request
            .input('value', value)
            .query(`DELETE FROM ${table} WHERE ${key} = '${value}'`);
        return result;
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
}

async function addRow(table, login, changingRow) {
    try {
        let localSql = users[login].localSql;
        let transaction = users[login].transaction;
        const request = new localSql.Request(transaction);
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
    } catch (err) {
        throw (err);
    }
}

async function commitTransaction(login) {
    try {
        await new Promise(resolve => users[login].transaction.commit(resolve));
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
};

async function createTransaction(login) {
    try {
        let localSql = Object.assign({}, sql);
        await localSql.connect(config);
        let transaction = new localSql.Transaction();
        await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promis
        users[login] = { transaction, localSql };
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
};

async function getChangeRowInfo(table) {
    try {
        await createTransaction(table);
        let localSql = users[table].localSql;
        let transaction = users[table].transaction;
        await new Promise(resolve => transaction.begin(resolve));//The transaction.begin does not return a Promise
        let request = new localSql.Request(transaction);
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
module.exports.users = users;
