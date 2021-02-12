require('dotenv').config()
const { mysqlConnection } = require('./MysqlAsyncWrapper.js')
const config = {
    host: `${process.env.host}`,
    user: `${process.env.login}`,
    password: `${process.env.password}`,
    database: `${process.env.database}`,
    port: 3306
};

let users = {};

async function updateTable(login, table, item, pkField) {
    try {
        let localConnection = users[login];
        if (item.key.includes("DATE") && item.value !== null) item.value = item.value.slice(0, 10);
        await localConnection.query({ sql: `UPDATE ${table} SET ${item.key} = ? WHERE ${pkField.key} = ${pkField.value}`, values: [item.value], timeout: 10000 });
    } catch (err) {
        if (err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
            await createTransaction(login);//creating new connection due to fatal error of the previous one
            err = new Error("The table is changing!");
            err.mes = "В данный момент таблица редактируется!";
        } else {
            err.key = item.key;
            err.value = item.value;
        }
        throw (err);
    }
}

async function getTable(login, table) {//using transactions here because they are not needed to be controlled
    try {
        await createTransaction(login);
        let localConnection = users[login];
        let result
        try {
            result = await localConnection.query(`SELECT * FROM ${table}`);
        } catch (err) {
            if (err.code !== "ETIMEOUT") {//MSSQL server
                console.log(err);
                throw (err);
            }
        }
        await commitTransaction(login);
        return result;
    } catch (err) {
        if (err) throw (err);
        console.log(err);
    }
}

async function deleteRow(table, login, key, value) {
    try {
        let localConnection = users[login];
        let result = await localConnection.query(`DELETE FROM ${table} WHERE ${key} = '${value}'`);
        return result;
    } catch (err) {
        if (err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
            await createTransaction(login);//creating new connection due to fatal error of the previous one
            err = new Error("The table is changing!");
            err.mes = "В данный момент таблица редактируется!";
        }
        console.log(err);
        throw (err);
    }
}

async function addRow(table, login, changingRow) {
    try {
        let localConnection = users[login];
        let sqlRow = ``;
        changingRow.forEach(entry => {
            if (entry.key.includes("DATE") && entry.value !== null) entry.value = entry.value.slice(0, 10);
            sqlRow += entry.value === null ? `${entry.value},` : `'${entry.value}',`;
        });
        sqlRow = sqlRow.slice(0, -1);
        try {
            await localConnection.query({ sql: `INSERT INTO ${table} VALUES(${sqlRow})`, timeout: 5000 });
        } catch (err) {
            if (err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
                await createTransaction(login);//creating new connection due to fatal error of the previous one
                err = new Error("The table is changing!");
                err.mes = "В данный момент таблица редактируется!";
            }
            console.log(err);
            throw (err);
        }
    } catch (err) {
        throw (err);
    }
}

async function commitTransaction(login) {
    try {
        await users[login].commitTransaction();
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
};

async function rollbackTransaction(login) {
    try {
        await users[login].rollbackTransaction();
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
};

async function createTransaction(login) {
    try {
        let localSql = mysqlConnection(config);
        await localSql.beginTransaction();
        //await localSql.query('START TRANSACTION');
        users[login] = localSql;
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
};

async function closeConnection(login) {
    try {
        console.log(login + " close");
        await users[login].close();
    } catch (e) {
        if (err) throw (err);
        console.log(err);
    }
}

async function getChangeRowInfo(table) { //using transactions here because they are not needed to be controlled
    try {
        await createTransaction(table);
        let localConnection = users[table];
        let result = await localConnection.query(`SELECT * FROM ${table}`)
        await commitTransaction(table);
        return result;
    } catch (err) {
        if (err) throw (err);
        console.log(err);
    }
}

module.exports.closeConnection = closeConnection;
module.exports.rollbackTransaction = rollbackTransaction;
module.exports.createTransaction = createTransaction;
module.exports.commitTransaction = commitTransaction;
module.exports.getTable = getTable;
module.exports.updateTable = updateTable;
module.exports.createTransaction = createTransaction;
module.exports.getChangeRowInfo = getChangeRowInfo;
module.exports.deleteRow = deleteRow;
module.exports.addRow = addRow;
module.exports.users = users;
