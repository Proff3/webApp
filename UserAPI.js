require('dotenv').config()
const { User } = require('./User.js');
const { createTransaction } = require('./DataBaseAPI.js');
const config = `mssql://${process.env.login}:${process.env.password}@localhost/AbonentPlus`;
const sql = require('mssql');

async function isUserExist(login) {
    try {
        this.connection = await sql.connect(config);
        const request = connection.request();
        let result = await request
            .input('login', sql.NVarChar, login)
            .query(`SELECT * FROM Users WHERE login=@login`);
        return !!result.recordset.length;
    } catch (err) {
        if (err) throw (err);
    } finally {
        connection.close();
    }
};

async function authentification(login, pass) {
    try {
        this.connection = await sql.connect(config)
        const request = connection.request();
        let result = await request
            .input('login', sql.NVarChar, login)
            .input('pass', sql.NVarChar, pass)
            //.query(`UPDATE Abonent SET StreetCD = ${10} WHERE AccountCD = ${999999}`);
            .query(`SELECT * FROM Users WHERE login=@login AND password=@pass`);
        if (!result.recordset.length) {
            throw new Error("Логин или пароль не корректны!")
        } else {
            createTransaction(login);
            return true;
        };
    } catch (err) {
        if (err) throw (err);
        console.log(err);
        console.log(err.number);
    } finally {
        connection.close();
    }
};

async function registration(login, pass) {
    try {
        if (await isUserExist(login)) throw new Error("Пользователь уже существует");
        this.connection = await sql.connect(config)
        const request = connection.request();
        await request
            .input('login', sql.NVarChar, login)
            .input('pass', sql.NVarChar, pass)
            .query(`INSERT INTO Users VALUES(@login, @pass)`);
    } catch (err) {
        if (err) throw (err);
        console.log(err)
    } finally {
        connection.close();
    }
};

module.exports.registration = registration;
module.exports.authentification = authentification;
module.exports.isUserExist = isUserExist;

