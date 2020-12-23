// class User {
//     constructor(props) {
//         this.login = props.login;
//         this.transaction = props.transaction;
//     }
// }
function User(login, transaction) {
    return {
        login,
        transaction
    }
}

module.exports = User;
