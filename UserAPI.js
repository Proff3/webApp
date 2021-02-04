require('dotenv').config()
const { mysqlConnection } = require('./MysqlAsyncWrapper.js')
const config = {
    host: 'localhost',
    user: 'User',
    password: 'WOwnib846',
    database: 'abonentplus'
};
//const mysql = require('mysql');

async function isUserExist(login) {
    try {
        this.connection = mysqlConnection(config);
        let result = await connection.query(`SELECT * FROM Users WHERE login=?`, [login])
        return !!result.length;
    } catch (err) {
        console.log(err);
        if (err) throw (err);
    } finally {
        connection.close();
    }
};

async function authentification(login, pass) {
    try {
        this.connection = mysqlConnection(config);
        let result = await connection.query(`SELECT * FROM Users WHERE login=? AND password=?`, [login, pass])
        if (!result.length) {
            throw new Error("Логин или пароль не корректны!")
        } else {
            return true;
        };
    } catch (err) {
        if (err) throw (err);
        console.log(err);
        console.log(err.number);
    }
};

async function registration(login, pass) {
    try {
        if (await isUserExist(login)) throw new Error("Пользователь уже существует");
        this.connection = mysqlConnection(config);
        await connection.query(`INSERT INTO Users VALUES(?,?)`, [login, pass])
    } catch (err) {
        if (err) throw (err);
        console.log(err)
    }
};

module.exports.registration = registration;
module.exports.authentification = authentification;
module.exports.isUserExist = isUserExist;

