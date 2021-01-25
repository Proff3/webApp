import './App.css';
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Router from './Router'
import NavbarLinks from './NavbarLinks'
import NavbarLogin from './NavbarLogin'


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isAuthentificated: false, table: 'abonent' };
        this.changeAuth = this.changeAuth.bind(this);
        this.changeTable = this.changeTable.bind(this);
        this.handleBurger = this.handleBurger.bind(this);
    }

    changeAuth() {
        this.setState((prevState) => ({ isAuthentificated: !prevState.isAuthentificated }))
    }

    changeTable(table) {
        this.setState({ table })
    }

    handleBurger() {
        document.getElementById("burger").classList.toggle("is-active");
        document.querySelector(".navbar-menu").classList.toggle("is-active")
    }

    componentDidMount() {
        if (localStorage.getItem('login')) {
            //console.log(localStorage.getItem('login'));
            this.setState({ isAuthentificated: true });
        }
    }

    render() {
        return (
            <div className="App" >
                <BrowserRouter>
                    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
                        <div class="navbar-brand">
                            <div onClick={this.handleBurger} role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" id="burger">
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                            </div>
                        </div>
                        <div id="navbarBasicExample" className="navbar-menu">
                            {this.state.isAuthentificated ? <NavbarLinks changeTable={this.changeTable}></NavbarLinks> : null}
                            <NavbarLogin auth={this.state.isAuthentificated} changeAuth={this.changeAuth}></NavbarLogin>
                        </div>
                    </nav>
                    <div className="App-header">
                        <Router auth={this.state.isAuthentificated} changeAuth={this.changeAuth} table={this.state.table}></Router>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
export default Main;