import { Link, Redirect } from "react-router-dom";
import React from 'react';

class LogInButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoggedIn: false };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        let login = document.getElementById("login").value;
        let pass = document.getElementById("pass").value;
        fetch("http://localhost:5000/authentification", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ login, pass })
        }).then(res => {
            if (!res.ok) {
                this.setState({ isLoggedId: false });
                res.json().then(alert)//Сделать нормальное окошко!
            } else {
                this.props.changeAuth();
                localStorage.setItem('login', login);
                this.setState({ isLoggedId: true });
            }
        })
    }

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to={"/"} />
        }
        return (
            <button className={this.props.className} style={this.props.style} onClick={this.handleClick}>{this.props.children}</button>
        )
    }

}

export default LogInButton