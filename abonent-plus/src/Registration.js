import React from "react";
import SignUpButton from './SignUpButton'

class Registration extends React.Component {
    render() {
        return (
            <div class="card cardClass">
                <header class="card-header ">
                    <p class="card-header-title" style={{ 'font-weight': '500' }}>
                        Форма регистрации
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
                            <p style={{ 'margin-bottom': '2px', 'text-align': 'left' }}>Придумайте логин</p>
                            <input class="input is-hovered" type="email" placeholder="Логин" id="login"></input>
                        </div>
                        <div class="password">
                            <p style={{ 'margin-bottom': '2px', 'text-align': 'left' }}>Придумайте пароль</p>
                            <input class="input is-hovered" type="password" placeholder="Введите пароль" id="pass"></input>
                        </div>
                    </div>
                    <footer>
                        <SignUpButton className={"button is-primary"}>
                            <strong>Зарегистрироваться</strong>
                        </SignUpButton>
                    </footer>
                </div>
            </div>
        )
    }
}

export default Registration;