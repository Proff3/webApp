import { Link, Redirect } from "react-router-dom";
import React from 'react';

class LogInButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isRegistred: false };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        let login = document.getElementById("login").value;
        let pass = document.getElementById("pass").value;
        fetch("http://localhost:5000/registration", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ login, pass })
        }).then(res => {
            if (res.ok) {
                this.setState({ isRegistred: true });
            } else {
                this.setState({ isRegistred: false });
            }
            return res.json()
        }).then(alert);
    }

    render() {
        console.log(this.state.isRegistred)
        if (this.state.isRegistred) {
            return <Redirect push to={"/"} />
        }
        return (
            <button className={this.props.className} onClick={this.handleClick}>{this.props.children}</button>
        )
    }

}

export default LogInButton