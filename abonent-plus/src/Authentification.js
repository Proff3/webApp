import React from "react";
import LogInButton from './LogInButton';
import { Link } from "react-router-dom";

class Authentification extends React.Component {
    render() {
        return (
            <div class="card cardClass">
                <header class="card-header ">
                    <p class="card-header-title" style={{ 'font-weight': '500' }}>
                        Форма авторизации
                    </p>
                    <a href="/" class="card-header-icon" aria-label="more options">
                        <span class="icon">
                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </a>
                </header>
                <div class="card-content">
                    <div class="content">
                        <div style={{ 'margin-bottom': '1em' }}>
                            <p style={{ 'margin-bottom': '2px', 'text-align': 'left' }}>Введите логин</p>
                            <div class="field">
                                <input class="input" type="email" placeholder="Логин" id={"login"} />
                            </div>
                            <p style={{ 'margin-bottom': '2px', 'text-align': 'left' }}>Введите пароль</p>
                            <div class="field">
                                <input class="input" type="password" placeholder="Пароль" id={"pass"} />
                            </div>
                        </div>
                    </div>
                    <footer>
                        <LogInButton changeAuth={this.props.changeAuth} className={"button is-primary"} style={{ 'margin-right': '1em' }}>
                            <strong>Войти</strong>
                        </LogInButton>
                        <Link to="/registration">
                            <button class="button is-light">
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
