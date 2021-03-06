import React from 'react'
import Table from './Table';
import Authentification from './Authentification';
import Registration from './Registration';
import { Switch, Route, Redirect } from "react-router-dom";



class Router extends React.Component {

    render() {
        if (this.props.auth) {
            return (
                <Switch>
                    <Route path="/table/">
                        <Table key={this.props.table} table={this.props.table}></Table>
                    </Route>
                    <Route path="/">
                        <Redirect to="/table/"></Redirect>
                    </Route>
                </Switch>
            )
        } else {
            return (
                <Switch>
                    <Route path="/registration">
                        <Registration />
                    </Route>
                    <Route path="/">
                        <Authentification changeAuth={this.props.changeAuth} />
                    </Route>
                </Switch>
            )
        }
    }
}

export default Router;