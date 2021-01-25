import React from "react";
import LogInButton from './LogInButton';
import { Link } from "react-router-dom";

class Authentification extends React.Component {
    render() {
        return (
            <div class="card cardClass">
                <header className="card-header ">
                    <p className="card-header-title" style={{ 'fontWeight': '500' }}>
                        Форма авторизации
                    </p>
                    <a href="/" className="card-header-icon" aria-label="more options">
                        <span className="icon">
                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </a>
                </header>
                <div class="card-content">
                    <div class="content">
                        <div style={{ 'marginBottom': '1em' }}>
                            <p style={{ 'marginBottom': '2px', 'textAlign': 'left' }}>Введите логин</p>
                            <div class="field">
                                <input class="input" type="email" placeholder="Логин" id={"login"} />
                            </div>
                            <p style={{ 'marginBottom': '2px', 'textAlign': 'left' }}>Введите пароль</p>
                            <div class="field">
                                <input class="input" type="password" placeholder="Пароль" id={"pass"} />
                            </div>
                        </div>
                    </div>
                    <footer>
                        <LogInButton changeAuth={this.props.changeAuth} className={"button is-primary"} style={{ 'marginRight': '1em' }}>
                            <strong>Войти</strong>
                        </LogInButton>
                        <Link to="/registration">
                            <button className="button is-light">
                                Зарегистрироваться
                            </button>
                        </Link>
                    </footer>
                </div>
            </div >
        )
    }
}

export default Authentification;
