require('dotenv').config()
const { mysqlConnection } = require('./MysqlAsyncWrapper.js')
const config = {
    host: `${process.env.host}`,
    user: `${process.env.login}`,
    password: `${process.env.password}`,
    database: `${process.env.database}`
};
let tableConnection = mysqlConnection(config);
let users = {};
class DataBaseAPI {
    async updateTable(login, table, item, pkField) {
        try {
            let localConnection = users[login];
            if (item.key.includes("DATE") && item.value !== null) item.value = item.value.slice(0, 10);
            await localConnection.query({ sql: `UPDATE ${table} SET ${item.key} = ? WHERE ${pkField.key} = ${pkField.value}`, values: [item.value], timeout: 10000 });
        } catch (err) {
            if (err.code === 'PROTOCOL_SEQUENCE_TIMEOUT' || err.errno === 1226) {
                err = new Error("The table is changing!");
                err.mes = "В данный момент таблица редактируется!";
            } else {
                err.key = item.key;
                err.value = item.value;
            }
            throw (err);
        }
    }

    async getTable(login, table) {//using transactions here because they are not needed to be controlled
        try {
            let result = await tableConnection.query(`SELECT * FROM ${table}`);
            return result;
        } catch (err) {
            if (err) throw (err);
            console.log(err);
        }
    }

    async deleteRow(table, login, key, value) {
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

    async addRow(table, login, changingRow) {
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

    async commitTransaction(login) {
        try {
            await users[login].commitTransaction();
        } catch (e) {
            if (err) throw (err);
            console.log(err);
        }
    };

    async rollbackTransaction(login) {
        try {
            await users[login].rollbackTransaction();
        } catch (e) {
            if (err) throw (err);
            console.log(err);
        }
    };

    async createTransaction(login) {
        try {
            console.log(login + " connected");
            let localSql = mysqlConnection(config);
            try {
                await localSql.beginTransaction();
                users[login] = localSql;
            } catch (err) {
                console.log(err.errno);
                if (err.errno === 1226) {
                    err = new Error("The table is changing!");
                    err.mes = "В данный момент таблица редактируется!";
                }
                throw (err)
            }
        } catch (err) {
            console.log(err);
            throw (err);
        }
    };

    async closeConnection(login) {
        try {
            console.log(login + " disconnected");
            await users[login].close();
        } catch (err) {
            console.log(err);
            throw (err);
        }
    }

    async getChangeRowInfo(table) {
        try {
            let result = await tableConnection.query(`SELECT * FROM ${table}`);
            return result;
        } catch (err) {
            if (err) throw (err);
            console.log(err);
        }
    }
}

module.exports = new DataBaseAPI();

