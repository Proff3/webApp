import { Link } from "react-router-dom";
function NavbarLogin(props) {

    let logoutHandler = function () {
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
                    <Link to="/registration"> {/* Компонент Authentification */}
                        <button class="button is-primary" style={{ "margin-right": "5px" }}><strong>Зарегистрироваться</strong></button>
                    </Link>
                    <Link to="/">             {/* Компонент Registration */}
                        <button class="button is-light">Войти</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default NavbarLogin;