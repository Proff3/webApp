const util = require('util');
const mysql = require('mysql');
function mysqlConnection(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
        beginTransaction() {
            return util.promisify(connection.beginTransaction)
                .call(connection);
        },
        commitTransaction() {
            return util.promisify(connection.commit)
                .call(connection);
        },
        rollbackTransaction() {
            return util.promisify(connection.rollback)
                .call(connection);
        }
    }
}
module.exports.mysqlConnection = mysqlConnection;