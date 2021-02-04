
import React from "react";
import Row from "./Row";
import THead from './THead';
import ChangingRowTable from './ChangingRowTable'
import AddingRowTable from './AddingRowTable'

function sortingRows(rows) {
    if (this.state.sortedBy === "Fio" || this.state.sortedBy.includes("DATE")) {
        rows.sort((a, b) => {
            if (this.state.sortDirection === 'down to up') return b[this.state.sortedBy] > a[this.state.sortedBy] ? 1 : -1;
            return a[this.state.sortedBy] > b[this.state.sortedBy] ? 1 : -1;
        })
    } else if (this.state.sortedBy) rows.sort((a, b) => {
        if (this.state.sortDirection === 'down to up') return b[this.state.sortedBy] - a[this.state.sortedBy]
        return a[this.state.sortedBy] - b[this.state.sortedBy];
    })
}

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            response: [],
            rows: [],
            sortedBy: "",
            sortDirection: "",
            numRowChanging: false,
            isAdding: false,
        };
        this.handleChangeRow = this.handleChangeRow.bind(this);
        this.handleSorting = this.handleSorting.bind(this);
        this.handleClosingModal = this.handleClosingModal.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.handleAddingRow = this.handleAddingRow.bind(this);
        this.createTransaction = this.createTransaction.bind(this);
        this.commitTransaction = this.commitTransaction.bind(this);
    }

    async updateTable() {
        this.setState({ isLoaded: false });
        let login = { login: localStorage.getItem('login') };
        fetch(`/table/${this.props.table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(login)
        })
            .then(res => res.json())
            .then(result => {
                if (result.message) {
                    this.setState({
                        isLoaded: true,
                        error: { message: result.message }
                    });
                } else {
                    let rows = [];
                    for (let value of Object.values(result.recordset)) rows.push(value);
                    this.setState({
                        isLoaded: true,
                        response: result,
                        rows
                    });
                }
            }, error => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
            )
    }

    componentDidMount() {
        this.updateTable();
    }

    async handleChangeRow(idx) {
        this.createTransaction().then(() =>
            this.setState({ numRowChanging: idx })
        );
    }

    handleClosingModal(e) {
        this.setState({ numRowChanging: null, isAdding: false })
    }

    async handleAddingRow() {
        this.createTransaction().then(() =>
            this.setState(prevState => ({ isAdding: !prevState.isAdding }))
        );
    }

    async createTransaction() {
        let login = { login: localStorage.getItem('login'), table: this.props.table };
        return fetch(`/transaction/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(login)
        })
    }

    async commitTransaction() {
        let login = { login: localStorage.getItem('commit') };
        return fetch(`/transaction/commit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(login)
        }).catch(err => console.log(err))
    }

    handleSorting(e) {
        this.setState({ sortedBy: e.target.title });
        if (e.target.classList.contains('has-background-warning')) this.setState({ sortDirection: 'down to up' })
        else this.setState({ sortDirection: 'up to down' })
    }

    render() {
        const { error, isLoaded, response } = this.state;
        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Загрузка...</div>;
        } else {
            let rows = this.state.rows;
            sortingRows.call(this, rows);
            let primaryKeys = rows.map(row => Object.values(row)[0]);
            return (
                <div style={{ 'padding': '10vh 10vw', 'width': '100vw', 'maxHeight': '100vh', 'overflowY': 'auto', "minHeight": "10vh" }}>
                    <table class="table is-hoverable is-size-6 is-fullwidth is-bordered has-background-light" style={{ "virticalAlign": "auto", "margin": "0" }}>{/* is-fullwidth */}
                        <thead>
                            <tr>
                                <THead titles={response.titles} handleSorting={this.handleSorting}></THead>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((item, idx) => <Row item={item} key={idx} rowNum={idx} handleChangeRow={this.handleChangeRow}></Row>)}
                        </tbody>
                        <tfoot>
                            <tr>
                                {response.titles.map((item, idx) => { return <th title={item} key={idx}>{item}</th> })}
                            </tr>
                        </tfoot>
                    </table>
                    {this.state.numRowChanging || this.state.numRowChanging === 0 ?
                        <ChangingRowTable
                            handleClosingModal={this.handleClosingModal}
                            table={this.props.table}
                            rows={this.state.rows}
                            numRowChanging={this.state.numRowChanging}
                            updateTable={this.updateTable}
                            primaryKeys={primaryKeys}
                        >
                        </ChangingRowTable> : null} {/*Модальное окно, класс is-active*/}
                    <button
                        className="addButton button is-primary"
                        onClick={this.handleAddingRow}
                    ></button>
                    {this.state.isAdding ?
                        <AddingRowTable
                            handleClosingModal={this.handleClosingModal}
                            table={this.props.table}
                            keys={Object.keys(this.state.rows[0])}
                            updateTable={this.updateTable}
                            primaryKeys={primaryKeys}
                        >
                        </AddingRowTable> : null
                    }
                </div>
            );
        }
    }
}
export default Table
