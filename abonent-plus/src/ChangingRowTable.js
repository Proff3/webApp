import React from "react";
import ModalField from './ModalField'

class changingValuesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { changingRow: [], pkField: null };
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdating = this.handleUpdating.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCommitTransaction = this.handleCommitTransaction.bind(this);
    }

    componentDidMount() {
        let changingRow = [];
        for (let [key, value] of Object.entries(this.props.rows[this.props.numRowChanging])) {
            changingRow.push({ key, value });
        };
        let pkField = changingRow[0].value;
        this.setState({ changingRow, pkField });
        let body = Object.assign({}, { changingRow, pkField, login: localStorage.getItem('login') });
        fetch(`http://localhost:5000/fakeUpdate/${this.props.table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
        }).catch(err => console.log(err))
    }

    handleChange(idx, value) {
        let changingRow = this.state.changingRow;
        changingRow[idx].value = typeof changingRow[idx].value === 'number' ? +value : value;
        //console.log(changingRow[idx].value);
        this.setState({ changingRow });
    }

    handleDelete(e) {
        e.target.classList.toggle("is-loading");
        let enviroment = this;
        let pkField = { key: this.state.changingRow[0].key, value: this.state.pkField };
        fetch(`http://localhost:5000/delete/${this.props.table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(Object.assign({}, { pkField, login: localStorage.getItem('login') })),
        }).then((res) => {
            if (res.status === 200) {
                e.target.classList.toggle("is-loading");
                enviroment.props.updateTable();
                enviroment.props.handleClosingModal();
            } else {
                e.target.classList.toggle("is-loading");
                alert("Ошибка удаления!");
            }
        })
    }

    handleCommitTransaction(e) {
        let login = { login: localStorage.getItem('login') };
        fetch(`http://localhost:5000/transaction/commit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(login)
        }).then(() => this.props.handleClosingModal()).catch(err => console.log(err))
    }

    handleUpdating(e) {
        let changingRow = this.state.changingRow;
        if (!!this.props.primaryKeys.filter(item => `${item}` === `${changingRow[0].value}`).length && changingRow[0].value !== this.state.pkField) {
            alert("Вы ввели существующий первичный ключ!");
            return;
        }
        e.target.classList.toggle("is-loading");
        let enviroment = this;
        let pkField = { key: changingRow[0].key, value: this.state.pkField };
        let body = Object.assign({}, { changingRow, pkField, login: localStorage.getItem('login') });
        fetch(`http://localhost:5000/change/${this.props.table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
        }).then((res) => {
            console.log(res);
            if (res.status === 200) {
                e.target.classList.toggle("is-loading");
                enviroment.props.updateTable();
                enviroment.props.handleClosingModal();
            } else {
                // console.log(JSON.parse(res));
                // alert(`Некорректное значение: ${res.value}`);
                e.target.classList.toggle("is-loading");
                return res.json();
            };
        }).then(errMes => {
            if (errMes) {
                alert(`Некорректное значение: ${errMes.value} поля: ${errMes.key}`);
                document.getElementById(errMes.key).classList.toggle("is-danger").focus();
            };
        }).catch(err => console.dir(err));
    }

    render() {
        console.log(this.props.table)
        let informTables = ["abonent", "nachislSumma", "paySumma", "request"];
        let changingRow = this.state.changingRow;
        return (
            <div class="modal is-active">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Окно редактирования записи</p>
                        <button class="delete" aria-label="close" onClick={this.handleCommitTransaction}></button>
                    </header>
                    <section class="modal-card-body">
                        {changingRow.map((element, idx) =>
                            <ModalField
                                table={this.props.table}
                                handleChange={this.handleChange}
                                key={element.key} idx={idx}
                                title={element.key}
                                value={element.value}>
                            </ModalField>)}
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" onClick={this.handleUpdating}>Сохранить изменения</button>
                        {informTables.find(item => item === this.props.table) === undefined ?
                            <button class="button is-danger" onClick={this.handleDelete}>Удалить запись</button> :
                            <button class="button is-danger" disabled>Удалить запись</button>
                        }
                        <button class="button" onClick={this.handleCommitTransaction}>Отмена</button>
                    </footer>
                </div>
            </div>
        )
    }
}

export default changingValuesTable