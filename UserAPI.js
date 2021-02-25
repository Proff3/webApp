require('dotenv').config()
const { mysqlConnection } = require('./MysqlAsyncWrapper.js')
const config = {
    host: process.env.host,
    user: process.env.login,
    password: process.env.password,
    database: process.env.database,
};

function UserAPI(config) {
    connection = mysqlConnection(config);
    return {
        async isUserExist(login) {
            try {
                let result = await connection.query(`SELECT * FROM Users WHERE login=?`, [login])
                return !!result.length;
            } catch (err) {
                console.log(err);
                throw (err);
            }
        },

        async authentification(login, pass) {
            try {
                let result = await connection.query(`SELECT * FROM Users WHERE login=? AND password=?`, [login, pass])
                if (!result.length) {
                    throw new Error("Логин или пароль не корректны!")
                } else {
                    return true;
                };
            } catch (err) {
                console.log(err);
                throw (err);
            }
        },

        async registration(login, pass) {
            try {
                if (await this.isUserExist(login)) throw new Error("Пользователь уже существует");
                await connection.query(`INSERT INTO Users VALUES(?,?)`, [login, pass])
            } catch (err) {
                console.log(err);
                throw (err);
            }
        }
    }
};

module.exports = UserAPI(config);

