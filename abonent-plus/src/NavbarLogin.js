import { Link } from "react-router-dom";
function NavbarLogin(props) {

    let logoutHandler = async function () {
        // let login = { login: localStorage.getItem('login') };
        // await fetch(`/closeConnection`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8'
        //     },
        //     body: JSON.stringify(login)
        // }).catch(err => console.log(err))
        localStorage.removeItem('login');
        props.changeAuth();
    }

    if (props.auth) {
        return (
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <Link to="/">
                            <button class="button is-primary" onClick={logoutHandler}><strong>Выйти</strong></button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <Link to="/"> {/* Компонент Authentification */}
                        <button className="button is-primary" style={{ "marginRight": "5px" }}><strong>Войти</strong></button>
                    </Link>
                    <Link to="/registration">             {/* Компонент Registration */}
                        <button className="button is-light">Зарегистрироваться</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default NavbarLogin;